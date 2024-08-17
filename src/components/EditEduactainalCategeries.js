import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api_Url } from '../utils/ApiEndPoints.js';
import { Card, Dialog, DialogHeader, DialogBody, Button, Input, Select, Option } from "@material-tailwind/react";
import Popup from "./Popup"; // Import your Popup component

const EditEducationalCategories = () => {
    const [educationalFields, setEducationalFields] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [error, setError] = useState('');
    const [filterText, setFilterText] = useState('');
    const [isReadOnly, setReadOnly] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupProps, setPopupProps] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${Api_Url}geteducationalFields`);
            console.log("Fetched data:", response.data.res);
            setEducationalFields(response.data.res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const openModal = (field) => {
        setCurrentField(field);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentField(null);
        setError('');
    };

    const handleFieldChange = (key, value) => {
        setCurrentField(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        if (!currentField.field) {
            setError('Field cannot be empty');
            return;
        }

        const updatedField = {
            field_value_id: currentField.field_value_id,
            field_type_id: currentField.field_type_id,
            field: currentField.field,
        };

        try {
            const response = await axios.post(`${Api_Url}saveEducationalField`, updatedField);
            console.log("Save response", response.data);
            setShowPopup(true);
            setPopupProps({ message: response.data.message, color: 'green' });
            const updatedFields = educationalFields.map(field =>
                field.field_value_id === currentField.field_value_id ? currentField : field
            );
            setEducationalFields(updatedFields);
            closeModal();
        } catch (error) {
            console.error('Error saving data:', error);
            setShowPopup(true);
            setPopupProps({ message: "Failed to update data", color: 'red' });
            setError('Failed to save data');
        }
    };

    const fieldTypeOptions = [
        { value: 1, label: 'Curriculum' },
        { value: 2, label: 'Subject' },
        { value: 3, label: 'Topic' },
    ];

    const getFieldTypeLabel = (fieldTypeId) => {
        const option = fieldTypeOptions.find(option => option.value === fieldTypeId);
        return option ? option.label : '';
    };

    const filteredFields = educationalFields.filter(field =>
        getFieldTypeLabel(field.field_type_id).toLowerCase().includes(filterText.toLowerCase()) ||
        field.field.toLowerCase().includes(filterText.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFields = filteredFields.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredFields.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <div className="w-full md:w-10/12 mx-auto my-4 px-0 shadow-xl border border-gray-200">
                <div className="bg-purple-200 h-10 shadow-xl rounded-t-2xl">
                    <h2 className="text-white text-center py-2 font-bold text-xl">
                        EDIT EDUCATIONAL CATEGORIES
                    </h2>
                </div>
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Filter fields..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="mb-4 p-2 border rounded"
                    />
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">S NO</th>
                                <th className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Field Type</th>
                                <th className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                                <th className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentFields.map((field, index) => (
                                <tr key={field.field_value_id}>
                                    <td className="px-4 py-2 whitespace-nowrap">{startIndex + index + 1}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{getFieldTypeLabel(field.field_type_id)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{field.field}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <Button
                                            onClick={() => openModal(field)}
                                            className="bg-cyan-500 text-white p-2 rounded-xl"
                                        >
                                            Edit

                                            {/*  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
 */}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={modalIsOpen} handler={closeModal} size="lg">
                <Card className="w-full p-4">
                    <DialogHeader className="">
                        <h2 className="text-xl mb-4">Edit Field</h2>
                    </DialogHeader>
                    <DialogBody>
                        {currentField && (
                            <div className="flex flex-col">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-6">
                                        <Select
                                            label='Field Type'
                                            value={currentField.field_type_id}
                                            onChange={(e) => handleFieldChange('field_type_id', parseInt(e))}
                                            className="mb-2 p-2 border rounded"
                                            disabled={isReadOnly}
                                        >
                                            {fieldTypeOptions.map(option => (
                                                <Option key={option.value} value={option.value}>{option.label}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-span-6">
                                        <Input
                                            label='Field'
                                            type="text"
                                            value={currentField.field}
                                            onChange={(e) => handleFieldChange('field', e.target.value)}
                                            className="p-2 border rounded mb-4"
                                        />
                                        {error && <p className="text-red-600 mb-2">{error}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 py-4">
                                    <Button color="green" className="rounded-lg" onClick={handleSave}>
                                        Update
                                    </Button>
                                    <Button onClick={closeModal} color="gray" ripple="light" className="mr-4">Cancel</Button>
                                </div>
                            </div>
                        )}
                    </DialogBody>
                </Card>
            </Dialog>

            {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default EditEducationalCategories;
