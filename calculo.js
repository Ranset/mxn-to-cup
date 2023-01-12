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

    changeCheckToque()

    changeCheckSJ()

    actualizar();

    sumar();
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
    // Datos apiToque local por defecto
    if (!localStorage.getItem('apiToque')){
        let apiData = {"usd": 165, "date": "2022-12-26"};

        //Set data a localDB
        localStorage.setItem('apiToque', JSON.stringify(apiData));
    }

    // Datos apiSJ local por defecto
    if (!localStorage.getItem('apiSJ')){
        let apiData = {"mxn":19.8,"date":"10/01/2023 12:15"};

        //Set data a localDB
        localStorage.setItem('apiSJ', JSON.stringify(apiData));
    }
    

    // Dats defecto memoria configuracu'on
    if (!localStorage.getItem('customCup')) {
        localStorage.setItem('customCup', 120);
    }

    if (!localStorage.getItem('customUsd')) {
        localStorage.setItem('customUsd', 19.80);
    }

    //Datos de configuraci'on    
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

    document.getElementById('inUsdCup').disabled = obj.eltoque;
    document.getElementById('inUsdMxn').disabled = obj.sanjorge;
    

    MostrarConfig();

    // Actualizando los campos en la ficha de Configuración (back)
    document.getElementById('inUsdMxn').value = obj.dolar;
    document.getElementById('inTasa').value = obj.tasa;
    document.getElementById('inUsdCup').value = obj.usdToCup;
    toqueChecker.checked = statusCheckToque;
    sjChecker.checked = statusCheckSJ;

    actualizar_API_SJ()

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




function actualizar_API_Toque(){
    let hoy = new Date().toLocaleString('en-CA', {
        timeZone: 'America/Havana',
      }).slice(0, 10);

    //get data
    let obj = JSON.parse(localStorage.getItem('apiToque'));

    if (hoy != obj.date && statusCheckToque) {

        console.log("Fecha para el toque: " + hoy)

        const url = 'https://tasas.eltoque.com/v1/trmi?date_from='+hoy+'%2000%3A00%3A01&date_to='+hoy+'%2023%3A59%3A01';
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3MTY0MjcyOCwianRpIjoiNmQxMzhmY2QtMDdlYS00OTI0LTkxNGMtNjIyOGI2ZGY2MGM0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYzYTMzZTY4ZTNhYzlkNWM2NGI1OTFmZCIsIm5iZiI6MTY3MTY0MjcyOCwiZXhwIjoxNzAzMTc4NzI4fQ.qMYR74hiBLNkS579r_VeuDrdP9fUKGPDiBxOICPNxso"; // apiToque Token
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
            localStorage.setItem('apiToque', JSON.stringify(apiData));
            usdToCup = Number(data.tasas.USD);

            document.getElementById('inUsdCup').value = data.tasas.USD;


            myApp.addNotification({
                message: 'Actualizada tasa de CUP',
                closeOnClick: true,
                hold: 2500
            });
        })
        .catch(err=>console.log(err));
        }
}


function actualizar_API_SJ(){
    let hoy = new Date().toLocaleDateString("en-GB");

    //get data
    let obj = JSON.parse(localStorage.getItem('apiSJ'));

    if (hoy != obj.date.slice(0, 10) && statusCheckSJ) {

        console.log("Fecha para SJ: " + hoy)

        const url = 'https://sj-api.deta.dev/';
        const token = "";
        const method = "GET"; // Request method, change for what's needed

        fetch(url, {method, 
                   headers: {
                "Authorization": `Bearer ${token}` // This is the important part, the auth header
            }
                   })
        .then(response => response.json())
        .then(data => {
            apiData = {"mxn": data.mxn, "date": data.date};

            //Set data a localDB
            localStorage.setItem('apiSJ', JSON.stringify(apiData));
            dolar = Number(data.mxn);

            //Actalizar tasa del USD/MXN en el front
            document.getElementById('infoCambio').innerHTML = "$" + dolar.toFixed(2);

            document.getElementById('inUsdMxn').value = data.mxn;


            myApp.addNotification({
                message: 'Actualizada tasa de MXN/USD',
                closeOnClick: true,
                hold: 2500
            });
        })
        .catch(err=>console.log(err));
        }
}

// Evento click del checbox de El Toque en Configuraci'on
function changeCheckToque() {
    let obj = JSON.parse(localStorage.getItem('apiToque'));

    if (document.getElementById('inUsdCup').disabled) {
        document.getElementById('inUsdCup').value = localStorage.getItem('customCup');
        document.getElementById('inUsdCup').disabled = false;
    } else {
        localStorage.setItem('customCup', document.getElementById('inUsdCup').value);
        document.getElementById('inUsdCup').value = obj.usd;
        document.getElementById('inUsdCup').disabled = true;
    }
}

// Evento click del checbox de San Jorge en Configuraci'on
function changeCheckSJ() {
    let obj = JSON.parse(localStorage.getItem('apiSJ'));

    if (document.getElementById('inUsdMxn').disabled) {
        document.getElementById('inUsdMxn').value = localStorage.getItem('customUsd');
        document.getElementById('inUsdMxn').disabled = false;
    } else {
        localStorage.setItem('customUsd', document.getElementById('inUsdMxn').value);
        document.getElementById('inUsdMxn').value = obj.mxn;
        document.getElementById('inUsdMxn').disabled = true;
    }
}