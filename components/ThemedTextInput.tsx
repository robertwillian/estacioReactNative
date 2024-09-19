import { View, Text, TextInputProps, TextInput } from 'react-native'
import React from 'react'

type ThemeTextInputProps = TextInputProps & {

}

const ThemedTextInput = ({...rest}:ThemeTextInputProps) => {
  return (
    <TextInput
      className='bg-white rounded-md px-5 py-2 dark:bg-zinc-500'
      {...rest}
    />
  )
}

export default ThemedTextInput