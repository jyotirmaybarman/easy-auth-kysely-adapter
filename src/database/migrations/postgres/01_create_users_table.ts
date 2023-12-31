import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
  .createTable('users')
  .ifNotExists()
  .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
  .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
  .addColumn('middle_name', 'varchar(255)')
  .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
  .addColumn('password', 'varchar(255)', (col) => col.notNull())
  .addColumn('reset_token', 'varchar(255)')
  .addColumn('verified', 'boolean', col => col.defaultTo(false))
  .addColumn('verification_token', 'varchar(255)')
  .addColumn('email', 'varchar(255)', (col) => col.unique().notNull())
  .addColumn('new_email', 'varchar(255)', (col) => col.unique())
  .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull() )
  .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull() )
  .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}