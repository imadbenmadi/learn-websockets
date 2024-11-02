// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const navigate = useNavigate();

    const login = async (username, password) => {
        const response = await axios.post("/auth/login", {
            username,
            password,
        });
        localStorage.setItem("token", response.data.token);
        setUser({ username });
        window.location.href = "/home";
        // navigate("/home"); // Redirect to the home page on successful login
    };

    const register = async (username, password) => {
        await axios.post("/auth/register", { username, password });
        // navigate("/login"); // Redirect to login after successful registration
        window.location.href = "/login";
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        // navigate("/login");
        window.location.href = "/login";
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ username: "Authenticated User" }); // This should ideally fetch user data based on the token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
