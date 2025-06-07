import { run, get, all } from '../db';
import { User } from '../db';

export async function getUserProfile(userId: string) {
  try {
    const user = await get(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.role, 
        u.profile_picture_url, u.bio, u.preferred_language, 
        u.is_active, u.is_verified, u.created_at, u.updated_at
      FROM users u
      WHERE u.id = ?
    `, [userId]);

    if (!user) {
      return null;
    }

    // If the user is an author, get author-specific information
    if (user.role === 'Author') {
      const author = await get(`
        SELECT id, website_url, social_media_links, author_pseudonym
        FROM authors
        WHERE id = ?
      `, [userId]);

      if (author) {
        // Parse JSON fields
        if (author.social_media_links) {
          try {
            author.social_media_links = JSON.parse(author.social_media_links);
          } catch (e) {
            author.social_media_links = {};
          }
        }

        user.author = author;
      }
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user profile for user ${userId}:`, error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, userData: Partial<User>) {
  try {
    const updateFields = [];
    const updateValues = [];

    // Build the update query dynamically based on provided fields
    if (userData.first_name !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(userData.first_name);
    }
    
    if (userData.last_name !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(userData.last_name);
    }
    
    if (userData.profile_picture_url !== undefined) {
      updateFields.push('profile_picture_url = ?');
      updateValues.push(userData.profile_picture_url);
    }
    
    if (userData.bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(userData.bio);
    }
    
    if (userData.preferred_language !== undefined) {
      updateFields.push('preferred_language = ?');
      updateValues.push(userData.preferred_language);
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add the user ID to the values array
    updateValues.push(userId);

    // Execute the update query
    if (updateFields.length > 0) {
      await run(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    return await getUserProfile(userId);
  } catch (error) {
    console.error(`Error updating user profile for user ${userId}:`, error);
    throw error;
  }
}

export async function updateAuthorProfile(authorId: string, authorData: any) {
  try {
    const updateFields = [];
    const updateValues = [];

    // Build the update query dynamically based on provided fields
    if (authorData.website_url !== undefined) {
      updateFields.push('website_url = ?');
      updateValues.push(authorData.website_url);
    }
    
    if (authorData.social_media_links !== undefined) {
      updateFields.push('social_media_links = ?');
      updateValues.push(JSON.stringify(authorData.social_media_links));
    }
    
    if (authorData.author_pseudonym !== undefined) {
      updateFields.push('author_pseudonym = ?');
      updateValues.push(authorData.author_pseudonym);
    }
    
    // Add the author ID to the values array
    updateValues.push(authorId);

    // Execute the update query
    if (updateFields.length > 0) {
      await run(
        `UPDATE authors SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    return await getAuthorProfile(authorId);
  } catch (error) {
    console.error(`Error updating author profile for author ${authorId}:`, error);
    throw error;
  }
}

export async function getAuthorProfile(authorId: string) {
  try {
    const author = await get(`
      SELECT 
        a.*,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_picture_url,
        u.bio
      FROM authors a
      JOIN users u ON a.id = u.id
      WHERE a.id = ?
    `, [authorId]);

    if (!author) {
      return null;
    }

    // Parse JSON fields
    if (author.social_media_links) {
      try {
        author.social_media_links = JSON.parse(author.social_media_links);
      } catch (e) {
        author.social_media_links = {};
      }
    }

    return author;
  } catch (error) {
    console.error(`Error fetching author profile for author ${authorId}:`, error);
    throw error;
  }
}

export async function getServiceProviderProfile(serviceProviderId: string) {
  try {
    const serviceProvider = await get(`
      SELECT 
        sp.*,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_picture_url,
        u.bio
      FROM service_providers sp
      JOIN users u ON sp.id = u.id
      WHERE sp.id = ?
    `, [serviceProviderId]);

    if (!serviceProvider) {
      return null;
    }

    // Parse JSON fields
    if (serviceProvider.service_categories) {
      try {
        serviceProvider.service_categories = JSON.parse(serviceProvider.service_categories);
      } catch (e) {
        serviceProvider.service_categories = [];
      }
    }

    if (serviceProvider.verification_documents) {
      try {
        serviceProvider.verification_documents = JSON.parse(serviceProvider.verification_documents);
      } catch (e) {
        serviceProvider.verification_documents = [];
      }
    }

    // Get services offered by this provider
    const services = await all(`
      SELECT *
      FROM services
      WHERE service_provider_id = ?
    `, [serviceProviderId]);

    serviceProvider.services = services;

    return serviceProvider;
  } catch (error) {
    console.error(`Error fetching service provider profile for provider ${serviceProviderId}:`, error);
    throw error;
  }
}

export async function followUser(followerUserId: string, followedUserId: string) {
  try {
    const now = new Date().toISOString();
    
    await run(
      'INSERT OR IGNORE INTO user_follows (follower_user_id, followed_user_id, follow_date) VALUES (?, ?, ?)',
      [followerUserId, followedUserId, now]
    );

    return { success: true };
  } catch (error) {
    console.error(`Error following user ${followedUserId}:`, error);
    throw error;
  }
}

export async function unfollowUser(followerUserId: string, followedUserId: string) {
  try {
    await run(
      'DELETE FROM user_follows WHERE follower_user_id = ? AND followed_user_id = ?',
      [followerUserId, followedUserId]
    );

    return { success: true };
  } catch (error) {
    console.error(`Error unfollowing user ${followedUserId}:`, error);
    throw error;
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const followers = await all(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.profile_picture_url,
        u.role,
        uf.follow_date
      FROM user_follows uf
      JOIN users u ON uf.follower_user_id = u.id
      WHERE uf.followed_user_id = ?
      ORDER BY uf.follow_date DESC
    `, [userId]);

    return followers;
  } catch (error) {
    console.error(`Error fetching followers for user ${userId}:`, error);
    throw error;
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const following = await all(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.profile_picture_url,
        u.role,
        uf.follow_date
      FROM user_follows uf
      JOIN users u ON uf.followed_user_id = u.id
      WHERE uf.follower_user_id = ?
      ORDER BY uf.follow_date DESC
    `, [userId]);

    return following;
  } catch (error) {
    console.error(`Error fetching following for user ${userId}:`, error);
    throw error;
  }
}