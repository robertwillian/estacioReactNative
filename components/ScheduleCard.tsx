import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Schedule from '../model/Schedule'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { database } from '../model'
import Customer from '../model/Customer'
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb'

type ScheduleCardProps = {
  item: Schedule,
  customer?: Customer
}

const db = database.get<Customer>('customers');

const ScheduleCard = ({ item }: ScheduleCardProps) => {

  const [customer, setCustomer] = useState<Customer>()
  
  const getCustomer = useCallback(async () => {
    const ctt = await db.query(Q.where('id', item.customerId)).fetch()

    if(ctt) {
      setCustomer(ctt[0]);
    }  
  }, [item.customerId])

  useEffect(() => {
    getCustomer()
  }, [])
  
  return (
    <View className='rounded-md gap-1 px-5'>
      <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='clock-o' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{item.date.toLocaleString('pt-BR', {day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'})}</Text>
      </View>
      <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='user-o' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{customer?.name}</Text>
      </View>
      {customer && <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='phone' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{customer?.whatsapp}</Text>
      </View>}
      <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='wrench' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{item.service}</Text>
      </View>
    </View>
  )
}

export default ScheduleCard