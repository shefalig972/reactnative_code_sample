import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Link } from 'react-router-native';

export default class NoScreenFound extends Component {
  render() {
    const { history } = this.props;
    return (
      <View style={{
          flex: 1, backgroundColor: '#373D96', justifyContent: 'center', alignItems: 'center',
          }}
      >
        <Text style={{ color: '#FFFFFF' }}>No Screen Found</Text>
        <Link to="/Intro"><Text style={{ color: '#FFFFFF' }}>Click here to go Intro screen.</Text></Link>
      </View>
    );
  }
}
