"use client"
import { useState } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    const data = await fetch("https://practice.amirm.me/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    const result = await data.json();
    console.log(result);
  }

  return (
    <div className="flex flex-col gap-4 w-70 mx-auto my-auto">
      <div className="flex flex-col">
        <label htmlFor="user">UserName</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="border-2 p-2" id="user" type="text" placeholder="Enter username" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="pass">PassWord</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 p-2" id="pass" type="password" placeholder="Enter password" />
      </div>
      <button onClick={handleSubmit} className="border-2 p-2 rounded-4xl w-30 mx-auto hover:bg-blue-400 cursor-pointer" type="button">Submit</button>
    </div>
  )
}

export default SignUp;