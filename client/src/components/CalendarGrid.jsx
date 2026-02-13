import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, format, isSameMonth } from 'date-fns';
import axios from '../config/axios';
import DayCell from './DayCell';
import TaskModal from './TaskModal';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarGrid() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [shifts, setShifts] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        try {
            const [shiftsRes, tasksRes] = await Promise.all([
                axios.get('/api/shifts'),
                axios.get('/api/tasks')
            ]);
            setShifts(shiftsRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Generate days
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getShiftForDate = (date) => {
        return shifts.find(s => new Date(s.date).toDateString() === date.toDateString());
    };

    const getTasksForDate = (date) => {
        return tasks.filter(t => new Date(t.date).toDateString() === date.toDateString());
    };

    // Admin: Set Shift
    const handleDayClick = async (date) => {
        // If admin, show options to set shift? Or just open task modal?
        // User requirement: "Cualquier usuario logueado puede hacer clic en un día y agregar tareas."
        // Also "Solo mi usuario (admin) puede asignar colores/estados a los días."
        // Keep it simple: Open modal. If admin, modal has extra tab/option for shift.
        // For now, let's just use click for Tasks. Shifts can be managed via a separate interaction or in the modal.
        // I will pass the shift data to the modal or handle shift change separately.
        // Let's open the Task Modal for everyone.
        setSelectedDate(date);
    };

    const handleShiftChange = async (type) => {
        if (!selectedDate) return;
        try {
            await axios.post('/api/shifts', {
                date: selectedDate,
                type
            });
            fetchData(); // Refresh
            // Close modal? or keep open?
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-full"><ChevronLeft /></button>
                <h2 className="text-2xl font-bold capitalize">{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-full"><ChevronRight /></button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2 text-center font-semibold text-gray-500">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border shadow rounded-lg overflow-hidden bg-white">
                {days.map(day => (
                    <DayCell
                        key={day.toString()}
                        date={day}
                        shift={getShiftForDate(day)}
                        tasks={getTasksForDate(day)}
                        isCurrentMonth={isSameMonth(day, monthStart)}
                        onClick={handleDayClick}
                    />
                ))}
            </div>

            {/* Modal */}
            {selectedDate && (
                <TaskModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                    user={user}
                    onShiftChange={(type) => {
                        handleShiftChange(type);
                        setSelectedDate(null);
                    }}
                />
            )}
        </div>
    );
}
