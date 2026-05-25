import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getEmployeeList, createEmployee, getEmployeeEdit, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";
import { isAdmin, isManager } from "../middlewares/rbac.middleware.js";

const router = express.Router();
router.use(authenticate);
router.get("/list", isManager, getEmployeeList); // Manager+ xem được
router.post("/create", isManager, createEmployee);
router.get("/:id/edit", isManager, getEmployeeEdit);
router.post("/:id/edit", isManager, updateEmployee);
router.delete("/:id", isAdmin, deleteEmployee);

// router.get("/list", authenticate, getEmployeeList);
// router.post("/create", authenticate, createEmployee);
// router.get("/:id/edit", authenticate, getEmployeeEdit);
// router.post("/:id/edit", authenticate, updateEmployee);
// router.delete("/:id", authenticate, deleteEmployee);

export default router;
