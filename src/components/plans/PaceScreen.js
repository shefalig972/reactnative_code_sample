import React,{ Component } from 'React';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {  Tabs, Tab } from 'react-router-navigation';
import { connect } from 'react-redux';

import Phase1 from './Phase1'
import Phase2 from './Phase2'
import EditPhase2 from './EditPhase2'
import Swiper from '../common/Swiper'
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  slide: {
   flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
   //bottom:10
 },
 // Text below header
 text: {
   color: '#FFFFFF',
   fontFamily: 'Avenir',
   fontSize: 18,
   marginHorizontal: 40,
   textAlign: 'center',
 },
})

const iconStyles = {
  size: 100,
  color: '#FFFFFF',
};

class PaceScreen extends Component {

  render(){
    console.log(this.props,"Fast Pace");
      const {history, userPlan} = this.props;
    let Phase5Foods = (userPlan && userPlan.fast_pace)?userPlan.fast_pace[Object.keys(userPlan.fast_pace)[0]]:[];
    let Phase6Foods = (userPlan && userPlan.fast_pace)?userPlan.fast_pace[Object.keys(userPlan.fast_pace)[1]]:[];
    return(
      <Swiper>
        {/* First screen */}
        <View style={styles.slide}>
        <View>
          <Text style={{textAlign:'center',fontSize:14}}>Phase1</Text>
          <Text style={{textAlign:'center', fontSize:16}}>Eliminate for 21 days</Text>
          <Phase1  foods={Phase5Foods} editScreen={this.props.editScreen} onPressRemove={(foodName,phase_id)=>this.props.onPressRemove(foodName, phase_id)}/>
        </View>
        </View>
        {/* Second screen */}
        <View style={styles.slide}>

        {this.props.editScreen?
          <View>
          <Text style={{textAlign:'center',fontSize:14}}>Phase2</Text>
          <EditPhase2 foods={Phase6Foods} editScreen={this.props.editScreen} sortItems={(foodOrder, phase)=>this.props.updateOrder(foodOrder, phase)} onPressRemove={(foodName,phase_id)=>this.props.onPressRemove(foodName, phase_id)}/>
          </View>
          :
          <View>
          <Text style={{textAlign:'center', fontSize:14}}>Phase2</Text>
          <Phase2 foods={Phase6Foods} editScreen={this.props.editScreen} onPressRemove={(foodName,phase_id)=>this.props.onPressRemove(foodName, phase_id)}/>
          </View>
        }
        </View>
      </Swiper>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  //  authData: state.authReducer.authUser,
    userPlan: state.planReducer.user_plan,
    props,
  };
}

export default connect(mapStateToProps)(PaceScreen);
