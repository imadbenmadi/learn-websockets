// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        const response = await axios.post("/auth/login", {
            username,
            password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        setUser({ username });
        return response;
    };

    const register = async (username, password) => {
        return await axios.post("/auth/register", { username, password });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
