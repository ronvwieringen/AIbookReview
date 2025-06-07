import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUserProfile, updateUserProfile } from "@/lib/api/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove sensitive information
    delete userProfile.password_hash;
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error(`Error in GET /api/users/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = params.id;
    
    // Check if user is updating their own profile or is an admin
    if (userId !== session.user.id && session.user.role !== 'PlatformAdmin') {
      return NextResponse.json(
        { error: 'You do not have permission to update this profile' },
        { status: 403 }
      );
    }
    
    const userData = await request.json();
    
    // Don't allow changing role or email through this endpoint
    delete userData.role;
    delete userData.email;
    
    const updatedProfile = await updateUserProfile(userId, userData);
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(`Error in PUT /api/users/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}