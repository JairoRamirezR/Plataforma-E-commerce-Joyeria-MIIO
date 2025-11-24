var customerDataTable;
// Definition of possible states for the dropdown (adjust according to your model)
const possibleStates = [
    "Pendiente",
    "En Proceso",
    "Enviado",
    "Completado",
    "Cancelado"
];

// Function that executes when the HTML document is fully loaded.
$(document).ready(function () {
    // 1. Initialize and load the orders table.
    loadCustomerDataTable();

    // 2. Configure automatic table reload every 30 seconds
    setInterval(function () {
        if (customerDataTable) {
            // Reloads data without changing current pagination (false)
            customerDataTable.ajax.reload(null, false);
        }
    }, 30000);
});

// Main function to initialize and configure DataTables.
function loadCustomerDataTable() {
    customerDataTable = $('#tblOrders').DataTable({
        // 1. Data Source Configuration (API)
        "ajax": {
            "url": "/Orders/Order/GetAll",
            "type": "GET",
            "datatype": "json"
        },

        // 2. Column Definition and Rendering
        "columns": [
            // Column 1: Order Number (ID)
            {
                "data": "id",
                "width": "15%",
                "render": function (data) {
                    const formattedId = data.toString().padStart(4, '0');
                    return `
                        <span class="order-id" data-label="Pedido">
                            <i class="fa-solid fa-circle-info order-info-icon"></i>
                            ORD-${formattedId}
                        </span>
                    `;
                }
            },
            // Column 2: Order Description
            {
                "data": "description",
                "width": "30%",
                "render": function (data) {
                    return data.length > 60 ? data.substring(0, 60) + '...' : data;
                }
            },
            // Column 3: Total Amount
            {
                "data": "totalAmount",
                "width": "15%",
                "render": function (data) {
                    const total = parseFloat(data).toFixed(2);
                    return `<span class="order-price" data-label="Total">₡${total.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>`;
                }
            },
            // Column 4: Order Date
            {
                "data": "date",
                "width": "15%",
                "render": function (data) {
                    const date = new Date(data);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('es-CR', options);
                }
            },
            // Column 5: ORDER STATE (MODIFIED TO DROPDOWN)
            {
                "data": "state",
                "width": "15%",
                "render": function (data, type, row) {
                    const orderId = row.id;

                    // Build the dropdown menu
                    let selectHtml = `<select class="form-select status-dropdown" data-order-id="${orderId}">`;

                    possibleStates.forEach(state => {
                        const selected = (state === data) ? 'selected' : '';
                        const statusClass = state.toLowerCase().replace(/\s/g, '-');

                        selectHtml += `<option value="${state}" class="${statusClass}" ${selected}>${state}</option>`;
                    });

                    selectHtml += `</select>`;
                    return selectHtml;
                }
            },
            // Column 6: Actions (Details Link)
            {
                "data": "id",
                "width": "10%",
                "render": function (data) {
                    return `
                        <a href="/Orders/Order/Details?id=${data}" class="details-link">
                            Ver detalles <i class="fa-solid fa-angle-right"></i>
                        </a>
                    `;
                }
            }
        ],

        // 3. DataTables General Configuration
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        },
        "responsive": true,
        "searching": false,
        "order": [[3, "desc"]],
        "lengthMenu": [10, 25, 50],
        "pageLength": 10,

        // 4. Initialization complete to add Event Listener
        "initComplete": function (settings, json) {
            $('#tblOrders').on('change', '.status-dropdown', function () {
                const orderId = $(this).data('order-id');
                const newStatus = $(this).val();

                // Llamamos al manejador de SweetAlert
                handleStatusChange(orderId, newStatus, this);
            });
        }
    });
}

// ====================================================================
// FUNCIÓN PARA MANEJAR EL CAMBIO Y LA CONFIRMACIÓN CON SWEETALERT
// ====================================================================

function handleStatusChange(orderId, newStatus, dropdownElement) {
    // Almacenamos el estado actual como "previo" antes de la confirmación
    const previousStatus = $(dropdownElement).find('option:selected').text();
    $(dropdownElement).data('previous-status', previousStatus);

    Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas cambiar el estado a "${newStatus}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡actualizar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, procedemos con la actualización
            updateOrderStatus(orderId, newStatus, dropdownElement);
        } else {
            // Si el usuario cancela, revertimos el dropdown visualmente
            $(dropdownElement).val(previousStatus);
        }
    });
}


// ====================================================================
// FUNCIÓN PARA ACTUALIZAR EL ESTADO DEL PEDIDO EN EL BACKEND (AJAX)
// ====================================================================

function updateOrderStatus(orderId, newStatus, dropdownElement) {
    // Guardamos el estado previo para el caso de error en el catch
    const previousStatus = $(dropdownElement).data('previous-status');

    // Disable dropdown while processing
    $(dropdownElement).prop('disabled', true);

    // API Call
    fetch('/Orders/Order/UpdateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id: orderId,
            NewStatus: newStatus
        })
    })
        .then(response => {
            // Siempre intentamos parsear la respuesta como JSON
            return response.json();
        })
        .then(data => {
            $(dropdownElement).prop('disabled', false);

            if (data.success === true) {

                // 1. Aseguramos que el valor del dropdown sea el nuevo estado.
                $(dropdownElement).val(newStatus);

                // 2. ACTUALIZAMOS el estado previo, para que si hay un cambio posterior,
                $(dropdownElement).data('previous-status', newStatus);

                // 3. 🎯 CORRECCIÓN: Forzamos la recarga de DataTables para reflejar el cambio.
                customerDataTable.ajax.reload(null, false);

                // Éxito: Usamos el modal de éxito de SweetAlert
                Swal.fire(
                    '¡Actualizado!',
                    data.message,
                    'success'
                );
            } else {
                // Error de negocio
                throw new Error(data.message);
            }
        })
        .catch(error => {
            // Error de red, error de parseo JSON o error de negocio
            console.error('Fallo en la actualización:', error.message);

            // Revertir y habilitar el dropdown
            $(dropdownElement).val(previousStatus);
            $(dropdownElement).prop('disabled', false);

            // Mostrar el error usando SweetAlert
            Swal.fire(
                '¡Error!',
                error.message.includes("Error:")
                    ? error.message
                    : `❌ Error inesperado: ${error.message}`,
                'error'
            );
        });
}