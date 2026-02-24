import Login from "../common/login";
import UpdatePassword from "../common/UpdatePassword";
import Logout from "../common/Logout";
import TeacherLayout from "./layout/TeacherLayout";
import Dashboard from "./pages/Dashboard";

export const teacherRoutes = {
  path: "/",
  children: [
    {
      index: true,
      element: <Login type="teacher" />,
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
      path: "teacher",
      element: <TeacherLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    }
  ],
};
