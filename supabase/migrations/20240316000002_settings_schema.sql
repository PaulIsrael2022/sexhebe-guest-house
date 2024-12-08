-- Create hotel_settings table
CREATE TABLE IF NOT EXISTS hotel_settings (
    id TEXT PRIMARY KEY DEFAULT '1',
    hotel_name TEXT NOT NULL DEFAULT 'Sexhebe Guest House',
    currency TEXT NOT NULL DEFAULT 'BWP',
    check_in_time TIME NOT NULL DEFAULT '14:00',
    check_out_time TIME NOT NULL DEFAULT '11:00',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 14.00,
    tax_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
    tax_name TEXT NOT NULL DEFAULT 'VAT/Levy',
    booking_terms TEXT,
    cancellation_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hotel_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hotel_settings_updated_at
    BEFORE UPDATE ON hotel_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_hotel_settings_updated_at();

-- Insert default settings if not exists
INSERT INTO hotel_settings (id)
VALUES ('1')
ON CONFLICT (id) DO NOTHING;
