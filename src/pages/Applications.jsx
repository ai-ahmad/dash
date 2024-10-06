import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaTrash, FaSpinner } from 'react-icons/fa'; // Импортируем иконку загрузки

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/zayavka/');
                console.log('Response data:', response.data);
                setApplications(response.data.data || []);
                localStorage.setItem('applications', JSON.stringify(response.data.data || []));
            } catch (error) {
                console.error('Ошибка при получении заявок:', error);
                const savedApplications = localStorage.getItem('applications');
                if (savedApplications) {
                    setApplications(JSON.parse(savedApplications));
                }
            } finally {
                setLoading(false); // Завершаем загрузку
            }
        };

        fetchApplications();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/zayavka/${id}`);
            setApplications(applications.filter((app) => app._id !== id));
            console.log('Заявка успешно удалена');
        } catch (error) {
            console.error('Ошибка при удалении заявки:', error);
        }
    };

    return (
        <div className="m-5 container mx-auto p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white rounded-xl shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-100">Список заявок</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-6xl text-gray-100" /> {/* Индикатор загрузки */}
                </div>
            ) : (
                <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {applications.map((app, index) => (
                        <li
                            key={index}
                            className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-600"
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-2xl text-gray-200">{app.name}</strong>
                                <span className="badge badge-info badge-outline text-sm py-1 px-3 bg-gray-600 text-gray-300">Новая заявка</span>
                            </div>

                            <div className="flex items-center mt-4">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <span className="text-gray-300">{app.email}</span>
                            </div>

                            <div className="flex items-center mt-2">
                                <FaPhone className="text-gray-400 mr-2" />
                                <span className="text-gray-300">{app.phone}</span>
                            </div>

                            <p className="text-gray-400 mt-4 italic">{app.comment}</p>

                            <div className="mt-4">
                                <div className="h-1 w-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg"></div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">Дата: {new Date().toLocaleDateString()}</span>
                                <div className="flex items-center">
                                    <button className="btn btn-secondary btn-sm hover:bg-gray-600 transition-colors mr-2">
                                        Связаться
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm hover:bg-red-600 transition-colors"
                                        onClick={() => handleDelete(app._id)}
                                    >
                                        <FaTrash className="mr-2" /> Удалить
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                </>
            )}
        </div>
    );
};

export default Applications;
