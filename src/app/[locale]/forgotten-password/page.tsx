'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgottenPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // Here you would integrate with your actual password reset API
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(t('resetPasswordError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/logo-novis.svg"
            alt="Novis Insurance"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('resetPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('resetPasswordDescription')}
          </p>
        </div>

        {status === 'success' ? (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {t('resetPasswordSuccess')}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToLogin')}
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('emailLabel')}
              </label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('emailPlaceholder')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToLogin')}
              </Link>
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-32"
              >
                {status === 'loading' ? t('sending') : t('send')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
