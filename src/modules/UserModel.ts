import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class UserModel extends BaseModel {
    protected table = 'users';
    protected fields = ["name", "email", "password"];
    protected requiredFields: string[];

    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}