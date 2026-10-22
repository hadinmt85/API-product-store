"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://practice.amirm.me";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

type User = {
    id: number;
    username: string;
};

function MyTodosPage() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem("token");
        if (!saved) {
            router.push("/signin");
            return;
        }
        setToken(saved);
    }, [router]);

    useEffect(() => {
        if (!token) return;

        async function loadAccount() {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                localStorage.removeItem("token");
                setToken(null);
                router.push("/signin");
                return;
            }
            setUser(await res.json());
            const todosRes = await fetch(`${API_URL}/me/todos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await todosRes.json();
            setTodos(json.data);
        }

        loadAccount();
    }, [token, router]);

    async function addTodo() {
        const res = await fetch(`${API_URL}/me/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
        });
        if (!res.ok) return;

        const newTodo: Todo = await res.json();
        setTodos([...todos, newTodo]);
        setTitle("");
    }

    async function logout() {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setTodos([]);
        router.push("/signin");
    }

    return (
        <div>
            <h1>Hello, {user?.username} 👋</h1>
            <button onClick={logout}>Logout</button>
            <h2>My todos</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task..."
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.completed ? "✅" : "⬜"} {todo.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyTodosPage;