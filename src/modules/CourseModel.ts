import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class CourseModel extends BaseModel {
    protected table = 'courses';
    protected fields = ["name", "description", "max_students"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}