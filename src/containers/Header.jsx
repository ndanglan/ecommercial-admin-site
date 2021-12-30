import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import ActionTypes from '../stores/actions';

import './Header.css'


const Header = () => {
  const dispatch = useDispatch();
  const [flag, setFlag] = useState("");
  const { t, i18n } = useTranslation();

  const logoutAction = (e) => {
    e.preventDefault();
    dispatch({
      type: ActionTypes.LOGOUT_USER,
    })
  }

  const changeLanguage = (e) => {
    e.preventDefault();
    let lang = localStorage.getItem("lang");
    lang = lang === "en" ? "vi" : "en";
    i18n.changeLanguage(lang);
    setFlag(lang === "en" ? "vn" : "us");
  }

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    setFlag(lang === "en" ? "vn" : "us");
  }, [])
  return (
    <>
      <Navbar expand="md" variant='dark' className='navBar'>
        <Container className='flex-column header-container'>
          <Navbar.Brand as={ Link } to="/home">{ t('appName') }</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className='flex-column header-nav-collapse w-100'>
            <Nav className="me-auto flex-column options-nav align-items-center">
              <Nav.Link as={ NavLink } to="/admin">{ t('adminAccount') }</Nav.Link>
              <Nav.Link as={ NavLink } to="/users">{ t('userAccount') }</Nav.Link>
              <Nav.Link as={ NavLink } to="/products">{ t('products') }</Nav.Link>
              <Nav.Link as={ NavLink } to="/carts">{ t('carts') }</Nav.Link>
            </Nav>
            <Nav className='actions-nav justify-content-center'>
              <Nav.Link onClick={ logoutAction }>
                { t('logout') }
              </Nav.Link>
              <Nav.Link

                onClick={ changeLanguage }
              >
                <i className={ `flag-icon flag-icon-${flag}` }></i>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;

