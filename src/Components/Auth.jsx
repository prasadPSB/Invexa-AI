import { useState } from "react";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function Auth({ onAuth }) {
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [animating, setAnimating] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const switchMode = (newMode) => {
        if (newMode === mode || animating) return;
        setAnimating(true);
        setError("");
        setSuccess("");
        setTimeout(() => {
            setMode(newMode);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setShowPassword(false);
            setAnimating(false);
        }, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Client-side validation
        if (mode === "signup") {
            if (!name.trim()) { setError("Please enter your full name."); return; }
            if (password !== confirmPassword) { setError("Passwords do not match."); return; }
            if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        }

        setLoading(true);

        try {
            const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
            const body = mode === "login"
                ? { email, password }
                : { name: name.trim(), email, password };

            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                // FastAPI returns { detail: "..." } on errors
                setError(data.detail || "Something went wrong. Please try again.");
                setLoading(false);
                return;
            }

            // data = { id, name, email }
            setSuccess(mode === "login" ? "Welcome back!" : "Account created! Signing you in…");
            setTimeout(() => onAuth?.(data), 800);

        } catch (err) {
            setError("Cannot reach the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gray-950 flex items-center justify-center relative overflow-hidden font-sans">

            {/* Ambient background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
            </div>

            {/* Dot grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Invixa
                    </span>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-1 p-1 bg-gray-900/60 border border-gray-800/80 rounded-full mb-6 shadow-inner">
                    {["login", "signup"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => switchMode(tab)}
                            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${mode === tab
                                    ? "bg-gray-800 text-indigo-400 shadow-md border border-gray-700/50"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent"
                                }`}
                        >
                            {tab === "login" ? "Sign In" : "Create Account"}
                        </button>
                    ))}
                </div>

                {/* Form card */}
                <div
                    className="bg-gray-900/40 border border-gray-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl transition-opacity duration-300"
                    style={{ opacity: animating ? 0 : 1 }}
                >
                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white mb-1">
                            {mode === "login" ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {mode === "login"
                                ? "Sign in to continue to your AI database workspace."
                                : "Start using Invixa's AI-powered database assistant."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name – signup only */}
                        {mode === "signup" && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                                <div className="flex items-center gap-3 bg-gray-950/60 border border-gray-700/60 hover:border-indigo-500/40 focus-within:border-indigo-500/60 rounded-xl px-4 py-3 transition-all duration-200">
                                    <User size={16} className="text-gray-500 shrink-0" />
                                    <input
                                        id="auth-name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="bg-transparent text-white placeholder-gray-600 outline-none flex-1 text-sm"
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                            <div className="flex items-center gap-3 bg-gray-950/60 border border-gray-700/60 hover:border-indigo-500/40 focus-within:border-indigo-500/60 rounded-xl px-4 py-3 transition-all duration-200">
                                <Mail size={16} className="text-gray-500 shrink-0" />
                                <input
                                    id="auth-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="bg-transparent text-white placeholder-gray-600 outline-none flex-1 text-sm"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                            <div className="flex items-center gap-3 bg-gray-950/60 border border-gray-700/60 hover:border-indigo-500/40 focus-within:border-indigo-500/60 rounded-xl px-4 py-3 transition-all duration-200">
                                <Lock size={16} className="text-gray-500 shrink-0" />
                                <input
                                    id="auth-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="bg-transparent text-white placeholder-gray-600 outline-none flex-1 text-sm"
                                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="text-gray-500 hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password – signup only */}
                        {mode === "signup" && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirm Password</label>
                                <div className="flex items-center gap-3 bg-gray-950/60 border border-gray-700/60 hover:border-indigo-500/40 focus-within:border-indigo-500/60 rounded-xl px-4 py-3 transition-all duration-200">
                                    <Lock size={16} className="text-gray-500 shrink-0" />
                                    <input
                                        id="auth-confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="bg-transparent text-white placeholder-gray-600 outline-none flex-1 text-sm"
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot password – login only */}
                        {mode === "login" && (
                            <div className="flex justify-end -mt-1">
                                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Error / success message */}
                        {error && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="auth-submit"
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer switch */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            {mode === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>

                {/* Terms */}
                <p className="text-center text-xs text-gray-600 mt-6">
                    By continuing, you agree to Invixa's{" "}
                    <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
                    {" & "}
                    <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
}