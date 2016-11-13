import React, { Component } from 'react'
import { Platform, StyleSheet, TouchableHighlight, Text, View } from 'react-native'
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io'
import Permissions from 'react-native-permissions'

export default class Root extends Component {
  state = {
    card: null,
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload()
    }
  }

  scanCard = async () => {
    try {
      this.setState({ card: null })
      const response = await Permissions.requestPermission('camera')
      if (response ==! 'authorized') {
        throw new Error('Camera permission denied')
      }
      console.log('response:', response)
      const card = await CardIOModule.scanCard()
      console.log('CARD:', card)
      this.setState({ card })
    } catch (error) {
      console.log('Fail to scan card:', error)
    }
  }

  render() {
    const { card } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          CardIOModule example
        </Text>
        <TouchableHighlight
          style={styles.button}
          underlayColor="rgba(0,0,0,0.5)"
          onPress={this.scanCard}>
          <Text>Scan card!</Text>
        </TouchableHighlight>
        {card &&
          <View style={styles.params}>
            <Text style={styles.instruction}>
              Number: {card.cardNumber}
            </Text>
            <Text style={styles.instruction}>
              Month: {card.expiryMonth}
            </Text>
            <Text style={styles.instruction}>
              Year: {card.expiryYear}
            </Text>
            <Text style={styles.instruction}>
              CVC: {card.cvv}
            </Text>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    padding: 8,
    height: Platform.OS === 'ios' ? 35 : 40,
    minWidth: 160,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
  },
  params: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: 300,
  },
})
