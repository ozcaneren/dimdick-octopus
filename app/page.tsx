'use client';

import { Button } from "@/components/ui/Button";
import ThemeSwitcher from "@/components/switchers/ThemeSwitcher";
import Link from "next/link";
import { User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/features/authSlice";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-row gap-4 my-12">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold">Yükleniyor...</h1>
        <div className="mt-12">
          <ThemeSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-row gap-4 my-12">
        <User className="w-10 h-10" />
      </div>
      
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Hoş Geldin, {user.name}!</h1>
          <p className="text-xl text-muted-foreground">{user.email}</p>
          <Image src={user.avatar} alt="Avatar" className="rounded-full" width={100} height={100} />
          <div className="flex flex-row gap-4 mt-6">
            <Button variant="outline" onClick={() => router.push('/settings')}>
              Ayarlar
            </Button>
          </div>
          <div className="flex flex-row gap-4 mt-6">
            <Button variant="destructive" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Hoş Geldiniz</h1>
          <p className="text-2xl text-muted-foreground mt-4">Devam etmek için giriş yapın</p>
          <div className="mt-12 flex flex-row gap-6">
            <Button variant="default">
              <Link href="/login" className="flex flex-row gap-2">
                Giriş Yap
              </Link>
            </Button>
            <Button variant="outline">
              <Link href="/register" className="flex flex-row gap-2">
                Kayıt Ol
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
