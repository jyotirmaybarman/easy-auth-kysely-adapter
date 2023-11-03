import * as path from 'path'
import { promises as fs } from 'fs'
import {
  Migrator,
  FileMigrationProvider,
  Kysely,
} from 'kysely'

export async function migrateToLatest(db: Kysely<any>, client: "postgres" | "mysql", refresh?:boolean) {


  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations', client),
    }),
  })
  
  if(refresh){
    const { error, results  } = await migrator.migrateDown()
    if(!error) console.log("Easy-Auth: Dropped `users` table");
  }

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Easy-Auth: Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`Easy-Auth: Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Error: Failed to migrate')
    console.error(error)
    process.exit(1)
  }
}