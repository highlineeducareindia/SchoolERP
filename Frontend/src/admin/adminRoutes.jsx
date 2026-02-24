import Login from "../common/login";
import UpdatePassword from "../common/UpdatePassword";
import Logout from "../common/Logout";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import StudentRegistration from "./pages/StudentRegister";
import TeacherRegistration from "./pages/TeacherRegister";

export const adminRoutes = {
  path: "/",
  children: [
    {
      index: true,
      element: <Login type="school" />,
    },
    {
      path: "update-password",
      element: <UpdatePassword />,
    },
    {
      path: "logout",
      element: <Logout />,
    },
    {
      path: "admin",
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
          path: "teachers",
          element: <TeacherRegistration />,
        }
      ],
    },
  ],
};
