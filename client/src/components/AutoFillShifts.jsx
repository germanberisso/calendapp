import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Wand2, Calendar, AlertCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AutoFillShifts({ onComplete }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPattern, setSelectedPattern] = useState('');
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadPatterns();
    }, []);

    const loadPatterns = async () => {
        try {
            const res = await axios.get('/api/patterns');
            setPatterns(res.data);
            // Auto-select default pattern if exists
            const defaultPattern = res.data.find(p => p.isDefault);
            if (defaultPattern) {
                setSelectedPattern(defaultPattern._id);
            }
        } catch (err) {
            console.error('Error loading patterns:', err);
        }
    };

    const handleAutoFill = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!selectedPattern) {
            setError('Por favor selecciona un patrón');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/api/shifts/auto-fill', {
                startDate,
                endDate,
                patternId: selectedPattern
            });

            setSuccess(`✅ ${res.data.message}`);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al aplicar el patrón');
        } finally {
            setLoading(false);
        }
    };

    const getPatternPreview = () => {
        const pattern = patterns.find(p => p._id === selectedPattern);
        if (!pattern) return 'Selecciona un patrón';

        return pattern.pattern.map(seg => {
            const label = {
                'M': 'Mañana',
                'N': 'Noche',
                'F': 'Franco',
                'Fe': 'Feriado'
            }[seg.type];
            return `${seg.days} ${label}${seg.days > 1 ? 's' : ''}`;
        }).join(' → ');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wand2 className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold">Auto-Completar Turnos</h2>
                </div>
                <Link
                    to="/patterns"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                    <Settings size={16} />
                    Gestionar Patrones
                </Link>
            </div>

            {patterns.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                        <div>
                            <p className="font-semibold text-yellow-900">No hay patrones configurados</p>
                            <p className="text-yellow-800 text-sm mt-1">
                                Primero debes crear un patrón personalizado.
                            </p>
                            <Link
                                to="/patterns"
                                className="text-yellow-900 underline text-sm mt-2 inline-block"
                            >
                                Ir a Gestión de Patrones →
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleAutoFill} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar Patrón
                            </label>
                            <select
                                value={selectedPattern}
                                onChange={(e) => setSelectedPattern(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Selecciona un patrón --</option>
                                {patterns.map((pattern) => (
                                    <option key={pattern._id} value={pattern._id}>
                                        {pattern.name} {pattern.isDefault ? '⭐' : ''} - {pattern.pattern.map(s => `${s.days}${s.type}`).join('-')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPattern && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-blue-900">Patrón Seleccionado:</p>
                                        <p className="text-blue-800 text-sm mt-1">
                                            {getPatternPreview()}
                                        </p>
                                        <p className="text-blue-700 text-xs mt-2">
                                            Este patrón se repetirá automáticamente en el rango de fechas seleccionado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !selectedPattern}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Aplicando patrón...
                                </>
                            ) : (
                                <>
                                    <Calendar size={20} />
                                    Aplicar Patrón Automático
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
