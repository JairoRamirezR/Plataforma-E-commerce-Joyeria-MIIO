var dataTable;

$(document).ready(function () {
    loadDataTable();
    // Se mantiene la recarga automática (opcional, pero útil para órdenes)
    setInterval(function () {
        dataTable.ajax.reload(null, false);
    }, 30000);
});

function loadDataTable() {
    dataTable = $('#tblData').DataTable({
        // 1. URL de la fuente de datos (API)
        ajax: {
            url: "/Orders/AdminOrder/GetAll"
        },
        // 2. Definición de Columnas
        columns: [
            { data: "id" },             // ID de la orden
            { data: "userId" },         // ID del usuario (o cliente)
            { data: "description" },    // Descripción general de la orden
            { data: "totalAmount" },    // Monto total
            { data: "date" },           // Fecha y hora
            { data: "state" },          // Estado de la orden
        ],
        // Ocultamos las columnas para usar el renderizado personalizado (tarjeta)
        columnDefs: [{
            targets: "_all",
            visible: false
        }],
        // 3. Renderizado de Fila Personalizado (Tarjeta de Orden)
        createdRow: function (row, data) {
            // Formatear la fecha
            const formattedDate = new Date(data.date).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Usamos un color/clase de estado simple (puedes personalizar las clases CSS)
            const stateClass = data.state.toLowerCase().replace(/\s/g, '-');

            $(row).html(`
                <div class="order-card">
                    <div class="order-header">
                        <h5>Orden #${data.id} - ${data.state}</h5>
                        <span class="order-status order-status-${stateClass}">${data.state}</span>
                    </div>
                    <div class="order-info">
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Usuario ID:</strong> ${data.userId}</p>
                        <p><strong>Detalle:</strong> ${data.description.substring(0, 100)}...</p>
                        <p class="order-total"><strong>Monto Total:</strong> ₡${data.totalAmount.toLocaleString('es-CR')}</p>
                    </div>
                    <div class="order-actions">
                        <a href="/Orders/AdminOrder/Details/${data.id}" class="btn btn-outline-info btn-sm me-2" title="Ver detalle completo">
                            <i class="bi bi-eye"></i> Ver
                        </a>
                        <a href="/Orders/AdminOrder/Edit/${data.id}" class="btn btn-outline-primary btn-sm me-2" title="Editar estado o detalles">
                            <i class="bi bi-pencil-square"></i> Editar
                        </a>
                        <a onClick="DeleteOrder(${data.id})" class="btn btn-outline-danger btn-sm" title="Eliminar orden permanentemente">
                            <i class="bi bi-x-circle"></i> Eliminar
                        </a>
                    </div>
                </div>
            `);
        }
    });
}

// 4. Función de Eliminación Actualizada
function DeleteOrder(_id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "La orden #" + _id + " será eliminada. ¡No podrás revertir este cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar orden!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                // URL de la función de borrado en el controlador de Órdenes
                url: "/Orders/AdminOrder/Delete/" + _id,
                type: "DELETE",
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.message);
                        dataTable.ajax.reload();
                    } else {
                        toastr.error(data.message);
                    }
                },
                error: function () {
                    toastr.error("Error conectando con el servidor");
                }
            });
        }
    });
}