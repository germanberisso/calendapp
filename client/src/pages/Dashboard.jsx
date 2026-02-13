import React, { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import PriorityAlert from '../components/PriorityAlert';
import AutoFillShifts from '../components/AutoFillShifts';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, Wand2 } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showAutoFill, setShowAutoFill] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Calendapp</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, <strong>{user?.username}</strong> ({user?.role})</span>
                        {user?.role === 'admin' && (
                            <>
                                <button
                                    onClick={() => setShowAutoFill(!showAutoFill)}
                                    className="text-blue-600 flex items-center gap-1 hover:underline"
                                >
                                    <Wand2 size={18} /> Auto-Completar
                                </button>
                                <Link to="/admin" className="text-blue-600 flex items-center gap-1 hover:underline">
                                    <Users size={18} /> Manage Users
                                </Link>
                            </>
                        )}
                        <button onClick={handleLogout} className="text-red-500 flex items-center gap-1 hover:text-red-700">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-4 mt-4">
                <PriorityAlert />

                {showAutoFill && user?.role === 'admin' && (
                    <div className="mb-6">
                        <AutoFillShifts onComplete={() => {
                            setShowAutoFill(false);
                            window.location.reload();
                        }} />
                    </div>
                )}

                <CalendarGrid />
            </main>
        </div>
    );
}
