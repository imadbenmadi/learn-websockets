// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api";

const HomePage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch list of users excluding the current user
        const fetchUsers = async () => {
            const response = await axios.get("/auth/users"); // Assume an endpoint to fetch users
            console.log(response.data);
            
            setUsers(response.data.filter((u) => u?.username !== user?.username));
        };
        fetchUsers();
    }, [user]);

    const selectUser = (selectedUser) => {
        navigate(`/chat/${selectedUser.id}`); // Redirect to chat room with the selected user
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Select a User to Chat</h1>
            {users.length === 0 ? (
                <p>No users available</p>
            ) : (
                <ul className="bg-white shadow rounded p-4">
                    {users.map((u) => (
                        <li
                            key={u.id}
                            className="cursor-pointer hover:bg-blue-100 p-2 rounded"
                            onClick={() => selectUser(u)}
                        >
                            {u?.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
