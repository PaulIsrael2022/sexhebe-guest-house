-- Update guests table
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Update rooms table to include price and type
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS price_per_night DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS room_type VARCHAR(50) NOT NULL DEFAULT 'single';

-- Update bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id),
ADD COLUMN IF NOT EXISTS price_per_night DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- Create room types enum
CREATE TYPE room_type AS ENUM ('single', 'double', 'suite');

-- Add constraints and indexes
ALTER TABLE rooms
ADD CONSTRAINT valid_room_type CHECK (room_type IN ('single', 'double', 'suite'));

CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);

-- Update existing data
UPDATE guests SET name = email WHERE name IS NULL;
UPDATE rooms SET room_type = 'single' WHERE room_type IS NULL;
