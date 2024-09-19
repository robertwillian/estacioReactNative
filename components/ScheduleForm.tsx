import 'react-native-get-random-values';
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import ThemedTextInput from './ThemedTextInput'
import DatePicker from 'react-native-date-picker'
import ThemedBlockButton from './ThemedBlockButton'
import Schedule from '../model/Schedule'
import CustomerForm from './CustomerForm'
import { database } from '../model'
import Customer from '../model/Customer'
import { withObservables } from '@nozbe/watermelondb/react'
import { v4 } from 'uuid'
import CustomerCard from './CustomerCard';

type ScheduleFormProps = {
  onClose: () => void;
  customers?: Customer[]
}

const db = database.get<Customer>('customers');
const observeCustomers = db.query().observe();

const enhanceWithCustomers = withObservables([], () => {
  return ({
    customers: observeCustomers
  })
})

const ScheduleForm = ({ onClose, customers }: ScheduleFormProps) => {
  const [step, setStep] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [filter, setFilter] = useState('')
  const [schedule, setSchedule] = useState({
    customerId: '',
    date: new Date(),
    service: '',
  })

  return (
    <>
      <SafeAreaView className={`w-full bg-background-light h-full dark:bg-background-dark absolute`}>
        <View className='bg-background-darken dark:bg-background-darkDarken flex-row h-16'>
          <TouchableOpacity className='w-12 items-center justify-center' onPress={() => {
            if (step > 0) setStep(step - 1)
            else onClose()
          }}>

            <Ionicons name='arrow-back' size={20} color={'#fff'} />

          </TouchableOpacity>
          <View className='flex-1 justify-center items-center'>
            <Text className='text-white'>Cadastro de agendamento</Text>
          </View>
          <View className='w-12 items-center justify-center'>

          </View>


        </View>
        {step === 0 && <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View className='gap-5 p-5 flex-1 items-center'>

            <Text className='text-white'>Selecione a data</Text>

            <DatePicker date={schedule.date} mode='datetime' theme='dark' locale='pt-BR' is24hourSource='locale' minuteInterval={15} onDateChange={(date) => setSchedule({
              ...schedule,
              date
            })} />

            <View className='w-full px-5'>
              <ThemedBlockButton onPress={() => setStep(1)}>
                <Text>Próximo</Text>
              </ThemedBlockButton>
            </View>

          </View>
        </ScrollView>}

        {step === 1 && <View className='gap-5 py-5 flex-1'>

          <Text className='text-white text-center'>Selecione o cliente</Text>

          <View className='px-5'>
            <ThemedTextInput
              onChangeText={(text) => {
                setFilter(text)
              }}
              value={filter}
              placeholder="procurar"
              autoCorrect={false}
            />
          </View>

          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20
            }}
            data={customers?.filter(ctt => !filter || ctt.name.includes(filter) || ctt.whatsapp?.includes(filter))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TouchableOpacity onPress={() => {
              setSchedule({
                ...schedule,
                customerId: item.id
              })

              setStep(2)
            }}>
              <CustomerCard item={item} />
            </TouchableOpacity>}
            ItemSeparatorComponent={
              () => <View className='border-t border-t-background-darken dark:border-t-background-darkDarken my-3' />
            }
          />

          <View>
            <View className='gap-5 px-5'>
              <ThemedBlockButton onPress={() => setShowCustomerForm(true)}>
                <Text>Novo cliente</Text>
              </ThemedBlockButton>

              <ThemedBlockButton onPress={() => setStep(2)}>
                <Text>Próximo</Text>
              </ThemedBlockButton>
            </View>
          </View>
        </View>}

        {step === 2 && <View className='gap-5 p-5 flex-1'>

          <Text className='text-white text-center'>Descreva o serviço</Text>

          <ThemedTextInput
            onChangeText={(text) => {
              setSchedule({
                ...schedule,
                service: text
              })
            }}
            value={schedule.service}
            placeholder="serviço"
            autoCorrect={false}
          />

          <ThemedBlockButton onPress={async () => {
            await database.write(async () => {
              await database.get<Schedule>('schedules').create(sch => {
                sch.date = schedule.date;
                sch.customerId = schedule.customerId;
                sch.service = schedule.service;
                sch._raw.id = v4();
              })
              .catch(err => {
                console.log(err);
                
              })
            })

            onClose()
          }}>
            <Text>Salvar</Text>
          </ThemedBlockButton>
        </View>}
      </SafeAreaView>

      {showCustomerForm && <CustomerForm onClose={(customerId?: string) => {
        if(customerId) {
          setSchedule({
            ...schedule,
            customerId
          });

          setStep(2);
        }
        setShowCustomerForm(false)
      }} />}
    </>
  )
}

export default enhanceWithCustomers(ScheduleForm)