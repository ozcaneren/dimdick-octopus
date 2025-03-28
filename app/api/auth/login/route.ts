import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Geçersiz şifre' },
        { status: 401 }
      );
    }

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
      token,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 