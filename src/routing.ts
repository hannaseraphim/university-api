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

const router = Router();

router.use('/activities', activityRoutes);
router.use('/associated', associatedRoutes);
router.use('/classes', classRoutes);
router.use('/courses', courseRoutes);
router.use('/enrolment', enrolmentRoutes);
router.use('/grades', gradeRoutes);
router.use('/history', historyRoutes);
router.use('/materials', materialRoutes);
router.use('/profiles', profileRoutes);
router.use('/submissions', submissionRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;