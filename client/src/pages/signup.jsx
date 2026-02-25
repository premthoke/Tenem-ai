import { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
     await axios.post(
  "https://tenem-ai.onrender.com/api/auth/signup",
  { email, password }
);

      alert("Signup successful. Now login.");
      window.location.href = "/";
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0b0f19]">
      <div className="bg-[#0e1424] p-8 rounded-xl w-96">
        <h1 className="text-2xl text-cyan-400 mb-6">Create Account</h1>

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
          onClick={handleSignup}
          className="w-full bg-cyan-500 py-2 rounded hover:bg-cyan-400"
        >
          Signup
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;