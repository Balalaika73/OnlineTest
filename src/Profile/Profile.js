import React, { useEffect, useState } from 'react';
import AppBarUser from '../components/AppBarUser';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { refreshAccessToken, decodeToken } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';


function Profile() {
    const notify = () => {toast.success('Изменено', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });}
    const [email, setEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [days, setDays] = useState('');
    const [date, setDate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('');

    const [isChangingEmail, setIsChangingEmail] = useState(false);

    const handleEmailChange = () => {
        setIsChangingEmail(true);
    }

    const handleSaveEmail = () => {
        console.log('New Email (on save):', newEmail);
        setEmail(newEmail);
        notify();
        setIsChangingEmail(false);
        const data = { newemail: newEmail };
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_API_BASE_URL}/person/changeEmail`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
                })
                .then(res => {
                    if (!res.ok) {
                        console.error(res);
                    throw new Error("Bad response");
                    }
                    setEmail(newEmail);
                    notify();
                })
                .catch(err => {
                console.error(err);
                });
    }

    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handlePasswordChange = () => {
        setIsChangingPassword(true);
    }

    const handleSavePassword = async (e) => {
        notify();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/person/changePass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: "werwer"
                })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error saving new password:', error);
        }
        setIsChangingPassword(false);
    }

    const checkToken = () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
    
        if (!token) {
            return;
        }
    
        const tokenExp = decodeToken(token).exp;

        if (tokenExp * 1000 < Date.now()) {
            refreshAccessToken();
        }
    };

    useEffect(() => {
        checkToken();
        const savedIsEditing = localStorage.getItem('isEditing');
        setIsEditing(savedIsEditing === 'true');
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const refreshToken = localStorage.getItem('refreshToken');

                // Параллельно выполняем обновление токена и основной запрос
                const [newToken, profileInfoResponse] = await Promise.all([
                    refreshAccessToken(), // Вызываем функцию обновления токена
                    fetch(`${process.env.REACT_APP_API_BASE_URL}/person/getProfileInfo`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    })
                ]);

                if (!profileInfoResponse.ok) {
                    throw new Error('Network response was not ok.');
                }

                const profileInfoData = await profileInfoResponse.json();

                // Обработка данных
                setEmail(profileInfoData.person.email);
                setDays(formatDays(profileInfoData.useDays));
                const dateObject = new Date(profileInfoData.person.registerDate);
                const day = dateObject.getDate();
                const month = dateObject.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
                const year = dateObject.getFullYear();
                const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);
                const formattedDate = `${addLeadingZero(day)}.${addLeadingZero(month)}.${year}`;
                setDate(formattedDate)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const formatDays = (days) => {
        const lastDigit = days % 10;
        if (days === 1) {
            return `Уже ${days} день на сервисе`;
        } else if (lastDigit === 1 && days !== 11) {
            return `Уже ${days} день на сервисе`;
        } else if (lastDigit >= 2 && lastDigit <= 4 && (days < 10 || days > 20)) {
            return `Уже ${days} дня на сервисе`;
        } else {
            return `Уже ${days} дней на сервисе`;
        }
    };

    const saveNewPass = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/changePass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: password })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            setIsEditing(false); // Выключаем режим редактирования после сохранения пароля
        } catch (error) {
            console.error('Error saving new password:', error);
        }
    };

    return (
        <div>
            <AppBarUser />
            <div className={styles["profile-container"]}>
                <div className={styles["email-container"]}>{email}</div>
                <div className={styles["days-container"]}>{days}</div>
                <div className={styles["date-container"]}>Дата регистрации: {date}</div>
                <div className={styles["password-container"]}>
                    {!isChangingPassword ? (
                        <button className={styles["my-button"]} onClick={handlePasswordChange}>Изменить пароль</button>
                    ) : (
                        <div>
                            <input type="password" placeholder="Введите новый пароль" className={styles["password"]}/>
                            <button className={styles["my-button"]} onClick={handleSavePassword}>Сохранить пароль</button>
                        </div>
                    )}
                    {!isChangingEmail ? (
                        <button className={styles["my-button"]} onClick={handleEmailChange}>Изменить почту</button>
                    ) : (
                        <div>
                            <input type="email" placeholder="Введите новую почту" className={styles["password"]}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}/>
                            <   button className={styles["my-button"]} onClick={handleSaveEmail}>Сохранить почту</button>
                        </div>
                    )}
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}
export default Profile;
