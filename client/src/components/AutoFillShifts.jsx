import React, { useState } from 'react';
import axios from '../config/axios';
import { Wand2, Calendar, AlertCircle } from 'lucide-react';

export default function AutoFillShifts({ onComplete }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startingIndex, setStartingIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const pattern = ['M', 'M', 'N', 'N', 'F', 'F', 'F', 'F'];

    const handleAutoFill = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('/api/shifts/auto-fill', {
                startDate,
                endDate,
                startingIndex: parseInt(startingIndex)
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
        const rotated = [...pattern.slice(startingIndex), ...pattern.slice(0, startingIndex)];
        return rotated.join(' → ');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <Wand2 className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold">Auto-Completar Turnos</h2>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-blue-900">Patrón de Turnos:</p>
                        <p className="text-blue-800 text-sm mt-1">
                            2 Mañanas (M) → 2 Noches (N) → 4 Francos (F)
                        </p>
                        <p className="text-blue-700 text-xs mt-2">
                            Este patrón se repetirá automáticamente en el rango de fechas seleccionado.
                        </p>
                    </div>
                </div>
            </div>

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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comenzar desde (posición en el patrón)
                    </label>
                    <select
                        value={startingIndex}
                        onChange={(e) => setStartingIndex(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="0">Inicio del patrón (M M N N F F F F)</option>
                        <option value="1">Segunda Mañana (M N N F F F F M)</option>
                        <option value="2">Primera Noche (N N F F F F M M)</option>
                        <option value="3">Segunda Noche (N F F F F M M N)</option>
                        <option value="4">Primer Franco (F F F F M M N N)</option>
                        <option value="5">Segundo Franco (F F F M M N N F)</option>
                        <option value="6">Tercer Franco (F F M M N N F F)</option>
                        <option value="7">Cuarto Franco (F M M N N F F F)</option>
                    </select>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Vista previa del patrón:</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                        {getPatternPreview()}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
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
        </div>
    );
}
