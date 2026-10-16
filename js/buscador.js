// buscador.js

function buscarEnTiempoReal() {
    const inputBuscador = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    const listaResultados = document.getElementById('searchResultsList');
    
    if (!inputBuscador || !dropdown || !listaResultados) return;

    // Convertimos a minúsculas y quitamos acentos para que "ibuprofeno" y "ibuprofénó" sean lo mismo
    const query = inputBuscador.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (query.length === 0) {
        dropdown.classList.add('hidden');
        return;
    }

    // Filtramos la base de datos buscando en nombre, marca o las ETIQUETAS
    const resultados = productosFarmacia.filter(prod => {
        const nombreStr = prod.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const marcaStr = prod.marca.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Verificamos si la query coincide con alguna etiqueta
        const coincideEtiqueta = prod.etiquetas && prod.etiquetas.some(tag => 
            tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query)
        );

        return nombreStr.includes(query) || marcaStr.includes(query) || coincideEtiqueta;
    });

    dropdown.classList.remove('hidden');
    listaResultados.innerHTML = ''; 

    // --- 1. SUGERENCIA INTELIGENTE (Autocomplete visual) ---
    // Siempre le mostramos la opción de buscar esa palabra exacta para ver el catálogo completo
    listaResultados.innerHTML += `
        <li class="bg-gray-50 border-b border-gray-100">
            <a href="categoria.html?buscar=${encodeURIComponent(query)}" class="flex items-center gap-3 p-3 hover:bg-blue-100 transition cursor-pointer text-blue-700">
                <svg class="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span class="font-semibold">Ver todos los resultados para "<span class="font-extrabold text-blue-900">${inputBuscador.value}</span>"</span>
            </a>
        </li>
    `;

    // --- 2. LISTA DE PRODUCTOS ESPECÍFICOS ---
    if (resultados.length === 0) {
        listaResultados.innerHTML += `
            <li class="p-6 text-center text-gray-500">
                <p class="font-semibold">No encontramos productos exactos.</p>
                <p class="text-sm mt-1">Intentá buscar por monodroga o marca.</p>
            </li>
        `;
    } else {
        resultados.forEach(prod => {
            const precioMostrado = prod.descuento ? 
                `<span class="text-gray-400 line-through text-xs mr-2">$${prod.precioViejo}</span><span class="text-blue-600 font-bold">$${prod.precio}</span>` : 
                `<span class="text-blue-600 font-bold">$${prod.precio}</span>`;

            listaResultados.innerHTML += `
                <li>
                    <a href="producto.html?id=${prod.id}" class="flex items-center gap-4 p-3 hover:bg-blue-50 transition cursor-pointer">
                        <div class="w-12 h-12 flex-shrink-0 bg-white rounded flex items-center justify-center p-1 border border-gray-100">
                            <img src="${prod.imagen}" alt="${prod.nombre}" class="max-w-full max-h-full object-contain">
                        </div>
                        <div class="flex-grow">
                            <span class="text-[10px] text-gray-400 font-bold uppercase">${prod.marca}</span>
                            <h4 class="font-bold text-sm text-gray-800 line-clamp-1 leading-tight">${prod.nombre}</h4>
                            <div class="mt-1">${precioMostrado}</div>
                        </div>
                    </a>
                </li>
            `;
        });
    }
}

document.addEventListener('click', (e) => {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    
    if (input && dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});