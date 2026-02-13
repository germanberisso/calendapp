import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get('/api/auth/pending');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            await axios.put(`/api/auth/approve/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="flex items-center text-blue-600 mb-6 hover:underline">
                    <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
                </Link>

                <h2 className="text-3xl font-bold mb-6">Pending Approvals</h2>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending users.</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Username</th>
                                    <th className="p-4 text-left">Registered At</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-t">
                                        <td className="p-4 font-medium">{u.username}</td>
                                        <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => approveUser(u._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 ml-auto"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
