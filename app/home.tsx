import ScheduleCard from '../components/ScheduleCard';
import ThemedStatusBar from '../components/ThemedStatusbar';
import { FlatList, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { database } from '../model';
import Schedule from '../model/Schedule';
import { Q } from '@nozbe/watermelondb';
import ScheduleForm from '../components/ScheduleForm';
import { useCallback, useEffect, useState } from 'react';
import ThemedBlockButton from '../components/ThemedBlockButton';
import { Ionicons } from '@expo/vector-icons';
import { getLastPulledAt } from "@nozbe/watermelondb/sync/impl";
import { syncService } from '../services/syncService';

const db = database.get<Schedule>('schedules');

function HomeScreen() {
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const [schedules, setSchedules] = useState<Schedule[]>()
  const [date, setDate] = useState<Date>(new Date())
  const [lastSync, setLastSync] = useState<Date>()

  const today = new Date();

  const getSchedules = useCallback(async () => {

    const dateIni = new Date(date);
    dateIni.setHours(0);
    dateIni.setMinutes(0);
    dateIni.setSeconds(0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23);
    dateEnd.setMinutes(59);
    dateEnd.setSeconds(59);

    const sch = await db.query(
      Q.sortBy('date', Q.asc),
      Q.where('date', Q.gte(dateIni.getTime())),
      Q.where('date', Q.lte(dateEnd.getTime()))
    ).fetch()

    if (sch) {
      setSchedules(sch);
    }

    const lastPulledAt = await getLastPulledAt(database);

    if (lastPulledAt) {
      setLastSync(new Date(lastPulledAt))
    }
  }, [date])

  useEffect(() => {
    getSchedules()

    syncService()
    .then(result => {
      setTimeout(() => {
        getSchedules()
      }, 300)
    })
    .catch(err => {
      ToastAndroid.showWithGravity(
        err.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,

      );
    })

  }, [date])

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className={`w-full h-full bg-background-light dark:bg-background-dark`}>
        <View className='bg-background-darken dark:bg-background-darkDarken flex-row h-16'>
          <TouchableOpacity className='w-12 items-center justify-center' onPress={() => {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() - 1)
            setDate(newDate)
          }}>

            <Ionicons name='arrow-back' size={20} color={'#fff'} />

          </TouchableOpacity>
          <View className='flex-1 justify-center items-center'>
            <Text className='text-white'>{`${today.getDate()}-${today.getMonth()}` === `${date.getDate()}-${date.getMonth()}` ? 'HOJE' : date.toLocaleString('pt-BR', { weekday: 'long', day: '2-digit' })}</Text>
          </View>
          <View className='w-12 items-center justify-center'>
            <TouchableOpacity className='w-12 items-center justify-center' onPress={() => {
              const newDate = new Date(date);
              newDate.setDate(date.getDate() + 1)
              setDate(newDate)
            }}>

              <Ionicons name='arrow-forward' size={20} color={'#fff'} />

            </TouchableOpacity>
          </View>


        </View>

        <FlatList
          contentContainerStyle={{
            paddingVertical: 20
          }}
          data={schedules}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ScheduleCard item={item} />}
          ItemSeparatorComponent={
            () => <View className='mx-5 border-t border-t-background-darken dark:border-t-background-darkDarken my-3' />
          }
        />

        <View className='p-5 pb-0'>
          <ThemedBlockButton onPress={() => setShowScheduleForm(true)}>
            <Text>Novo agendamento</Text>
          </ThemedBlockButton>
        </View>

        <View className='h-5 items-center justify-center'>
          {lastSync && <Text className='text-xs text-white/40'>Sincronizado em {lastSync.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</Text>}
        </View>
      </SafeAreaView>

      {showScheduleForm && <ScheduleForm onClose={() => {
        setShowScheduleForm(false)

        setTimeout(() => {
          getSchedules()

          syncService()
            .then(result => getSchedules())
            .catch(err => {
              ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,

              );
            })
        }, 100)
      }} />}
    </>
  );
}

export default HomeScreen