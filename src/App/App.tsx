import React from 'react';
import './App.css';
import {AppBar, Container, Grid, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {TodolistsList} from "../Features/TodolistsList";
import {ErrorSnackBar} from "../Components/ErrorSnackBar/ErrorSnackBar";
import {useAppSelector} from "../state/store";

export const App = () => {
    const status = useAppSelector(state => state.app.status)
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
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress/> }
                <ErrorSnackBar/>
            </AppBar>
            <Container fixed>
                <Grid container spacing={3}>
                    <TodolistsList/>
                </Grid>
            </Container>

        </div>
    );
}
