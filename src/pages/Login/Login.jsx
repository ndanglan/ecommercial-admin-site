import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './Login.css'
import Input from '../../components/Input';
import ActionTypes from '../../stores/actions';
import { adminServices } from '../../services';

const Login = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    adminServices.login(username, password)
      .then((res) => {
        if (res.success) {
          setMessage('');
          setError(false);
          handleLoginAction(res.accessToken, res.user);
          navigate('/')
        }
      })
      .catch(err => {
        setMessage(t('incorrectLogin'));
        setError(true);
      })
  }

  const handleLoginAction = (token, adminInfo) => {
    dispatch({
      type: ActionTypes.LOGIN_USER,
      token: token,
      adminInfo: adminInfo
    })
  }

  useEffect(() => {
    usernameRef.current.focus();
  }, [])

  return (
    <>
      <div div className="container h-100 body-login" >
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-sm-8 col-lg-5">
            <div className="card card-login">
              <div className="card-header bg-main-color">
                <h4 className="card-title mb-0"><i className="fas fa-th"></i> { t('loginSystem') }</h4>
              </div>
              <div className="card-body rounded-bottom">
                { error ? <p className='text-center text-danger'>{ message }</p> : <p className='text-center text-success'>{ message }</p> }
                <form onSubmit={ formSubmitHandler }>
                  <Input
                    id='txtUserName'
                    type='text'
                    labelSize='4'
                    name='userName'
                    label={ t("username") }
                    placeholder={ t("enterUsername") }
                    inputRef={ usernameRef }
                    className="input-login"
                  />
                  <Input
                    id='txtPassword'
                    type='password'
                    labelSize='4'
                    name='password'
                    label={ t("password") }
                    placeholder={ t("enterPassword") }
                    inputRef={ passwordRef }
                    className="input-login"
                  />
                  <div className="row justify-content-center">
                    <div className=" col-auto">
                      <button className="btn modal-btn-color">{ t("signIn") }</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Login;