import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import migrations from './migrations'
import Customer from './Customer'
import Schedule from './Schedule'

const adapter = new SQLiteAdapter({
  schema,
  migrations
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Customer,
    Schedule
  ],
})