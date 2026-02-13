import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { AlertCircle } from 'lucide-react';

export default function PriorityAlert() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const checkTasks = async () => {
            try {
                const res = await axios.get('/api/tasks');
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const highPriority = res.data.filter(t => {
                    const tDate = new Date(t.date);
                    tDate.setHours(0, 0, 0, 0);
                    return t.priority === 'High' && tDate >= today;
                });

                setAlerts(highPriority);
            } catch (err) {
                console.error("Failed to fetch tasks for alert", err);
            }
        };

        checkTasks();
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <div className="flex items-center gap-2">
                <AlertCircle size={24} />
                <p className="font-bold">Attention!</p>
            </div>
            <p>You have {alerts.length} high priority task(s) coming up.</p>
        </div>
    );
}
