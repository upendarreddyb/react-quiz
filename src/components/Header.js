import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const Header = ({ setLoggedIn }) => {
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    if (['/addfields', '/editeducationcategeries', '/editmappededuactinalfields'].includes(currentPath)) {
      setActiveButton('/addfields'); // or another relevant path
    } else {
      setActiveButton(currentPath);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className=''>
      <div className="flex flex-col md:flex-row bg-cyan-500 shadow-xl h-16">
        <div className="flex items-center justify-center w-full">
          <ul className="flex flex-wrap justify-center p-2 m-2">
            <li className="px-4 font-bold text-xl">
              <Link to="/" onClick={() => setActiveButton('/')}>
                <Button
                  className={`shadow-white rounded-full text-white ${activeButton === '/' ? 'bg-gray-900 hover:bg-gray-900' : 'bg-gray-0 hover:bg-gray-900'} transition-all duration-300`}
                >
                  Questions
                </Button>
              </Link>
            </li>
            <li className="px-4 font-bold text-xl">
              <Link to="/addquestion" onClick={() => setActiveButton('/addquestion')}>
                <Button
                  className={`shadow-white rounded-full text-white ${activeButton === '/addquestion' ? 'bg-gray-900 hover:bg-gray-900 ' : 'bg-gray-0 hover:bg-gray-900'} transition-all duration-300`}
                >
                  + Questions
                </Button>
              </Link>
            </li>
            <li className="px-4 font-bold text-xl">
              <Link to="/addfields" onClick={() => setActiveButton('/addfields')}>
                <Button
                  className={`shadow-white rounded-full text-white ${activeButton === '/addfields' || ['/editeducationalcategories', '/editmappededuactinalfields'].includes(activeButton) ? 'bg-gray-900 hover:bg-gray-900' : 'bg-gray-0 hover:bg-gray-900'} transition-all duration-300`}
                >
                  + EDUCATIONAL CATEGORIES
                </Button>
              </Link>
            </li>
            <li className="px-4 font-bold text-xl">
              <Link to="/addbranding" onClick={() => setActiveButton('/addbranding')}>
                <Button
                  className={`shadow-white rounded-full text-white ${activeButton === '/addbranding' ? 'bg-gray-900 hover:bg-gray-900' : 'bg-gray-0 hover:bg-gray-900'} transition-all duration-300`}
                >
                  + Branding
                </Button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center md:justify-center p-2 m-2">
          <Button
            className="shadow-white bg-purple-250 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
