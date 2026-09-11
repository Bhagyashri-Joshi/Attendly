import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validate";
import { createTodoSchema, updateTodoSchema, updateTodoStatusSchema } from "../validators/todoValidators";
import { createTodo, deleteTodo, listTodos, updateTodo, updateTodoStatus } from "../controllers/todoController";

const router = Router();
router.use(authenticate);
router.get("/", listTodos);
router.post("/", validateBody(createTodoSchema), createTodo);
router.put("/:id", validateBody(updateTodoSchema), updateTodo);
router.patch("/:id/status", validateBody(updateTodoStatusSchema), updateTodoStatus);
router.delete("/:id", deleteTodo);
export default router;
