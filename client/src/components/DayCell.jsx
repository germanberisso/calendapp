import React from 'react';

export default function DayCell({ date, shift, tasks = [], onClick, isCurrentMonth }) {
    // Determine background color based on shift
    let bgColor = 'bg-white';
    let textColor = 'text-gray-800';
    let label = '';

    if (shift) {
        if (shift.type === 'M') { bgColor = 'bg-pink-200'; label = 'M'; }
        else if (shift.type === 'N') { bgColor = 'bg-cyan-200'; label = 'N'; }
        else if (shift.type === 'F') { bgColor = 'bg-green-100'; label = 'F'; }
        else if (shift.type === 'Fe') { bgColor = 'bg-orange-200'; label = 'Fe'; }
    }

    // Task Indicators
    const hasHighPriority = tasks.some(t => t.priority === 'High');
    const taskCount = tasks.length;

    return (
        <div
            onClick={() => onClick(date)}
            className={`
        h-24 sm:h-32 border p-1 sm:p-2 cursor-pointer transition hover:brightness-95
        ${bgColor}
        ${!isCurrentMonth ? 'opacity-40' : ''}
      `}
        >
            <div className="flex justify-between items-start">
                <span className="font-semibold text-sm sm:text-base">{date.getDate()}</span>
                {label && <span className="font-bold text-xs sm:text-sm px-1.5 py-0.5 rounded bg-white/50">{label}</span>}
            </div>

            {/* Task Dots */}
            <div className="mt-2 flex flex-wrap gap-1">
                {taskCount > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {taskCount}
                        </span>
                        {hasHighPriority && (
                            <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse" title="High Priority"></span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
