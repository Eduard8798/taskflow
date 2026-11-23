
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LockKeyhole, Phone, CheckCircle2 } from 'lucide-react';

import { useLoginMutation } from '@/store/endpoints/authApi';
import { loginSuccess, setUser } from '@/store/slice/authSlice';
import { useAppDispatch } from '@/store/hooks';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login({
                phone: phone.trim(),
                password,
            }).unwrap();

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);



            dispatch(loginSuccess());

            router.replace('/dashboard');
        } catch {
            setError('Invalid phone number or password.');
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <div className="mb-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <CheckCircle2 size={26} />
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to your TaskFlow account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Phone number
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />

                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+380671234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />

                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                            />
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-slate-900 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </main>
    );
}
