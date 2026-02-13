import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Plus, Trash2, Save, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Patterns() {
    const { user } = useAuth();
    const [patterns, setPatterns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        pattern: [],
        isDefault: false
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadPatterns();
    }, []);

    const loadPatterns = async () => {
        try {
            const res = await axios.get('/api/patterns');
            setPatterns(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addSegment = () => {
        setFormData({
            ...formData,
            pattern: [...formData.pattern, { type: 'M', days: 1 }]
        });
    };

    const removeSegment = (index) => {
        setFormData({
            ...formData,
            pattern: formData.pattern.filter((_, i) => i !== index)
        });
    };

    const updateSegment = (index, field, value) => {
        const newPattern = [...formData.pattern];
        newPattern[index][field] = field === 'days' ? parseInt(value) : value;
        setFormData({ ...formData, pattern: newPattern });
    };

    const getTotalDays = () => {
        return formData.pattern.reduce((sum, seg) => sum + seg.days, 0);
    };

    const getPatternPreview = () => {
        return formData.pattern.map(seg => `${seg.days}${seg.type}`).join('-');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalDays = getTotalDays();
        if (totalDays < 1 || totalDays > 15) {
            alert('El patrón debe tener entre 1 y 15 días en total');
            return;
        }

        try {
            if (editingId) {
                await axios.put(`/api/patterns/${editingId}`, formData);
            } else {
                await axios.post('/api/patterns', formData);
            }
            setFormData({ name: '', pattern: [], isDefault: false });
            setShowForm(false);
            setEditingId(null);
            loadPatterns();
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            alert(err.response?.data?.message || err.message || 'Error al guardar el patrón');
        }
    };

    const handleEdit = (pattern) => {
        setFormData({
            name: pattern.name,
            pattern: pattern.pattern,
            isDefault: pattern.isDefault
        });
        setEditingId(pattern._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este patrón?')) return;
        try {
            await axios.delete(`/api/patterns/${id}`);
            loadPatterns();
        } catch (err) {
            alert('Error al eliminar el patrón');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`/api/patterns/${id}/set-default`);
            loadPatterns();
        } catch (err) {
            alert('Error al establecer patrón por defecto');
        }
    };

    const getShiftColor = (type) => {
        switch (type) {
            case 'M': return 'bg-pink-500';
            case 'N': return 'bg-cyan-500';
            case 'F': return 'bg-green-400';
            case 'Fe': return 'bg-orange-500';
            default: return 'bg-gray-400';
        }
    };

    const getShiftLabel = (type) => {
        switch (type) {
            case 'M': return 'Mañana';
            case 'N': return 'Noche';
            case 'F': return 'Franco';
            case 'Fe': return 'Feriado';
            default: return type;
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600">Solo los administradores pueden gestionar patrones.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Patrones</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: '', pattern: [], isDefault: false });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nuevo Patrón
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Editar Patrón' : 'Crear Nuevo Patrón'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Nombre del Patrón</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Ej: Patrón Siderar"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Secuencia de Turnos</label>
                                <button
                                    type="button"
                                    onClick={addSegment}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                >
                                    + Agregar Segmento
                                </button>
                            </div>

                            {formData.pattern.map((segment, index) => (
                                <div key={index} className="flex gap-2 mb-2 items-center">
                                    <select
                                        value={segment.type}
                                        onChange={(e) => updateSegment(index, 'type', e.target.value)}
                                        className="border rounded px-3 py-2"
                                    >
                                        <option value="M">Mañana</option>
                                        <option value="N">Noche</option>
                                        <option value="F">Franco</option>
                                        <option value="Fe">Feriado</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        max="15"
                                        value={segment.days}
                                        onChange={(e) => updateSegment(index, 'days', e.target.value)}
                                        className="border rounded px-3 py-2 w-20"
                                        placeholder="Días"
                                    />
                                    <span className="text-sm text-gray-600">días</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSegment(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            {formData.pattern.length === 0 && (
                                <p className="text-sm text-gray-500 italic">
                                    Agrega segmentos para definir tu patrón
                                </p>
                            )}
                        </div>

                        {formData.pattern.length > 0 && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium mb-2">Vista Previa:</p>
                                <p className="text-lg font-bold text-blue-600">{getPatternPreview()}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total: {getTotalDays()} días
                                    {(getTotalDays() < 1 || getTotalDays() > 15) && (
                                        <span className="text-red-600 ml-2">
                                            (debe ser entre 1 y 15 días)
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Establecer como patrón por defecto</span>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Save size={18} />
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', pattern: [], isDefault: false });
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {patterns.map((pattern) => (
                    <div key={pattern._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold">{pattern.name}</h3>
                                    {pattern.isDefault && (
                                        <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Creado por: {pattern.createdBy?.username || 'Desconocido'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {!pattern.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(pattern._id)}
                                        className="text-yellow-600 hover:text-yellow-800"
                                        title="Establecer como predeterminado"
                                    >
                                        <Star size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(pattern)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(pattern._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {pattern.pattern.map((segment, index) => (
                                <div
                                    key={index}
                                    className={`${getShiftColor(segment.type)} text-white px-4 py-2 rounded-lg font-medium`}
                                >
                                    {segment.days} {getShiftLabel(segment.type)}
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            Patrón: <span className="font-mono font-bold">{pattern.pattern.map(s => `${s.days}${s.type}`).join('-')}</span>
                        </p>
                    </div>
                ))}

                {patterns.length === 0 && !showForm && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No hay patrones creados aún.</p>
                        <p className="text-sm mt-2">Crea tu primer patrón personalizado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
