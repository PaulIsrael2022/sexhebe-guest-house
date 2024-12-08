-- Add floor_number column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='rooms' 
                  AND column_name='floor_number') THEN
        ALTER TABLE rooms ADD COLUMN floor_number INTEGER NOT NULL DEFAULT 1;
        
        -- Add index for floor_number
        CREATE INDEX idx_rooms_floor_number ON rooms(floor_number);
        
        -- Add documentation for the column
        COMMENT ON COLUMN rooms.floor_number IS 'Floor number where the room is located';
    END IF;
END $$;
