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

export default function AppBarMain() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/loginRegister");
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
                    <Button color="inherit" onClick={handleLoginClick}>Войти</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
