console.log("JS funcionando");

// ====== RELOJ ======
function actualizarReloj() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2,"0");
    const minutos = String(ahora.getMinutes()).padStart(2,"0");
    const segundos = String(ahora.getSeconds()).padStart(2,"0");
    document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
}

// ====== FECHA ======
function actualizarFecha() {
    const ahora = new Date();
    const opciones = { weekday: "long", day: "numeric", month: "long" };
    document.getElementById("fecha").textContent = ahora.toLocaleDateString("es-AR", opciones);
}

// ====== CALENDARIO TIPO WINDOWS ======
function generarCalendarioMes() {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const año = hoy.getFullYear();

    const primerDia = new Date(año, mes, 1).getDay(); // 0 = domingo
    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    const diasSemana = ["D","L","M","M","J","V","S"];
    let tabla = "<table><tr>";

    diasSemana.forEach(d => tabla += `<th>${d}</th>`);
    tabla += "</tr><tr>";

    let diaCont = 1;
    for (let i=0; i<7; i++){
        if (i < primerDia) tabla += "<td></td>";
        else { 
            tabla += `<td class="${diaCont===hoy.getDate() ? 'hoy':''}">${diaCont}</td>`;
            diaCont++;
        }
    }
    tabla += "</tr>";

    while(diaCont <= ultimoDia){
        tabla += "<tr>";
        for(let i=0;i<7;i++){
            if(diaCont > ultimoDia){ tabla += "<td></td>"; }
            else { tabla += `<td class="${diaCont===hoy.getDate() ? 'hoy':''}">${diaCont}</td>`; }
            diaCont++;
        }
        tabla += "</tr>";
    }

    return `<div style="text-align:center; font-weight:bold; margin-bottom:5px;">
        ${hoy.toLocaleString("es-AR",{month:"long", year:"numeric"})}
    </div>` + tabla;
}

// ====== OPENWEATHER ======

const apiKey = "0b8ce0c21748a6ca1a319a99d5567827";
const ciudad = "La Plata,AR";


async function actualizarClima() {

    const climaDiv = document.getElementById("clima");

    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
        );

        const data = await res.json();


        const temperatura = Math.round(data.main.temp);
        const estado = data.weather[0].description;


        let icono = "☀️";


        if (estado.includes("lluvia") || estado.includes("tormenta")) {
            icono = "⛈️";
        }
        else if (estado.includes("nublado")) {
            icono = "☁️";
        }
        else if (estado.includes("nieve")) {
            icono = "❄️";
        }


        climaDiv.textContent =
            `${icono} ${temperatura}°C - ${estado}`;


    } catch(error) {

        console.error("Error al cargar clima:", error);

        climaDiv.textContent = "❌ Error clima";

    }

}

// ====== EVENTOS ======

document.addEventListener("DOMContentLoaded", ()=>{

    // reloj
    setInterval(actualizarReloj, 1000);
    actualizarReloj();


    // fecha
    actualizarFecha();


    // clima
    actualizarClima();
    setInterval(actualizarClima, 600000);


    // calendario desplegable

    const fechaDiv = document.getElementById("fecha");
    const calendarioDiv = document.getElementById("calendario");


    fechaDiv.addEventListener("click", ()=>{

        calendarioDiv.classList.toggle("oculto");


        if(!calendarioDiv.classList.contains("oculto")){

            calendarioDiv.innerHTML = generarCalendarioMes();

        }

    });

});