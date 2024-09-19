import 'react-native-get-random-values';
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import ThemedTextInput from './ThemedTextInput'
import DatePicker from 'react-native-date-picker'
import ThemedBlockButton from './ThemedBlockButton'
import Schedule from '../model/Schedule'
import { database } from '../model'
import Customer from '../model/Customer'
import { v4 } from 'uuid'

type CustomerFormProps = {
  onClose: (customerId?: string) => void;
}

const CustomerForm = ({ onClose }: CustomerFormProps) => {
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState({
    name: '',
    whatsapp: ''
  })

  return (
    <SafeAreaView className={`w-full bg-background-light h-full dark:bg-background-dark absolute`}>
      <View className='bg-background-darken dark:bg-background-darkDarken flex-row h-16'>
        <TouchableOpacity className='w-12 items-center justify-center' onPress={() => {
          onClose()
        }}>

          <Ionicons name='arrow-back' size={20} color={'#fff'} />

        </TouchableOpacity>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-white'>Cadastro de cliente</Text>
        </View>
        <View className='w-12 items-center justify-center'>

        </View>


      </View>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className='gap-5 p-5 flex-1'>

          <ThemedTextInput
            onChangeText={(text) => {
              setCustomer({
                ...customer,
                name: text
              })
            }}
            value={customer.name}
            placeholder="nome do cliente"
            autoCorrect={false}
          />

          <ThemedTextInput
            onChangeText={(text) => {
              setCustomer({
                ...customer,
                whatsapp: text
              })
            }}
            value={customer.whatsapp}
            placeholder="whatsapp do cliente"
            autoCorrect={false}
          />

          <ThemedBlockButton onPress={async () => {
            const newCustomerId = v4();
            await database.write(async () => {
              const newCustomer = await database.get<Customer>('customers').create(ctt => {
                ctt.name = customer.name;
                ctt.whatsapp = customer.whatsapp
                ctt._raw.id = newCustomerId;
              })
              .catch(err => {
                console.log(err);
                
              })
            })

            onClose(newCustomerId)
          }}>
            <Text>Salvar</Text>
          </ThemedBlockButton>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerForm