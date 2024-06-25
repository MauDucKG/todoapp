import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Routes/App.jsx'
import './index.css'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import Login from './Routes/Login.jsx'
import SignUp from './Routes/SignUp.jsx'
import ViewTask, { loader as ViewTaskLoader } from './components/ViewTask.jsx';
import ProtectedRoute from './ProtectedRoute';
const router =
createBrowserRouter(
  [
    {
        path: '/',
        element: <ProtectedRoute element={<App />} />,
        children:[
            { path: '/:taskID', element: <ViewTask />, loader: ViewTaskLoader}
        ]
        },
        {path:'/login',element: <Login />},
        {path:'/signup',element: <SignUp />}
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
