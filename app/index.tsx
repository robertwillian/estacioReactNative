import { Link, Stack } from 'expo-router';
import { Text, ToastAndroid, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import ThemedTextInput from '../components/ThemedTextInput';
import ThemedBlockButton from '../components/ThemedBlockButton';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [authData, setAuthData] = useState({
    username: "",
    password: ""
  })

  const loginHandle = useCallback(async () => {
    if (authData.password && authData.username) {
      try {
        const data = {
          email: authData.username,
          password: authData.password
        }

        console.log(data);
        
        const response = await authService(data)

        const token = response.data.data

        await AsyncStorage.setItem('token', token);

        router.replace('/home')
      }
      catch(err: any) {
        console.log(err.message);
        
        ToastAndroid.showWithGravity(
          "Houve algum erro ao tentar autenticar",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,

        );
      }
    }
    else {
      ToastAndroid.showWithGravity(
        "Preencha os campos com seu e-mail e senha",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,

      );
    }
  }, [authData])

  useEffect(() => {
    const value = AsyncStorage.getItem('token')
    .then(token => {
      if(token !== null) {
        router.replace('/home')
      }
    })
    .catch(err => {

    })
  }, [])
  
  return (
    <>
      <SafeAreaView className={`h-full bg-background-light dark:bg-background-dark justify-between`}>
        <View className='p-5 items-end'>
          <Link href="/register"><Text className='text-white'>Criar conta</Text></Link>
        </View>
        <View className='p-5 justify-end gap-5'>
          <View className='items-center'>
            <Text className='text-white'>Meus agendamentos</Text>
          </View>
          <ThemedTextInput
            onChangeText={(text) => {
              setAuthData({
                ...authData,
                username: text
              })
            }}
            value={authData.username}
            placeholder="seu e-mail"
            keyboardType="email-address"
          />

          <ThemedTextInput
            onChangeText={(text) => {
              setAuthData({
                ...authData,
                password: text
              })
            }}
            value={authData.password}
            placeholder="sua senha"
            secureTextEntry={true}
            autoCorrect={false}
          />
          <ThemedBlockButton onPress={loginHandle}>
            <Text>Entrar</Text>
          </ThemedBlockButton>
        </View>
      </SafeAreaView>
    </>
  );
}
