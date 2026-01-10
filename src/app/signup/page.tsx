"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
        agreeTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const passwordRequirements = [
        { label: "At least 8 characters", met: formData.password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
        { label: "Contains number", met: /\d/.test(formData.password) },
    ];

    const isPasswordValid = passwordRequirements.every(r => r.met);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) { toast.error("Please meet all password requirements"); return; }
        if (!passwordsMatch) { toast.error("Passwords do not match"); return; }
        if (!formData.agreeTerms) { toast.error("Please agree to the terms of service"); return; }
        setLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: { data: { full_name: formData.fullName, company: formData.company } }
            });
            if (error) { toast.error(error.message); return; }
            toast.success("Account created! Please check your email to verify.");
            router.push("/login");
        } catch { toast.error("An unexpected error occurred"); } 
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-50/50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex w-full max-w-[1100px] min-h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border">
                <div className="hidden lg:flex flex-col flex-1 bg-slate-900 p-16 text-white justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900 opacity-90" />
                    <div className="relative z-10">
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-12">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white h-12 w-12 rounded-xl flex items-center justify-center font-bold text-2xl shadow-xl">Z</div>
                            <span className="text-2xl font-bold tracking-tight font-outfit">Zenith CRM</span>
                        </motion.div>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                            <h1 className="text-5xl font-bold leading-tight mb-8 font-outfit tracking-tight">Start Your Journey Today.</h1>
                            <p className="text-indigo-100/80 text-lg max-w-md font-medium leading-relaxed">Join thousands of teams using Zenith CRM.</p>
                        </motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative z-10 grid grid-cols-2 gap-8">
                        <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-white/10"><Shield size={20} className="text-indigo-200" /></div><div><h4 className="font-bold text-sm">Enterprise Security</h4></div></div>
                        <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-white/10"><Zap size={20} className="text-indigo-200" /></div><div><h4 className="font-bold text-sm">Real-time Sync</h4></div></div>
                    </motion.div>
                </div>
                <div className="w-full lg:w-[520px] p-8 lg:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 font-outfit mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Get started with your free trial today.</p>
                    </div>
                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-medium" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Company</label>
                                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Acme Inc." className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-medium" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@company.com" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-medium" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="********" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 pr-12 text-sm outline-none focus:border-indigo-500 transition-all font-medium" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">{passwordRequirements.map((req, i) => (<div key={i} className={`flex items-center gap-1.5 text-xs ${req.met ? "text-emerald-600" : "text-slate-400"}`}><Check size={12} />{req.label}</div>))}</div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm Password</label>
                            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="********" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 text-sm outline-none focus:border-indigo-500 transition-all font-medium" required />
                            {formData.confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 ml-1">Passwords do not match</p>}
                        </div>
                        <div className="flex items-start gap-2 py-1">
                            <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} className="rounded border-slate-300 text-indigo-600 mt-0.5" id="terms" />
                            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer font-medium select-none">I agree to the Terms of Service and Privacy Policy</label>
                        </div>
                        <button type="submit" disabled={loading || !isPasswordValid || !passwordsMatch || !formData.agreeTerms} className="group w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white h-12 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <><span>Create Account</span><ArrowRight size={18} /></>}
                        </button>
                    </form>
                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500 font-medium">Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
