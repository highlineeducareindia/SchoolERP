import Login from "./auth/Login";
import UpdatePassword from "./auth/UpdatePassword";
import CompanyForm from "./pages/CompanyRegisterForm";
import SuperAdminLayout from "./layout/SuperAdminLayout";
import Dashboard from "./pages/Dashboard";
import SimplePlanCreator from "./pages/plan";
import Logout from "./auth/Logout";
import SchoolRegistration from "./pages/SchoolRegistration";
import ViewPlans from "./pages/ViewPlan";

export const superAdminRoutes = {
  path: "/super-admin",
  children: [
    {
      index: true,
      element: <Login />,
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
      element: <SuperAdminLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "company",
          element: <CompanyForm />,
        },
        {
          path: "plans",
          element: <SimplePlanCreator />,
        },
        {
          path:"view-plans",
          element:<ViewPlans />
        },
        {
          path:"school-register",
          element:<SchoolRegistration />
        },
        {
          path:"company-register",
          element:<CompanyForm />
        }
      ],
    },
  ],
};
