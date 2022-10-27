var mxn;
var dolar;
var tasa;
var usdToCup;
const inputMxn = document.getElementById('inputMXN');


function sumar() {
    //Input del costo MXN en el front
	mxn = inputMxn.value;

    //Cálculos
    var precioCUP = Number(mxn) / Number(dolar) * Number(tasa) * Number(usdToCup);
    var precioUSD = Number(mxn) / Number(dolar) * Number(tasa);
    var costoUSD = Number(mxn) / Number(dolar);

    // Muestra Precio en CUP
    document.getElementById('cup').innerHTML = "$ " + precioCUP.toFixed(0);

    // Muestra precio en USD 
    document.getElementById('usd').innerHTML = "$ " + precioUSD.toFixed(2);

    // Muestra equivalente en USD
    document.getElementById('mxnToUsd').innerHTML = costoUSD.toFixed(2);
}

function guardar(){

    // Datos de los inputs en la Configuración
    dolar = document.getElementById('inUsdMxn').value;
    tasa = document.getElementById('inTasa').value;
    usdToCup = document.getElementById('inUsdCup').value;

    var configData = {"dolar": dolar, "usdToCup": usdToCup, "tasa": tasa};

    //Set data a localDB
    localStorage.setItem('config', JSON.stringify(configData));

    actualizar();
}

//Eventos click de la app
//document.getElementById('btnCalcular').addEventListener('click', sumar);
document.getElementById('btnGuardar').addEventListener('click', guardar);
//document.getElementById('btnCUP').addEventListener('click', showPoppup);


//poput calculo reverso
function showPoppup(){

    let text;
    let newPrecioCUP = prompt("Coloque el precio deseado en CUP:", "0.00");
    if (newPrecioCUP == null || newPrecioCUP == "") {
        text = "User cancelled the prompt.";
    } else {
        text = "Hello " + newPrecioCUP + "! How are you today?";
      }

      //calculos
      let precioUSD = newPrecioCUP/usdToCup
      let costoUSD = precioUSD / tasa
      let inputMxn = costoUSD * dolar

    // Muestra Precio en CUP
    document.getElementById('cup').innerHTML = "$ " + newPrecioCUP;

    // Muestra precio en USD 
    document.getElementById('usd').innerHTML = "$ " + precioUSD.toFixed(2);

    // Muestra equivalente en USD
    document.getElementById('mxnToUsd').innerHTML = costoUSD.toFixed(2);


    inputMxn.value = inputMxn.toFixed(2);

}

function MostrarConfig(){
    document.getElementById('infoCambio').innerHTML = "$" + dolar.toFixed(2);
    document.getElementById('infoTasa').innerHTML = tasa.toFixed(1);
} 

function actualizar(){
    if (!localStorage.getItem('config')){

    dolar = 19.40;
    tasa = 2.0;
    usdToCup = 120;
    MostrarConfig();
    console.log("Se cargaron los datos por defecto");

} else {

    console.log("Datos obtenidos de DB local")

    //get data
    var obj = JSON.parse(localStorage.getItem('config'));

    dolar = Number(obj.dolar);
    tasa = Number(obj.tasa);
    usdToCup = Number(obj.usdToCup);

    MostrarConfig();

    // Actualizando los campos en la ficha de Configuración (back)
    document.getElementById('inUsdMxn').value = obj.dolar;
    document.getElementById('inTasa').value = obj.tasa;
    document.getElementById('inUsdCup').value = obj.usdToCup;

    console.log(obj);
    }


}

//Click en el inputMXN de precio
function showCalc() {
    myApp.pickerModal('.picker-info')
}

inputMxn.addEventListener('click', showCalc);

// Agregar a display
function agregarDisplay (a){

    if (a == 'C') {

        inputMxn.value = "";

    } else {

    inputMxn.value += a;

    }
}

// Borrar ultimo elemento del display
function eliminarDisplay(){
    inputMxn.value = inputMxn.value.slice(0, -1);
}


// Sumar Display
function calcularDisplay(){
    resultado = eval(inputMxn.value);
    inputMxn.value = resultado;
    sumar();
}