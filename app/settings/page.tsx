'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState, AppDispatch } from '@/store/store';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import axios from 'axios';
import { updateUser } from '@/store/features/authSlice';

// Template avatarlar
const templateAvatars = [
  '/avatars/template1.jpg',
  '/avatars/template2.jpg',
  '/avatars/template3.jpg',
];

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setIsClient(true);
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (isClient && !user) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await dispatch(updateUser({
        name,
        avatar: avatarUrl || avatar,
      })).unwrap();

      setMessage('Profil başarıyla güncellendi!');
    } catch (error: any) {
      setMessage(error || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const selectTemplateAvatar = (templateUrl: string) => {
    setAvatar(templateUrl);
    setAvatarUrl('');
  };

  if (!isClient || !user) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Profil Ayarları</h2>
          <p className="text-muted-foreground mt-2">Profil bilgilerinizi güncelleyin</p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={avatar || '/avatars/default.png'}
              alt="Profil resmi"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
              İsim
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Template Avatarlar
            </label>
            <div className="grid grid-cols-4 gap-4">
              {templateAvatars.map((templateUrl) => (
                <button
                  key={templateUrl}
                  type="button"
                  onClick={() => selectTemplateAvatar(templateUrl)}
                  className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
                    avatar === templateUrl ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={templateUrl}
                    alt="Template avatar"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-muted-foreground">
              Avatar URL (İsteğe bağlı)
            </label>
            <input
              type="url"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('hata') ? 'text-destructive' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Güncelleniyor...' : 'Kaydet'}
          </Button>
        </form>
      </div>
    </div>
  );
} 