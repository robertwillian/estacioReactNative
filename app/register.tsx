import { Link, router, Stack } from 'expo-router';
import { Text, ToastAndroid, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedTextInput from '../components/ThemedTextInput';
import ThemedBlockButton from '../components/ThemedBlockButton';
import { useCallback, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { registerService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })


  const registerHandle = useCallback(async () => {
    if (registerData.name && registerData.password && registerData.confirmPassword && registerData.email) {
      if(registerData.confirmPassword !== registerData.password){

        ToastAndroid.showWithGravity(
          "Você precisa confirmar a senha",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
  
        );

      }

      try {
        const data = {
          email: registerData.email,
          password: registerData.password,
          name: registerData.name
        }

        console.log(data);
        
        const response = await registerService(data)

        const token = response.data.data

        await AsyncStorage.setItem('token', token);

        router.replace('/home')
      }
      catch(err: any) {
        console.log(err.message);
        
        ToastAndroid.showWithGravity(
          err?.response?.data?.message || "Houve algum erro ao tentar criar sua conta",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }
    else {
      ToastAndroid.showWithGravity(
        "Preencha todos os campos",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,

      );
    }
  }, [registerData])

  return (
    <>
      <SafeAreaView className={`h-full bg-background-light dark:bg-background-dark justify-between`}>
        <View className='p-5'>
          <Link href="/" className='justify-center flex-row'>
            <View className='flex-row items-center'>
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text className='text-white justify-start'>Voltar</Text>
            </View>
          </Link>
        </View>
        <View className='p-5 justify-end gap-5'>
          <View className='items-center'>
            <Text className='text-white'>Criar conta</Text>
          </View>
          <ThemedTextInput
            onChangeText={(text) => {
              setRegisterData({
                ...registerData,
                name: text
              })
            }}
            value={registerData.name}
            placeholder="seu nome"
          />

          <ThemedTextInput
            onChangeText={(text) => {
              setRegisterData({
                ...registerData,
                email: text
              })
            }}
            value={registerData.email}
            placeholder="seu e-mail"
            keyboardType="email-address"
          />

          <ThemedTextInput
            onChangeText={(text) => {
              setRegisterData({
                ...registerData,
                password: text
              })
            }}
            value={registerData.password}
            placeholder="sua senha"
            secureTextEntry={true}
            autoCorrect={false}
          />

          <ThemedTextInput
            onChangeText={(text) => {
              setRegisterData({
                ...registerData,
                confirmPassword: text
              })
            }}
            value={registerData.confirmPassword}
            placeholder="confirmar sua senha"
            secureTextEntry={true}
            autoCorrect={false}
          />
          <ThemedBlockButton onPress={registerHandle}>
            <Text>Criar conta</Text>
          </ThemedBlockButton>
        </View>
      </SafeAreaView>
    </>
  );
}
