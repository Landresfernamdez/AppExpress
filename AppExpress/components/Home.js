import React from 'react';
import Modal from 'react-native-modalbox'
import axios from 'axios';
import { ListView, Text, View, Image, StyleSheet,TextInput, ActivityIndicator, Alert,
Dimensions,Platform,TouchableHighlight} from 'react-native';
import { Button } from 'react-native-elements';
import NumericInput,{ calcSize } from 'react-native-numeric-input';
var screen=Dimensions.get('window');
const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column'
  },container1: {
    flex: 1,
    marginTop: 0,
    flexDirection: 'row',
  },container2: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'column',
  },modalImg: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'column',
  },modal1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img:{
    marginTop: 10,
    marginLeft: 0,
    width: 193,
    height: 110,
  },modal:{
    justifyContent:'center',
    borderRadius: Platform.OS==='android'?30:0,
    shadowRadius: 10,
    width:screen.width-80,
    height:280
  },botonModal:{
    marginBottom:0
  },icon: {
    width: 24,
    height: 24,
  },TextInputStyleClass:{
    backgroundColor:'#8AE2FF',
    height:45
  }
});
export default class Home extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Inicio',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../assets/images/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    )
  };
  constructor(props) {
    super(props);
    this.bandera=true;
    this.interval= setInterval(() => {
      this.componentDidMount();
    }, 25000);
    this.arrayholder=[{'nombre':"Ensalada",'imagen':"https://mobile-cdn.123rf.com/300wm/serezniy/serezniy1110/serezniy111000110/10752709-sabrosa-ensalada-griega-en-recipiente-transparente-aislado-en-blanco.jpg?ver=6",'precio':1000,'ingredientes':'Tomate,lechuga,pepino,limon','cantidadcalorias':'5'}];
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.arrayholder1=[{'nombre':"Ensalada",'imagen':"https://mobile-cdn.123rf.com/300wm/serezniy/serezniy1110/serezniy111000110/10752709-sabrosa-ensalada-griega-en-recipiente-transparente-aislado-en-blanco.jpg?ver=6",'precio':1000,'ingredientes':'Tomate,lechuga,pepino,limon','cantidadcalorias':'5'}];
    let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource:ds.cloneWithRows(this.arrayholder),
      dataSource1:ds.cloneWithRows(this.arrayholder1),
      text:"",
      modalVisible:false,
      producto:{'nombre':'','imagen':'','precio':'','ingredientes':'','cantidadcalorias':''},
      isLoading: true
    };

  }
  componentDidMount(){
    console.log("Entro a prueba");
    //this.setTimeout(() => {
      axios.get('https://guarded-eyrie-96688.herokuapp.com/seleccionarProductos')
      .then(response=>{
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.arrayholder=response.data.data;
        this.setState({
          dataSource: ds.cloneWithRows(response.data.data),
          isLoading:false
        }, function() {
          // In this block you can do something with new state.
          this.arrayholder = response.data.data;
        })
      }).catch(function (error) {
        return error.data
    })
    //}, 500);
  }
  SearchFilterFunction(text){
    const newData = this.arrayholder.filter(function(item){
        const itemData = item.producto.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newData),
        text: text
    })
}
GetListViewItem (data){
    this.setState({
      'producto':
      {
      'producto':data.producto,
      'imagen':data.imagen,
      'precio':data.precio,
      'ingredientes':data.ingredientes,
      'cantidadcalorias':data.cantidadcalorias
      },
      'modalVisible':true
                 })
                }
 setStateModal(){
  this.setState({
    'modalVisible':false
               })
}
addShoppinCar(producto){
    this.arrayholder1.push(producto);
    let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            dataSource1: ds1.cloneWithRows(this.arrayholder1),
            isLoading:false
          }, function() {

          });
}
  render(){
    
    if(this.state.isLoading){
        return(<View/>)           
    }
    return( 
              <View style={styles.containerList}>
                        <TextInput 
                        style={styles.TextInputStyleClass}
                        onChangeText={(text) => this.SearchFilterFunction(text)}
                        value={this.state.text}
                        underlineColorAndroid='transparent'
                        placeholder="Search Here"
                        />
                      <ListView
                        style={styles.containerList}
                        dataSource={this.state.dataSource}
                        renderRow={(data) =>
                          <View style={styles.container1}>
                            <Image
                              source={{ uri: data.imagen}}
                              style={styles.img}
                            />
                            <View style={styles.container2}>
                            <Text onPress={this.GetListViewItem.bind(this, data.producto)}>{data.producto}</Text>
                            <Text onPress={this.GetListViewItem.bind(this, data.producto)}> Precio: ${data.precio}</Text>
                            <View style={styles.container1}>
                              <Button title='Detalles' color="black" onPress={this.GetListViewItem.bind(this,data)}/>
                              <Button title='+' color="black" onPress={this.addShoppinCar.bind(this,data)}/>
                              <NumericInput 
                                      value={this.state.value} 
                                      onChange={value => this.setState({value})} 
                                      totalWidth={calcSize(240)} 
                                      totalHeight={calcSize(50)} 
                                      iconSize={calcSize(25)}
                                      step={1.5}
                                      valueType='real'
                                      rounded 
                                      textColor='#B0228C' 
                                      iconStyle={{ color: 'black' }} 
                                      rightButtonBackgroundColor='#EA3788' 
                                      leftButtonBackgroundColor='#E56B70'/>
                            </View>
                            </View>
                          </View>
                            }
                      />
                      <Modal
                        style={styles.modal}
                        position='center'
                        backdrop={true}
                        isOpen={this.state.modalVisible}>
                        <View style={styles.modal1}>
                          <View style={styles.modalImg}>
                            <Image
                                source={{ uri: this.state.producto.imagen}}
                                style={styles.img}
                              />
                          </View>
                          <View style={styles.container2}>
                            <Text>Nombre del producto:{this.state.producto.producto}</Text>
                            <Text>Ingredientes:{this.state.producto.ingredientes}</Text>
                            <Text>Precio:{this.state.producto.precio}</Text>
                            <Text>Cantidad de calorias:{this.state.producto.cantidadcalorias}</Text>
                            <Button style={styles.botonModal} title="Cerrar" color="black" onPress={this.setStateModal.bind(this)}></Button>

                          </View>
                        </View>
                      </Modal>
              </View>
    );
  }
}
