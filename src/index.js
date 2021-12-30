import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "flag-icon-css/css/flag-icons.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import "./i18n"
import store from './stores';
import reportWebVitals from './reportWebVitals';
import './index.css';

toast.configure({
  autoClose: 1000,
  draggable: true,
  position: "top-right",
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnHover: true,
  theme: "colored"
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
