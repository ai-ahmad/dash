import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';

const Otziv = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        rating: '',
        comment: '',
    });

    const fetchOtzivs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/otziv');
            const otzivs = await response.json();
            setData(otzivs);
        } catch (error) {
            console.error('Error fetching otzivs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOtzivs();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/v1/otziv/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error('Error adding otziv');
            }
            
            const newOtziv = await response.json();
            setData((prevData) => [...prevData, newOtziv.data]);
            setFormData({ name: '', date: '', rating: '', comment: '' });
            document.getElementById('my_modal_otziv').close();
        } catch (error) {
            console.error('Error adding otziv:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/otziv/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                throw new Error('Error deleting otziv');
            }
            const deletedOtziv = await response.json();
            setData((prevData) => prevData.filter((otziv) => otziv._id !== deletedOtziv.data._id));
        } catch (error) {
            console.error('Error deleting otziv:', error);
        }
    };

    

    const truncateComment = (comment) => {
        if (!comment) return ''; // Return empty string if comment is undefined or null
        const words = comment.split(' ');
        return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : comment;
    };

    return (
        <div className="p-5 flex flex-col w-10/12 gap-5">
            <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary">Отзывы</h1>
                <button className="btn btn-primary flex items-center" onClick={() => document.getElementById('my_modal_otziv').showModal()}>
                    <FaPlus className="mr-2" /> Добавить
                </button>
            </div>

            <dialog id="my_modal_otziv" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                            Имя
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" placeholder="Имя" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Дата
                            <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="grow" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Рейтинг
                            <input type="number" name="rating" value={formData.rating} onChange={handleFormChange} className="grow" placeholder="Рейтинг (1-5)" min="1" max="5" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Комментарий
                            <textarea name="comment" value={formData.comment} onChange={handleFormChange} className="grow bg-transparent " placeholder="Ваш комментарий" required></textarea>
                        </label>
                        <button type="submit" className="btn mt-5">Добавить Отзыв</button>
                    </form>
                </div>
            </dialog>

            <div className='p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl'>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Дата</th>
                                <th>Рейтинг</th>
                                <th>Комментарий</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((otziv) => (
                                <tr key={otziv._id} className='text-white'>
                                    <td>{otziv._id}</td>
                                    <td>{otziv.name}</td>
                                    <td>{new Date(otziv.date).toLocaleDateString()}</td>
                                    <td>{otziv.rating}</td>
                                    <td>{truncateComment(otziv.comment)}</td>
                                    <td>
                                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(otziv._id)}>
                                            <FaTrash className="mr-2" /> Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="flex justify-center mt-5">
                            <FaSpinner className="animate-spin text-5xl text-gray-50" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Otziv;
