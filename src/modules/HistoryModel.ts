import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class HistoryModel extends BaseModel {
    protected table = 'history';
    protected fields = ["id_student", "id_class", "final_grade", "status"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}