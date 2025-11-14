import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class ActivityModel extends BaseModel {
    protected table = 'activities';
    protected fields = ["id_class", "title", "description", "type", "max_grade", "due_date"]
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}