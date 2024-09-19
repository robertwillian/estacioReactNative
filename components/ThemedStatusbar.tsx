import { useColorScheme } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'


const ThemedStatusBar = () => {
  const theme = useColorScheme() ?? 'light';

  return (
    <StatusBar backgroundColor={theme === 'light' ? '#2e283d' : '#262626'} translucent /> 
  )
}

export default ThemedStatusBar