import React, { useState, useEffect } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import AddQuestion from './components/AddQuestion';
import AddFields from './components/AddFields';
import Header from './components/Header';
import GetQuestions from './components/GetQuestions';
import Branding from './components/Branding';
import EditEduactainalCategeries from './components/EditEduactainalCategeries';
import EditMappedEduactinalFields from './components/EditMappedEduactinalFields';
import Login from './components/Login';

function App() {
    const [loggedIn, setLoggedIn] = useState(null); // Use null to indicate loading state

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        setLoggedIn(isLoggedIn);
    }, []);

    if (loggedIn === null) {
        // Show a loading state or spinner while determining login status
        return <div>Loading...</div>;
    }

    return (
        <HashRouter>
            {loggedIn && <Header setLoggedIn={setLoggedIn} />}
            <Routes>
                {!loggedIn ? (
                    <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
                ) : (
                    <>
                        <Route path="/" element={<GetQuestions />} />
                        <Route path="addquestion" element={<AddQuestion />} />
                        <Route path="addfields" element={<AddFields />} />
                        <Route path="addbranding" element={<Branding />} />
                        <Route path="editeducationcategeries" element={<EditEduactainalCategeries />} />
                        <Route path="editmappededuactinalfields" element={<EditMappedEduactinalFields />} />
                    </>
                )}
            </Routes>
        </HashRouter>
    );
}

export default App;
