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
    
    // Query item by id
    async findAssociatedById(id: number) {
        const query = `SELECT * FROM associated WHERE id_user = ?`;
        const [rows] = await this.db.execute(query, [id]);
        return (rows as any)[0];
    }
}