import { Outlet } from "react-router-dom";
import Login from "./auth/Login"

export const studentRoutes = {
  path: "/student",
   children: [
     {
       index: true,
       element: <Login />,
     },
    //  {
    //    path: "update-password",
    //    element: <UpdatePassword />,
    //  },
    //  {
    //    path: "logout",
    //    element: <Logout />,
    //  },
  ],
};
