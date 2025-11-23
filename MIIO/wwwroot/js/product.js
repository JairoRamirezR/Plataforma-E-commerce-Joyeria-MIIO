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
            "url": "/Products/AdminProduct/GetAll"
        },
        "columns": [
            { "data": "name", "width": "15%", "title": "Nombre" },
            { "data": "description", "width": "20%", "title": "Descripción" },
            { "data": "category", "width": "10%", "title": "Categoría" },
            { "data": "material", "width": "10%", "title": "Material" },
            { "data": "price", "width": "10%", "title": "Precio" },
            {
                "data": "offer",
                "width": "8%",
                "title": "Oferta",
                "render": function (data) {
                    return data ? "Sí" : "No";
                }
            },
            {
                "data": "image",
                "width": "12%",
                "title": "Imagen",
                "render": function (data) {
                    return `
                        <div class="card" style="width: 70px;">
                            <img src="${data}" class="card-img-top" alt="img"
                             style="max-width: 60px; max-height: 60px; margin: auto; padding-top: 5px;" />
                        </div>`;
                }
            },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <a href="/Products/AdminProduct/Edit/${data}" class="btn btn-primary">
                            <i class="bi bi-pencil-square"></i> Editar
                        </a>
                        <a onClick=Delete(${data}) class="btn btn-danger mx-2">
                            <i class="bi bi-x-circle"></i> Eliminar
                        </a>
                    `;
                },
                "width": "15%"
            }
        ]
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
