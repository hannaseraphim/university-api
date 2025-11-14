import { Router } from "express";
import activityRoutes from './routes/activity.route.js'
import associatedRoutes from './routes/associated.route.js'
import classRoutes from './routes/class.route.js'
import courseRoutes from './routes/course.route.js'
import enrolmentRoutes from './routes/enrolment.route.js'
import gradeRoutes from './routes/grade.route.js'
import historyRoutes from './routes/history.route.js'
import materialRoutes from './routes/material.route.js'
import profileRoutes from './routes/profiles.route.js'
import submissionRoutes from './routes/submission.route.js'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import { authMiddleware } from "./middlewares/auth.middleware.js";

const router = Router();

router.use('/activities', authMiddleware, activityRoutes);
router.use('/associated', authMiddleware, associatedRoutes);
router.use('/classes', authMiddleware, classRoutes);
router.use('/courses', authMiddleware, courseRoutes);
router.use('/enrolment', authMiddleware, enrolmentRoutes);
router.use('/grades', authMiddleware, gradeRoutes);
router.use('/history', authMiddleware, historyRoutes);
router.use('/materials', authMiddleware, materialRoutes);
router.use('/profiles', authMiddleware, profileRoutes);
router.use('/submissions', authMiddleware, submissionRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/auth', authRoutes);

export default router;