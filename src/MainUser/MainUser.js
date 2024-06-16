import React from 'react';
import AppBarUser from '../components/AppBarUser';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GraphComponent from "../components/GraphComponent";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './MainUser.module.css';
import { refreshAccessToken,  decodeToken} from '../App';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import {Pie} from 'react-chartjs-2';
import { color } from 'chart.js/helpers';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);



function MainUser() {
  
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [history, setHistory] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [lang, setLang] = useState('Python');
  const [script, setScript] = useState('');

  const handleLangChange = (event) => {
    setLang(event.target.value);
  };

  const data = {
    labels: ['Ошибки', 'Удача'],
    datasets: [
      {
        data: [testResults.negativeResults || 0, testResults.positiveResults || 0],
        backgroundColor: ['#fe3237', '#4fe0b5']
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Это позволит игнорировать аспектное соотношение и использовать указанные ширину и высоту
    width: 500, 
    height: 500,
    legend: {
      labels: {
        color: '#fffff' // устанавливаем цвет текста легенды на белый
      }
    }
  };  

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newText =
        script.substring(0, selectionStart) +
        '\t' +
        script.substring(selectionEnd);
      setScript(newText);
      // Устанавливаем курсор после вставленной табуляции
      e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return;
    }

    const tokenExp = decodeToken(token).exp;

    if (tokenExp * 1000 < Date.now()) {
        refreshAccessToken();
    }
};

  const handleRedirect = () => {
    if (link !== '') {
      localStorage.setItem('link', link);
      navigate(`/mainTest`); // Передаем значение поля ввода в URL
    }
  };

  const handleRedirectMyTest = () => {
    if (script !== '') {
      const token = localStorage.getItem('token');
    fetch('http://localhost:8080/code/getUserCode', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ code: script })
    })
    .then(response => response.text())
    .then(data => {
      navigate(`/testFile?data=${encodeURIComponent(data)}&type=${encodeURIComponent(lang)}`);
    })
    .catch(error => {
        console.error('Error fetching test results:', error);
    });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchTestHistory();
    fetch('http://localhost:8080/code/getTestResults', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch test results');
        }
        return response.json();
      })
      .then(data => {
        setTestResults(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching test results:', error);
      });
    }, []);


  const fetchTestHistory = () => {
    const token = localStorage.getItem('token');

    checkToken();

    fetch("http://localhost:8080/code/getTestsHistory", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        params: {
          sortBy: "testDate",
          sortOrder: "desc"
      }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
      // Перевернуть массив данных перед установкой в состояние
      setHistory(data.reverse());
    })
    .catch(error => console.error('Error fetching history:', error));
  };


  return (
    <div>
      <AppBarUser/>
      <div className={styles["main-container"]}>
        <div className={styles["existing-content"]}>
          <div className={styles["container"]}>
            <div className={styles["topLine"]}>Введите ссылку на репозиторий github</div>
            <div className={styles["bottomLine"]}>
              <input
                type="text"
                className={styles["my-input-field"]}
                placeholder="Ссылка"
                value={link} 
                onChange={(e) => setLink(e.target.value)}
              />
              <Button variant="contained" className={styles["button"]} onClick={handleRedirect}>
                <ArrowForwardIcon />
              </Button>
            </div>
          </div>
          <div className={styles["grafContainer"]}>
            <GraphComponent/>
          </div>
        </div>
        <div className={styles["history-chart-container"]}>
          <div className={styles["main-container"]}>
            <div className={styles["code-container"]}>
              <div className={styles["topLine"]}>Написать код
                <FormControl style={{marginLeft: '10px'}}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lang}
                    onChange={handleLangChange}
                    style={{ width: '100px', height: '22px', color: '#ffffff', fontSize: '15px'}}
                  >
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" className={styles["my-button"]} onClick={handleRedirectMyTest}>
                  <ArrowForwardIcon />
                </Button>
              </div>
              <textarea rows="4" cols="50" className={styles["textArea-design"]} 
                style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className={styles["chart-container"]}>
              <div className={styles["topLine"]}>Результат тестов </div>
              <div className={styles["bottomLine"]}>
                <Pie data={data} options={options} />
              </div>
            </div>
          </div>
          <div className={styles["history-container"]}>
            <div className={styles["topLine"]}>История тестов</div>
            <div className={styles["table-container"]}>
              <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Репозиторий</th>
                  <th>Результат</th>
                </tr>
              </thead>
              <tbody>
                {history.map((histories, index) => {
                  const formattedDate = new Date(histories.testDate);
                  const day = formattedDate.getDate().toString().padStart(2, '0'); // Получаем день месяца, добавляем нуль, если число меньше 10
                  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Получаем месяц (отсчет начинается с нуля), добавляем нуль, если число меньше 10
                  const year = formattedDate.getFullYear();
  
                  return (
                    <tr key={index}>
                      <td>{`${day}.${month}.${year}`}</td>
                      <td>
                        <a href={histories.url} target="_blank" rel="noopener noreferrer" className={styles["link"]}>{histories.url}</a>
                      </td>
                      <td>
                        {histories.result ? <CheckCircleIcon style={{ color: '#4fe0b5' }}/> : <CancelIcon style={{ color: '#fe3237' }}/>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default MainUser;