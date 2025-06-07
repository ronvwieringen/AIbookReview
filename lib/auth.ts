import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { run, get, all } from './db';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export async function signUp(email: string, password: string, role: string) {
  try {
    // Check if user already exists
    const existingUser = await get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash the password
    const passwordHash = await hash(password, 10);
    
    // Generate a unique ID
    const userId = uuidv4();

    // Create user record
    await run(
      'INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, role, 1, 0]
    );

    // If role is Author, create a record in the authors table
    if (role === 'Author') {
      await run(
        'INSERT INTO authors (id) VALUES (?)',
        [userId]
      );
    }

    return { 
      success: true, 
      data: { 
        user: { 
          id: userId, 
          email, 
          role 
        } 
      } 
    };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Get user by email
    const user = await get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login timestamp
    await run(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    return { 
      success: true, 
      data: { 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name
        } 
      } 
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await get(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const user = await get(
      'SELECT id, email, role, first_name, last_name FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, userData: any) {
  try {
    const { firstName, lastName, bio, profilePictureUrl, preferredLanguage } = userData;
    
    await run(
      `UPDATE users SET 
        first_name = COALESCE(?, first_name), 
        last_name = COALESCE(?, last_name), 
        bio = COALESCE(?, bio), 
        profile_picture_url = COALESCE(?, profile_picture_url), 
        preferred_language = COALESCE(?, preferred_language),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [firstName, lastName, bio, profilePictureUrl, preferredLanguage, userId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
}

export async function updatePassword(userId: string, newPassword: string) {
  try {
    const passwordHash = await hash(newPassword, 10);
    
    await run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, userId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error };
  }
}

export async function verifyUser(userId: string) {
  try {
    await run(
      'UPDATE users SET is_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, error };
  }
}