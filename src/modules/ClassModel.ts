import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class ClassModel extends BaseModel {
    protected table = 'classes';
    protected fields = ["id_courses", "id_teacher", "starts_on", "ends_on", "period", "name", "max_students", "archived"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}