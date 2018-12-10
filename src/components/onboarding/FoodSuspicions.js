
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
const commonStyles = require('../commonStyle');
const IMAGES = require('../Images');
const { screenHeight } = require("../../theme");
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import Loading from '../common/Loading';

const styles = StyleSheet.create({
  mainImage: {
    alignSelf:'center',
    top:-40,
    zIndex:1
  },
});

class FoodSuspicions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foods: null,
      selectedItems: this.checkSelected(),
    };
  }
  componentWillMount() {
    this.sortFoodsbyCategory();
  }


  onPressResponse() {
    const { authData, screenData } = this.props;
    authData.step_name = screenData.current_screen.name;
    authData.response = 'none_needed';
    authData.step_data = { food_suspicions: this.state.selectedItems };
    this.props.onPressResponse(authData);
  }

  onPressBack() {
    this.props.onPressBack();
  }

  onSelectItem(item) {
    const selectedItems = this.state.selectedItems;
    selectedItems.push(item.name);
    this.setState({ selectedItems });
  }

  onUnSelectItem(item) {
    const selectedItems = this.state.selectedItems;

    if (selectedItems && selectedItems.length > 0) {
      const index = selectedItems.indexOf(item.name);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }

    this.setState({ selectedItems });
  }

  sortFoodsbyCategory() {
    const { screenData } = this.props;
    const foodSensitivities = screenData.current_screen ?
      screenData.current_screen.screen_data.food_sensitivities :
      null;
    if (foodSensitivities) {
      const groupBy = (xs, key) => xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});

      const foods = groupBy(foodSensitivities, 'category');
      if (foods) {
        this.setState({ foods });
      }
    }
  }

  checkSelected() {
    const { screenData } = this.props;
    if (screenData.current_screen &&
      screenData.current_screen.screen_data &&
      screenData.current_screen.screen_data.user_food_suspicions
    ) {
      return screenData.current_screen.screen_data.user_food_suspicions.map(item => item.name);
    }
    return [];
  }

  renderFood(data) {
    if (data && data.length > 0) {
      return (
        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
          { data.map((item) => {
           let filterItem = false;
           if (this.state.selectedItems) {
              filterItem = this.state.selectedItems.includes(item.name);
           }

           return (
             <TouchableOpacity
               style={[commonStyles.selectedItemTextContainer, { backgroundColor: filterItem ? '#6C2DFC' : '#FFFFFF',  borderRadius: 0, borderRadius: 2 }]}
               key={item.localization_key}
               onPress={() => (filterItem ? this.onUnSelectItem(item) : this.onSelectItem(item))}
             >
               <Text style={{ color: filterItem ? '#FFFFFF' : '#6C2DFC' }}> { item.name } </Text>
             </TouchableOpacity>
         );
       }, this)}
        </View>
      );
    }
    return null;
  }

  renderFoodsCategory() {
    const { foods } = this.state;
    const renderContent = [];
    Object.keys(foods).forEach((foodCategory) => {
      renderContent.push(<View key={foodCategory} style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>{foodCategory}</Text>
        { this.renderFood(foods[`${foodCategory}`])}
      </View>);
    });

    return (
      <View>
        {renderContent}
      </View>
    );
  }

  render() {
    const { screenData } = this.props;
    const screenImage = screenData.current_screen.image ?
    IMAGES[`${screenData.current_screen.image.split('.png')[0]}`] :
    null;
    return (
      <View style={[commonStyles.container, { backgroundColor: '#FFFFFF'}]}>
      {this.props.isFetching?<Loading/>:null}
        <View style={commonStyles.introContainer}>
        <View style={{justifyContent:'center', height:80, paddingLeft:10}}>
        <Icon name="arrow-left" size={20} color="#FFFFFF" onPress={() => this.onPressBack()}/>
        </View>
          <View style={{alignItems:'center'}}>
            <Text style={commonStyles.stepsHeading}>2 of 4</Text>
            <View style={commonStyles.onboardingTitleSeperator}/>
            <Text style={[commonStyles.text1, commonStyles.heading1]}>
              {screenData.current_screen.title}
            </Text>
          </View>
        </View>
        {screenImage ?
          <Image source={screenImage} style={styles.mainImage} resizeMode="stretch" />
          :
          null
        }
        <View style={[commonStyles.contentContainer,{flex:1}]}>

        <ScrollView>



          {screenData.current_screen.description?
            <Text style={[commonStyles.text2, commonStyles.paragraphText]}>
              {screenData.current_screen.description}
            </Text>
            :null}

            {this.state.foods ? this.renderFoodsCategory() : null}
            <View style={{ alignItems:'center', margin:0}}>
            <TouchableOpacity style={commonStyles.buttonWrapper} onPress={() => this.onPressResponse('none_needed')}>
              <Text style={commonStyles.buttonText}>NEXT</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
        </View>

      </View>
    );
  }
}

FoodSuspicions.propTypes = {
  screenData: PropTypes.shape({
    current_screen: PropTypes.shape({
      screen_data: PropTypes.object.isRequired,
    }).isRequired,
    previous_screen: PropTypes.object.isRequired,
  }).isRequired,
  authData: PropTypes.shape({
    client_id: PropTypes.string.isRequired,
    client_token: PropTypes.string.isRequired,
    client_version: PropTypes.string.isRequired,
    token_timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onPressResponse: PropTypes.func.isRequired,
  onPressBack: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    screenData: state.onboardingReducer.screenData,
    authData: state.authReducer.authUser,
    isFetching: state.appReducer.isFetching,
    props,
  };
}

export default connect(mapStateToProps)(FoodSuspicions);
