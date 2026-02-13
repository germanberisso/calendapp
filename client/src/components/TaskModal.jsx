import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Trash2 } from 'lucide-react';

export default function TaskModal({ date, onClose, user, onShiftChange }) {
    const [tasks, setTasks] = useState([]);
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('Low');

    useEffect(() => {
        fetchTasks();
    }, [date]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/tasks');
            // Filter clientside or server side? For prototype convenience, filtering client side 
            // but in real app should be server query. 
            // Let's rely on standard "get all" for now as per route implementation.
            const dayTasks = res.data.filter(t =>
                new Date(t.date).toDateString() === date.toDateString()
            );
            setTasks(dayTasks);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/tasks', {
                date,
                time,
                description,
                priority,
                createdBy: user.id
            });
            setTasks([...tasks, res.data]);
            setDescription('');
            setTime('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{date.toDateString()}</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                {/* Task List */}
                <div className="mb-6 max-h-60 overflow-y-auto">
                    {tasks.length === 0 ? <p className="text-gray-500">No tasks yet.</p> : (
                        tasks.map(task => (
                            <div key={task._id} className={`p-2 mb-2 rounded border ${task.priority === 'High' ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between">
                                    <span className="font-bold text-sm">{task.time}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>{task.priority}</span>
                                </div>
                                <p className="mt-1">{task.description}</p>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>By: {task.createdBy?.username || 'Unknown'}</span>
                                    <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Admin: Shift Controls */}
                {user?.role === 'admin' && onShiftChange && (
                    <div className="mb-6 border-t pt-4">
                        <h4 className="font-semibold mb-2 text-sm text-gray-600">Admin: Set Daily Shift</h4>
                        <div className="flex gap-2">
                            <button onClick={() => onShiftChange('M')} className="flex-1 py-1 bg-pink-200 hover:bg-pink-300 rounded text-sm font-medium">M</button>
                            <button onClick={() => onShiftChange('N')} className="flex-1 py-1 bg-cyan-200 hover:bg-cyan-300 rounded text-sm font-medium">N</button>
                            <button onClick={() => onShiftChange('F')} className="flex-1 py-1 bg-green-200 hover:bg-green-300 rounded text-sm font-medium">F</button>
                            <button onClick={() => onShiftChange('Fe')} className="flex-1 py-1 bg-orange-200 hover:bg-orange-300 rounded text-sm font-medium">Hol</button>
                        </div>
                    </div>
                )}

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Add Task</h4>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="time"
                            required
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="border p-1 rounded"
                        />
                        <select
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                            className="border p-1 rounded flex-1"
                        >
                            <option value="Low">Low Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Description"
                        required
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Task</button>
                </form>
            </div>
        </div>
    );
}
