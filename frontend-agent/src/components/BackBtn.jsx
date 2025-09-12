import React from 'react'
import { useNavigate } from 'react-router-dom'

export const BackBtn = () => {

    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/tickets");
    };

    return (
        <button
            onClick={handleBack}
            className="btn btn-ghost btn-sm text-sm border-2 border-white/40 rounded-full px-4"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
        </button>
    )
};