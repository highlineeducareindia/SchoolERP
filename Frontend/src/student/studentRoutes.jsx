
import Login from "./auth/Login"
import Logout from "./auth/Logout";
import StudentLayout from "./layout/StudentLayout";
import Dashboard from "./pages/Dashboard";

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
     {
       path: "logout",
       element: <Logout />,
     },
     {
      element:<StudentLayout/>,
      children:[
        {
          path :"dashboard",
          element :<Dashboard/>,
        }
      ]
     }
  ],
};
