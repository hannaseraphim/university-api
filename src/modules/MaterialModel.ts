import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class MaterialModel extends BaseModel {
    protected table = 'materials';
    protected fields = ["id_class", "title", "description"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}