'use client'
import React, { useEffect, useState } from 'react'

interface User {
    id: number;
    name: string;
    website: string;
    phone: string;
    email: string;
}

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [range, setRange] = useState("all");

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users").then(
            async (data) => {
                const body = await data.json();
                setUsers(body);
                setLoading(false);
            }
        )
    }, []);

    let visibleUsers = users;

    if (range === "first") {
        visibleUsers = users.slice(0, 5);
    } else if (range === "last") {
        visibleUsers = users.slice(5, 10);
    }

    return (
        <div className='px-15 my-auto'>
            <select onChange={(e) => setRange(e.target.value)} className='border-3 p-1 mb-20'>
                <option value="all">All</option>
                <option value="first">Movie</option>
                <option value="last">Series</option>
            </select>

            {selectedUser && (
                <div className="mb-4 rounded-xl border border-blue-400 p-4">
                    <h3 className="font-bold">{selectedUser.name}</h3>
                    <p>ایمیل: {selectedUser.email}</p>
                    <p>وب‌سایت: {selectedUser.website}</p>
                    <p>تلفن: {selectedUser.phone}</p>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="mt-2 rounded bg-blue-500 px-3 py-1 text-white cursor-pointer"
                    >
                        بستن
                    </button>
                </div>
            )}

            <div className='grid grid-cols-5 gap-5'>
                {loading && <h2 className='col-span-5 text-center'>...Loading</h2>}
                {visibleUsers.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="flex w-full cursor-pointer flex-col rounded-xl border border-amber-300 p-4"
                    >
                        <span>{user.name}</span>
                        <span className="text-sm opacity-60">
                            {user.website} - {user.phone}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page;