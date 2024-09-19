import { Model, Q, Query } from '@nozbe/watermelondb'
import { text, date, children, relation, immutableRelation } from '@nozbe/watermelondb/decorators'
import { v4 } from "uuid"
import Customer from './Customer'
import { lazy } from 'react'

export default class Schedule extends Model {
  static table = 'schedules'

  // static associations = {
  //   customers: { type: 'has_many', foreignKey: 'customer_id' }
  // } as const

  @date('date') date!: Date;
  @text('customer_id') customerId!: string;
  @text('service') service?: string;
  @date('created_at') createdAt?: Date;
  @date('updated_at') updatedAt?: Date;
  // @immutableRelation('customers', 'customer_id') customer!: Customer

  public async addSchedule(schedule: Schedule) {
    const newSchedule = await this.collections.get<Schedule>('schedules').create(scheduleToSave => {
      scheduleToSave._raw.id = v4();
      scheduleToSave.date = schedule.date;
      scheduleToSave.customerId = schedule.customerId;
      scheduleToSave.service = schedule.service;
    })

    return newSchedule;
  }

  public async delete() {
    await this.markAsDeleted();
  }

}