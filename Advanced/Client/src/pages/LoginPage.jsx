// src/pages/LoginPage.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
        navigate("/chat");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md"
            >
                <h2 className="text-xl mb-4">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="input"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
