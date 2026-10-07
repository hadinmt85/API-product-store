'use client';
import { useEffect, useState } from "react";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    created_at: number;
    updated_at: number;
}

function Page() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputData, setInputData] = useState("");
    const [loading, setLoading] = useState(true);

    const loadtodo = () => {
        fetch("https://practice.amirm.me/todos").then(
            async (data) => {
                const body = await data.json();
                setTodos(body.data);
                setLoading(false);
            }
        )
    }

    useEffect(() => {
        loadtodo();
    }, []);

    const handleClick = () => {
        const data = {
            title: inputData,
            completed: false
        };

        fetch("https://practice.amirm.me/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(() => {
            setInputData("");
            loadtodo();
        }).catch((err) => console.error(err));
    };

    return (
        <div dir="ltr" className="mx-auto my-auto">
            <div>
                <input
                    className="border-2 p-2"
                    type="text"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder="Enter Text"
                />
                <button className="cursor-pointer" onClick={handleClick}>Clcik</button>
            </div>
            {loading && <p>Loading...</p>}
            {todos.map((todo) => (
                <div
                    className="grid grid-cols-3 items-center gap-4 border-2 p-3"
                    key={todo.id}
                >
                    <h3>{todo.title}</h3>
                    <span>{todo.completed ? "True" : "Flase"}</span>
                    <span>
                        {todo.created_at} - {todo.updated_at}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default Page;