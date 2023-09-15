import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useAppDispatch } from "state/store";
import { Navigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import {selectIsLoggedIn} from "state/auth.selector";
import {useSelector} from "react-redux";
import {authThunks} from "state/auth-reducer";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      let errors: FormikErrorType = {};

      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password?.trim().length < 3) {
        errors.password = 'Length should be more 3 symbols';
      }
      return errors;
    },
    onSubmit: values => {
      dispatch(authThunks.login(values))
      formik.resetForm();
    },
  });
  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel>
          <p>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               target={'_blank'}> here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </FormLabel>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email" margin="normal"  {...formik.getFieldProps('email')}/>
            {formik.touched.email && formik.errors.email &&
                <div style={{color: 'red'}}>{formik.errors.email}</div>}
            <TextField type="password" label="Password"
                       margin="normal"   {...formik.getFieldProps('password')}/>

            {formik.touched.password && formik.errors.password &&
                <div style={{color: 'red'}}>{formik.errors.password}</div>}

            <FormControlLabel label={'Remember me'} control={
              <Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>
            }/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}