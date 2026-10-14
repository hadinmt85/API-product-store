"use client"
import { useState } from 'react';
import Link from 'next/link';

const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        const res = await fetch("https://practice.amirm.me/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        const result = await res.json()
        console.log(result)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-700 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 mt-2">
                        Have an account? {" "}
                        <Link href="/signin" className="text-indigo-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter username"
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-indigo-600 text-white text-lg font-semibold rounded-xl cursor-pointer transition hover:bg-indigo-700 active:scale-95"
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Signup;