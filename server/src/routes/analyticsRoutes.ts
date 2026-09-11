import { Router } from "express";import { authenticate } from "../middleware/authenticate";import { getOverall,getSubjects,getSubject } from "../controllers/analyticsController";
const router=Router();router.use(authenticate);router.get("/overall",getOverall);router.get("/subjects",getSubjects);router.get("/subject/:id",getSubject);export default router;
