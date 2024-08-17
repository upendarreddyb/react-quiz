import React, { useState, useEffect } from 'react'
import { Select, Option, Textarea, Button, Input } from "@material-tailwind/react";
import { useFormik } from 'formik';
import axios from "axios";
import Popup from "./Popup"; // Import your Popup component
import { Api_Url } from '../utils/ApiEndPoints.js'

const AddQuestion = () => {

    const [questiontype, setQuestionType] = useState(true);

    const [curriculumdata, setCurriculum] = useState([]);


    const [subjects, setSubjects] = useState([]);
    const [topics, setTpoics] = useState([]);

    const [filterdsubjects, setFilterdsubjects] = useState([]);
    const [filterdtopics, setFilterdtopics] = useState([]);

    const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
    const [popupProps, setPopupProps] = useState({}); // State to hold props for the Popup component

    const setDropvalues = (type, val) => {
        console.log(type, val)
        if (val === 'Text') setQuestionType(true)
        if (val === 'Image') setQuestionType(false);
        formik.setFieldValue(type, val);
    }

    const setFieldValues = (type, files) => {
        formik.values[type] = files;
        formik.setFieldValue(type, files);
        console.log("onchange", formik.values[type]);
    }

    const getfilterSubjects = (curriculumId) => {
        const filteredSubjects = subjects.filter(subject => subject.curriculum_id === curriculumId);
        console.log("Filtered subjects:", filteredSubjects);
        setFilterdsubjects(filteredSubjects);
        setFilterdtopics([]);
    }

    const getfilterTpoips = (subjectid) => {
        const filteredTopics = topics.filter(subject => subject.subject_id === subjectid);
        console.log("Filtered Topics:", filteredTopics);
        setFilterdtopics(filteredTopics)
    }


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios.get(Api_Url + `getfilters`)
            .then(response => {
                setCurriculum(response.data[0].curriculums);
                setSubjects(response.data[1].subjects);
                setTpoics(response.data[2].topics);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const formik = useFormik({
        initialValues: {
            curriculum: '',
            subject: '',
            topic: '',
            paper: '',
            dificulty: '',
            season: '',
            year: '',
            zone: '',
            calculater: '',
            grade: '',
            question_type: '',
            question: '',
            questionfile: null,
            answer: '',
            answerfile: null
        },
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append('curriculum', values.curriculum);
            formData.append('subject', values.subject);
            formData.append('topic', values.topic);
            formData.append('paper', values.paper);
            formData.append('dificulty', values.dificulty);
            formData.append('season', values.season);
            formData.append('year', values.year);
            formData.append('zone', values.zone);
            formData.append('calculater', values.calculater);
            formData.append('grade', values.grade);
            formData.append('question_type', values.question_type);
            formData.append('question', values.question);
            if (values.question_type === 'Image') {
                for (const file of values.questionfile) {
                    formData.append('questionfiles', file);
                }
                for (const file of values.answerfile) {
                    formData.append('answerfile', file);
                }
            }

            formData.append('answer', values.answer);
            console.log("formData", formData);
            axios.post(Api_Url + "uploads", formData).then(res => {
                console.log(res)
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
                setFilterdsubjects([]);
                setFilterdtopics([]);
            });
        },
        validate: (values) => {
            console.log("validate", values)
            let errors = {};
            if (!values.curriculum) {
                errors.curriculum = "Curriculum  Required";
            }
            if (!values.subject) {
                errors.subject = "Subject  Required";
            }
            if (!values.topic) {
                errors.topic = "Topic  Required";
            }
            if (!values.paper) {
                errors.paper = "Paper  Required";
            }
            if (!values.dificulty) {
                errors.dificulty = "Dificulty  Required";
            }
            if (!values.calculater) {
                errors.calculater = "Calculater  Required";
            }
            if (!values.grade) {
                errors.grade = "Grade  Required";
            }
            if (!values.question_type) {
                errors.question_type = "Question Type  Required";
            }
            if (values.question_type === 'Text' && !values.question) {
                errors.question = "Question Required";

            }
            if (values.question_type === 'Text' && !values.answer) {
                errors.answer = "Answer Is Required";
            }
            if (values.question_type === 'Image' && !values.questionfile) {
                errors.question = "Image Required";
            }

            if (values.question_type === 'Image' && !values.answerfile) {
                errors.answer = "Image  Required";
            }
            return errors;
        }

    });

    return (
        <div className="">

            <div className="w-full md:w-10/12 mx-auto my-4 px-4 md:px-0 shadow-xl border border-gray-200">
                <div className="bg-purple-200 shadow-xl rounded-t-2xl">
                    <div className="h-12 px-4 md:px-6 flex items-center justify-center">
                        <h2 className="text-white text-xl">ADD QUESTION</h2>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} autoComplete='off' encType="multipart/form-data">
                    <div className="space-y-10">
                        <div className="border-b border-gray-900/10 p-12">
                            <div className="grid grid-cols-12 gap-6">

                                <div className="col-span-4">
                                    <Select label="Select curriculum" color="purple" name="curriculum"
                                        onChange={(e) => {
                                            formik.setFieldValue('curriculum', e);
                                            getfilterSubjects(e);
                                        }}
                                    >
                                        {curriculumdata.map(item => (
                                            <Option key={item.curriculum_id} value={item.curriculum_id.toString()}>
                                                {item.currculium}
                                            </Option>
                                        ))}
                                    </Select>

                                    <span className="text-red-800 text-sm"> {formik.errors.curriculum ? <div>{formik.errors.curriculum}</div> : null}</span>
                                </div>
                                <div className="col-span-4">
                                    <Select label="Select Subject" color="purple" name="subject" onChange={e => { formik.setFieldValue('subject', e); getfilterTpoips(e) }}
                                    >
                                        {filterdsubjects.map(item => (
                                            <Option key={item.subject_id} value={item.subject_id.toString()}>{item.subject}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.subject ? <div>{formik.errors.subject}</div> : null}</span>
                                </div>

                                <div className="col-span-4">
                                    <Select
                                        label="Select Topic"
                                        color="purple"
                                        name="topic"

                                        onChange={e => { formik.setFieldValue('topic', e) }}
                                    >
                                        {filterdtopics.map(item => (
                                            <Option key={item.topic_id} value={item.topic_id.toString()}>{item.topic}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.topic ? <div>{formik.errors.topic}</div> : null}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6 py-10">
                                <div className="col-span-4">
                                    <Select
                                        label="Select Paper"
                                        color="purple"
                                        name="paper"
                                        value={formik.values.paper}
                                        onChange={e => { formik.setFieldValue('paper', e) }}
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <Option key={index + 1} value={(index + 1).toString()}>{index + 1}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.paper ? <div>{formik.errors.paper}</div> : null}</span>
                                </div>
                                <div className="col-span-4">
                                    <Select
                                        label="Select Difficulty Level"
                                        color="purple"
                                        name="dificulty"
                                        value={formik.values.dificulty}
                                        onChange={e => { formik.setFieldValue('dificulty', e) }}
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <Option key={index + 1} value={(index + 1).toString()}>{index + 1}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.dificulty ? <div>{formik.errors.dificulty}</div> : null}</span>
                                </div>

                                <div className="col-span-4">
                                    <Select
                                        label="Select Calculator"
                                        color="purple"
                                        name="calculater"
                                        value={formik.values.calculater}
                                        onChange={e => { formik.setFieldValue('calculater', e) }}
                                    >
                                        {['Yes', 'No'].map((option, index) => (
                                            <Option key={index} value={option}>{option}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.calculater ? <div>{formik.errors.calculater}</div> : null}</span>
                                </div>

                            </div>

                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-3">
                                    <Select
                                        label="Select Grade"
                                        color="purple"
                                        name="grade"
                                        value={formik.values.grade}
                                        onChange={e => { formik.setFieldValue('grade', e) }}
                                    >
                                        {[6, 7, 8, 9, 10, 11, 12].map((grade, index) => (
                                            <Option key={index} value={grade.toString()}>{grade}</Option>
                                        ))}
                                    </Select>




                                    <span className="text-red-800 text-sm"> {formik.errors.grade ? <div>{formik.errors.grade}</div> : null}</span>
                                </div>
                                <div className="col-span-3">
                                    <Select
                                        label="Select Zone (op)"
                                        color="purple"
                                        name="zone"
                                        value={formik.values.zone}
                                        onChange={e => { formik.setFieldValue('zone', e) }}
                                    >
                                        {[1, 2, 3].map((zone, index) => (
                                            <Option key={index} value={zone}>{zone}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.zone ? <div>{formik.errors.zone}</div> : null}</span>
                                </div>
                                <div className="col-span-3">
                                    <Select
                                        label="Select Season (op)"
                                        color="purple"
                                        name="season"
                                        value={formik.values.season}
                                        onChange={e => { formik.setFieldValue('season', e) }}
                                    >
                                        {['Feb', 'May', 'Nov'].map((season, index) => (
                                            <Option key={index} value={season}>{season}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.season ? <div>{formik.errors.season}</div> : null}</span>
                                </div>


                                <div className="col-span-3">
                                    <Input label="Enter Year (op)" name="year" onChange={formik.handleChange}
                                        value={formik.values.year} />
                                    <span className="text-red-800 text-sm"> {formik.errors.year ? <div>{formik.errors.year}</div> : null}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6 py-10">
                                <div className="col-span-4">
                                    <Select
                                        label="Select Question Type"
                                        color="purple"
                                        name="question_type"
                                        value={formik.values.question_type}
                                        onChange={e => { formik.setFieldValue('question_type', e); setDropvalues('question_type', e) }}
                                    >
                                        {['Text', 'Image'].map((type, index) => (
                                            <Option key={index} value={type}>{type}</Option>
                                        ))}
                                    </Select>
                                    <span className="text-red-800 text-sm"> {formik.errors.question_type ? <div>{formik.errors.question_type}</div> : null}</span>
                                </div>
                                {questiontype ? <div className="col-span-4">
                                    <Textarea
                                        resize={true}
                                        label="Question"
                                        color="purple"
                                        name="question"
                                        value={formik.values.question}
                                        onChange={formik.handleChange}
                                    />
                                    <span className="text-red-800 text-sm"> {formik.errors.question ? <div>{formik.errors.question}</div> : null}</span>
                                </div> : <div className="col-span-4">
                                    <label htmlFor="questionfile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question files</label>
                                    <input type="file" id="questionfile" name="questionfile" onChange={event => setFieldValues("questionfile", event.currentTarget.files)} multiple className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                                    <span className="text-red-800 text-sm"> {formik.errors.question ? <div>{formik.errors.question}</div> : null}</span>
                                </div>}
                                {questiontype ? <div className="col-span-4">
                                    <Textarea
                                        resize={true}
                                        label="Answer"
                                        color="purple"
                                        name="answer"
                                        value={formik.values.answer}
                                        onChange={formik.handleChange}
                                    />
                                    <span className="text-red-800 text-sm"> {formik.errors.answer ? <div>{formik.errors.answer}</div> : null}</span>
                                </div> : <div className="col-span-4">
                                    <label htmlFor="answerfile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer files</label>
                                    <input type="file" id="answerfile" name="answerfile" onChange={event => setFieldValues("answerfile", event.currentTarget.files)} multiple className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                                    <span className="text-red-800 text-sm"> {formik.errors.answer ? <div>{formik.errors.answer}</div> : null}</span>
                                </div>}
                            </div>

                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 p-4">
                        <Button type="submit" className="bg-cyan-500" color="purple" disabled={!(formik.isValid && formik.dirty)}>Save</Button>
                    </div>
                </form>
                {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
            </div>
        </div>
    );
};

export default AddQuestion;
