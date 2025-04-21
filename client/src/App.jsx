// import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// import pages
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import BookList from '../pages/BookList';
import BorrowedBook from '../pages/BorrowedBook';
import NewBook from '../pages/NewBook';
import EditBook from '../pages/EditBook';
import OverdueBook from '../pages/OverdueBook';
import ChangePassword from '../pages/ChangePassword';
import ServerError from '../pages/ServerError';

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
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/book-list',
        element: (
          <ProtectedRoute>
            <BookList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/borrowed-book',
        element: (
          <ProtectedRoute>
            <BorrowedBook />
          </ProtectedRoute>
        ),
      },
      {
        path: '/new-book',
        element: (
          <ProtectedRoute>
            <NewBook />
          </ProtectedRoute>
        ),
      },
      {
        path: '/edit-book/:id_book',
        element: (
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reserved-book',
        element: (
          <ProtectedRoute>
            <ReservedBook />
          </ProtectedRoute>
        ),
      },
      {
        path: '/overdue-book',
        element: (
          <ProtectedRoute>
            <OverdueBook />
          </ProtectedRoute>
        ),
      },
      {
        path: '/change-password',
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/server-error',
        element: (
          <ProtectedRoute>
            <ServerError />
          </ProtectedRoute>
        ),
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
