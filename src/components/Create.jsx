import React, { useState } from 'react';

const Create = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setUsername('');
    setPassword('');
    setRole('');
  };  

  const handleCreate = async () => {
    const partnerData = { username, password, role };

    console.log("Sending data:", partnerData); // Debugging log

    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/admin/create-partnyor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const result = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Error adding partner');
      }

      console.log('Partner successfully added:', result);
      closeModal(); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <button onClick={openModal} className="btn btn-primary text-white">Создать</button>
      {modalIsOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Создать партнера</h2>
            <div className="mb-4">
              <label className="block mb-2">Имя пользователя:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Роль:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={handleCreate} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200 ease-in-out">Создать</button>
              <button onClick={closeModal} className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200 ease-in-out">Закрыть</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Create;
