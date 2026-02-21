import { createBrowserRouter } from "react-router-dom";
import Login from "./suparAdmin/pages/Login";
import UpdatePassword from "./suparAdmin/pages/UpdatePassword";
import CompanyForm from "./suparAdmin/pages/CompanyRegisterForm";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/company",
    element: <CompanyForm/>,
  },
]);