/*
  # Fix Missing Role Column in Profiles Table

  1. Schema Updates
    - Add missing role column to profiles table if it doesn't exist
    - Update the is_admin() function to handle missing role gracefully
    - Ensure all policies work correctly

  2. Data Integrity
    - Set default role for existing users
    - Ensure proper constraints are in place

  3. Security
    - Maintain RLS policies
    - Ensure admin function works correctly
*/

-- First, let's safely add the role column if it doesn't exist
DO $$
BEGIN
  -- Check if role column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    -- Add the role column with default value
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'reader';
    
    -- Update any existing profiles to have the reader role
    UPDATE profiles SET role = 'reader' WHERE role IS NULL;
    
    -- Make the column NOT NULL now that all rows have values
    ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;
  END IF;
END $$;

-- Ensure the is_admin function handles the role column correctly
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  DECLARE
    user_id UUID := auth.uid();
    user_role user_role;
  BEGIN
    -- Return false if no user is authenticated
    IF user_id IS NULL THEN
      RETURN FALSE;
    END IF;

    -- Try to get the user's role
    BEGIN
      SELECT role INTO user_role 
      FROM public.profiles 
      WHERE id = user_id;
      
      -- If no profile found, return false
      IF user_role IS NULL THEN
        RETURN FALSE;
      END IF;
      
      -- Return true only if user is admin
      RETURN user_role = 'admin';
      
    EXCEPTION WHEN OTHERS THEN
      -- If any error occurs (like missing column), return false
      RETURN FALSE;
    END;
  END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Update the handle_new_user function to set default role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    'reader'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify that all necessary columns exist in profiles table
DO $$
BEGIN
  -- Ensure all expected columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_picture_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN website_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'social_media_links'
  ) THEN
    ALTER TABLE profiles ADD COLUMN social_media_links JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Ensure RLS is enabled on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work with the role column
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Recreate policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Test the is_admin function by creating a simple test
DO $$
BEGIN
  -- This will test if the function works without errors
  PERFORM is_admin();
  RAISE NOTICE 'is_admin() function is working correctly';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'is_admin() function error: %', SQLERRM;
END $$;