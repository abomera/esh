var GetPickupInfo = function () {
  var uri = ApiUrl + 'api/ClientUsers/PickupInquiry';

  return $.ajax({
    url: uri,
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (PickupInfo, textStatus, jqxhr) {
      BuildTable(PickupInfo);

    },
    error: function (jqXhr, textStatus, errorThrown) {

    }
  });

}
function BuildTable(PickupInfo) {

  var thead = '';
  thead += '<thead>';
  thead += '<tr>';
  thead += '<th>Pickup ID</th>';
  thead += '<th>Number Of AWBs</th>';
  thead += '<th>Pickup Address</th>';
  thead += '<th>Phone</th>';
  thead += '<th>Contact Person</th>';
  thead += '<th>Pickup Date</th>';
  thead += '<th>Status</th>';
  thead += '<th>City</th>';
  thead += '<th>Product</th>';
  thead += '<th>Actual AWBs</th>';
  thead += '<th>Notes</th>';
  thead += '</tr>';
  thead += '</thead>';

  var tbody = '';
  tbody += '<tbody>';
  for (var i = 0; i < PickupInfo.length; i++) {
    tbody += '<tr>';
    tbody += '<td>' + PickupInfo[i].PickupID + '</td>';
    tbody += '<td>' + PickupInfo[i].NumberOfAWBs + '</td>';
    tbody += '<td>' + PickupInfo[i].PickupAddress + '</td>';
    tbody += '<td>' + PickupInfo[i].Phone + '</td>';
    tbody += '<td>' + PickupInfo[i].ContactPerson + '</td>';
    tbody += '<td>' + PickupInfo[i].PickupDate + '</td>';
    tbody += '<td>' + PickupInfo[i].StatusName + '</td>';
    tbody += '<td>' + PickupInfo[i].CityName + '</td>';
    tbody += '<td>' + PickupInfo[i].ProductName + '</td>';
    tbody += '<td>' + PickupInfo[i].ActualAWBs + '</td>';
    tbody += '<td>' + PickupInfo[i].Notes + '</td>';
    tbody += '</tr>';

  }
  tbody += '</tbody>';


  var tfoot = '';
  tfoot += '<tfoot>';
  tfoot += '<tr>';
  tfoot += '<th>Pickup ID</th>';
  tfoot += '<th>Number Of AWBs</th>';
  tfoot += '<th>Pickup Address</th>';
  tfoot += '<th>Phone</th>';
  tfoot += '<th>Contact Person</th>';
  tfoot += '<th>Pickup Date</th>';
  tfoot += '<th>Status</th>';
  tfoot += '<th>City</th>';
  tfoot += '<th>Product</th>';
  tfoot += '<th>Actual AWBs</th>';
  tfoot += '<th>Notes</th>';
  tfoot += '</tr>';
  tfoot += '</tfoot>';

  var t = thead + tbody + tfoot
  $('#example1').html(t);
  $('#example1').DataTable(
    {
      responsive: true,
      ordering: true,
      dom: 'Bfrtip',
      buttons: [{
        extend: 'colvis',
        text: 'Columns'
      },
                  {
                    extend: 'collection',
                    text: 'Export',
                    buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            //'pdfHtml5',
                      //'csv',
                      //'pdf'
                    ],

                  }
      ],
    }
    );

}

$(document).ready(function () {
  GetPickupInfo();
});
