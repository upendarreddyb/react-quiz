import React, { useState } from 'react'
import { Card, Dialog, DialogHeader, DialogBody, } from "@material-tailwind/react";
import { IMG_URL } from '../utils/ApiEndPoints.js'
import Delete from '../icons/Delete.js';
import Calculator from '../icons/calculator.png';
import CrossIcon from '../icons/CrossIcon.png'; // Make sure to replace this with the actual path to the cross symbol

import { Api_Url } from '../utils/ApiEndPoints.js'
import axios from 'axios';
import Popup from "./Popup"; // Import your Popup component

const QuestionCard = (props) => {
    const { qData } = props;
    const { id, question_type, question, answer, calculator, curriculum_field, subject_field, topic_field } = qData;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    const [isHovered, setIsHovered] = useState(false);
    const { questions, fetchQuestions } = props;
    const { index } = props;
    const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
    const [popupProps, setPopupProps] = useState({}); // State to hold props for the Popup component


    const handleDelete = () => {
        const confirmed = window.confirm('Are you sure you want to delete this Question?');
        if (confirmed) {
            deleteItem(id);
        }
    };
    const deleteItem = async (id) => {

        console.log(`Deleting item with id ${id}`);
        await axios.delete(`${Api_Url}/deleteQuestion/${id}`)
            .then(response => {
                console.log("res", response);
                console.log(response.data.message)
                if (response.status === 200) {
                    setShowPopup(true);
                    setPopupProps({ message: response.data.message, color: 'green' });
                    fetchQuestions();
                }
            })
            .catch(error => {
                setShowPopup(true);
                setPopupProps({ message: error.response.data.error, color: 'red' });
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <div className="relative h-100  p-4 rounded-lg border">
                <div className='text-lg text-cyan-700 flex  justify-between'>
                    <ul className='flex flex-wrap items-center space-x-2'>

                        <li className='flex flex-wrap items-center space-x-2 cursor-pointer'
                            onClick={handleDelete}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>
                            Q- {index + 1} (
                            {topic_field}
                            {calculator === 'Yes' &&

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                                </svg>


                            }
                            {calculator === 'No' && (
                                <div className='relative w-4 '>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                                    </svg>
                                    <img src={CrossIcon} className='absolute top-2 left-1 w-4 h-4' alt="cross" />
                                </div>
                            )}
                            )
                            {<span className='ml-2 text-red-600'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>

                            </span>}
                        </li>

                    </ul>
                    <div>
                        <h6 className="rounded-lg bg-gary-400 cursor-pointer text-sm" onClick={handleOpen} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </h6>
                    </div>
                </div>
                <div>
                    {
                        question_type === 'Text' &&
                        <div className="w-auto text-pretty p-2">
                            <h2>{question}</h2>
                        </div>
                    }
                    {
                        question_type === 'Image' &&
                        question.split(',').map(item => (
                            <div>
                                <div className="w-[50%] h-50">
                                    <img src={IMG_URL + item} alt="" />
                                </div>
                                <br />
                            </div>
                        ))
                    }

                </div>
            </div>
            <Dialog open={open} handler={handleOpen} size='xl' className='rounded-xl'>
                <DialogHeader>
                    <div className='flex space-x-[960px]'>
                        <div>
                            <h5 className='text-cyan-600'>Q:{id}</h5>
                            <h5 className='text-cyan-600'>Answer</h5>
                        </div>
                        <div className="cursor-pointer px-6">
                            <h5 onClick={handleOpen}>❌</h5>
                        </div>
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="overflow-y-auto max-h-[400px]">
                        {
                            question_type === 'Text' &&
                            <div className="w-auto text-pretty p-2">
                                <h2>{answer}</h2>
                            </div>
                        }
                        {
                            question_type === 'Image' &&
                            answer.split(',').map(item => (
                                <div key={item}>
                                    <div className="w-[50%] h-50">
                                        <img src={IMG_URL + item} alt="" />
                                    </div>
                                    <br />
                                </div>
                            ))
                        }
                    </div>
                </DialogBody>
            </Dialog>
            {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
        </div>
    )
}

export default QuestionCard