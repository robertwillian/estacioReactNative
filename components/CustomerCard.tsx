import { View, Text } from 'react-native'
import React from 'react'
import Schedule from '../model/Schedule'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Customer from '../model/Customer'

type CustomerCardProps = {
  item: Customer
}

const CustomerCard = ({ item }: CustomerCardProps) => {
  return (
    <View className='rounded-md gap-1'>
      <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='user-o' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{item.name}</Text>
      </View>
      <View className='flex-row items-center'>
        <View className='h-8 w-8 items-start justify-center'>
          <FontAwesome name='phone' size={20} color={'#fff'} />
        </View>
        <Text className='text-white'>{item.whatsapp}</Text>
      </View>
    </View>
  )
}

export default CustomerCard