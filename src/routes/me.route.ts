import { Router } from "express";
import connection from "../config/connection.js";
import { UserProfile } from "../modules/UserProfile.js";
import { SubmissionModel } from "../modules/SubmissionModel.js";
import { HistoryModel } from "../modules/HistoryModel.js";
import { GradeModel } from "../modules/GradeModel.js";
import { EnrolmentModel } from "../modules/EnrolmentModel.js";
import { ClassModel } from "../modules/ClassModel.js";
import { UserModel } from "../modules/UserModel.js";
import { AssociatedModel } from "../modules/AssociatedModel.js";


const userProfile = new UserProfile(connection);
const submissionModel = new SubmissionModel(connection);
const historyModel = new HistoryModel(connection);
const gradeModel = new GradeModel(connection);
const enrolmentModel = new EnrolmentModel(connection);
const classModel = new ClassModel(connection);
const userModel = new UserModel(connection);
const associatedModel = new AssociatedModel(connection);


const router = Router();

router.get('/', async (req, res) => {
    res.json({
        user: await userModel.findById(Number(req.userid)),
        classes: await classModel.findById(Number(req.userid)),
        user_profile: await associatedModel.findAssociated(Number(req.userid))
    })
});

export default router;