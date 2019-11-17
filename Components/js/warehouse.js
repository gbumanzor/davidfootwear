var action = "";

$(document).ready(function() {
	action = $("#EditForm").attr("action");
})

$(".warehouse-table").DataTable( {
	"ajax": url_base + "Bodegas/Lista",
	"deferRender": true,
	"retrieve": true,
	"processing": true,
	"language": {

		"sProcessing":     "Procesando...",
		"sLengthMenu":     "Mostrar _MENU_ registros",
		"sZeroRecords":    "No se encontraron resultados",
		"sEmptyTable":     "Ningún dato disponible en esta tabla",
		"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
		"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
		"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
		"sInfoPostFix":    "",
		"sSearch":         "Buscar:",
		"sUrl":            "",
		"sInfoThousands":  ",",
		"sLoadingRecords": "Cargando informacion de la tabla...",
		"oPaginate": {
		"sFirst":    "Primero",
		"sLast":     "Último",
		"sNext":     "Siguiente",
		"sPrevious": "Anterior"
		},
		"oAria": {
			"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
			"sSortDescending": ": Activar para ordenar la columna de manera descendente"
		}

	}
});

$(document).on("click", ".btn-delete-warehouse", function() {
	var id = $(this).attr("warehouse");
	
	swal({
		type: 'question',
		title: 'Eliminar Bodega',
		text: 'Está seguro de eliminar la bodega seleccionada?',
		showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!'
        }).then(function(result) {
        if (result.value) {
        	window.location = url_base + "Bodegas/Eliminar/" + id;
        }
	});
});

$(document).on("click", ".btn-edit-warehouse", function() {
	var id = $(this).attr("warehouse");
	$("#EditForm").attr("action", action + id);

	$.ajax({
		url: url_base + 'Bodegas/Editar/' + id,
		method: 'GET',
		cache : false,
		contentType : false,
		processData : false,
		dataType : "json",
		success: function(response){
			$("#EditForm").attr("action", action + id.toString());
			$("#description").val(response["description"]);
			$("#code").val(response["code"]);
			if(response["employee_id"] == "0") {
				$("#employee_id").val("");
			}else {
				$("#employee_id").val(response["employee_id"]);
			}
			if(response["store_id"] == "0") {
				$("#store_id").val("");
			}else {
				$("#store_id").val(response["store_id"]);
			}
		}
	});
});