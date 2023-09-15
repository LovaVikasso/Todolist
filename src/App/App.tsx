import React, { useCallback, useEffect } from "react";
import "./App.css";
import { AppBar, Container, Grid, IconButton, LinearProgress, Toolbar, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { TodolistsList } from "Features/TodolistsList";
import { ErrorSnackBar } from "Components/ErrorSnackBar/ErrorSnackBar";
import { useAppDispatch} from "state/store";
import { Login } from "Features/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {selectIsLoggedIn} from "state/auth.selector";
import {useSelector} from "react-redux";
import {selectAppStatus, selectIiInitialized} from "state/app.selector";
import {authThunks} from "state/auth-reducer";

export const App = () => {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIiInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, []);

  const logOutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Home</Typography>
          {isLoggedIn && (
            <Button onClick={logOutHandler} color="inherit">
              Log Out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
        <ErrorSnackBar />
      </AppBar>
      <Container fixed>
        <Grid container spacing={3}>
          <Routes>
            <Route path={"/login"} element={<Login />} />
            <Route path={"/"} element={<TodolistsList />} />
            <Route path={"/404"} element={<h1>Page not found</h1>} />
            <Route path="*" element={<Navigate to={"/404"} />} />
          </Routes>
        </Grid>
      </Container>
    </div>
  );
};
