import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardList from './features/dashboard/pages/DashboardList';
import ConfiguratorPage from './features/configurator/pages/ConfiguratorPage';
import DashboardViewerPage from './features/dashboard/pages/DashboardViewerPage';
import LandingPage from './features/landing/pages/LandingPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/dashboards',
        element: <DashboardList />,
    },
    {
        path: '/dashboard/create',
        element: <ConfiguratorPage />,
    },
    {
        path: '/dashboard/edit/:id',
        element: <ConfiguratorPage />,
    },
    {
        path: '/dashboard/:id',
        element: <DashboardViewerPage />,
    },
]);