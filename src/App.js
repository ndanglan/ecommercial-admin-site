import { useSelector } from 'react-redux';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { DefaultLayout } from './containers';

import { Login } from './pages';

import './index.css';
import { getShow } from './stores';

function App() {
  const loading = useSelector(getShow);
  return (
    <>
      { loading && <div className='loading'>
        <div className='spinner'></div>
      </div> }
      <BrowserRouter >
        <Routes>
          <Route path="/login" element={ <Login /> } />
          <Route path="/*" element={ <DefaultLayout /> } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
