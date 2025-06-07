import { supabase, User } from '../db';

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        authors!left(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching user profile for user ${userId}:`, error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, userData: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating user profile for user ${userId}:`, error);
    throw error;
  }
}

export async function updateAuthorProfile(authorId: string, authorData: any) {
  try {
    const { data, error } = await supabase
      .from('authors')
      .update(authorData)
      .eq('id', authorId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating author profile for author ${authorId}:`, error);
    throw error;
  }
}

export async function getAuthorProfile(authorId: string) {
  try {
    const { data, error } = await supabase
      .from('authors')
      .select(`
        *,
        users:id(
          id,
          first_name,
          last_name,
          email,
          profile_picture_url,
          bio
        )
      `)
      .eq('id', authorId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching author profile for author ${authorId}:`, error);
    throw error;
  }
}

export async function getServiceProviderProfile(serviceProviderId: string) {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        *,
        users:id(
          id,
          first_name,
          last_name,
          email,
          profile_picture_url,
          bio
        ),
        services(*)
      `)
      .eq('id', serviceProviderId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching service provider profile for provider ${serviceProviderId}:`, error);
    throw error;
  }
}

export async function updateServiceProviderProfile(serviceProviderId: string, providerData: any) {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .update(providerData)
      .eq('id', serviceProviderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating service provider profile for provider ${serviceProviderId}:`, error);
    throw error;
  }
}

export async function followUser(followerUserId: string, followedUserId: string) {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .insert({
        follower_user_id: followerUserId,
        followed_user_id: followedUserId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error following user ${followedUserId}:`, error);
    throw error;
  }
}

export async function unfollowUser(followerUserId: string, followedUserId: string) {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_user_id', followerUserId)
      .eq('followed_user_id', followedUserId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error unfollowing user ${followedUserId}:`, error);
    throw error;
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        follower:follower_user_id(
          id,
          first_name,
          last_name,
          profile_picture_url,
          role
        )
      `)
      .eq('followed_user_id', userId);

    if (error) {
      throw error;
    }

    return data?.map(item => item.follower) || [];
  } catch (error) {
    console.error(`Error fetching followers for user ${userId}:`, error);
    throw error;
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        followed:followed_user_id(
          id,
          first_name,
          last_name,
          profile_picture_url,
          role
        )
      `)
      .eq('follower_user_id', userId);

    if (error) {
      throw error;
    }

    return data?.map(item => item.followed) || [];
  } catch (error) {
    console.error(`Error fetching following for user ${userId}:`, error);
    throw error;
  }
}