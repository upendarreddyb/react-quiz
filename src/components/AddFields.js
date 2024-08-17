import React, { useState, useEffect } from 'react'
import { Select, Option, Button, Input } from "@material-tailwind/react";
import { useFormik } from 'formik';
import axios from "axios";
import MapFileds from "./MapFileds";
import Popup from "./Popup"; // Import your Popup component
import { Api_Url } from '../utils/ApiEndPoints.js'
import { Link, useLocation } from 'react-router-dom';


const AddFields = () => {
    const [fields, setFields] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
    const [popupProps, setPopupProps] = useState({}); // State to hold props for the Popup component

    const formik = useFormik({
        initialValues: {
            fieldetype: "",
            field: ""
        },
        onSubmit: (values, { resetForm, setSubmitting }) => {
            axios.post(Api_Url + "addfields", values).then(res => {
                if (res.status === 200) {
                    console.log("success: " + res.data.message)
                    setShowPopup(true);
                    setPopupProps({ message: res.data.message, color: 'green' });
                    fetchData()//setting updated vaules to the child component
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
            if (!values.fieldetype) {
                errors.fieldetype = "Field Type Required";
            }
            if (!values.field) {
                errors.field = "Field Required";
            }
            return errors;
        }
    });

    const setDropvalues = (type, val) => {
        console.log(type, val)
        formik.values[type] = val;
        formik.setFieldValue(formik.values[type], val);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios.get(Api_Url + `getfields`)
            .then(response => {
                console.log(response.data.groupedFields);
                setFields(response.data.groupedFields)

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }


    return (
        <div className="">
            <div className="w-full md:w-10/12 mx-auto my-4 px-0 shadow-xl border border-gray-200">
                <div className="bg-purple-200 h-10 shadow-xl rounded-t-2xl" >
                    <h2 className="text-white text-center py-2 font-bolt text-xl">ADD EDUCATIONAL CATEGORIES</h2>
                </div>
                <form onSubmit={formik.handleSubmit} autoComplete='off'>
                    <div className="space-y-12">
                        <div className=" p-12">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-6">
                                    <Select label="Select Educational Categories" name="fieldetype"
                                        onChange={e => { formik.handleChange(e); setDropvalues('fieldetype', e) }}
                                        value={formik.values.fieldetype}
                                    >
                                        <Option value="1">Curriculum</Option>
                                        <Option value="2">Subject</Option>
                                        <Option value="3">Topic</Option>
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.fieldetype ? <div>{formik.errors.fieldetype}</div> : null}</span>
                                </div>
                                <div className="col-span-6">
                                    <Input label="Enter Educational Categorey Value" name="field" onChange={formik.handleChange}
                                        value={formik.values.field} />
                                    <span className="text-red-800 text-sm"> {formik.errors.field ? <div>{formik.errors.field}</div> : null}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-6 py-8 text-center">
                                <div className="col-span-12">
                                    <h6>

                                        <Button type="submit" className="rounded-full bg-cyan-500 cursor-pointer px-4 m-2" disabled={!(formik.isValid && formik.dirty)}>Submit</Button>

                                        <Link className="underline text-gray-00 text-sm" to="/editeducationcategeries" >
                                          Edit Educational Categries
                                        </Link>
                                    </h6>


                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {fields && <div className="text-center font-bolt text-xl">
                    <MapFileds key={JSON.stringify(fields)} fieldsData={fields} />
                </div>}
            </div>
            {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
        </div>
    )
}

export default AddFields
