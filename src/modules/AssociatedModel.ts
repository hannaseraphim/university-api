import type { Connection } from "mysql2/promise";
import { BaseModel } from "../core/BaseModel.js";
import { UserProfile } from "./UserProfile.js";
import connection from "../config/connection.js";

const userProfile = new UserProfile(connection);

export class AssociatedModel extends BaseModel {
  protected table = "associated";
  protected fields = ["id_user", "id_profile"];
  protected requiredFields: string[];

  constructor(db: Connection) {
    super(db);
    this.requiredFields = [...this.fields];
  }

  // Query item by id
  async findAssociated(id: number) {
    const query = `SELECT * FROM \`${this.table}\` WHERE id_user = ?`;
    const [rows] = await this.db.execute(query, [id]);

    const roles: string[] = [];

    for (const row of rows as any[]) {
      const profile = await userProfile.findById(row.id_profile);
      roles.push(profile.name);
    }

    return roles;
  }
}
