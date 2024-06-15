import React, { useEffect, useState } from 'react';
import AppBarUser from '../components/AppBarUser';
import SimpleBackdrop from '../components/ProgressBar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './MainTest.module.css';
import { refreshAccessToken,  decodeToken} from '../App';

function MainTest() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false); // Состояние для отслеживания загрузки данных
    const link = localStorage.getItem('link');
    const repo = { githubUrl: link };
    console.log(link);

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

    const handleRedirect = (file) => {
        if (!file.endsWith('.py') &&  !file.endsWith('.java')) {
            alert('Неверный формат файла');
            return;
        }
        localStorage.setItem('selectedFile', file);
        navigate(`/testFile`);
    };    

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        checkToken();

        fetch(`http://localhost:8080/code/getRepoFiles`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(repo)
        })
        .then(response => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log(data);
            setFiles(data); // Сохраняем полученные файлы в состоянии
            setLoading(false); // Устанавливаем состояние загрузки в false после получения данных
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            setLoading(false);
        });
    }, [link]);
    
    return (
        <div>
            <AppBarUser/>
            <div className={styles["my-container"]}>
                <h2 className={styles["my-title"]}>Файлы репозитория</h2>
                <h3 className={styles["my-link"]}>{link}</h3>
            </div>
            {loading && <div><SimpleBackdrop/></div>}
            {!loading && (
                <div className={styles["my-container-files"]}>
                    {files.map((file, index) => (
                        <div key={index} className={styles["file-container"]}>
                            <div className={styles["column"]}>
                                <label htmlFor={`button-${index}`} className={styles["my-file"]}>{file}</label>
                            </div>
                            <div className={styles["column"]}>
                                <button onClick={() => handleRedirect(file)} id={`button-${index}`} className={styles["my-btn"]}>Протестировать</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MainTest;
