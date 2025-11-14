import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class EnrolmentModel extends BaseModel {
    protected table = 'enrolment';
    protected fields = ["id_student", "id_class", "active"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}