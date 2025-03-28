import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/utils/db';
import User from '@/models/User';

export async function PUT(req: Request) {
  try {
    await connectDB();

    const authorization = req.headers.get('authorization');
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const { name, avatar } = await req.json();

    // Kullanıcıyı bul ve güncelle
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    user.name = name;
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
    
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 