// src/components/WelcomePage.js
import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
            <p className="text-lg mb-6">
                Please log in or register to start chatting.
            </p>
            <div>
                <Link
                    to="/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default WelcomePage;
