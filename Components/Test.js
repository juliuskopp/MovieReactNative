// Components/Test.js

import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import HelloWorld from './HelloWorld'

class Test extends React.Component {

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.subview_container_2}>
            <HelloWorld/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Première façon en utilisant ...Platform.select     --> Attention les ... sont obligatoires
  subview_container_1: {
    ...Platform.select({
        ios: {
            backgroundColor: 'red',
            height: 100,
            width: 50
        },
        android: {
            backgroundColor: 'yellow', 
            height: 50,
            width: 100
        }
    })
  },
  // Deuxième option : en testant l'OS
  subview_container_2: {
    backgroundColor: Platform.OS === 'ios' ? 'red' : 'yellow',
    height: Platform.OS === 'ios' ? 100 : 50,
    width: Platform.OS === 'ios' ? 50 : 100
  }
})

export default Test
