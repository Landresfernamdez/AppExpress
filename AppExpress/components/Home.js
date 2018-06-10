import React from 'react';
import Modal from 'react-native-modalbox'
import axios from 'axios';
import { ListView, Text, View, Image, StyleSheet,TextInput, ActivityIndicator, Alert,
Dimensions,Platform,TouchableHighlight,TouchableOpacity} from 'react-native';
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
  },containerHeader: {
    marginTop: 0,
    marginLeft: 0,
    flexDirection: 'row',
    height:20
  },container2:{
    flex: 1,
    marginTop: 10,
    flexDirection: 'column',
  },modalImg: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'column',
  },modalImg1: {
    marginTop: 10,
    flexDirection: 'row',
  },modal1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },modal3: {
    flex: 1,
    flexDirection: 'column'
  },
  img:{
    marginTop: 10,
    marginLeft: 0,
    width: 193,
    height: 110,
  },
  img1:{
    marginTop: 10,
    marginLeft: 0,
    width: 50,
    height: 50,
  },img_car:{
    marginTop: 10,
    marginLeft: 0,
    width: 50,
    height: 50,
  },modal:{
    justifyContent:'center',
    borderRadius: Platform.OS==='android'?30:0,
    shadowRadius: 10,
    width:screen.width-80,
    height:280
  },modal2:{
    justifyContent:'center',
    borderRadius: Platform.OS==='android'?30:0,
    shadowRadius: 5,
    width:screen.width-10,
    height:screen.height-10
  },botonModal:{
    marginBottom:0
  },botonHeader:{
    marginRight:0,
    backgroundColor: '#859a9b',
    borderRadius: 5,
    padding: 10,
    width:45,
    height:45,
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },icon: {
    width: 24,
    height: 24,
  },TextInputStyleClass:{
    backgroundColor:'#8AE2FF',
    height:45,
    width:300
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
    this.arrayholder1=[{'producto':"Ensalada",'imagen':"https://mobile-cdn.123rf.com/300wm/serezniy/serezniy1110/serezniy111000110/10752709-sabrosa-ensalada-griega-en-recipiente-transparente-aislado-en-blanco.jpg?ver=6",'precio':1000,'ingredientes':'Tomate,lechuga,pepino,limon','cantidadcalorias':'5'}];
    let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      value:0,
      dataSource:ds.cloneWithRows(this.arrayholder),
      dataSource1:ds.cloneWithRows(this.arrayholder1),
      text:"",
      modalVisible:false,
      modalCarritoVisible:false,
      producto:{'producto':'','imagen':'','precio':'','ingredientes':'','cantidadcalorias':''},
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
  GetListCar(){
      console.log(this.arrayholder1);
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              dataSource1: ds.cloneWithRows(this.arrayholder1),
              modalCarritoVisible:true
            }, function() {
            })
                }
 setStateModal(){
  this.setState({
    'modalVisible':false
               })
}
setStateModalCarrito(){
  this.setState({
    'modalCarritoVisible':false
               })

}
addShoppinCar(producto){
  console.log(producto);
    this.arrayholder1.push(producto);
    console.log(this.arrayholder1);
    let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            dataSource1: ds1.cloneWithRows(this.arrayholder1),
            isLoading:false,
            modalCarritoVisible:false
          }, function() {

          });
}
  render(){
    if(this.state.isLoading){
        return(<View/>)           
    }
    return( 
              <View style={styles.containerList}>
                        <View  style={styles.containerHeader}>
                          <TextInput 
                          style={styles.TextInputStyleClass}
                          onChangeText={(text) => this.SearchFilterFunction(text)}
                          value={this.state.text}
                          underlineColorAndroid='transparent'
                          placeholder="Search Here"
                          />
                          <TouchableOpacity style={styles.botonHeader} onPress={this.GetListCar.bind(this)}>
                            <Image source={require("../assets/images/shopping_car.png")}/>
                          </TouchableOpacity>
                        </View>
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


                      <Modal
                        style={styles.modal2}
                        position='center'
                        backdrop={true}
                        isOpen={this.state.modalCarritoVisible}>
                        <View style={styles.modal3}>
                        <View style={styles.modalImg1}>
                          <Text>   Img  </Text>
                          <Text>Nombre  </Text>
                          <Text>Precio</Text>
                        </View>
                        <ListView
                        style={styles.containerList}
                        dataSource={this.state.dataSource1}
                        renderRow={(data) =>
                          <View style={styles.modalImg1}>
                            <Image
                              source={{ uri: data.imagen}}
                              style={styles.img1}
                            />
                            <Text>{data.producto} </Text>
                            <Text>₡{data.precio}</Text>
                          </View>
                            }
                      /><Button style={styles.botonModal} title="Cerrar" color="black" onPress={this.setStateModalCarrito.bind(this)}></Button>
                        </View>
                      </Modal>
              </View>
    );
  }
}