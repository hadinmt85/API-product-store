"use client"
import { useState } from 'react';
import Link from 'next/link';

const Signin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        const res = await fetch("https://practice.amirm.me/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        const result = await res.json()
        console.log(result)
        localStorage.setItem("token", result.token)
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 bg-[url('/login-bg.jpg')] bg-cover bg-center p-4">
            <div className="absolute inset-0 bg-slate-900/50" />
            <div className="relative w-full max-w-md rounded-3xl border border-white/30 bg-white/10 p-10 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="mt-2 text-white/80">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-orange-300 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-sm font-medium text-white">Username</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter username"
                        className="w-full h-12 px-4 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/60 outline-none transition focus:border-white/70 focus:ring-4 focus:ring-white/20"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
                    <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className="w-full h-12 px-4 rounded-xl border border-white/30 bg-white/10 text-white placeholder:text-white/60 outline-none transition focus:border-white/70 focus:ring-4 focus:ring-white/20"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full h-12 rounded-xl bg-orange-500 text-lg font-semibold text-slate-900 cursor-pointer transition hover:bg-orange-400 active:scale-95"
                >
                    Sign In
                </button>
            </div>
        </div>
    )
}

export default Signin;