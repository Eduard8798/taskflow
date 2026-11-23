
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircle2,
    Phone,
    LockKeyhole,
    UserPlus,
    Eye,
    EyeOff,
} from 'lucide-react';

import { useRegisterMutation } from '@/store/endpoints/authApi';
import { loginSuccess } from '@/store/slice/authSlice';
import { useAppDispatch } from '@/store/hooks';

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!/^\+[1-9]\d{7,14}$/.test(phone.trim())) {
            setError('Enter a valid phone number in international format.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await register({
                phone: phone.trim(),
                password,
            }).unwrap();

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            dispatch(loginSuccess());

            router.replace('/dashboard');
        } catch (err) {
            const apiError = err as {
                status?: number;
            };

            if (apiError.status === 409) {
                setError('An account with this phone number already exists.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <div className="mb-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <CheckCircle2 size={26} />
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Create an account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Get started with TaskFlow today.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Phone Number */}
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

                    {/* Password */}
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
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                minLength={8}
                                maxLength={72}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword ? 'Hide password' : 'Show password'
                                }
                                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Confirm password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />

                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <UserPlus size={18} />
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-slate-900 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    );
}
