import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";

//library imports 
import { Container, Content, Icon, Header, Body } from 'native-base'
import { DrawerNavigator, StackNavigator, DrawerItems, SafeAreaView} from 'react-navigation'

//custom files 
import Home from "./components/Home";
export default class App extends Component {

  render() {
    return (
      <MyApp />
    )
  }
}

const CustomDrawerContentComponent = (props) => (

  <Container style={styles.container}>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('./assets/images/logo_instantfoodcr.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>

  </Container>
);
const MyApp = DrawerNavigator({
  // For each screen that you can navigate to, create a new entry like this:
  Home: {
    screen: Home,
  }
},
  {
    initialRouteName: 'Home',
    drawerPosition: 'left',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    mode: 'card'
  });
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  drawerHeader: {
    height: 200,
    backgroundColor: '#8AE2FF'
  },
  drawerImage:{
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor:'white'
  }
})