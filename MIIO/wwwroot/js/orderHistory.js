var customerDataTable;
// La variable 'isAdmin' debe estar definida en la vista antes de cargar este script.

const possibleStates = [
    "Pendiente",
    "En Proceso",
    "Enviado",
    "Completado",
    "Cancelado"
];

// Function that executes when the HTML document is fully loaded.
$(document).ready(function () {
    loadCustomerDataTable();

    // 2. Configure automatic table reload every 30 seconds (aplica para todos)
    setInterval(function () {
        if (customerDataTable) {
            customerDataTable.ajax.reload(null, false);
        }
    }, 30000);
});

// Main function to initialize and configure DataTables.
function loadCustomerDataTable() {
    customerDataTable = $('#tblOrders').DataTable({
        "ajax": {
            "url": "/Orders/Order/GetAll",
            "type": "GET",
            "datatype": "json"
        },
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
            // 🛑 Columna 5: ESTADO (APLICA LÓGICA DE ROL) 🛑
            {
                "data": "state",
                "width": "15%",
                "render": function (data, type, row) {
                    // Si el usuario es administrador, muestra el dropdown
                    if (isAdmin) {
                        const orderId = row.id;
                        let selectHtml = `<select class="form-select status-dropdown" data-order-id="${orderId}">`;

                        possibleStates.forEach(state => {
                            const selected = (state === data) ? 'selected' : '';
                            const statusClass = state.toLowerCase().replace(/\s/g, '-');

                            selectHtml += `<option value="${state}" class="${statusClass}" ${selected}>${state}</option>`;
                        });
                        selectHtml += `</select>`;
                        return selectHtml;
                    }
                    // Si NO es administrador (cliente), muestra solo el texto
                    else {
                        return `<span class="order-state-text">${data}</span>`;
                    }
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
        // ... (configuraciones generales) ...
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
            // El listener SOLO se añade si es administrador
            if (isAdmin) {
                $('#tblOrders').on('change', '.status-dropdown', function () {
                    const orderId = $(this).data('order-id');
                    const newStatus = $(this).val();

                    // Llamamos al manejador de SweetAlert
                    handleStatusChange(orderId, newStatus, this);
                });
            }
        }
    });
}

// ====================================================================
// FUNCIÓN PARA MANEJAR EL CAMBIO Y LA CONFIRMACIÓN (SOLO ADMIN)
// ====================================================================
// Estas funciones SOLO se necesitan si isAdmin es true. 
// Las definimos fuera de loadCustomerDataTable para evitar redefiniciones.

if (isAdmin) {
    function handleStatusChange(orderId, newStatus, dropdownElement) {
        // Almacenamos el estado actual como "previo" antes de la confirmación
        const previousStatus = $(dropdownElement).find('option:selected').text();
        $(dropdownElement).data('previous-status', previousStatus);

        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas cambiar el estado a "${newStatus}"? ¡Esta acción no es fácilmente reversible!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡actualizar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                updateOrderStatus(orderId, newStatus, dropdownElement);
            } else {
                $(dropdownElement).val(previousStatus);
            }
        });
    }

    // ====================================================================
    // FUNCIÓN PARA ACTUALIZAR EL ESTADO DEL PEDIDO EN EL BACKEND (AJAX)
    // ====================================================================

    function updateOrderStatus(orderId, newStatus, dropdownElement) {
        const previousStatus = $(dropdownElement).data('previous-status');

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
                return response.json();
            })
            .then(data => {
                $(dropdownElement).prop('disabled', false);

                if (data.success === true) {

                    $(dropdownElement).val(newStatus);
                    $(dropdownElement).data('previous-status', newStatus);

                    // Forzamos la recarga de DataTables para reflejar el cambio.
                    customerDataTable.ajax.reload(null, false);

                    Swal.fire(
                        '¡Actualizado!',
                        data.message,
                        'success'
                    );
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('Fallo en la actualización:', error.message);

                $(dropdownElement).val(previousStatus);
                $(dropdownElement).prop('disabled', false);

                Swal.fire(
                    '¡Error!',
                    error.message.includes("Error:")
                        ? error.message
                        : `❌ Error inesperado: ${error.message}`,
                    'error'
                );
            });
    }
}