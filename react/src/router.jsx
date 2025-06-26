import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Users from "./views/Users";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import UserForm from "./views/UserForm";
import Audits from "./views/Audits";
import Tasks from "./views/Tasks";
import TaskForm from "./views/TaskForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/users/new",
                element: <UserForm key="userCreate"/>
            },
            {
                path: "/users/:id",
                element: <UserForm key="userUpdate"/>
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/tasks",
                element: <Tasks />
            },
            {
                path: "/tasks/new",
                element: <TaskForm key="taskCreate"/>
            },
            {
                path: "/tasks/:id",
                element: <TaskForm key="taskUpdate"/>
            },
            {
                path: "/audits",
                element: <Audits />
            },
        ]
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },
]);

export default router;