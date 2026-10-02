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

    useEffect(() => {
        const data = fetch("https://jsonplaceholder.typicode.com/users").then(
            async (data) => {
                const body = await data.json();
                setUsers(body);
                setLoading(false);
            }
        )
    })

    return (
        <div className='px-15 my-auto'>
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

            <div className='flex flex-row gap-3'>
                {loading && <h2 className='mx-auto'>...Loading</h2>}
                {users.map((user) => (
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