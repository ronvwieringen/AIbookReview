import { supabase } from './db';
import { User } from './db';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export async function signUp(email: string, password: string, role: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Create a record in the users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: role,
          is_active: true,
          is_verified: false,
        });

      if (profileError) {
        throw profileError;
      }

      // If role is Author, create a record in the authors table
      if (role === 'Author') {
        const { error: authorError } = await supabase
          .from('authors')
          .insert({
            id: data.user.id,
          });

        if (authorError) {
          throw authorError;
        }
      }

      // If role is ServiceProvider, create a record in the service_providers table
      if (role === 'ServiceProvider') {
        const { error: serviceProviderError } = await supabase
          .from('service_providers')
          .insert({
            id: data.user.id,
            verification_status: 'Unverified',
          });

        if (serviceProviderError) {
          throw serviceProviderError;
        }
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Update last login timestamp
    if (data.user) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      if (updateError) {
        console.error('Error updating last login:', updateError);
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      firstName: userData.first_name,
      lastName: userData.last_name,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error };
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error };
  }
}