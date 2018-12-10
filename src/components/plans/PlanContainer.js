import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/plan';
import * as AppActions from '../../actions/app';
import * as HomeActions from '../../actions/home';
import PaceScreen from './PaceScreen';
import SlowPaceScreen from './SlowPaceScreen';
import Loading from '../common/Loading';


const commonStyles = require('../commonStyle');
const { THEME_COLOR } = require('../../theme');
const api = require('../../lib/api');
const services = require('../../lib/services');

const styles = StyleSheet.create({
  paceLink: {
    //textAlign:'left',
     marginLeft: 20,
     marginTop: 20,
    textDecorationLine: 'underline',
     color: '#7C29FC',
     fontSize: 12
  },
  topBarContainer: {
    backgroundColor: THEME_COLOR,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    //flex:1
  },
  startDate: {
     color: '#FFFFFF',
     marginLeft: 40,
     fontWeight: '600',
     fontSize: 18
   },
   btn: {
     padding: 10,
     //height: 30,
     alignItems: 'center',
     //flex: 1,
     backgroundColor: 'transparent',
     justifyContent: 'center'
   }
});

class PlanContainer extends Component {
constructor(props) {
  super(props);
  this.state = {
    editScreen: false,
    pace: 'fast',
    showCalendar: false,
    scrollY: new Animated.Value(-60),
  };
}
  componentDidMount() {
    this.fetchPaceData('fast');
  }

  onPressRemove(foodName, pace, phase) {
    if (phase === 'phase 1') {
      this.props.removePaceFoodItem(foodName, pace, 'phase 2');
    } else if (phase === 'phase 3') {
      this.props.removePaceFoodItem(foodName, pace, 'phase 4');
    }
    this.props.removePaceFoodItem(foodName, pace, phase);
  }

  fetchPaceData(pace) {
    this.props.setFetchState(true);
    const { authData } = this.props;
    authData['pace'] = pace;
    api.getUserPlan(authData).then(responseJson => {
      if (responseJson && responseJson.user_plan) {
        const foodItems = responseJson.user_plan.plan_phase_food_senstivities;
        const phaseFoods = services.sortItemsByKey(foodItems, 'phase');
         responseJson.user_plan[`${pace}_pace`] = phaseFoods;
         console.log(responseJson['user_plan'],"Plan Container");
         this.props.setFetchState(false);
         this.props.setUserPlan(responseJson['user_plan']);
         if (pace === 'fast') {
           this.props.updateUserFoodsSenstivities(phaseFoods['phase 1']);
         } else {
           this.props.updateUserFoodsSenstivities(
             phaseFoods['phase 1'].concat(phaseFoods['phase 3'])
           );
         }
      }

    }).catch(err=>{
      this.props.setFetchState(false);
      console.log(err);
    })
  }

  renderPace(){
    const {userPlan} = this.props;
    if (userPlan && userPlan.fast_pace) {
      return(
        <View style={{flex:1}}>
          <TouchableOpacity onPress={()=>this.fetchPaceData('slow')}><Text style={styles.paceLink}>SLOWER PACE</Text></TouchableOpacity>
          <PaceScreen editScreen={this.state.editScreen} onPressRemove={(foodName,phase)=>this.onPressRemove(foodName,'fast',phase)}
          updateOrder={(foodName, phase)=>this.updateOrder(foodName,'fast', phase)}/>
        </View>
      )
    }else{
      return(
        <View>
          <Text style={styles.paceLink} onPress={()=>this.fetchPaceData('fast')}>FASTER PACE</Text>
          <SlowPaceScreen editScreen={this.state.editScreen}
          updateOrder={(foodName,phase)=>this.updateOrder(foodName,'slow', phase)}
          onPressRemove={(foodName, phase)=>this.onPressRemove(foodName,'slow',phase)}
          />
        </View>
      )
    }

  }

  changeStartDate(timestring){
    this.props.setFetchState(true);
    const{authData} = this.props;
    authData['started_on'] = timestring;
    api.startPlan(authData).then((responseJson)=>{
      this.props.setFetchState(false);
      this.props.updateUserPlan('started_on', services.convertToJSONDate(timestring));
    }).catch((err)=>{
      this.props.setFetchState(false);
    })

    this.setState({showCalendar:false})
  }

  updateSequenceNumber(foodItems, newOrder, pace, phase){
    const { userPlan} = this.props;
    let newArr = [];
    newOrder.map(order=>{
      var found = foodItems.find(function(element) {
        return element.sequence_number === order;
      });
      return newArr.push(found);
    })
    this.props.updatePhaseItems(pace,phase,newArr);
  }

  updateOrder(newOrder, pace, phase){
    const {authData, userPlan} = this.props;
    console.log(userPlan, newOrder);
    if (pace == 'fast') {
      let foodItems = userPlan.fast_pace[phase];
      this.updateSequenceNumber(foodItems, newOrder, pace, phase)
    }else {
      let foodItems = userPlan.slow_pace[phase];
      this.updateSequenceNumber(foodItems, newOrder, pace, phase)
    }
  }

  updatePlan(){
    this.props.setFetchState(true);
    console.log(this.props.userPlan);
    const {authData, userPlan} = this.props;
    var planData;
    authData['food_items'] = [];
    if (userPlan && userPlan.fast_pace) {
      planData = userPlan.fast_pace;
      authData['pace'] = 'fast';
    } else {
    planData = userPlan.slow_pace;
    authData['pace'] = 'slow';
    }
    for (var key in planData) {
      if (planData.hasOwnProperty(key)) {
        authData['food_items'] = authData['food_items'].concat(planData[key]);
      }
    }
    console.log(authData,"Update api");
    let foodItems = services.removeDuplicates(authData['food_items'],'name');
    console.log(foodItems);
    //authData['food_items'] = userPlan.phase1.concat(userPlan.phase3);
    api.updateUserPlan(authData).then((responseJson)=>{
      this.props.setFetchState(false);
        alert("Plan updated successfully");
        this.props.updateUserFoodsSenstivities(foodItems);
      console.log(responseJson);
    }).catch((err) => {
      this.props.setFetchState(false);
        alert(api.errorDescription(err));
    })
    this.setState({editScreen: false})
  }
  render(){
    const {history, userPlan, isFetching} = this.props;
    console.log(userPlan);
    var planStartDate = "";
    if (userPlan && userPlan.started_on) {
      planStartDate = services.timestampToDate(userPlan.started_on);
    }else if (userPlan && userPlan.plan) {
      planStartDate = services.timestampToDate(userPlan.plan.plan_will_start);
    }

    return (
      <View style={{ flex: 1 }}>
      <StatusBar
      backgroundColor="blue"
      barStyle="light-content"
      />
      {isFetching ? <Loading /> : null}
        <View
        style={
          [commonStyles.navbar,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20
            }
          ]
        }
        >
          <View>
          <TouchableOpacity
          style={styles.btn}
          onPress={() => { history.push('/Home/HomeScreen'); }}
          >
          <Icon
          name="ios-arrow-round-back"
          size={30}
          />
          </TouchableOpacity>

          </View>
          <View>
            <Text>My Plan</Text>
          </View>
          {!this.state.editScreen ?
          <TouchableOpacity
          onPress={() => { this.setState({ editScreen: true }); }}
          style={styles.btn}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity
          onPress={() => this.updatePlan()}
          style={styles.btn}
          >
              <Text>Save</Text>
            </TouchableOpacity>
          }
        </View>
        <DateTimePicker
         isVisible={this.state.showCalendar}
         onConfirm={(date)=>{this.changeStartDate(date)}}
         onCancel={()=>{this.setState({showCalendar:false})}}
         confirmTextIOS="OK"
         minimumDate={new Date()}
       />

       <View style={styles.topBarContainer}>
         <Text style={styles.startDate}>Start Date: </Text>
         <View>
         <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
         {planStartDate}
         </Text>
         </View>
          {this.state.editScreen ?
            <FontAwesomeIcon
            name="pencil"
            color="#FFFFFF"
            size={14}
            style={{ paddingLeft: 5 }}
            onPress={() => { this.setState({ showCalendar: true }); }}
            />
            : null
          }
        </View>
        {this.props.userPlan ? this.renderPace() : null}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    authData: state.authReducer.authUser,
    userPlan: state.planReducer.user_plan,
    isFetching: state.appReducer.isFetching,
    props,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...AppActions, ...HomeActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer);
