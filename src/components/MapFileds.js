import React, { useState, useEffect } from 'react'
import { Select, Option, Button } from "@material-tailwind/react";
import { useFormik } from 'formik';
import axios from "axios";
import Popup from "./Popup"; // Import your Popup component
import { Api_Url } from '../utils/ApiEndPoints.js'
import { Link, useLocation } from 'react-router-dom';

const MapFileds = (props) => {


    const { fieldsData } = props;
    const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
    const [popupProps, setPopupProps] = useState({});
    console.log("props", fieldsData)

    const [curriculums, setCurriculum] = useState(fieldsData[1] || []);
    const [subjects, setSubject] = useState(fieldsData[2] || []);
    const [topics, setTopic] = useState(fieldsData[3] || []);

    const formik = useFormik({
        initialValues: {
            curriculum: '',
            subject: '',
            topic: ''
        },
        onSubmit: (values, { resetForm }) => {
            axios.post(Api_Url + "mapfields", values).then(res => {
                console.log("res", res);
                if (res.status === 200) {
                    console.log("success: " + res.data.message)
                    setShowPopup(true);
                    setPopupProps({ message: res.data.message, color: 'green' });

                }
            }).catch(error => {
                console.error('Error:', error['response']['data']['error']);

                setShowPopup(true);
                setPopupProps({ message: error['response']['data']['error'], color: 'red' });
            }).finally(() => {
                resetForm();
            });

        },
        validate: (values) => {
            let errors = {};
            if (!values.curriculum) {
                errors.curriculum = "Curriculum Required";
            } if (!values.subject) {
                errors.subject = "Subject Required";
            }
            if (!values.topic) {
                errors.topic = "Topic Required";
            }
            return errors;
        }
    });

    const setDropvalues = (type, val) => {
        console.log(type, val)
        formik.values[type] = val;
        formik.setFieldValue(formik.values[type], val);
    }



    return (
        <div className="">

            <div className="w-full md:w-10/12 mx-auto my-4  md:px-0 shadow-xl rounded-2xl border border-gray-200">
                <div className="bg-purple-200 shadow-xl h-10 rounded-t-2xl" >
                    <h2 className="text-white text-center py-2 font-bolt text-xl">MAP EDUCATIONAL CATEGORIES</h2>
                </div>
                <form onSubmit={formik.handleSubmit} autoComplete='off'>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 p-12">
                            <div className="grid grid-cols-12 gap-8 p-4">
                                <div className="col-span-6">
                                    <Select label="Select Curriculum" name="curriculum"
                                        onChange={e => { formik.handleChange(e); setDropvalues('curriculum', e) }}
                                        value={formik.values.curriculum}>
                                        {curriculums.map(item => (
                                            <Option key={item.id} value={item.id.toString()}>{item.field}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.curriculum ? <div>{formik.errors.curriculum}</div> : null}</span>
                                </div>
                                <div className="col-span-6">
                                    <Select label="Select Subject" name="subject"
                                        onChange={e => { formik.handleChange(e); setDropvalues('subject', e) }}
                                        value={formik.values.subject}>
                                        {subjects.map(item => (
                                            <Option key={item.id} value={item.id.toString()}>{item.field}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.subject ? <div>{formik.errors.subject}</div> : null}</span>
                                </div>

                            </div>

                            <div className="grid grid-cols-12 gap-8 p-4">
                                <div className="col-span-6">
                                    <Select label="Select Topic" name="topic"
                                        onChange={e => { formik.handleChange(e); setDropvalues('topic', e) }}
                                        value={formik.values.topic}>
                                        {topics.map(item => (
                                            <Option key={item.id} value={item.id.toString()}>{item.field}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.topic ? <div>{formik.errors.topic}</div> : null}</span>
                                </div>

                                <div className="col-span-6 gap-8">
                                    <h6> <Button type="submit" className="rounded-full bg-cyan-500 cursor-pointer" disabled={!(formik.isValid && formik.dirty)}>MAP</Button></h6>

                                    <Link
                                        className="underline text-gray-00 text-sm "
                                        to={`/editmappededuactinalfields?curriculums=${encodeURIComponent(JSON.stringify(curriculums))}&subjects=${encodeURIComponent(JSON.stringify(subjects))}&topics=${encodeURIComponent(JSON.stringify(topics))}`}
                                    >
                                        Edit Mapped Educational Fields
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>

            </div>

            {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
        </div>
    )
}

export default MapFileds
