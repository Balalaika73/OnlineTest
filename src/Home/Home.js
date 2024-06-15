// Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChartComponent from "../components/ChartComponent";
import AppBarMain from '../components/AppBarMain';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const token = localStorage.getItem('token');
    
    if (token && rememberMe) {
        navigate("/mainUser");
    }
  }, []);


  return (
    <div>
      <AppBarMain/>
    <div className={styles["container"]}>
      <div className={styles["leftArea"]}>
        <label>OnlineTest</label>
        <div className={styles["home-content"]}>
          Сервис предназначен для эффективного тестирования проектов с GitHub! У нас вы можете быстро и легко проверить работоспособность кода, а также обнаружить и исправить ошибки. Авторизуйтеась и просто укажите ссылку на репозиторий, и мы позаботимся о всём остальном.
        </div>
      </div>
      <div className={styles["rightArea"]}>
      <ChartComponent />
      </div>
    </div>
    </div>
  );
}

export default Home;