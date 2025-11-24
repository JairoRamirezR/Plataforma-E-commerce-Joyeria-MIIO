var dataTable;

$(document).ready(function () {
    loadDataTable();

    setInterval(function () {
        dataTable.ajax.reload(null, false);
    }, 30000);
});

function loadDataTable() {
    dataTable = $('#tblData').DataTable({

        ajax: {
            url: "/Orders/AdminOrder/GetAll"
        },

        columns: [
            { data: "id" },             
            { data: "userId" },       
            { data: "description" },    
            { data: "totalAmount" },   
            { data: "date" },           
            { data: "state" },          
        ],
        
        columnDefs: [{
            targets: "_all",
            visible: false
        }],
        
        createdRow: function (row, data) {
            
            const formattedDate = new Date(data.date).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            
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