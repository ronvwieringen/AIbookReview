import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updatePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await getUserByEmail(email);
    
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return NextResponse.json(
        { success: true, message: 'If your email is registered, you will receive a password reset link' },
        { status: 200 }
      );
    }
    
    // In a real application, you would send an email with a reset link
    // For this demo, we'll just return a success message
    
    return NextResponse.json(
      { success: true, message: 'If your email is registered, you will receive a password reset link' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/reset-password:', error);
    return NextResponse.json(
      { error: 'Password reset request failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();
    
    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }
    
    const result = await updatePassword(userId, newPassword);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Password update failed' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/auth/reset-password:', error);
    return NextResponse.json(
      { error: 'Password update failed' },
      { status: 500 }
    );
  }
}