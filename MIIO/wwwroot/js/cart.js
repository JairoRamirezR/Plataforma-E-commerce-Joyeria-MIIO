function removeFromCart(id) {
    $.ajax({
        url: `/Orders/Cart/Remove/${id}`,
        type: "POST",
        success: function (data) {
            if (data.success) {
                toastr.success(data.message);

                location.reload();
            } else {
                toastr.error(data.message);
            }
        },
        error: function () {
            toastr.error("Error al eliminar del carrito");
        }
    });
}
function addToCart(productId) {

    $.ajax({
        url: `/Orders/Cart/Add/${productId}`,
        type: "POST",
        success: function (data) {
            if (data.success) {
                toastr.success("Producto agregado al carrito");
            } else {
                toastr.error("No se pudo agregar al carrito");
            }
        },
        error: function () {
            toastr.error("Error al conectar con el servidor");
        }
    });
}
function processPayment() {
    $.ajax({
        url: "/Orders/Order/Create",
        type: "POST",
        success: function (res) {
            if (res.success) {
                toastr.success("Orden generada correctamente");

                setTimeout(() => {
                    window.location.href = "/Orders/Order/Details/" + res.orderId;
                }, 1000);

            } else {
                toastr.error("No se pudo completar el pago");
            }
        },
        error: function () {
            toastr.error("Error al procesar el pago/ Asegurese que ya inició sesión");
        }
    });
}