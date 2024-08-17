import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Option, Button } from "@material-tailwind/react";
import QuestionCard from './QuestionCard';
import { useFormik } from 'formik';
import GenerateWord from './GenerateWord.js';
import GeneratePdf from './GeneratePdf.js';
import Popup from './Popup.js';
import { Api_Url } from '../utils/ApiEndPoints.js'

const GetQuestions = () => {
  const [curriculum, setCurriculum] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTpoics] = useState([]);
  const [filterdsubjects, setFilterdsubjects] = useState([]);
  const [filterdtopics, setFilterdtopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [worddata, setWordData] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
  const [popupProps, setPopupProps] = useState({});

  const getfilterSubjects = (curriculumId) => {
    const filteredSubjects = subjects.filter(subject => subject.curriculum_id === curriculumId);
    console.log("Filtered subjects:", filteredSubjects);
    setFilterdsubjects(filteredSubjects);
    getfilterTpoips([])

  }

  const getfilterTpoips = (subjectid) => {
    const filteredTopics = topics.filter(subject => subject.subject_id === subjectid);
    console.log("Filtered Topics:", filteredTopics);
    setFilterdtopics(filteredTopics)
  }

  const fetchQuestions = async () => {
    await axios.get(Api_Url + `getquestions?page=${currentPage}&limit=10`)
      .then(response => {
        console.log(response.data.results);
        setQuestions(response.data.results);
        setWordData(response.data.results)
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formik = useFormik({
    initialValues: {
      curriculum: '',
      subject: '',
      topic: '',
      paper: '',
      dificulty: '',
      calculater: '',
      season: '',
      zone: '',
      page: currentPage,
      limit: 5
    },
    onSubmit: (values) => {
      console.log("submitted values", values);
      const queryParams = new URLSearchParams(values).toString();
      axios.get(Api_Url + `getflterdquestions?${queryParams}`)
        .then(response => {
          console.log("res", response);
          if (response.status === 200) {
            setQuestions(response.data.results);
            setTotalPages(response.data.totalPages);
            setWordData(response.data.results)
          }
        })
        .catch(error => {
          console.error('Error:', error.response.data.message);
          setQuestions([]);
          setWordData([])
          setTotalPages(1);
          setShowPopup(true);
          setPopupProps({ message: error.response.data.message, color: 'red' });
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
        errors.topic = "Topic Required";
      }
      if (!values.paper) {
        errors.paper = "Paper Required";
      }
      return errors;
    }
  });

  const setDropvalues = (type, val) => {
    console.log(type, val)
    formik.values[type] = val;
    formik.setFieldValue(formik.values[type], val);
    setQuestions([])
  }

  useEffect(() => {
    fetchFiltersData();
    //fetchQuestions()
  }, [currentPage]);

  const fetchFiltersData = async () => {
    await axios.get(Api_Url + `getfilters`)
      .then(response => {
        console.log("response", response);
        setCurriculum(response.data[0].curriculums);
        setSubjects(response.data[1].subjects);
        setTpoics(response.data[2].topics);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };


  return (
    <div className="p-2">
      <div>
        <div className="bg-purple-200 shadow-xl rounded-t-2xl ">
          <div className="h-10 px-4 md:px-6 flex items-center justify-center">
            <h2 className="text-white text-xl">QUESTIONS</h2>
          </div>

        </div>

        <div className="h-18 shadow-xl rounded-b-2xl bg-white">
          <div className="flex justify-between ">
            <form onSubmit={formik.handleSubmit} autoComplete='off'>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2">
                <div className="md:col-span-3">
                  <Select label="Select curriculum" name="curriculum"
                    onChange={e => { getfilterSubjects(e); formik.handleChange(e); setDropvalues('curriculum', e) }}
                  >
                    {curriculum.map(item => (
                      <Option key={item.curriculum_id} value={item.curriculum_id.toString()}>{item.currculium}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm"> {formik.errors.curriculum ? <div>{formik.errors.curriculum}</div> : null}</span>
                </div>
                <div className="md:col-span-3">
                  <Select label="Select Subject" name="subject" onChange={e => { getfilterTpoips(e); formik.handleChange(e); setDropvalues('subject', e) }}>
                    {filterdsubjects.map(item => (
                      <Option key={item.subject_id} value={item.subject_id.toString()}>{item.subject}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm "> {formik.errors.subject ? <div>{formik.errors.subject}</div> : null}</span>
                </div>
                <div className="md:col-span-3">
                  <Select label="Select Topic" name="topic" onChange={e => { formik.handleChange(e); setDropvalues('topic', e) }}>
                    {filterdtopics.map(item => (
                      <Option key={item.topic_id} value={item.topic_id.toString()}>{item.topic}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm "> {formik.errors.topic ? <div>{formik.errors.topic}</div> : null}</span>
                </div>
                <div className="md:col-span-3">
                  <Select label="Select Paper" name="paper" onChange={e => { formik.handleChange(e); setDropvalues('paper', e) }} >
                    {[...Array(10)].map((_, index) => (
                      <Option key={index + 1} value={(index + 1).toString()}>{index + 1}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm "> {formik.errors.paper ? <div>{formik.errors.paper}</div> : null}</span>
                </div>
              </div>



              <div className='grid grid-cols-1 md:grid-cols-12 gap-4 p-2'>
                <div className="md:col-span-2">
                  <Select label="Select Dificulty Lavel (op)" color="purple" name="dificulty" onChange={e => { formik.handleChange(e); setDropvalues('dificulty', e) }}>
                    {[...Array(10)].map((_, index) => (
                      <Option key={index + 1} value={(index + 1).toString()}>{index + 1}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm"> {formik.errors.dificulty ? <div>{formik.errors.dificulty}</div> : null}</span>
                </div>

                <div className="col-span-2">
                  <Select
                    label="Select Calculator (op)"
                    color="purple"
                    name="calculater"

                    onChange={e => { formik.setFieldValue('calculater', e) }}
                  >
                    {['Yes', 'No'].map((option, index) => (
                      <Option key={index} value={option}>{option}</Option>
                    ))}
                  </Select>
                  <span className="text-red-800 text-sm"> {formik.errors.calculater ? <div>{formik.errors.calculater}</div> : null}</span>
                </div>

                <div className="md:col-span-2">
                  <Select label="Select Season (op)" name="season" onChange={e => { formik.handleChange(e); setDropvalues('season', e) }}>
                    {['Feb', 'May', 'Nov'].map(value => (
                      <Option key={value} value={value.toString()}>{value}</Option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Select label="Select Zone (op)" name="zone" onChange={e => { formik.handleChange(e); setDropvalues('zone', e) }}>
                    {[1, 2, 3].map(value => (
                      <Option key={value} value={value.toString()}>{value}</Option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Button type="submit" className="rounded-full text-white" disabled={!(formik.isValid && formik.dirty)}>Search</Button>
                </div>

                {
                  questions.length > 0 &&
                  <><div className="text-center py-2 cursor-pointer rounded-xl bg-blue-gray-100">
                    <GeneratePdf questions={worddata} />
                  </div><div className="text-center py-2 cursor-pointer rounded-xl bg-blue-gray-100">
                      <GenerateWord questions={worddata} />
                    </div></>
                }



              </div>
            </form>

          </div>

          <div>


            {

              questions.length > 0 &&
              <div className='py-8'>

                <div className="container mx-auto p-2" id="content-to-download" >
                  {questions.map((item, index) => (
                    <div key={item.id} >
                      <div className=''>
                        <QuestionCard qData={item} fetchQuestions={fetchQuestions} index={index} />
                      </div>
                      <div className="py-2">
                      </div>
                    </div>
                  ))}
                </div>
                <div className="container mx-auto p-4">
                  <ul className="flex items-right justify-end">
                    <li>
                      <button className="bg-gray-400  hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-l cursor-pointer"
                        onClick={handlePreviousPage} disabled={currentPage === 1}>⏮️ </button>
                    </li>
                    {[...Array(totalPages).keys()].map((page) => (
                      <li key={page}>
                        <button className={`mx-1 px-3 py-2 rounded ${page + 1 === currentPage ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-700'}`}
                          onClick={() => setCurrentPage(page + 1)}>{page + 1} </button>
                      </li>
                    ))}
                    <li>
                      <button className="bg-gray-400  hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-r cursor-pointer"
                        onClick={handleNextPage} disabled={currentPage === totalPages}>  ⏭️</button>
                    </li>
                  </ul>
                </div>
              </div>
            }


          </div>

        </div >



        {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
      </div >
    </div>
  )
}

export default GetQuestions
