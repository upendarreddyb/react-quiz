import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api_Url } from '../utils/ApiEndPoints.js';
import { Card, Dialog, DialogHeader, DialogBody, Button, Select, Option } from "@material-tailwind/react";
import { useLocation } from 'react-router-dom';

const EditMappedEducationalFields = () => {
    const [mappedfields, setMappedFields] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editData, setEditData] = useState({});
    const [filterText, setFilterText] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const curriculums = JSON.parse(searchParams.get('curriculums') || '[]');
    const subjects = JSON.parse(searchParams.get('subjects') || '[]');
    const topics = JSON.parse(searchParams.get('topics') || '[]');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${Api_Url}getmappedfields`);
            console.log("Fetched data:", response.data.res);
            setMappedFields(response.data.res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setShowEditPopup(true); // Open the dialog when editing is initiated
    };

    const handleClosePopup = () => {
        setShowEditPopup(false);
        setEditData({});
    };

    const handleSaveChanges = async () => {
        try {
            const updatedData = {
                c_id: editData.c_id,
                s_id: editData.s_id,
                t_id: editData.t_id,
                update_id: editData.map_id
            };

            const response = await axios.post(`${Api_Url}updatemappedfield`, updatedData);
            console.log("Updated data:", response.data);
            setShowEditPopup(false);
            setEditData({});
            fetchData(); // Refresh data after update
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    // Filtered fields based on filterText
    const filteredFields = mappedfields.filter(item =>
        item.curriculum_name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.subject_name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.topic_name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Pagination logic
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
                        EDIT MAPPED EDUCATIONAL FIELDS
                    </h2>
                </div>
                <div className="p-4">
                    {/* Filter input */}
                    <input
                        type="text"
                        placeholder="Filter mapped fields..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="mb-4 p-2 border rounded"
                    />
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S No
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Curriculum Name
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Topic
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentFields.map((item, index) => (
                                <tr key={item.map_id}>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{startIndex + index + 1}</div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.curriculum_name}</div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.subject_name}</div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.topic_name}</div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <Button
                                            onClick={() => handleEdit(item)}
                                            className="bg-cyan-500 text-white p-2 rounded-xl"
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-500 text-white">
                            Previous
                        </Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-500 text-white">
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Popup */}
            <Dialog size="lg" open={showEditPopup} onClose={handleClosePopup}>
                <Card className="w-full p-4">
                    <DialogHeader>Edit Mapped Field</DialogHeader>
                    <DialogBody>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-4">
                                <Select
                                    label="Curriculum"
                                    value={String(editData.c_id)}
                                    onChange={(e) => setEditData({ ...editData, c_id: parseInt(e) })}
                                >
                                    {curriculums.map(item => (
                                        <Option key={item.id} value={String(item.id)}>{item.field}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-span-4">
                                <Select
                                    label="Subject"
                                    value={String(editData.s_id)}
                                    onChange={(e) => setEditData({ ...editData, s_id: parseInt(e) })}
                                >
                                    {subjects.map(item => (
                                        <Option key={item.id} value={String(item.id)}>{item.field}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-span-4">
                                <Select
                                    label="Topic"
                                    value={String(editData.t_id)}
                                    onChange={(e) => setEditData({ ...editData, t_id: parseInt(e) })}
                                >
                                    {topics.map(item => (
                                        <Option key={item.id} value={String(item.id)}>{item.field}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleSaveChanges} color="green" ripple="light" className="mr-4">Update</Button>
                            <Button onClick={handleClosePopup} color="gray" ripple="light">Cancel</Button>
                        </div>
                    </DialogBody>
                </Card>
            </Dialog>
        </div>
    );
}

export default EditMappedEducationalFields;
