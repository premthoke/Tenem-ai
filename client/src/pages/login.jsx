import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/chat";
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0b0f19]">
      <div className="bg-[#0e1424] p-8 rounded-xl w-96">
        <h1 className="text-2xl text-cyan-400 mb-6">Login to Tenem</h1>

        <input
          className="w-full mb-4 p-2 rounded bg-[#0b0f19] border border-cyan-500/30"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-[#0b0f19] border border-cyan-500/30"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 py-2 rounded hover:bg-cyan-400"
        >
          Login
        </button>

        {/* SIGNUP LINK */}
        <p className="text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer"
            onClick={() => (window.location.href = "/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;