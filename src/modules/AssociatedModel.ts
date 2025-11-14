import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class AssociatedModel extends BaseModel {
    protected table = 'courses';
    protected fields = ["id_user", "id_profile"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}