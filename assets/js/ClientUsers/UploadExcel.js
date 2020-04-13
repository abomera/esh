function BuildTable(Shipments) {

  var thead = '';
  thead += '<thead>';
  thead += '<tr>';
  thead += '<th>Error Type</th>';
  thead += '<th>AWB</th>';
  thead += '<th>Name</th>';
  thead += '<th>Addr1</th>';
  thead += '<th>Addr2</th>';
  thead += '<th>Phone1</th>';
  thead += '<th>Mobile</th>';
  thead += '<th>City</th>';
  thead += '<th>Contents</th>';
  thead += '<th>Weight</th>';
  thead += '<th>Pieces</th>';
  thead += '<th>Special Instructions</th>';
  thead += '<th>Ref</th>';
  thead += '<th>Contact Person</th>';
  thead += '<th>COD</th>';
  thead += '<th>Data1</th>';
  thead += '<th>Data2</th>';
  thead += '<th>Data3</th>';
  thead += '<th>Data4</th>';
  thead += '</tr>';
  thead += '</thead>';

  var tbody = '';
  tbody += '<tbody>';
  for (var i = 0; i < Shipments.length; i++) {
    tbody += '<tr>';
    tbody += '<td>' + Shipments[i]["Error Type"] + '</td>';
    tbody += '<td>' + Shipments[i].AWB + '</td>';
    tbody += '<td>' + Shipments[i].Name + '</td>';
    tbody += '<td>' + Shipments[i].Addr1 + '</td>';
    tbody += '<td>' + Shipments[i].Addr2 + '</td>';
    tbody += '<td>' + Shipments[i].Phone1 + '</td>';
    tbody += '<td>' + Shipments[i].Mobile + '</td>';
    tbody += '<td>' + Shipments[i].City + '</td>';
    tbody += '<td>' + Shipments[i].Contents + '</td>';
    tbody += '<td>' + Shipments[i].Weight + '</td>';
    tbody += '<td>' + Shipments[i].Peices + '</td>';
    tbody += '<td>' + Shipments[i]["Special Instructions"] + '</td>';
    tbody += '<td>' + Shipments[i].Ref + '</td>';
    tbody += '<td>' + Shipments[i]["Contact Person"] + '</td>';
    tbody += '<td>' + Shipments[i].COD + '</td>';
    tbody += '<td>' + Shipments[i].Data1 + '</td>';
    tbody += '<td>' + Shipments[i].Data2 + '</td>';
    tbody += '<td>' + Shipments[i].Data3 + '</td>';
    tbody += '<td>' + Shipments[i].Data4 + '</td>';
    tbody += '</tr>';

  }
  tbody += '</tbody>';


  var tfoot = '';

  var t = thead + tbody + tfoot;
  $('#example').html(t);
  ConfigDT();

}
var ConfigDT = function () {
  var table = $('#example').DataTable(
    {
      bDestroy: true,
      responsive: true,
      ordering: true,
      dom: 'Bfrtip',
      buttons: [{
        extend: 'colvis',
        text: 'Columns'
      },
      {
        extend: 'collection',
        text: 'Export Data',
        buttons: [
          'copyHtml5',
          'excelHtml5',
          'csvHtml5'
        ]

      }
      ], 'order': [0, 'asc']
    }
  );
};

function ShowUploadModal() {
  $("#fileShipments").val("");
  $("#mdlUploadExcel").modal('show');
}
var doPrintShipments = function (data) {

  var url = $('#rdtClientsPrintShipments').val();
  url += '?x=' + JSON.stringify({ "AWBs": "", "Refs": "", "PickupNo": data.PickupNo });

  window.location.href = url;

};


$('#btnUploadExcelFile').click(function (e) {
  e.preventDefault();

  var fd = new FormData();
  var fileInput = document.getElementById('fileShipments');
  var file = fileInput.files[0];
  if (fileInput.files.length === 0) {
    swal.fire({
      title: "Error",
      html: "<h4>Please select shipments' file</h4>",
      type: "error",
      confirmButtonClass: "btn-success"
    });

    return;
  }
  //    debugger;
  fd.append('file', file);

  $.ajax({
    url: ApiUrl + 'api/ClientUsers/V2/UploadExcelFile',
    data: fd,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function (data) {
      console.log(data);

      $("#mdlUploadExcel").modal('hide');
      if (data.HasError === false) {

        Swal.fire({
          title: '<h2>Pickup NO.: <u>' + data.PickupNo + '</u></h2>',
          html: '<h4>Shipments uploaded successfully' + '<br/>'
            + 'Print shipments now?</h4>',
          type: "success",
          showCancelButton: true,
          confirmButtonClass: "btn-success",
          confirmButtonText: "Yes, print it!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.value) {
            doPrintShipments(data);
            return;
          }
          window.location.href = $('#rdtClientsIndex').val();
        });




      }
      else {
        swal.fire({
          title: "<h2>Error</h2>",
          html: "<h4>" + data.ErrorMsg + "</h4>",
          type: "error",
          confirmButtonClass: "btn-success",
        }).then((result) => {
          BuildTable(data.UploadExcelData);
          return;
        });
      }
    }
  });

});