import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getEmployeeList, createEmployee, getEmployeeEdit, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/list", authenticate, getEmployeeList);
router.post("/create", authenticate, createEmployee);
router.get("/:id/edit", authenticate, getEmployeeEdit);
router.post("/:id/edit", authenticate, updateEmployee);
router.delete("/:id", authenticate, deleteEmployee);

export default router;
