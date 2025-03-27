// import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// import pages
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import BookList from '../pages/BookList';
import BorrowedBook from '../pages/BorrowedBook';
import NewBook from '../pages/NewBook';
import EditBook from '../pages/EditBook';
import OverdueBook from '../pages/OverdueBook';

// import components
import Header from '../components/Header';

// Import context
import { AuthProvider } from '../auth/AuthContext';
import ReservedBook from '../pages/ReservedBook';

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
      {
        path: '/borrowed-book',
        element: <BorrowedBook />,
      },
      {
        path: '/new-book',
        element: <NewBook />,
      },
      {
        path: '/edit-book/:id_book',
        element: <EditBook />,
      },
      {
        path: '/reserved-book',
        element: <ReservedBook />,
      },
      {
        path: '/overdue-book',
        element: <OverdueBook />,
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
