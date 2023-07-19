import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AppBar, Container, Grid, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {TodolistsList} from "../Features/TodolistsList";
import {ErrorSnackBar} from "../Components/ErrorSnackBar/ErrorSnackBar";
import {useAppDispatch, useAppSelector} from "../state/store";
import {Login} from "../Features/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {initializeAppTC} from "../state/app-reducer";
import {logoutTC} from "../state/auth-reducer";

export const App = () => {
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logOutHandler = useCallback(() => {
        dispatch(logoutTC())
    },[])

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Home
                    </Typography>
                    {isLoggedIn && <Button onClick={logOutHandler} color="inherit">Log Out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
                <ErrorSnackBar/>
            </AppBar>
            <Container fixed>
                <Grid container spacing={3}>
                    <Routes>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'/404'} element={<h1>Page not found</h1>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Grid>
            </Container>


        </div>
    );
}
