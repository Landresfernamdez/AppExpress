import React from 'react';
import Modal from 'react-native-modalbox'
import axios from 'axios';
import { ListView, Text, View, Image, StyleSheet,TextInput, ActivityIndicator, Alert,
Dimensions,Platform,TouchableHighlight,TouchableOpacity} from 'react-native';
import { Button,FormLabel, FormInput } from 'react-native-elements';
import NumericInput,{ calcSize } from 'react-native-numeric-input';
var screen=Dimensions.get('window');

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
  constructor(props){
    super(props);
    this.bandera=true;
    this.interval= setInterval(() => {
      this.componentDidMount();
    }, 25000);
    this.sesion=false;
    this.arrayholder=[{'nombre':"Ensalada",'imagen':"https://mobile-cdn.123rf.com/300wm/serezniy/serezniy1110/serezniy111000110/10752709-sabrosa-ensalada-griega-en-recipiente-transparente-aislado-en-blanco.jpg?ver=6",'precio':1000,'ingredientes':'Tomate,lechuga,pepino,limon','cantidadcalorias':'5'}];
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.arrayholder1=[];
    let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      userName:'',
      password:'', 
      modalVisibleLoginVisible:false,
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
BuyCar(){
  this.setState({
      modalVisibleLoginVisible:true
  });
}
validarLogin(){
  axios.post('http://172.24.113.47:5000/iniciarSesionCliente',{
    correo:this.state.userName,
    contrasena:this.state.password
    })
    .then(result => {
        console.log(result);
        if(result.data.success==true){
            console.log("Usuario Invalido")
        }
        else{
            console.log("Usuario valido")
            }
        }
    )
    .catch(error=> {
    console.log(error);
    });
}
//Se encarga de modificar la cantidad del producto en el carrito
agregarUnidades(cantidad,nombre){
  var listaCarrito=this.arrayholder1;
  for(var x=0;x<listaCarrito.length;x++){
    if(listaCarrito[x].producto==nombre){
        this.arrayholder1[x].cantidad=this.arrayholder1[x].cantidad+cantidad;
    }
  }
}
//Se encarga de verificar si existe el producto en el carrito
existeProducto(nombre){
  var listaCarrito=this.arrayholder1;
  for(var x=0;x<listaCarrito.length;x++){
    if(listaCarrito[x].producto==nombre){
      return true;
    }
  }
  return false;
}
DeleteFromCar(nombre){
  var listaCarrito=this.arrayholder1;
  for(var x=0;x<listaCarrito.length;x++){
    if(listaCarrito[x].producto==nombre){
      this.arrayholder1.splice(x,1);
      this.GetListCar();
    }
  }
}
addShoppinCar(producto){
  console.log(producto);
    producto.cantidad=this.state.value;
    if(this.existeProducto(producto.producto)){
        console.log("Ya esta el producto en el carrito");
        this.agregarUnidades(this.state.value,producto.producto);
    }
    else{
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
                            <Image source={require("../assets/images/shopping_cart.png")}/>
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
                              <Button title='Detalles' color="black" backgroundColor="#859a9b" onPress={this.GetListViewItem.bind(this,data)}/>
                              <TouchableOpacity style={styles.botonHeader} onPress={this.addShoppinCar.bind(this,data)}>
                                <Image source={require("../assets/images/shopping_car.png")}/>
                              </TouchableOpacity>
                            </View>
                            <NumericInput 
                                      min={1}
                                      max={100}
                                      onChange={value => this.setState({value})} 
                                      totalWidth={calcSize(240)} 
                                      totalHeight={calcSize(50)} 
                                      iconSize={calcSize(25)}
                                      step={1}
                                      valueType='real'
                                      rounded 
                                      textColor='#B0228C' 
                                      iconStyle={{ color: 'black' }} 
                                      rightButtonBackgroundColor='#EA3788' 
                                      leftButtonBackgroundColor='#E56B70'/>
                            </View>
                          </View>
                            }
                      />
                       {/*Este es el modal de mostrar detalles de un producto*/}
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
                      {/*Este es el modal del carrito de compras*/}
                      <Modal
                        style={styles.modal2}
                        position='center'
                        backdrop={true}
                        isOpen={this.state.modalCarritoVisible}>
                        <View style={styles.modal3}>
                        <View style={styles.modalImg1}>
                          <Text style={styles.elemento}>   Img  </Text>
                          <Text style={styles.elemento}>Nombre  </Text>
                          <Text style={styles.elemento}>Precio  </Text>
                          <Text style={styles.elemento}>Cantidad  </Text>
                          <Text style={styles.elemento}>Subtotal</Text>
                          <TouchableOpacity style={styles.botonHeaderModalCar} onPress={this.setStateModalCarrito.bind(this)}>
                                <Image source={require("../assets/images/close.png")}/>
                        </TouchableOpacity>
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
                            <Text style={styles.elemento}>{data.producto}  </Text>
                            <Text style={styles.elemento}>₡{data.precio}  </Text>
                            <Text style={styles.elemento}>{data.cantidad}  </Text>
                            <Text style={styles.elemento}>{data.cantidad*data.precio}</Text>
                            <TouchableOpacity style={styles.botonHeader1} onPress={this.DeleteFromCar.bind(this,data.producto)}>
                            <Image source={require("../assets/images/remove_shopping_cart.png")}/>
                            </TouchableOpacity>
                          </View>
                            }
                      />
                      <TouchableOpacity style={styles.botonHeader} onPress={this.BuyCar.bind(this)}>
                                <Image source={require("../assets/images/payment.png")}/>
                        </TouchableOpacity>
                        </View>
                      </Modal>
                      {/*Este es el modal del Login*/}
                      <Modal
                        style={styles.modal}
                        position='center'
                        backdrop={true}
                        isOpen={this.state.modalVisibleLoginVisible}>
                        <View style={styles.containerLogin}>
                            <Text >Bienvenido a InstantFoodExpress</Text>
                            <FormLabel>Digite su usuario</FormLabel>
                            <TextInput style={styles.inputLogin}
                            underlineColorAndroid='transparent'
                            placeholder="Digite su usuario"
                              onChangeText={text => this.setState({ userName: text })}
                            />
                            <FormLabel>Contraseña</FormLabel>
                            <TextInput style={styles.inputLogin}
                              underlineColorAndroid='transparent'
                              placeholder="Digite su contraseña"
                              onChangeText={text => this.setState({ password: text })}
                            />
                            <Button 
                              onPress={this.validarLogin.bind(this)}
                              buttonStyle={[{ marginBottom: 5, marginTop: 5 }]}
                              title="Login"
                            />
                        </View>
                      </Modal>
              </View>
    );
  }
}
const styles = StyleSheet.create({
  containerLogin:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flexDirection:'column'
  },
  inputLogin: {
    borderRadius: 5,
    backgroundColor:'#8AE2FF',
    width: 200,
    height: 44,
    borderWidth: 1,
    borderColor: 'black'
  },
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
  },elemento:{
    flexDirection: 'column',
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
    width: 30,
    height: 30,
    flexDirection: 'column',
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
  },botonHeaderModalCar:{
    marginRight:0,
    backgroundColor: '#859a9b',
    borderRadius: 5,
    width:35,
    height:45,
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    justifyContent:'center',
  },botonHeader1:{
    marginRight:0,
    backgroundColor: '#859a9b',
    borderRadius: 5,
    padding: 10,
    width:30,
    height:30,
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