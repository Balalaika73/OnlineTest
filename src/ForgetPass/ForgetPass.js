import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MyTimer from '../components/Timer';
import AppBarMain from '../components/AppBarMain';
import styles from './ForgetPass.module.css';

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [sentEmail, setSentEmail] = useState(false); // Состояние для отслеживания отправленного email
    const [code, setCode] = useState("");
    const [newPass, setNewPass] = useState("");
    const [codeVerified, setCodeVerified] = useState(false); // Состояние для отслеживания успешной проверки кода

    const navigate = useNavigate();

    const handleSendEmailClick = async (e) => {
        e.preventDefault();
        console.log(email);
        try {
            const response = await fetch("${process.env.REACT_APP_API_BASE_URL}/person/sendEmailCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }) // Здесь оборачиваем email в объект JSON
            });
            if (response.ok) {
                console.log("Email sent successfully");
                setEmail(email);
                setSentEmail(true); // Устанавливаем sentEmail в true после успешной отправки email
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log('User with email not found:', error.message);
        }
    };

    const handleSendCodeClick = async (e) => {
        e.preventDefault();
        console.log(email);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/person/verifyCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    enteredCode: code
                })
            });
            if (response.ok) {
                console.log("HI");
                    setCodeVerified(true);
                    // Здесь устанавливаем состояние, чтобы показать форму для изменения пароля
                    setSentEmail(false);
            } else {
                console.log("Неверный код");
            }
        } catch (error) {
            console.log('Ошибка при выполнении запроса:', error.message);
        }
    };
    

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCode(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    };

    const handleChangePass = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/person/changePass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPass
                })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            else {
                navigate("/loginRegister");
            }
        } catch (error) {
            console.error('Error saving new password:', error);
        }
    };

    return (
        <div className={styles["my-bodu"]}>
            <div className={styles["hero"]}>
            <div className={styles['my-form-box']}>
                <h1 className={styles["my-title-name"]}>Сбросить пароль</h1>
                {sentEmail ? ( // Если sentEmail === true, показываем verify-group
                    <form className={styles["verify-group"]}>
                        <input 
                            className={styles["my-input-field"]} 
                            placeholder="Введите код" 
                            value={code} 
                            onChange={handleCodeChange} 
                            maxLength={4}
                            required 
                        />
                        <button type="submit" className={styles["forget-btn"]} onClick={handleSendCodeClick}>Проверить код</button>
                        <MyTimer/>
                    </form>
                ) : codeVerified ? ( // Если codeVerified === true, показываем changepass-group
                    <form className={styles["changepass-group"]}>
                        <input 
                            type="text" 
                            className={styles["my-input-field"]} 
                            placeholder="Введите новый пароль" 
                            value={newPass} 
                            onChange={(e) => setNewPass(e.target.value)} 
                            required 
                        />
                        <button type="submit" className={styles["forget-btn"]} onClick={handleChangePass}>Изменить пароль</button>
                    </form>
                ) : ( // Иначе показываем my-input-group
                    <form className={styles["my-input-group"]}>
                        <input 
                            type="email" 
                            className={styles["my-input-field"]} 
                            placeholder="Введите ваш email" 
                            value={email} 
                            onChange={handleEmailChange}
                            required 
                        />
                        <button type="submit" className={styles["forget-btn"]} onClick={handleSendEmailClick}>Отправить письмо</button>
                    </form>
                )}
            </div>
        </div>
        </div>
    );
};

export default ForgetPassword;
