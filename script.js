const url = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.rematedeaduanas.com/ol-ad-rmweb/RMInicio");

const productos = document.getElementById("Grid_Productos");

function obtenerDatos() {
    fetch(url)
        .then(res => res.text())
        .then(htmlString => procesarHTML(htmlString));
}

function procesarHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const allRows = [...doc.querySelectorAll("p table tbody tr")];
    const productosData = [];

    for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];

        const linkTag = row.querySelector('td[colspan="4"] a');
        if (linkTag && linkTag.textContent.trim() !== "") {
            const nombre = linkTag.textContent.trim();
            const infoRow = allRows[i + 1];


            const imgTag = infoRow.querySelector("img");
            const imgSrc = imgTag
                ? "https://www.rematedeaduanas.com/ol-ad-rmweb/" + imgTag.getAttribute("src")
                : "https://via.placeholder.com/120x99";


            const precioTag = infoRow.querySelector('font[color="brown"]');
            const precio = precioTag ? precioTag.textContent.trim() : "Precio no disponible";


            const tiempoTag = Array.from(infoRow.querySelectorAll("font b")).find(el =>
                el.textContent.toLowerCase().match(/(día|hora|minuto|segundo)/)
            );
            const tiempo = tiempoTag ? tiempoTag.textContent.trim() : "Sin tiempo disponible";


            const ofertaTag = Array.from(infoRow.querySelectorAll("font b")).find(el =>
                el.textContent.toLowerCase().includes("oferta")
            );
            const ofertas = ofertaTag ? ofertaTag.textContent.trim() : "0 ofertas";

            productosData.push({ nombre, imgSrc, precio, tiempo, ofertas });
        }
    }

    renderizarProductos(productosData);
}


function renderizarProductos(data) {
    productos.innerHTML = "";

    data.forEach(producto => {
        const card = document.createElement("div");
        card.className = "bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition";

        card.innerHTML = `
      <img src="${producto.imgSrc}" alt="${producto.nombre}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">${producto.nombre}</h3>
        <p class="text-gray-600 text-sm mb-1">Precio: <span class="text-blue-600 font-bold">${producto.precio}</span></p>
        <p class="text-gray-600 text-sm mb-1">Ofertas: <span class="text-green-600 font-medium">${producto.ofertas}</span></p>
        <p class="text-gray-600 text-sm">Tiempo restante: <span class="text-red-500 font-medium">${producto.tiempo}</span></p>
      </div>
    `;

        productos.appendChild(card);
    });
}


obtenerDatos();
