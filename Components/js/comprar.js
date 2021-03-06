 var product_id = 0;

$(document).ready(function() {

    $("#openModal").click(function(e) {
        e.preventDefault();
        $("#mdlAddItem").modal({
            backdrop: 'static', 
            keyboard: false
        });
    });
});

var dt_compras = $(".tbl-compras-prod").DataTable({
    "ajax" : url_base + "DataTables/ListaItemsCompra/" + $("#order_id").val(),
    "deferRender" : true,
    "bLengthChange" : false,
    "pageLength" : 5,
    "searching" : false,
    "info" : false,
    "ordering" : false,
    "retrieve": true,
    "processing": true,
    "language" : dt_spanish
});

var dt_modal = $(".dt-modal-compras").DataTable({
    "ajax" : url_base + "DataTables/ProductosCompras",
    "deferRender": true,
    "bLengthChange" : false,
    "pageLength" : 5,
    "retrieve": true,
    "ordering" : false,
    "processing": true,
    "language" : dt_spanish
});

var dt_tallas = $(".tbl-revisar-tallas").DataTable({
    "ajax" : url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val(),
    "deferRender" : true,
    "bLengthChange" : false,
    "pageLength" : 5,
    "searching" : false,
    "info" : false,
    "ordering" : false,
    "retrieve": true,
    "processing": true,
    "language" : dt_spanish
});

var de_tallas = $(".tbl-revisar-tallas-2").DataTable({
    "ajax" : url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val(),
    "deferRender" : true,
    "bLengthChange" : false,
    "pageLength" : 5,
    "searching" : false,
    "info" : false,
    "ordering" : false,
    "retrieve": true,
    "processing": true,
    "language" : dt_spanish
});

 $(document).on("click", ".btn-check", function(e) {
    e.preventDefault();
    $("#clicks").click();
    product_id = $(this).attr("product");
    dt_tallas.clear().draw();

});

$(document).on("click", ".btn-agregar-tallas", function(e) {
    e.preventDefault();
    var talla = $("#select-tallas").val();
    var cnt = $("#cantidad-talla").val();
    var fd = new FormData();
    fd.append("size", talla);
    fd.append("amount", cnt);
    fd.append("product_id", product_id);
    fd.append("order_id", $("#order_id").val());

    $.ajax({
        url : url_base + "RegistrarCompras/AgregarItem",
        method : "POST",
        data : fd,
        cache : false,
        contentType : false,
        processData : false,
        dataType : "json",
        success: function(response) {
            if(response["status"] == "success") {

                dt_tallas.ajax.url(url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val()).load()

                $("#select-tallas").val("");
                $("#cantidad-talla").val("");
            }
        }
    })
});

$(document).on("click", ".quitar-tallas", function(e) {
    e.preventDefault();

    var fd = new FormData();
    var tbl = $(this);
    var product = $(this).attr("producto");
    var size = $(this).attr("talla");
    fd.append("size", $(this).attr("talla"));
    fd.append("order_id", $("#order_id").val());
    fd.append("product_id", $(this).attr("producto"));

    $.ajax({
        url : url_base + "RegistrarCompras/RemoverTalla",
        method : "POST",
        data : fd,
        cache : false,
        contentType : false,
        processData : false,
        dataType : "json",
        success: function(response) {            
            if(response["status"] == "success") {
                product_id = product;
                dt_tallas.ajax.url(url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val()).load();
                de_tallas.ajax.url(url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val()).load();
                dt_compras.ajax.reload();
                totalizar();
            }
        }
    });
});

$(document).on("click", ".mdl-close", function(e){
    e.preventDefault();
    var order_id = $("#order_id").val();
    $.ajax({
        url: url_base + "RegistrarCompras/LimpiarItemsTemporales/" + order_id,
        cache : false,
        contentType : false,
        processData : false,
        dataType : "json",
        success: function(response) {            
            if(response["status"] == "success") {
                dt_tallas.ajax.url(url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val()).load();
                dt_modal
                    .search('')
                    .columns().search('')
                    .draw();
                $("#tab_1_link").click();
            }
        }
    }); 
});

$(document).on("click", ".btn-asignar-item", function(e) {
    e.preventDefault();
    product_id = 0;
    $(".mdl-cerrar").click();
    dt_compras.ajax.reload();
    dt_modal
        .search('')
        .columns().search('')
        .draw();
    $("#tab_1_link").click();
    totalizar();
    $.ajax({
        url : url_base + 'RegistrarCompras/Status/' + $("#order_id").val(),
        cache : false,
        contentType : false,
        processData : false,
        dataType: 'json',
        success: function(response) {
            if(response["status"] != "success") {
                swal("Error", "No se actualizo estado", "error");
            }
        }
    });
    dt_tallas.clear().draw();
});

$(document).on("click", ".btn-eliminar-item-c", function(e) {
    e.preventDefault();
    var product_id = $(this).attr("product");
    var order_id = $("#order_id").val();

    var fd = new FormData();
    fd.append("product_id", product_id);
    fd.append("order_id", order_id);

    swal({
        type: 'question',
        title: 'Eliminar item',
        text: '¿Está seguro de eliminar el Item de su compra? Esta acción no se puede deshacer.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!'
        }).then(function(result) {
        if (result.value) {
            $.ajax({
                url : base_url + "RegistrarCompras/RemoverItem",
                method: 'POST',
                data: fd,
                cache : false,
                contentType : false,
                processData : false,
                dataType : "json",
                success: function(response) {
                    if(response["status"] == "success") {
                        swal("Eliminado", "Registro eliminado con exito", "success");
                        dt_compras.ajax.reload();
                        totalizar();
                    }
                }
            });                 
        }
    });
});

function totalizar() {
    $.ajax({
        url : url_base + 'RegistrarCompras/Totalizar/' + $("#order_id").val(),
        cache : false,
        contentType : false,
        processData : false,
        dataType: 'json',
        success: function(response) {
            $(".product-amount").html(response["amount"]);
            $(".no-taxes-price").html(response["subtotal"]);
            $(".iva-amount").html(response["tax"]);
            $(".cesc-amount").html("$ 0.00");
            $(".total-amount").html(response["total"]);
        }
    });
}

$(document).on("click", ".btn-mostrar-tallas-c", function(e) {
    e.preventDefault();
    dt_compras.ajax.reload();
    totalizar();
    product_id = $(this).attr("product");
    de_tallas.ajax.url(url_base + "DataTables/DetTallas/" + product_id + "/" + $("#order_id").val()).load();
});