import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'

const home = () => {
  
  return (
    <View style={styles.container}>
        <Link href="/EditCreate">Home</Link>
    </View>
  )
}

export default home
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})