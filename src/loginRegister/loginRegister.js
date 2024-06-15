import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './loginRegister.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CLIENT_ID = "4982c70cd1e50c14b81f";

function Login() {
    const notify = () => {toast.success('Зарегестрирован', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });}
    const failLogin = () => {toast.error('Неверный логин или пароль', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
    });}
    const failRegEmail = () => {toast.error('Некорректный формат адреса электронной почты', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
});}
    const failReg = () => {toast.error('Ненадляжащая длина данных', {
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

    const handleRedirect = (role) => {
        if (role === 'USER') {
            navigate("/mainUser");
        } else if (role === 'ADMIN') {
            navigate("/mainAdmin");
        }
    };

    const redirectPass = () => {
        navigate("/forgetPassword");
    };

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPass, setRegisterPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [rememberMe, setRememberMe] = useState(false);


    const handleLoginClick = (e) => {
        e.preventDefault();
        const user = { email: loginEmail, password: loginPass };
        console.log(user);
        fetch("http://localhost:8080/person/signIn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        }).then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('role', data.role);
            if (rememberMe) {
                localStorage.setItem('rememberMe', true);
            }
            handleRedirect(data.role);
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            failLogin();
        });
    };

    const handleRegisterClick = (e) => {
        e.stopPropagation();
        if (registerEmail.length < 8 || registerPass.length < 6 || confirmPass.length < 6) {
            failReg();
            return;
        }
        const user = { email: registerEmail, password: registerPass, repeatPassword: confirmPass };
        console.log(user);
        fetch("http://localhost:8080/person/signUp", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(user)
        }).then(()=> {
            console.log("User added")
            notify();
            login();
        })
        .catch(error => {
            console.error("Ошибка при отправке запроса:", error);
            error.response.json().then(data => {
                const errorMessage = data.error || "Произошла ошибка";
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }).catch(() => {
                // Если не удалось получить текст ошибки из ответа сервера, выводим общее сообщение об ошибке
                toast.error("Произошла ошибка", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
            // Здесь можно обработать ошибку, например, отобразить сообщение об ошибке пользователю
        });
    };

    const reg = () => {
        const x = document.getElementById("login");
        const y = document.getElementById("register");
        const z = document.getElementById("btn");
        if (window.innerWidth <= 768) {
            x.style.left = "-400px";
            y.style.left = "20px";
            z.style.left = "135px";
        } else {
            x.style.left = "-400px";
            y.style.left = "50px";
            z.style.left = "135px";
        }
    };

    const login = () => {
        const x = document.getElementById("login");
        const y = document.getElementById("register");
        const z = document.getElementById("btn");
        if (window.innerWidth <= 768) {
            x.style.left = "30px";
            y.style.left = "450px";
            z.style.left = "0px";
        } else {
            x.style.left = "50px";
            y.style.left = "450px";
            z.style.left = "0px";
        }
    };

    useEffect(() => {
        login();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        console.log(codeParam);
    }, []);

    return (
        <div className={styles["hero"]}>
            <div className={styles['my-form-box']}>
                <div className={styles["my-button-box"]}>
                    <div id="btn"></div>
                    <button type="button" className={styles["my-toggle-btn"]} onClick={login}>Вход</button>
                    <button type="button" className={styles["my-toggle-btn"]} onClick={reg}>Регистрация</button>
                </div>
                <form id="login" className={styles["my-input-group"]}>
                    <input type="email" className={styles["my-input-field"]} placeholder="Введите ваш email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    <input type="password" className={styles["my-input-field"]} placeholder="Введите ваш пароль" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
                    <a className={styles["forgot-password-link"]} onClick={redirectPass}>Не помню пароль</a>
                    <input type="checkbox" className={styles["my-check-box"]} checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/><span>Запомнить пароль</span>
                    <button type="submit" className={styles["enter-btn"]} onClick={handleLoginClick}>Войти</button>
                </form>
                <form id="register" className={styles["my-input-group"]} method="get" action="/main">
                    <input type="email" name="email" className={styles["my-input-field"]} placeholder="Введите ваш email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                    <input type="password" name="password" className={styles["my-input-field"]} placeholder="Введите ваш пароль" value={registerPass} onChange={(e) => setRegisterPass(e.target.value)} required />
                    <input type="password" name="confirmPassword" className={styles["my-input-field"]} placeholder="Повторите ваш пароль" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
                    <input type="checkbox" className={styles["my-check-box"]} /><span>Согласен с условиями</span>
                    <button type="button" className={styles["enter-btn"]} onClick={handleRegisterClick}>Зарегистрироваться</button>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
};

export default Login;