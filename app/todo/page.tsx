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

    const loadtodo = () => {
        fetch(API).then(async (res) => {
            const body = await res.json();
            setTodos(body.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadtodo();
    }, []);

    const handleAdd = () => {
        fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: inputData, completed: false }),
        }).then(() => {
            setInputData("");
            loadtodo();
        });
    };

    const handleUpdate = (id: number) => {
        fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: inputData, completed: true }),
        }).then(() => {
            setInputData("");
            loadtodo();
        });
    };

    const handleDelete = (id: number) => {
        fetch(`${API}/${id}`, { method: "DELETE" }).then(() => loadtodo());
    };

    return (
        <div dir="ltr" className="w-290 mx-auto">
            <div>
                <input
                    className="border-2 p-2"
                    type="text"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder="Enter Text"
                />
                <button className="cursor-pointer border-2 p-2" onClick={handleAdd}>
                    Add
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {todos.map((todo) => (
                <div className="grid grid-cols-5 items-center gap-4 border-2 p-3" key={todo.id}>
                    <h3>{todo.title}</h3>
                    <span>{todo.completed ? "True" : "False"}</span>
                    <span>
                        {todo.created_at} - {todo.updated_at}
                    </span>
                    <button className="cursor-pointer border-2 p-1" onClick={() => handleUpdate(todo.id)}>
                        Update
                    </button>
                    <button className="cursor-pointer border-2 p-1" onClick={() => handleDelete(todo.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Page;