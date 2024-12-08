-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON cleaning_tasks(status);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- Add indexes for foreign key relationships
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_room_id ON cleaning_tasks(room_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_to ON cleaning_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
