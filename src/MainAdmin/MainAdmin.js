import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AppBarUser from '../components/AppBarUser';
import { useNavigate } from 'react-router-dom';
import styles from './MainAdmin.module.css';
import { refreshAccessToken,  decodeToken} from '../App';

function MainAdmin() {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
        fetchUsers();
    }, []);

    const handleRedirect = () => {
        navigate(`/addUser`);
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

    const handleDelete = (userId) => {
        const token = localStorage.getItem('token');
        checkToken();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/deleteUser/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .then(() => {
            console.log("User deleted");
            fetchUsers();
            fetchLogs();
        })
        .catch(error => {
            console.error("Error deleting user:", error);
        });
    };
    


    const filterUsers = () => {
        return users.filter(user => {
            return user.email.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const fetchLogs = () => {
        const token = localStorage.getItem('token');
    
        checkToken();
    
        fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/getLogs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => setLogs(data))
        .catch(error => console.error('Error fetching logs:', error));
    };

    const fetchUsers = () => {
        const token = localStorage.getItem('token');
    
        checkToken();
    
        fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/getAllUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => setUsers(data))
        .catch(error => console.error('Error fetching logs:', error));
    };

    return (
        <div>
            <AppBarUser/>
            <div className={styles["container"]}>
                <h2>Логи</h2>
                <div className={styles["table-container"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Level</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index}>
                                    <td>{log.id}</td>
                                    <td>{log.level}</td>
                                    <td>{log.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles["my-container"]}>
                <h2>Пользователи</h2>
                <div className={styles["inp-but"]}>
                <input 
                    type="text" 
                    placeholder="Поиск по email" 
                    value={searchTerm} 
                    className={styles["my-input-field"]}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" className={styles["my-button"]} onClick={handleRedirect}>Добавить</Button>
                </div>
                <div className={styles["table-container"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>role</th>
                                <th>registerDate</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterUsers().map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.registerDate}</td>
                                    <td>
                                        <button onClick={() => handleDelete(user.id)} className={styles["delete-button"]}>Удалить</button> {/* Кнопка "Удалить" */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MainAdmin;
