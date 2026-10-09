'use client';
import { useEffect, useState } from "react";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    created_at: number;
    updated_at: number;
}

const API = "https://practice.amirm.me/todos";

function Page() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputData, setInputData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadtodo = () => {
        fetch(API).then(async (data) => {
            const body = await data.json();
            setTodos(body.data);
            setLoading(false);
        })
    };

    useEffect(() => {
        loadtodo();
    }, []);

    const handleAdd = () => {
        fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: inputData, completed: false })
        }).then(() => {
            setInputData("");
            loadtodo();
        });
    };

    const handleUpdate = (id: number) => {
        fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: inputData, comleted: true })
        }).then((res) => {
            if (!res.ok) throw new Error("Update failed");
            setError("");
            setInputData("");
            loadtodo();
        }).catch((err) => {
            console.error(err);
            setError("Update failed. Please try again.");
        })
    };

    const handleDelete = (id: number) => {
        fetch(`${API}/${id}`, {method: "DELETE"}).then((res) => {
            if (!res.ok) throw new Error("Delete failed");
            setError("");
            loadtodo();
        }).catch((err) => {
            console.error(err);
            setError("Delete failed. Please try again.");
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-100 via-violet-50 to-pink-100 px-4 py-10 antialiased sm:px-6 sm:py-16">
            <div dir="ltr" className="mx-auto w-full max-w-4xl">
                <h1 className="mb-6 bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:mb-8 sm:text-5xl">
                    Todo List
                </h1>

                <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white/80 p-3 shadow-xl shadow-indigo-200/50 ring-1 ring-white backdrop-blur-xl sm:mb-8 sm:flex-row sm:items-center">
                    <input
                        className="w-full flex-1 rounded-2xl border border-transparent bg-slate-100/80 px-5 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        type="text"
                        placeholder="Enter Text"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                    />
                    <button
                        className="w-full cursor-pointer rounded-2xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-300/60 transition hover:from-indigo-500 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-indigo-300/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-95 sm:w-auto"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-5 py-3.5 text-sm font-medium text-rose-700 shadow-lg shadow-rose-100 backdrop-blur"
                    >
                        <span>{error}</span>
                        <button
                            className="cursor-pointer rounded-lg px-2.5 py-0.5 text-lg leading-none text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading && (
                    <p className="animate-pulse py-8 text-center text-lg font-medium text-indigo-500">
                        Loading...
                    </p>
                )}

                <div className="space-y-4">
                    {todos.map((todo) => (
                        <div
                            className={`grid grid-cols-2 items-center gap-3 rounded-2xl border-l-4 bg-white/80 p-5 shadow-md shadow-slate-200/60 ring-1 ring-slate-200/60 backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-indigo-200/50 md:grid-cols-5 md:gap-4 ${
                                todo.completed ? "border-l-emerald-400" : "border-l-amber-400"
                            }`}
                            key={todo.id}
                        >
                            <h3 className="col-span-2 wrap-break-word text-base font-semibold text-slate-800 md:col-span-1 md:truncate">
                                {todo.title}
                            </h3>
                            <span
                                className={`col-span-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold before:size-1.5 before:rounded-full before:bg-current md:col-span-1 ${
                                    todo.completed
                                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                        : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                                }`}
                            >
                                {todo.completed ? "True" : "False"}
                            </span>
                            <span className="col-span-2 wrap-break-word font-mono text-[11px] leading-relaxed text-slate-400 md:col-span-1">
                                <span className="whitespace-nowrap md:whitespace-normal">{todo.created_at}</span>
                                {" - "}
                                <span className="whitespace-nowrap md:whitespace-normal">{todo.updated_at}</span>
                            </span>
                            <button
                                className="w-full cursor-pointer rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-95 md:py-1.5"
                                onClick={() => handleUpdate(todo.id)}
                            >
                                Update
                            </button>
                            <button
                                className="w-full cursor-pointer rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-100 transition hover:bg-rose-600 hover:text-white hover:shadow-md hover:shadow-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-95 md:py-1.5"
                                onClick={() => handleDelete(todo.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Page;