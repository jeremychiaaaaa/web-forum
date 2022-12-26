
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { App } from '../components/App';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  BrowserRouter,
  
} from "react-router-dom";

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
    <Routes>
      <Route path='*' element={<App/>} />
    </Routes>
   
   
   </BrowserRouter>,
    document.body.appendChild(document.createElement('div')),
  )
})
