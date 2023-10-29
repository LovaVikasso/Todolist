import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import {
    // FormikHelpers,
    useFormik} from "formik";
import {useAppDispatch} from "State/store";
import {Navigate} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {selectIsLoggedIn} from "State/auth.selector";
import {useSelector} from "react-redux";
import {authThunks} from "State/auth-reducer";

type FormValues = {
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
            let errors: FormValues = {};

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
        }
        // onSubmit: (values
        //            , formikHelpers: FormikHelpers<FormValues>
        // ) => {
        //     dispatch(authThunks.login(values))
        //     // //санки всегда возвращают зарезовленный промис и если нам надо попасть в catch то испольщуем метод unwrap,
        //     // //которые видет reject или fulfilled
        //     .unwrap()
        //     .catch((error: BaseResponseType) => {
        //         error.fieldsErrors?.forEach((fieldEr) => {
        //             formikHelpers.setFieldError(fieldEr.field, fieldEr.error)
        //         })
        //         // formikHelpers.setFieldError(error.fieldsErrors[0].field, error.fieldsErrors[0].error)
        //     })
        //     formik.resetForm();
        // },
    });
    if (isLoggedIn) {
        return <Navigate to={"/"}/>;
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target='_blank'
                           rel="noopener noreferrer"> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField label="Email" margin="normal" {...formik.getFieldProps('email')}/>
                        {/*{formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}*/}
                        {formik.touched.email && formik.errors.email &&
                        <div style={{color: 'red'}}>{formik.errors.email}</div>}
                        <TextField type="password" label="Password"
                                   margin="normal" {...formik.getFieldProps('password')}/>
                        {/*{formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}*/}
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