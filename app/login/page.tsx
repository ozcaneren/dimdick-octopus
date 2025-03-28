'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, reset } from '@/store/features/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      router.push('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, router, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-foreground">Giriş Yap</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
