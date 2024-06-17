import React, { useEffect, useState } from 'react';
import AppBarUser from '../components/AppBarUser';
import { ToastContainer, toast } from 'react-toastify';
import SelectLabels from '../components/Select';
import { useNavigate } from 'react-router-dom';
import styles from './AddUser.module.css';

function AddUser() {
    const notify = () => {toast.success('Письмо отправлено', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });}
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER'); // По умолчанию устанавливаем роль пользователя
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        const data = { email, role };

        fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/registerUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Если запрос успешен, устанавливаем сообщение "Письмо отправлено"
                notify();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    return (
        <div>
            <AppBarUser/>
            <div className={styles["container"]}>
                <div className={styles["add-user-title"]}>Добавить пользователя</div>
                <div className={styles["bottomLine"]}>
                    <input
                        type="text"
                        className={`${styles["textbox"]} ${styles["my-input-field"]}`}
                        placeholder="Почта"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className={styles["select-style"]}>
                        <SelectLabels value={role} onChange={setRole}/>
                    </div>
                    <button className={styles["my-btn"]} onClick={handleSubmit}>Сгенерировать пароль</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default AddUser;
