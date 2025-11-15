import type { Connection } from "mysql2/promise";

// absctract impede que algo como 
// const base = new BaseModel() aconteça
export abstract class BaseModel {

  // abstract faz com que as outras classes sejam obrigadas a definir uma "table" e um "fields"
  protected abstract table: string;
  protected abstract fields: string[];
  protected abstract requiredFields: string[];

  constructor(protected db: Connection) {}

  // Create item
  async create(data: Record<string, any>) {
    //Validate fields
 
    // Acessa o nome dos campos (name, description, etc) com Object.keys(data)
    // Filtra os campos um por um com o .filter(key => ...)
    // Checa se a key(campo) NÃO aparece na lista dos campos (data) com .includes(key)
    const invalid = Object.keys(data).filter(key => !this.fields.includes(key));
    if (invalid.length) throw new Error(`Invalid fields: ${invalid.join(", ")}`);

    // Transforma o Array em um único objeto, separando os campos apenas com o .join(", ")
    const columns = Object.keys(data).join(", ");

    // Cria um "?" para cada item com .map(() => "?")
    // Transforma o Array em um único objeto, separando os campos apenas com o .join(", ")
    const placeholders = Object.keys(data).map(() => "?").join(", ");

    // Pega o valor dos campos
    const values = Object.values(data);

    const query = `INSERT INTO \`${this.table}\` (${columns}) VALUES (${placeholders})`;
    const [result] = await this.db.execute(query, values);
    return (result as any);
  } 

  // Query item by id
  async findById(id: number) {
    const query = `SELECT * FROM \`${this.table}\` WHERE id = ?`;
    const [rows] = await this.db.execute(query, [id]);
    return (rows as any)[0];
  }
  
  // Query all items
  async findAll() {
    const query = `SELECT * FROM \`${this.table}\``;
    const [rows] = await this.db.execute(query);
    return rows as any[];
  }

  async findByEmail(email: string) {
    const query = `SELECT * FROM \`${this.table}\` WHERE email = ?`;
    const [rows] = await this.db.execute(query, [email]);
    return (rows as any)[0];
  }

  // Update item by id
  async update(id: number, data: Record<string, any>): Promise<boolean> {

    if (Object.keys(data).length === 0) {
      return false;
    }

    // Acessa o nome dos campos (name, description, etc) com Object.keys(data)
    // Filtra os campos um por um com o .filter(key => ...)
    // Checa se a key(campo) NÃO aparece na lista dos campos (data) com .includes(key)
    const invalid = Object.keys(data).filter(key => !this.fields.includes(key));
    if (invalid.length) throw new Error(`Invalid fields: ${invalid.join(", ")}`);

    // Acessa o nome dos campos com Object.keys(data)
    // Depois mapeia cada objeto para "\`${key}\` = ?"
    // Sendo mesclados e separados com .join(", ")
    const assignments = Object.keys(data).map(key => `\`${key}\` = ?`).join(", ");

    // Adiciona os valores anteriores da data com "...Object.values(data)"
    const values = [...Object.values(data), id];

    const query = `UPDATE \`${this.table}\` SET ${assignments} WHERE id = ?`;
    await this.db.execute(query, values);
    return true;
  }

  // Delete item by id
  async delete(id: number): Promise<number> {
    const query = `DELETE FROM \`${this.table}\` WHERE id = ?`;
    const [result] = await this.db.execute(query, [id]);
    return (result as any).affectedRows;
  }

  // Check if the item exists
  async exists(where: Partial<Record<string, any>>): Promise<boolean> {
    const keys = Object.keys(where);
    const values = Object.values(where);

    if (keys.length === 0) {
      throw new Error("No valid criteria fields found.");
    }

    const conditions = keys.map(key => `\`${key}\` = ?`).join(" AND ");
    const query = `SELECT * FROM \`${this.table}\` WHERE ${conditions}`;

    const [rows] = await this.db.execute(query, values);
    return Array.isArray(rows) && rows.length > 0;
  }

  // Check if the fields are valid in the model
  async validateFields(data: Record<string, any>): Promise<string[]> {
    const invalid = Object.keys(data).filter(key => !this.fields.includes(key));
    return invalid;
  }

  // Check if the fields are required by the model
  async validateRequiredFields(data: Record<string, any>): Promise<string[]> {
    if (!("requiredFields" in this)) return [];

    const required = (this as any).requiredFields as string[];
    const missing = required.filter(field => !(field in data) || data[field] === undefined || data[field] === null || data[field] === "");
    return missing;
  }
}
