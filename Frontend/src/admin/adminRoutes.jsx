import { Outlet } from "react-router-dom";
import Login from "../common/login";
import UpdatePassword from "../common/UpdatePassword";
import Logout from "../common/Logout";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import StudentRegistration from "./pages/StudentRegister";
import TeacherRegistration from "./pages/TeacherRegister";
import AuthGuard from "../common/AuthGuard";
import ViewStudents from "./pages/ViewStudents";
import ViewTeacher from "./pages/ViewTeachers";
import SchoolPlanView from "./pages/SchoolPlanView";

const SchoolRoot = () => <Outlet />;

export const adminRoutes = {
  path: "/admin",
  element: <Outlet />, // Changed to Outlet directly
  children: [
    {
      index: true,
      element: <Login type="school" />,
    },
    {
      path: "login",
      element: <Login type="school" />,
    },
    // Protected Routes
    {
      // element: <AuthGuard allowedRoles={["school_admin"]} />,
      children: [
        {
          path: "update-password",
          element: <UpdatePassword userType="school" />, 
        },
        {
          path: "logout",
          element: <Logout />,
        },
        {
          element: <AdminLayout />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "students",
              element: <StudentRegistration />,
            },
            {
              path: "view-students",
              element: <ViewStudents />,
            },
            {
              path: "teachers",
              element: <TeacherRegistration />,
            },
            {
              path:"view-teachers",
              element:<ViewTeacher />,
            },
            {
              path: "plans",
              element: <SchoolPlanView />,
            }
            
          ],
        },
      ]
    }
  ],
};
