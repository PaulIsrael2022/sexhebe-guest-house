-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create functions if they don't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    -- When booking is confirmed
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE rooms SET status = 'occupied' WHERE id = NEW.room_id;
    -- When booking is cancelled or completed
    ELSIF (NEW.status IN ('cancelled', 'completed')) AND OLD.status = 'confirmed' THEN
        UPDATE rooms SET status = 'available' WHERE id = NEW.room_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION generate_quotation()
RETURNS TRIGGER AS $$
DECLARE
    quotation_num VARCHAR(50);
BEGIN
    -- Generate quotation number (Q-YYYY-MM-[sequential number])
    SELECT CONCAT(
        'Q-',
        TO_CHAR(NOW(), 'YYYY-MM-'),
        LPAD(COALESCE(
            (SELECT COUNT(*) + 1 FROM quotations 
             WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
             AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())),
            1)::TEXT,
            4,
            '0'
        )
    ) INTO quotation_num;

    -- Create quotation when booking is pending
    IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
        INSERT INTO quotations (
            guest_id,
            number,
            amount,
            subtotal,
            tax,
            valid_until,
            notes
        ) VALUES (
            NEW.guest_id,
            quotation_num,
            NEW.total_amount,
            NEW.total_amount * 0.9, -- 90% of total is subtotal
            NEW.total_amount * 0.1, -- 10% tax
            NEW.check_in, -- Valid until check-in date
            CONCAT('Quotation for booking #', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION generate_invoice()
RETURNS TRIGGER AS $$
DECLARE
    invoice_num VARCHAR(50);
    related_quotation_id UUID;
BEGIN
    -- Generate invoice number (INV-YYYY-MM-[sequential number])
    SELECT CONCAT(
        'INV-',
        TO_CHAR(NOW(), 'YYYY-MM-'),
        LPAD(COALESCE(
            (SELECT COUNT(*) + 1 FROM invoices 
             WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
             AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())),
            1)::TEXT,
            4,
            '0'
        )
    ) INTO invoice_num;

    -- Get related quotation if exists
    SELECT id INTO related_quotation_id
    FROM quotations
    WHERE guest_id = NEW.guest_id
    AND status = 'accepted'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Create invoice when booking is confirmed
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        -- Update quotation status if exists
        IF related_quotation_id IS NOT NULL THEN
            UPDATE quotations 
            SET status = 'accepted'
            WHERE id = related_quotation_id;
        END IF;

        INSERT INTO invoices (
            booking_id,
            quotation_id,
            invoice_number,
            amount,
            due_date,
            notes
        ) VALUES (
            NEW.id,
            related_quotation_id,
            invoice_num,
            NEW.total_amount,
            NEW.check_in, -- Due date set to check-in date
            CASE 
                WHEN related_quotation_id IS NOT NULL THEN 
                    CONCAT('Invoice for booking #', NEW.id, ' (Quotation accepted)')
                ELSE 
                    CONCAT('Invoice for booking #', NEW.id)
            END
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop all existing tables and recreate them
DROP TABLE IF EXISTS quotation_items CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;

-- Create tables in order of dependencies
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    id_number VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guests_email ON guests(email);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    price_per_night DECIMAL(10,2) NOT NULL,
    amenities TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_room_status CHECK (status IN ('available', 'occupied', 'maintenance'))
);

CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_room_number ON rooms(room_number);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL,
    room_id UUID NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    price_per_night DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_booking_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    CONSTRAINT valid_booking_dates CHECK (check_out > check_in),
    CONSTRAINT fk_booking_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
);

CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    paid_by VARCHAR(255),
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    guest_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    valid_until DATE NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_quotation_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    CONSTRAINT fk_quotation_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE RESTRICT
);

CREATE INDEX idx_quotations_guest_id ON quotations(guest_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_number ON quotations(number);

CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_quotation_item_quotation FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
);

CREATE INDEX idx_quotation_items_quotation_id ON quotation_items(quotation_id);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    quotation_id UUID,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_invoice_status CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    CONSTRAINT fk_invoice_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    CONSTRAINT fk_invoice_quotation FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE SET NULL
);

CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Create triggers
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotation_items_updated_at
    BEFORE UPDATE ON quotation_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER manage_room_status
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_room_status();

CREATE TRIGGER generate_invoice_on_booking
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice();

CREATE TRIGGER generate_quotation_on_booking
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_quotation();
