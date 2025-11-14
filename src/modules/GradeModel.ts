import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class GradeModel extends BaseModel {
    protected table = 'grades';
    protected fields = ["id_student", "id_activity", "grade"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}