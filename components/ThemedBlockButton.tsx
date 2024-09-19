import { View, Text, Button, ButtonProps, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'

type ThemedBlockButtonProps = TouchableOpacityProps & {
  
}

const ThemedBlockButton = ({children, ...rest}: ThemedBlockButtonProps) => {
  return (
    <TouchableOpacity {...rest} >
      <View className='rounded-md bg-primary flex-row justify-center h-10 items-center'>
        {children} 
      </View>
    </TouchableOpacity>
  )
}

export default ThemedBlockButton