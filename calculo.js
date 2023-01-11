let mxn;
let dolar;
let tasa;
let usdToCup;

let memory = "";
let resultado;

let apiData = {};

const inputMxn = document.getElementById('inputMXN');
const toqueChecker = document.getElementById('checkToque');
const sjChecker = document.getElementById('checkSJ');

let statusCheckToque;
let statusCheckSJ;


function sumar() {
    //Input del costo MXN en el front
	mxn = resultado;

    //Cálculos
    let precioCUP = Number(mxn) / Number(dolar) * Number(tasa) * Number(usdToCup);
    let precioUSD = Number(mxn) / Number(dolar) * Number(tasa);
    let costoUSD = Number(mxn) / Number(dolar);

    // Muestra Precio en CUP
    document.getElementById('cup').innerHTML = "$ " + formatear(precioCUP, 0);

    // Muestra precio en USD 
    document.getElementById('usd').innerHTML = "$ " + formatear(precioUSD, 2);

    // Muestra equivalente en USD
    document.getElementById('mxnToUsd').innerHTML = formatear(costoUSD, 2);
}

//poput calculo reverso
function sumarCUP(){

    let text;
    const inputCUP = document.getElementById('inputCUP');
    let newPrecioCUP = inputCUP.value;
    if (newPrecioCUP == null || newPrecioCUP == "") {
        text = "User cancelled the prompt.";
    }

      //calculos
      let precioUSD = newPrecioCUP/usdToCup;
      let costoUSD = precioUSD / tasa;
      let inputMxn = costoUSD * dolar;

    // Muestra Precio en CUP
    document.getElementById('cup').innerHTML = "$ " + formatear(Number(newPrecioCUP), 0);

    // Muestra precio en USD 
    document.getElementById('usd').innerHTML = "$ " + formatear(precioUSD, 2);

    // Muestra equivalente en USD
    document.getElementById('mxnToUsd').innerHTML = formatear(costoUSD, 2);

    inputMXN.value = formatear(inputMxn, 2);

    myApp.closeModal('.popover');

}

function guardar(){

    // Datos de los inputs en la Configuración
    dolar = document.getElementById('inUsdMxn').value;
    tasa = document.getElementById('inTasa').value;
    usdToCup = document.getElementById('inUsdCup').value;

    statusCheckToque = toqueChecker.checked;
    statusCheckSJ = sjChecker.checked;

    let configData = {"dolar": dolar, "usdToCup": usdToCup, "tasa": tasa, "eltoque": statusCheckToque, "sanjorge": statusCheckSJ};

    //Set data a localDB
    localStorage.setItem('config', JSON.stringify(configData));

    sumar();

    actualizar();
}

//Eventos click de la app
//document.getElementById('btnCalcular').addEventListener('click', sumar);
document.getElementById('btnGuardar').addEventListener('click', guardar);
//document.getElementById('btnCUP').addEventListener('click', showPoppup);


// Función para separar los miles en los números
function formatear (num, decimal){
    formatedNum = num.toFixed(decimal).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return formatedNum;
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
    statusCheckToque = false;
    statusCheckSJ = false;
    MostrarConfig();
    console.log("Se cargaron los datos por defecto");

} else {

    console.log("Datos obtenidos de DB local")

    //get data
    let obj = JSON.parse(localStorage.getItem('config'));

    dolar = Number(obj.dolar);
    tasa = Number(obj.tasa);
    usdToCup = Number(obj.usdToCup);
    statusCheckToque = obj.eltoque
    statusCheckSJ = obj.sanjorge

    MostrarConfig();

    // Actualizando los campos en la ficha de Configuración (back)
    document.getElementById('inUsdMxn').value = obj.dolar;
    document.getElementById('inTasa').value = obj.tasa;
    document.getElementById('inUsdCup').value = obj.usdToCup;
    toqueChecker.checked = statusCheckToque;
    sjChecker.checked = statusCheckSJ;

    actualizar_API_Toque()

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
        memory = "";

    } else {

    memory += a;
    inputMxn.value = memory;

    }
}

// Borrar ultimo elemento del display
function eliminarDisplay(){
    memory = memory.slice(0, -1);
    inputMxn.value = memory;
}


// Sumar Display
function calcularDisplay(){

    resultado = eval(memory);
    if (isNaN(resultado)){
        console.log(resultado);
    } else {
        //memory = resultado.toString();
        memory = "";
        inputMxn.value = formatear(resultado, 2);
        sumar();
        myApp.closeModal('.picker-info');
    }


}


// Datos API local por defecto
if (!localStorage.getItem('api')){
    let apiData = {"usd": 165, "date": "2022-12-26"};

    //Set data a localDB
    localStorage.setItem('api', JSON.stringify(apiData));
}

function actualizar_API_Toque(){
    let hoy = new Date().toISOString().slice(0, 10);

    //get data
    let obj = JSON.parse(localStorage.getItem('api'));

    if (hoy != obj.date && statusCheckToque) {

        const url = 'https://tasas.eltoque.com/v1/trmi?date_from='+hoy+'%2000%3A00%3A01&date_to='+hoy+'%2023%3A59%3A01';
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MTY0MjcyOCwianRpIjoiNmQxMzhmY2QtMDdlYS00OTI0LTkxNGMtNjIyOGI2ZGY2MGM0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYzYTMzZTY4ZTNhYzlkNWM2NGI1OTFmZCIsIm5iZiI6MTY3MTY0MjcyOCwiZXhwIjoxNzAzMTc4NzI4fQ.qMYR74hiBLNkS579r_VeuDrdP9fUKGPDiBxOICPNxso"; // API Token
        const method = "GET"; // Request method, change for what's needed

        fetch(url, {method, 
                   headers: {
                "Authorization": `Bearer ${token}` // This is the important part, the auth header
            }
                   })
        .then(response => response.json())
        .then(data => {
            apiData = {"usd": data.tasas.USD, "date": data.date};

            //Set data a localDB
            localStorage.setItem('api', JSON.stringify(apiData));

            myApp.addNotification({
                message: 'Actualizada tasa de CUP',
                closeOnClick: true,
                hold: 2500
            });
        })
        .catch(err=>console.log(err));

        }
}


console.log(sjChecker.checked);
console.log(toqueChecker.checked);
toqueChecker.checked = false;