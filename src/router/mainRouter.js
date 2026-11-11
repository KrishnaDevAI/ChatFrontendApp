import { Navigate, createBrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import Dashboard from 'routes/dashboard/default';
import Login from 'routes/pages/login/Login3';
import Register from 'routes/pages/register/Register3';
import SamplePage from 'routes/sample-page';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import theme from 'themes';

function ThemeLayout({ children }) {
    const customization = useSelector((state) => state.customization);

    return (
        <ThemeProvider theme={theme(customization)}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

function MainThemeLayout() {
    return (
        <ThemeLayout>
            <MainLayout />
        </ThemeLayout>
    );
}

function ProtectedMainLayout() {
    let isAuthenticated = false;
    try {
        isAuthenticated = Boolean(sessionStorage.getItem('userProfile'));
    } catch {
        isAuthenticated = false;
    }

    return isAuthenticated ? <MainThemeLayout /> : <Navigate to="/pages/login/" replace />;
}

function AuthThemeLayout() {
    return (
        <ThemeLayout>
            <MinimalLayout />
        </ThemeLayout>
    );
}

function GuestAuthLayout() {
    let isAuthenticated = false;
    try {
        isAuthenticated = Boolean(sessionStorage.getItem('userProfile'));
    } catch {
        isAuthenticated = false;
    }

    return isAuthenticated ? <Navigate to="/dashboard/default" replace /> : <AuthThemeLayout />;
}

const mainRouter = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard/default" replace />
    },
    {
        element: <ProtectedMainLayout />,
        children: [
            { path: 'sample-page', element: <SamplePage /> },
            { path: 'dashboard/default', element: <Dashboard /> }
        ]
    },
    {
        element: <GuestAuthLayout />,
        children: [
            { path: 'pages/login/', element: <Login /> },
            { path: 'pages/register/', element: <Register /> }
        ]
    }
]);

export default mainRouter;