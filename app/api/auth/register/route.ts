import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, firstName, lastName } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['Author', 'Reader', 'ServiceProvider'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: Author, Reader, ServiceProvider' },
        { status: 400 }
      );
    }
    
    const result = await signUp(email, password, role);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Registration failed' },
        { status: 400 }
      );
    }
    
    // If first name and last name were provided, update the user profile
    if (firstName || lastName) {
      const userId = result.data.user.id;
      
      // Update user profile with first name and last name
      await run(
        `UPDATE users SET 
          first_name = ?, 
          last_name = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [firstName || null, lastName || null, userId]
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Import the run function from the db module
import { run } from "@/lib/db";