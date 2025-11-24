var customerDataTable;

// Función que se ejecuta cuando el documento HTML está completamente cargado.
$(document).ready(function () {
    // 1. Inicializa y carga la tabla de pedidos.
    loadCustomerDataTable();

    // 2. Configura la recarga automática de la tabla cada 30 segundos 
    //    para obtener el estado más reciente de los pedidos.
    setInterval(function () {
        if (customerDataTable) {
            // Recarga los datos sin cambiar la paginación actual (false)
            customerDataTable.ajax.reload(null, false);
        }
    }, 30000);
});

// Función principal para inicializar y configurar DataTables.
function loadCustomerDataTable() {
    // Inicializa DataTables, apuntando al elemento con id="tblOrders"
    customerDataTable = $('#tblOrders').DataTable({

        // 1. Configuración del Origen de Datos (API)
        "ajax": {
            // URL del controlador de pedidos para el usuario final (no el de Admin)
            "url": "/Orders/Order/GetAll",
            "type": "GET",
            "datatype": "json"
        },

        // 2. Definición y Renderización de las Columnas
        "columns": [
            // Columna 1: Número de Pedido (ID)
            {
                "data": "id",
                "width": "15%",
                "render": function (data) {
                    // Formatea el ID con relleno de ceros (ej: ORD-0001)
                    const formattedId = data.toString().padStart(4, '0');
                    return `
                        <span class="order-id" data-label="Pedido">
                            <i class="fa-solid fa-circle-info order-info-icon"></i>
                            ORD-${formattedId}
                        </span>
                    `;
                }
            },
            // Columna 2: Descripción del Pedido
            {
                "data": "description",
                "width": "30%",
                "render": function (data) {
                    // Limita la longitud para que la tabla sea legible
                    return data.length > 60 ? data.substring(0, 60) + '...' : data;
                }
            },
            // Columna 3: Monto Total
            {
                "data": "totalAmount",
                "width": "15%",
                "render": function (data) {
                    // Formato de moneda costarricense (₡) con separador de miles
                    // toFixed(2) asegura dos decimales y se reemplaza el punto por coma si es necesario
                    const total = parseFloat(data).toFixed(2);
                    return `<span class="order-price" data-label="Total">₡${total.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>`;
                }
            },
            // Columna 4: Fecha del Pedido
            {
                "data": "date",
                "width": "15%",
                "render": function (data) {
                    // Formato de fecha localizado (Día, Mes, Año)
                    const date = new Date(data);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('es-CR', options);
                }
            },
            // Columna 5: Estado del Pedido
            {
                "data": "state",
                "width": "15%",
                "render": function (data) {
                    // Crea una clase CSS a partir del estado (ej: "En Camino" -> "en-camino")
                    const statusClass = data.toLowerCase().replace(/\s/g, '-');
                    return `
                        <span class="status-tag ${statusClass}" data-label="Estado">
                            ${data}
                        </span>
                    `;
                }
            },
            // Columna 6: Acciones (Botón/Enlace a Detalles)
            {
                "data": "id",
                "width": "10%",
                "render": function (data) {
                    // Enlace a la vista de detalles del pedido
                    return `
                        <a href="/Orders/Order/Details?id=${data}" class="details-link">
                            Ver detalles <i class="fa-solid fa-angle-right"></i>
                        </a>
                    `;
                }
            }
        ],

        // 3. Configuraciones Generales de DataTables
        "language": {
            // Carga la traducción al español de la interfaz de DataTables
            "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        },
        "responsive": true, // Habilita la funcionalidad responsiva
        "searching": false, // Oculta la barra de búsqueda para esta vista
        "order": [[3, "desc"]], // Ordena por defecto por la columna de Fecha (índice 3) de forma descendente
        "lengthMenu": [10, 25, 50], // Opciones de paginación
        "pageLength": 10 // Número de filas por defecto
    });
}