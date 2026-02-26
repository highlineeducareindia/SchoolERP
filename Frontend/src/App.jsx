import { createBrowserRouter } from "react-router-dom";
import { superAdminRoutes } from "./suparAdmin/superAdminRoutes";
import { adminRoutes } from "./admin/adminRoutes";
import { teacherRoutes } from "./teacher/teacherRoutes";
import { studentRoutes } from "./student/studentRoutes";

export const router = createBrowserRouter([
  superAdminRoutes,
  adminRoutes,
  teacherRoutes,
  studentRoutes,
]);