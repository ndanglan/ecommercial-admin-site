import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Header from './Header';
import routes from '../routes';
import { getIsLoggedIn } from '../stores';

const DefaultLayout = () => {

  const isLoggedIn = useSelector(getIsLoggedIn);

  return (
    <>
      { !isLoggedIn ? (
        <Navigate to="/login" />
      ) : (
        <Row className='row-reset'>
          <Col sm={ 3 }>
            <Header />
          </Col>
          <Col sm={ 9 }>
            <Routes>
              { routes.map((route, index) => {
                return <Route path={ route.path } element={ route.component } key={ index } />
              }) }
            </Routes>
          </Col>
        </Row>
      )
      }
    </>
  )
}

export default DefaultLayout;