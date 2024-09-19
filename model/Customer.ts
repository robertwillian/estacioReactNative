import { Model } from '@nozbe/watermelondb'
import { text, date } from '@nozbe/watermelondb/decorators'
import { v4 } from "uuid"

export default class Customer extends Model {
  static table = 'customers'

  @text('name') name!: string;
  @text('whatsapp') whatsapp?: string;
  @date('created_at') createdAt?: Date;
  @date('updated_at') updatedAt?: Date;

  public async addCustomer(customer: Customer) {
    const newSweep = await this.collections.get<Customer>('customers').create(customerToSave => {
      customerToSave._raw.id = v4();
      customerToSave.name = customer.name;
      customerToSave.whatsapp = customer.whatsapp;
    })

    return newSweep;
  }

  public async delete() {
    await this.markAsDeleted();
  }

}