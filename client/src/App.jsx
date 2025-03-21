// import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// import pages
import Auth from '../pages/Auth'
import Dashboard from '../pages/Dashboard'
import BookList from '../pages/BookList'

// import components
import Header from '../components/Header';

// Import context


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/book-list',
        element: <BookList />,
      },
      // {
      //   path: '*',
      //   element: <PageNotFound />,
      // },
    ],
  },
]);

const App = () => {
  return (
    <div>
      {/* <AuthProvider> */}
        <RouterProvider router={router} />
      {/* </AuthProvider> */}
    </div>
  );
};

export default App;