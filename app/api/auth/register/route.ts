import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, password } = await req.json();

    // Kullanıcı var mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
    });

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 