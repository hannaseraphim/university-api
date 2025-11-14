import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";

export class UserProfile extends BaseModel {
    protected table = 'user_profiles';
    protected fields = ["id"];
    protected requiredFields: string[];
    
    constructor(db: Connection) {
        super(db);
        this.requiredFields = [...this.fields]
    }
}