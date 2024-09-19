import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'customers',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'whatsapp', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        }),
        tableSchema({
            name: 'schedules',
            columns: [
                { name: 'date', type: 'number' },
                { name: 'customer_id', type: 'string'},
                { name: 'service', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' }
            ]
        })
    ]
})