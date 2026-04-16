import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const projectImages = [
    "https://images.yoprintables.com/66ea679ceb2d5056048527.jpeg",
    "https://img.freepik.com/premium-photo/classroom-with-students-vector-illustration-line-art_969863-181728.jpg",
    "https://png.pngtree.com/png-clipart/20210310/original/pngtree-line-drawing-classroom-png-image_5914536.jpg"
];

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { login, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projectImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const user = await login(data);

            if (user.role === 'TEACHER' && !user.is_approved) {
                toast('Your account is pending approval.', { icon: '⏳' });
                navigate('/pending-approval');
                return;
            }

            toast.success(`Welcome back, ${user.first_name}!`);
            navigate('/teacher/selection');
        } catch (err) {
            // error is handled by the useEffect above
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-[550px]">

                <div className="w-full md:w-1/2 bg-gray-50 relative border-b md:border-b-0 md:border-r border-gray-100 overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out h-full w-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {projectImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Feature ${index + 1}`}
                                className="w-full h-full flex-shrink-0 object-cover"
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20 drop-shadow-md">
                        {projectImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    currentIndex === index
                                        ? 'bg-white w-8 h-2.5'
                                        : 'bg-white/60 hover:bg-white w-2.5 h-2.5'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center">
                    <h2 className="text-[28px] font-bold text-gray-900 text-center mb-10">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-sm mx-auto w-full">
                        <div>
                            <div className="relative flex items-center group">
                                <input
                                    {...register('email')}
                                    placeholder="Email Address"
                                    className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:bg-white focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border border-transparent focus:border-[#6b7aff]/20"
                                />
                                <Mail className="absolute right-5 w-5 h-5 text-gray-400 group-focus-within:text-[#6b7aff] transition-colors" strokeWidth={2.5} />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-4">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="relative flex items-center group">
                                <input
                                    {...register('password')}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="........"
                                    className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder-gray-400 px-6 py-3.5 rounded-full outline-none focus:bg-white focus:ring-2 focus:ring-[#6b7aff]/50 transition-all border border-transparent focus:border-[#6b7aff]/20 tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 text-gray-400 hover:text-gray-600 focus:text-[#6b7aff] transition-colors"
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

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-xs text-[#6b7aff] hover:underline font-medium">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-[#6b7aff] hover:bg-[#5a67e6] text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-[#6b7aff]/30 active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                        </button>

                        <p className="text-center text-xs text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#6b7aff] hover:underline font-medium">
                                Apply Here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
