
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AppWrapper from '../components/AppWrapper';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  BrowserRouter,
  
} from "react-router-dom";
import '../styles/App.css'
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
    <Routes>
      <Route path='*' element={<AppWrapper/>} />
    </Routes>
   
   
   </BrowserRouter>,
    document.body.appendChild(document.createElement('div')),
  )
})
