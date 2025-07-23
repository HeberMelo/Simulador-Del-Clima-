const API_KEY = "fe9d655e0bc4272778eaef8af1a1d640"; // Inserta tu API KEY aquí 

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscarBtn");
  const inputCiudad = document.getElementById("inputCiudad");

  buscarBtn.addEventListener("click", () => {
    const ciudad = inputCiudad.value.trim();
    if (ciudad) {
      obtenerClima(ciudad);
      obtenerPronostico(ciudad);
    }
  });

  // Clima inicial por defecto es Bogotá
  obtenerClima("Bogota");
  obtenerPronostico("Bogota");
});

async function obtenerClima(ciudad) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`);
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    const temperatura = Math.round(data.main.temp);
    const estado = data.weather[0].description;
    const icono = data.weather[0].icon;
    const precipitaciones = data.rain ? (data.rain["1h"] || 0) : 0;
    const humedad = data.main.humidity;
    const viento = Math.round(data.wind.speed * 3.6); // m/s → km/h

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleString('es-CO', { weekday: 'long', hour: 'numeric', minute: 'numeric' });

    document.getElementById("temperatura").textContent = `${temperatura}°C`;
    document.getElementById("estadoClima").textContent = estado.charAt(0).toUpperCase() + estado.slice(1);
    document.getElementById("iconoClima").src = `https://openweathermap.org/img/wn/${icono}@2x.png`;
    document.getElementById("precipitaciones").textContent = `${precipitaciones}%`;
    document.getElementById("humedad").textContent = `${humedad}%`;
    document.getElementById("viento").textContent = `${viento} km/h`;
    document.getElementById("fecha").textContent = fechaFormateada;

  } catch (error) {
    console.error("Error al obtener el clima:", error.message);
    alert("No se pudo obtener el clima. Intenta con otra ciudad.");
  }
}

async function obtenerPronostico(ciudad) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`);
    const data = await res.json();

    if (data.cod !== "200") throw new Error(data.message);

    const contenedor = document.getElementById("pronostico");
    contenedor.innerHTML = "";

    const dias = {};

    data.list.forEach((item) => {
      const fecha = new Date(item.dt_txt);
      const dia = fecha.toLocaleDateString('es-CO', { weekday: 'short' });

      if (!dias[dia]) {
        dias[dia] = {
          min: item.main.temp_min,
          max: item.main.temp_max,
          icono: item.weather[0].icon
        };
      } else {
        dias[dia].min = Math.min(dias[dia].min, item.main.temp_min);
        dias[dia].max = Math.max(dias[dia].max, item.main.temp_max);
      }
    });

    Object.entries(dias).slice(0, 7).forEach(([dia, datos]) => {
      const bloque = document.createElement("div");
      bloque.className = "bg-gray-700 p-4 rounded-lg w-20 text-center";
      bloque.innerHTML = `
        <p class="font-semibold">${dia}</p>
        <img src="https://openweathermap.org/img/wn/${datos.icono}@2x.png" class="w-10 h-10 mx-auto" alt="icono clima">
        <p>${Math.round(datos.max)}° / ${Math.round(datos.min)}°</p>
      `;
      contenedor.appendChild(bloque);
    });

  } catch (error) {
    console.error("Error al obtener el pronóstico:", error.message);
    alert("No se pudo obtener el pronóstico del clima.");
  }
}
