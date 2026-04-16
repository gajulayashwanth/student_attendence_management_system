import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const registerSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Must be 8+ characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            toast.success("Registration submitted successfully!");
            navigate('/pending-approval');
        } catch (err) {
            // error is handled by the useEffect above
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">

                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 overflow-hidden relative">
                    <img
                        src="https://img.freepik.com/premium-vector/male-teacher-teaching-front-class-with-students-flat-design-style_207579-1150.jpg?w=2000"
                        alt="Workspace Illustration"
                        className="w-full h-full object-cover absolute inset-0 opacity-90"
                    />
                </div>

                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-[28px] font-bold text-gray-900 text-center mb-8">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto w-full">

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative flex items-center">
                                    <input
                                        {...register('first_name')}
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border-none"
                                    />
                                </div>
                                {errors.first_name && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.first_name.message}</p>}
                            </div>
                            <div className="flex-1">
                                <div className="relative flex items-center">
                                    <input
                                        {...register('last_name')}
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border-none"
                                    />
                                    <User className="absolute right-5 w-5 h-5 text-gray-800" strokeWidth={2.5} />
                                </div>
                                {errors.last_name && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.last_name.message}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border-none"
                                />
                                <Mail className="absolute right-5 w-5 h-5 text-gray-800" strokeWidth={2.5} />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <input
                                    {...register('password')}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border-none tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.password.message}</p>}
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <input
                                    {...register('confirm_password')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border-none tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.confirm_password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-[#6b7aff] hover:bg-[#5a67e6] text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-lg shadow-[#6b7aff]/30"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </button>

                        <p className="text-center text-xs text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#6b7aff] hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
