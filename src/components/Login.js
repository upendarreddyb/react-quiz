import React from 'react';
import { Input } from "@material-tailwind/react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Api_Url } from '../utils/ApiEndPoints.js'



const Login = ({ setLoggedIn }) => {

    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post(Api_Url+'validateUser', values);
            if (response.data.success) {
                console.log(response.data.data)
                localStorage.setItem('loggedIn', 'true');
                setLoggedIn(true);
            } else {
                setErrors({ apiError: response.data.message });
            }
        } catch (error) {
            setErrors({ apiError: 'An error occurred. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('User Name Required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password Required')
    });

    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center ">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                    >
                        {({ isSubmitting, errors }) => (
                            <Form className="mt-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Field
                                            as={Input}
                                            label="Username"
                                            name="username"
                                            type="text"
                                            className="block w-full px-3 py-2 border rounded-md"
                                        />
                                        <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <Field
                                            as={Input}
                                            label="Password"
                                            name="password"
                                            type="password"
                                            className="block w-full px-3 py-2 border rounded-md"
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                                {errors.apiError && <div className="text-red-500 text-sm">{errors.apiError}</div>}
                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:cyan-500"
                                        disabled={isSubmitting}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className="w-1/2 bg-gradient-to-r from-cyan-100 to-cyan-900 flex items-center justify-center">
                <h3 className="text-5xl text-white font-bold">Quiz</h3>
            </div>
        </div>
    );
}

export default Login;
