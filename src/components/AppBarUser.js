// AppBarMain.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './AppBar.module.css';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function AppBarUser() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/profile`);
    };

    const handleExit = () => {
        localStorage.clear();
        navigate(`/`);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar className={styles['main-body']}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        OnlineTest
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="account"
                        sx={{ mr: 2 }}
                        onClick={handleRedirect}
                    >
                        <AccountCircleIcon/>
                    </IconButton>
                    <Button color="inherit" onClick={handleExit}>Выйти</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
