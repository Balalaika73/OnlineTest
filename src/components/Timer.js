import React, { useRef, useState, useEffect } from 'react';
import styles from './Timer.module.css';


function MyTimer() {
    const [timer, setTimer] = useState("00:00");
    const Ref = useRef();

    function getTimeRemaining(e) {
      const total = Date.parse(e) - Date.parse(new Date());
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const seconds = Math.floor((total / 1000) % 60); // Исправлено
      return {total, minutes, seconds};
    }

    function startTimer(e) {
      let {total, minutes, seconds} = getTimeRemaining(e);
      if(total >= 0 ) {
        setTimer(
          (minutes > 9 ? minutes : '0' + minutes) + ':' +
          (seconds > 9 ? seconds : '0' + seconds) // Исправлено
        )
      }
    }

    function clearTimer(e) {
      setTimer("00:10");
      if(Ref.current) clearInterval(Ref.current);
      const id = setInterval(()=> {
        startTimer(e);
      }, 1000);
      Ref.current = id;
    }

    function getDeadTime() {
      let deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + 10); // Устанавливаем время на 10 минут вперед
      return deadline;
    }    

    useEffect(() => {
      clearTimer(getDeadTime());
    }, []);

    return (
        <div className={styles["timer"]}>{timer}</div> // Обернуто в div
    );
}

export default MyTimer;
