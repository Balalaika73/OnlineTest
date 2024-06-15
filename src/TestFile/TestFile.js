import React, { useEffect, useState } from 'react';
import AppBarUser from '../components/AppBarUser';
import styles from './TestFile.module.css';
import { refreshAccessToken,  decodeToken} from '../App';
import { useLocation, useNavigate  } from 'react-router-dom';
import DotLoader from "react-spinners/DotLoader";

function TestFile() {
    const [inputValues, setInputValues] = useState([]);
    const [codeLines, setCodeLines] = useState([]);
    const [result, setResult] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const dataCode = params.get('data') || '';
    const typeCode = params.get('type') || '';

    let url = null;
    let fileName = null;
    let rawURL = null;
    let link = null;

    if (localStorage.getItem('link')) {
        link = localStorage.getItem('link');
        const repoParts = link.split("/");
        const username = repoParts[3];
        const repository = repoParts[4];
        fileName = localStorage.getItem('selectedFile');
        rawURL = `https://raw.githubusercontent.com/${username}/${repository}/main/${fileName}`;
        url = { urlCode: rawURL};
    }

    const clearSearchParams = () => {
        navigate(location.pathname); // Используем navigate вместо history.replace
    };

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

    function handleUpload() {
        if(!file){
            setMsg("No file selected");
            return;
        }
        const fd = new FormData();
        fd.append('file', file);

        setMsg("Uploading...");
        /*setProgress(prevState => {
            return {...prevState, started: true}
        })*/
        fetch('http://localhost:8080/code/python/getExcel', {
            method: "POST",
            body: fd,
            /*onUploadProgress: (progressEvent) => {setProgress(prevState => {
                return {...prevState, pc: progressEvent.progress*100}
            })},*/
            headers: {
                "Custom-Header": "value"
            }
        })
        .then(res=> {
            if(!res.ok){
                throw new Error("Bad response");
            }
            setMsg("Uploud sucessful");
            console.log(res.data)
            return res.json();
        })
        .then(data => console.log(data))
        .catch(err => {
            setMsg("Uploud failed");
            console.error(err)
        });
    }

    const handleInputChange = (index, event) => {
        const values = [...inputValues];
        values[index].value = event.target.value;
        setInputValues(values);
    };

    useEffect(() => {//загрузка кода
        var lastWord = rawURL.substring(rawURL.lastIndexOf("/") + 1);
        console.log(lastWord);
        fileName = lastWord;
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
        }, 5000)
        const token = localStorage.getItem('token');
        console.log(typeCode);
        checkToken();

        if (dataCode !== '') {
            fetch(`http://localhost:8080/code/getUserCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: dataCode })
            })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Получаем текст ответа
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setCodeLines(data.split('\n'));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

            if (typeCode === 'Python'){
                fetch(`http://localhost:8080/code/python/getUserVar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: dataCode })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    const formattedData = data.map(item => ({
                        name: item.name,
                        value: "",
                        type: item.type
                    }));
                    //console.log(formattedData);
                    setInputValues(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }
            else if (typeCode === 'Java'){
                fetch(`http://localhost:8080/code/java/getUserVar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: dataCode })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    const formattedData = data.map(item => ({
                        name: item.name,
                        value: "",
                        type: item.type
                    }));
                    //console.log(formattedData);
                    setInputValues(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }
        }
        else {
            if(fileName && fileName.endsWith('.java')) {
                fetch(`http://localhost:8080/code/java/getVar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(url)
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    const formattedData = data.map(item => ({
                        name: item.name,
                        value: "",
                        type: item.type
                    }));
                    console.log(formattedData);
                    setInputValues(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }
            else if(fileName && fileName.endsWith('.py')) {
                fetch(`http://localhost:8080/code/python/getVar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(url)
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    const formattedData = data.map(item => ({
                        name: item.name,
                        value: "",
                        type: item.type
                    }));
                    console.log(formattedData);
                    setInputValues(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }
    
            fetch(`http://localhost:8080/code/getCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(url)
            })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Получаем текст ответа
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setCodeLines(data.split('\n'));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }

        /*const handleUnmount = () => {
            localStorage.removeItem('selectedFile');
        };*/

        return () => {
            //handleUnmount();
        };
    }, [link], [navigate]);

    const renderInputField = (input, index) => {
        console.log(input[0]);
        if (input.type  === 'int' || input.type === 'float') {
            return (
                <input
                className={styles["my-input-field"]}
                key={index}
                type="number"
                placeholder={input.name}
                value={input.value}
                onChange={(event) => handleInputChange(index, event)}
                />
            );
        } else if (input.type === 'bool') {
            return (
                <select
                    className={styles["my-input-field"]}
                    key={index}
                    onChange={(event) => handleInputChange(index, event)}
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            );
        } else {
            return (
                <input
                    className={styles["my-input-field"]}
                    key={index}
                    type="text"
                    placeholder={input.name}
                    onChange={(event) => handleInputChange(index, event)}
                />
            );
        }
    };

    const handleExpExcelClick = () => {
        const token = localStorage.getItem('token');
        checkToken();

        if (dataCode !== '') {
            if (typeCode === 'Python') {
                fetch(`http://localhost:8080/excel/downloadUserVarsPython`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ code: dataCode })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке файла');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'FormForVars.xlsx'; // Устанавливаем имя файла для загрузки
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
            else if (typeCode === 'Java') {
                fetch(`http://localhost:8080/excel/downloadUserVarsJava`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ code: dataCode })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке файла');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'FormForVars.xlsx'; // Устанавливаем имя файла для загрузки
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
        } 
        else {
            if(fileName.endsWith('.py')) {
                fetch(`http://localhost:8080/excel/downloadVarsPython`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(url)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке файла');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'FormForVars.xlsx'; // Устанавливаем имя файла для загрузки
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
            else if (fileName.endsWith('.java')) {
                fetch(`http://localhost:8080/excel/downloadVarsJava`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(url)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке файла');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'FormForVars.xlsx'; // Устанавливаем имя файла для загрузки
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
        }
    };

    function formatOutput(responseData) {
        let lines = responseData.output.split('\n');

        let formattedOutput = "";
    
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (trimmedLine !== "") {
                formattedOutput += trimmedLine + "\n";
            }
        });
    
        return formattedOutput;
    }

    const handleTestClick = () => {
        const token = localStorage.getItem('token');
        checkToken();

        const values = inputValues.map(input => input.value);

        if (dataCode !== '') {
            const codeRun = {
                code: dataCode,
                values: values
            };
            setLoading(true);
            if(typeCode === 'Python') {
                fetch(`http://localhost:8080/code/python/runUserCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(codeRun)
                })
                .then(response => {
                return response.text();
                })
                .then(data => {
                    setResult(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
            else if (typeCode === 'Java') {
                fetch(`http://localhost:8080/code/java/runUserCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(codeRun)
                })
                .then(response => {
                return response.text();
                })
                .then(data => {
                    setResult(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
        }
        else {
            const codeRun = {
                url: rawURL,
                values: values
            };
            setLoading(true);
            console.log(codeRun);
            if(fileName.endsWith('.py')) {
                fetch(`http://localhost:8080/code/python/runCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(codeRun)
                })
                .then(response => {
                    return response.text(); // Преобразование ответа в JSON
                })
                .then(data => {
                    setResult(data); // Получение только поля output
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
            }
            else if (fileName.endsWith('.java')) {
                fetch(`http://localhost:8080/code/java/runCode`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(codeRun)
                })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then(data => {
                    setResult(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
        }
    };

    const handleSaveExcelClick = (selectedFile) => {
        const token = localStorage.getItem('token');
        if (!selectedFile) {
            console.error('Файл не выбран');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        setLoading(true);
        if (dataCode !== '') {
            if (typeCode === 'Python') {
                formData.append('userCode.code', dataCode);  
                fetch(`http://localhost:8080/excel/uploudUserVarsPython`,{
                method: "POST",
                headers: {
                    "Custom-Header": "value",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
                })
                .then(res => {
                if (!res.ok) {
                    throw new Error("Bad response");
                }
                setMsg("Upload successful");
                return res.blob();
                })
                .then(blob => {
                const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Report.xlsx'; // Устанавливаем имя файла для загрузки
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                })
                .catch(err => {
                setMsg("Upload failed");
                console.error(err);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
            else if (typeCode === 'Java') {
                formData.append('userCode.code', dataCode);  
                fetch(`http://localhost:8080/excel/uploudUserVarsJava`,{
                method: "POST",
                headers: {
                    "Custom-Header": "value",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
                })
                .then(res => {
                if (!res.ok) {
                    throw new Error("Bad response");
                }
                setMsg("Upload successful");
                return res.blob();
                })
                .then(blob => {
                const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Report.xlsx'; // Устанавливаем имя файла для загрузки
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                })
                .catch(err => {
                setMsg("Upload failed");
                console.error(err);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
        }
        else {
            formData.append('codeRequest.urlCode', rawURL);        
            setMsg("Uploading...");
            if(fileName.endsWith('.py')) {
                fetch(`http://localhost:8080/excel/uploudVarsPython`,{
                method: "POST",
                headers: {
                    "Custom-Header": "value",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
                })
                .then(res => {
                if (!res.ok) {
                    throw new Error("Bad response");
                }
                setMsg("Upload successful");
                return res.blob();
                })
                .then(blob => {
                const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Report.xlsx'; // Устанавливаем имя файла для загрузки
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                })
                .catch(err => {
                setMsg("Upload failed");
                console.error(err);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
            else if (fileName.endsWith('.java')) {
                fetch(`http://localhost:8080/excel/uploudVarsJava`,{
                method: "POST",
                headers: {
                    "Custom-Header": "value",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
                })
                .then(res => {
                    if (!res.ok) {
                    throw new Error("Bad response");
                    }
                    setMsg("Upload successful");
                    return res.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob); // Создаем URL для Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Report.xlsx'; // Устанавливаем имя файла для загрузки
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(err => {
                    setMsg("Upload failed");
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false); // Установка loading в false после получения ответа или обработки ошибки
                });
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return; // Если файл не выбран, ничего не делаем
    
        setFile(selectedFile);
        handleSaveExcelClick(selectedFile); // Вызываем функцию и передаем выбранный файл
    };
    

    return (
        <div>
            <AppBarUser/>
            {
                loading ? (
                    <div>
                    <div className={styles["dot-container"]}>
                    <DotLoader color="#15cdcb" loading={loading} size={80}/>
                    </div>
                     <div className={styles["container"]}>
                     <div className={styles["input-container"]}>
                     <button for="file-download" className={styles["my-button"]} onClick={handleExpExcelClick}>Экспортировать</button>
                     <label for="file-upload" className={styles["custom-file-upload"]}>
                             Импортировать
                     </label>
                     <input id="file-upload" accept=".xlsx, .xls" type="file" className={styles["input-file"]} onChange={handleFileChange}/>
                         <div>
                             {inputValues.map((input, index) => (
                                 renderInputField(input, index)
                             ))}
                         </div>
                         <button className={styles["my-button"]} onClick={(e) => {handleTestClick(); handleUpload();}}>Тестировать</button>
                         <div className={styles["output-label-container"]}>
                             <label>Результат: <p></p>{result}</label>
                         </div>
                     </div>
                     <div className={styles["label-container"]}>
                         {codeLines.map((line, index) => (
                             <label
                                 key={index}
                                 className={index === codeLines.length - 1 ? styles["last-label"] : ""}
                             >
                             {line}
                             </label>
                         ))}
                     </div>
                     </div>
                 </div>
                )
                : (
                    <div className={styles["container"]}>
                <div className={styles["input-container"]}>
                <button for="file-download" className={styles["my-button"]} onClick={handleExpExcelClick}>Экспортировать</button>
                <label for="file-upload" className={styles["custom-file-upload"]}>
                        Импортировать
                </label>
                <input id="file-upload" accept=".xlsx, .xls" type="file" className={styles["input-file"]} onChange={handleFileChange}/>
                    <div>
                        {inputValues.map((input, index) => (
                            renderInputField(input, index)
                        ))}
                    </div>
                    <button className={styles["my-button"]} onClick={(e) => {handleTestClick(); handleUpload();}}>Тестировать</button>
                    <div className={styles["output-label-container"]}>
                        <label>Результат: <p></p>{result}</label>
                    </div>
                </div>
                <div className={styles["label-container"]}>
                    {codeLines.map((line, index) => (
                        <label
                            key={index}
                            className={index === codeLines.length - 1 ? styles["last-label"] : ""}
                        >
                        {line}
                        </label>
                    ))}
                </div>
                
            </div>
                )
            }
        </div>
    );
}

export default TestFile;