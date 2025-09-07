import React from 'react'
import { useNavigate } from 'react-router-dom'

export const LogoutBtn = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/logout`, {
                method: "POST",
                credentials: 'include', // Include cookies for session-based auth
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('authType');

                navigate('/login');
                console.log('Logout successful');

            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('authType');

                navigate('/login');
            }

        } catch (error) {
            console.error('Logout error:', error);

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('authType');
            navigate('/login');
        }
    }

    return (
        <div className="w-full flex justify-between mt-4">
            <button
                onClick={logout}
                className="bg-red-700 cursor-pointer text-white p-2 rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
            <div></div> {/* Spacer to balance layout */}
        </div>
    )
}
