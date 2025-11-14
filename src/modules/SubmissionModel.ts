import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class SubmissionModel extends BaseModel {
    protected table = 'submissions';
    protected fields = ["id_student", "id_activity", "content"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}