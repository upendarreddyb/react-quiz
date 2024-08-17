import React, { useState, useEffect } from 'react';
import { Textarea, Button } from "@material-tailwind/react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from "axios";
import * as Yup from 'yup';
import Popup from "./Popup"; // Import your Popup component
import { Api_Url } from '../utils/ApiEndPoints.js';

const Branding = () => {
    const [branding, setBranding] = useState({});
    const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
    const [popupProps, setPopupProps] = useState({}); // State to hold props for the Popup component

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios.get(Api_Url + `getbranding`)
            .then(response => {
                console.log(response.data.res[0]);
                setBranding(response.data.res[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const validationSchema = Yup.object({
        headerText: Yup.string().required('Header Text Required'),
        footerText: Yup.string().required('Footer Text Required')
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const res = await axios.post(Api_Url + "updatebranding", values);
            if (res.status === 200) {
                console.log("success: " + res.data.message);
                setShowPopup(true);
                setPopupProps({ message: res.data.message, color: 'green' });
                fetchData();
            }
        } catch (error) {
            console.error('Error:', error['response']['data']['error']);
            setShowPopup(true);
            setPopupProps({ message: error['response']['data']['error'], color: 'red' });
        } finally {
            resetForm();
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <div className="w-full md:w-10/12 mx-auto my-4 px-4 md:px-0 shadow-xl border border-gray-200">
                <div className="bg-purple-200 shadow-xl rounded-t-2xl h-12">
                    <div className="h-12 px-4 md:px-6 flex items-center justify-center">
                        <h2 className="text-white text-xl">ADD BRANDING TO WORD / PDF</h2>
                    </div>
                </div>
                <Formik
                    initialValues={{
                        headerText: branding.header_text || '',
                        footerText: branding.footer_text || ''
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, isValid, dirty }) => (
                        <Form autoComplete='off'>
                            <div className="space-y-12">
                                <div className=" p-12">
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-6">
                                            <Field as={Textarea} 
                                                label="Header Text" 
                                                name="headerText"
                                                className="block w-full px-3 py-2 border rounded-md" 
                                            />
                                            <span className="text-red-800 text-sm">
                                                <ErrorMessage name="headerText" component="div" />
                                            </span>
                                        </div>
                                        <div className="col-span-6">
                                            <Field as={Textarea} 
                                                label="Footer Text" 
                                                name="footerText"
                                                className="block w-full px-3 py-2 border rounded-md" 
                                            />
                                            <span className="text-red-800 text-sm">
                                                <ErrorMessage name="footerText" component="div" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-6 py-8 text-center">
                                        <div className="col-span-12">
                                            <Button 
                                                type="submit" 
                                                className="rounded-full bg-cyan-500 cursor-pointer" 
                                                disabled={!(isValid && dirty) || isSubmitting}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default Branding;
