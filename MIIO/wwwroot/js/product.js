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
            url: "/Products/AdminProduct/GetAll"
        },
        columns: [
            { data: "name" },
            { data: "description" },
            { data: "category" },
            { data: "material" },
            { data: "price" },
            {
                data: "offer",
                render: function (data) {
                    return data ? "Sí" : "No";
                }
            },
            { data: "image" },
            { data: "id" }
        ],
        columnDefs: [{
            targets: "_all",
            visible: false
        }],
        createdRow: function (row, data) {
            $(row).html(`
                <div class="product-card">
                    <img src="${data.image}" alt="${data.name}" />
                    <div class="product-info">
                        <h5>${data.name}</h5>
                        <p>${data.description}</p>
                        <p><strong>Categoría:</strong> ${data.category}</p>
                        <p><strong>Material:</strong> ${data.material}</p>
                        <p class="product-price">₡${data.price}</p>
                        ${data.offer ? '<p class="product-offer">¡En oferta!</p>' : ''}
                    </div>
                    <div>
                        <a href="/Products/AdminProduct/Edit/${data.id}" class="btn btn-outline-primary btn-sm me-2">
                            <i class="bi bi-pencil-square"></i> Editar
                        </a>
                        <a onClick="Delete(${data.id})" class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-x-circle"></i> Eliminar
                        </a>
                    </div>
                </div>
            `);
        }
    });
}


function Delete(_id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir este cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Products/AdminProduct/Delete/" + _id,
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
