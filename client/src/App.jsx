// import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// import pages


// import components
import Header from '../components/Header';

// Import context


const Layout = () => {
  return (
    <>
      <Header />
      {/* <div className="main">
        <Outlet className="outlet" />
      </div> */}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // {
      //   path: '/auth',
      //   element: <Auth />,
      // },
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