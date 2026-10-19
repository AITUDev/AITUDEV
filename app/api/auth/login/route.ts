import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await dbConnect();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if teammembers collection has any admin, if not seed default admin account
    let member = await db.collection('teammembers').findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });

    // Check if default admin is logging in or if db is empty
    const defaultEmail = (process.env.NEXT_PUBLIC_DASHBOARD_EMAIL || 'aitudevelopment@gmail.com').toLowerCase();
    const defaultPass = process.env.NEXT_PUBLIC_DASHBOARD_PASS || 'aitudev2026';

    if (!member && normalizedEmail === defaultEmail) {
      // Seed default admin account
      const hashedPassword = await hashPassword(defaultPass);
      const adminMember = {
        name: 'AITU Dev Admin',
        email: defaultEmail,
        passwordHash: hashedPassword,
        role: 'admin' as const,
        status: 'active' as const,
        skills: ['Management', 'Fullstack', 'Lead'],
        bio: 'Administrator account for AITU Dev team platform',
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await db.collection('teammembers').insertOne(adminMember);
      member = { _id: insertResult.insertedId, ...adminMember };
    }

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    let isMatch = false;
    if (member.passwordHash) {
      isMatch = await comparePassword(password, member.passwordHash);
    } else if (normalizedEmail === defaultEmail && password === defaultPass) {
      // Migrate password hash if not set yet
      const hashedPassword = await hashPassword(defaultPass);
      await db.collection('teammembers').updateOne(
        { _id: member._id },
        { $set: { passwordHash: hashedPassword } }
      );
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Sign Token
    const userRole = member.role || 'member';
    const token = signToken({
      id: member._id.toString(),
      email: member.email,
      name: member.name,
      role: userRole,
    });

    // Response with Cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        role: userRole,
        avatar: member.avatar,
        skills: member.skills,
        bio: member.bio,
        socialLinks: member.socialLinks,
      },
    });

    response.cookies.set('aitu_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
