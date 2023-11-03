import { DatabaseAdapterInterface } from "./interfaces/database-adapter.interface";
import { UserType } from "./types/user.type";
import { CreateUserType } from "./types/create-user.type";
import { Database } from "./database/schema";
import { Kysely, MysqlDialect, MysqlPool, PostgresDialect, PostgresPool } from "kysely";
import { migrateToLatest } from "./database/migrator";

type MysqlPoolType = MysqlPool | (() => Promise<MysqlPool>)
type PostgresPoolType = PostgresPool | (() => Promise<PostgresPool>)
type AdapterInitConfigType = { migrate?: boolean, refresh?: boolean } & ({ client: "postgres", pool: PostgresPoolType } | { client: "mysql", pool: MysqlPoolType })

export class KyselyAdapter implements DatabaseAdapterInterface {
  private readonly db;
  constructor(config: AdapterInitConfigType ) {
    let dialect;
    if (config.client == "mysql") {
      dialect = new MysqlDialect({ pool: config.pool });
    } else if(config.client == "postgres") {
      dialect = new PostgresDialect({ pool: config.pool });
    }

    if(!dialect) throw new Error(`Invalid database client${config.client ? ':' : ''} "${config.client}"`);
    
    this.db = new Kysely<Database>({ dialect });

    if(config.migrate||config.refresh) migrateToLatest(this.db, config.client, config.refresh)
    
    this.db.introspection.getTables({ withInternalKyselyTables: true }).then(_tables => {    
      console.log("Easy-Auth: Module initialized successfully");
    }).catch(error => {
      console.log(error);
    })
  }

  async createUser(data: CreateUserType): Promise<UserType> {
    const user = await this.db
      .insertInto("users")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
    return user as UserType;
  }

  async findUser(filter: Partial<UserType>, select?: (keyof UserType)[]): Promise<UserType | undefined> {
    let query = this.db.selectFrom("users");
    select?.length ? select.forEach((str) => (query = query.select(str))) : (query = query.selectAll());
    query = this.updateQuery(filter, query);
    const user = await query.executeTakeFirst();
    return user as UserType;
  }

  async deleteUser(filter: Partial<UserType>): Promise<UserType> {
    let query = this.db.deleteFrom("users");
    query = this.updateQuery(filter, query);
    const user = await query.returningAll().executeTakeFirstOrThrow();
    return user as UserType;
  }

  async updateUser(filter: Partial<UserType>, data: Partial<Omit<UserType, "created_at" | "updated_at">>): Promise<UserType> {
    let query = this.db.updateTable("users");
    query = this.updateQuery(filter, query);
    const user = await query.set(data).returningAll().executeTakeFirstOrThrow();
    return user as UserType;
  }

  private updateQuery(filter: Partial<UserType>, query: any) {
    Object.keys(filter).forEach(
      (key) => (query = query.where(key, "=", filter[key as keyof UserType]))
    );
    return query;
  }
}