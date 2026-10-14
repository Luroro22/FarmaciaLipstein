// carrito.js

let cart = JSON.parse(localStorage.getItem('farmasur_cart')) || [];

// 1. Inyectar el HTML del Carrito Lateral
function inyectarCarritoHTML() {
    if (document.getElementById('cartSidebar')) return;

    const html = `
        <!-- Fondo oscuro (Overlay) -->
        <div id="cartOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-[60] opacity-0 pointer-events-none transition-opacity duration-300" onclick="toggleCart()"></div>
        
        <!-- Panel Lateral -->
        <div id="cartSidebar" class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[70] transform translate-x-full transition-transform duration-300 flex flex-col">
            
            <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                <h2 class="text-xl font-extrabold text-blue-900">Tu Pedido</h2>
                <button onclick="toggleCart()" class="text-blue-900 font-bold bg-white w-8 h-8 rounded-full shadow hover:bg-gray-100 transition">X</button>
            </div>

            <div class="flex-grow overflow-y-auto p-5">
                <ul id="cartItems" class="divide-y divide-gray-100">
                    <!-- Los items se inyectan acá -->
                </ul>
            </div>

            <div class="p-5 border-t border-gray-100 bg-white">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-bold text-gray-600">Total aproximado:</span>
                    <span class="font-extrabold text-2xl text-blue-800">$<span id="cartTotal">0</span></span>
                </div>
                
                <div class="space-y-3 mb-4">
                    <input type="text" id="clientName" placeholder="Tu Nombre y Apellido" class="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500">
                    <input type="text" id="clientAddress" placeholder="Dirección de entrega (Opcional)" class="w-full border-2 border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500">
                </div>

                <button onclick="sendToWhatsApp()" class="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Pedir por WhatsApp
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function saveCart() {
    localStorage.setItem('farmasur_cart', JSON.stringify(cart));
    updateCartUI();
}

// 3. Agregar (Con animación visual)
function addToCart(nombre, precio) {
    cart.push({ name: nombre, price: precio });
    saveCart();
    
    // Feedback visual animado en el contador
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        // Agregamos clases para que se agrande y se ponga verde
        cartCount.classList.remove('bg-blue-800');
        cartCount.classList.add('bg-green-500', 'scale-150', 'transition-all', 'duration-300');
        
        // A los 300 milisegundos lo volvemos a la normalidad
        setTimeout(() => {
            cartCount.classList.remove('bg-green-500', 'scale-150');
            cartCount.classList.add('bg-blue-800');
        }, 300);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// 5. Actualizar la interfaz (Con la cruz de eliminar)
function updateCartUI() {
    const countElement = document.getElementById('cartCount');
    if (countElement) countElement.innerText = cart.length;

    const itemsContainer = document.getElementById('cartItems');
    if (itemsContainer) {
        let total = 0;
        itemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<li class="text-center text-gray-500 py-10">Tu carrito está vacío</li>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                itemsContainer.innerHTML += `
                    <li class="py-4 flex justify-between items-center border-b border-gray-100 last:border-0">
                        <span class="text-sm font-semibold text-gray-700">${item.name}</span> 
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-blue-800">$${item.price}</span>
                            <!-- Nueva Cruz elegante para eliminar -->
                            <button onclick="removeFromCart(${index})" class="text-red-500 font-bold bg-red-50 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200">X</button>
                        </div>
                    </li>`;
            });
        }
        document.getElementById('cartTotal').innerText = total;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar) {
        sidebar.classList.toggle('translate-x-full');
        
        if (sidebar.classList.contains('translate-x-full')) {
            overlay.classList.remove('opacity-100', 'pointer-events-auto');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'auto';
        } else {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            document.body.style.overflow = 'hidden';
        }
    }
}

function sendToWhatsApp() {
    const name = document.getElementById('clientName').value;
    const address = document.getElementById('clientAddress').value;
    
    if(!name || cart.length === 0) {
        alert("Completá tu nombre y verificá que haya productos en el carrito.");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    let message = `Hola Farmacia Sur, soy ${name}. Quería hacer el siguiente pedido:\n\n`;
    
    cart.forEach(item => {
        message += `- ${item.name} ($${item.price})\n`;
    });
    message += `\n*Total aproximado: $${total}*\n`;
    
    if(address) {
        message += `\n📍 Dirección de entrega: ${address}`;
    } else {
        message += `\n🏪 Paso a retirar por el local.`;
    }

    const phone = "549291XXXXXXX"; // Número de la farmacia
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    inyectarCarritoHTML(); 
    updateCartUI();        
    
    const cartBtn = document.getElementById('cartBtn');
    if(cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }
});