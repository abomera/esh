var SelectedShipments = [];
var Courier = {};
var AllShipments = [];

var ParamData;
var HasParamData = false;


$(document).ready(function () {
  GetParamData();
  ApplyParamData();
});

var GetParamData = function () {
  try {
    ParamData = getUrlParameter('x');
    ParamData = JSON.parse(ParamData);
    HasParamData = true;
  } catch (e) {
    HasParamData = false;
    console.log(e);
  }
};

var ApplyParamData = function () {
  try {
    if (!HasParamData) {
      return;
    }

    $('#txtPickupNo').val(ParamData.PickupNo);
    $('#txtAWBs').val(ParamData.AWBs);
    $('#txtREFs').val(ParamData.REFs);
    GetShimpmentInfos();

  } catch (e) {
    console.log(e);
  }

};

var GetShimpmentInfos = function () {
  date = $("#rngPickupDate").find('span').html();

  var spl = date.split(" - ");

  from = spl[0];
  to = spl[1];  

  console.log( from, to);

  var Inquiry = {
    AWBs: $('#txtAWBs').val(),
    REFs: $('#txtREFs').val(),
    PickupNo: $('#txtPickupNo').val(),
    FromDate: from,
    ToDate: to
  };


  var uri = ApiUrl + 'api/ClientUsers/GetShipments';

  return $.ajax({
    url: uri,
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(Inquiry),
    success: function (ShimpmentInfos, textStatus, jqxhr) {
      Courier = ShimpmentInfos.Courier;
      AllShipments = ShimpmentInfos.Shipments;
      BuildTable(AllShipments);
    },
    error: function (jqXhr, textStatus, errorThrown) {

    }
  });

};

function BuildTable(Shipments) {

  var thead = '';
  thead += '<thead>';
  thead += '<tr>';
  thead += '<th> <input type="checkbox" id="select-all"/></th>';
  thead += '<th>Commands</th>';
  thead += '<th>Shipment No</th>';
  thead += '<th>From City</th>';
  thead += '<th>Consignee</th>';
  thead += '<th>Address</th>';
  thead += '<th>City</th>';
  thead += '<th>Phone</th>';
  thead += '<th>Mobile</th>';
  thead += '<th>Wieght</th>';
  thead += '<th>Contents</th>';
  thead += '<th>Pieces</th>';
  thead += '<th>Status</th>';
  thead += '<th>Reason</th>';
  thead += '<th>COD</th>';
  thead += '<th>Paid</th>';
  thead += '<th>AWB vs AWB</th>';
  thead += '<th>Receiving Date</th>';
  thead += '<th>Notes</th>';
  thead += '<th>Update Notes</th>';
  thead += '<th>Audit Time</th>';
  thead += '</tr>';
  thead += '</thead>';

  var tbody = '';
  tbody += '<tbody>';
  for (var i = 0; i < Shipments.length; i++) {
    tbody += '<tr>';
    tbody += '<td><input type="checkbox" class="select-checkbox" Serial="' + Shipments[i].Serial + '"/></td>';
    tbody += '<td></td>';//Commands
    tbody += '<td>' + Shipments[i].AWB + '</td>';
    tbody += '<td>' + Shipments[i].FromCityName + '</td>';
    tbody += '<td>' + Shipments[i].ToConsigneeName + '</td>';
    tbody += '<td>' + Shipments[i].ToAddress + '</td>';
    tbody += '<td>' + Shipments[i].ToCityName + '</td>';
    tbody += '<td>' + Shipments[i].ToPhone + '</td>';
    tbody += '<td>' + Shipments[i].ToMobile + '</td>';
    tbody += '<td>' + Shipments[i].Weight + '</td>';
    tbody += '<td>' + Shipments[i].Contents + '</td>';
    tbody += '<td>' + Shipments[i].Pieces + '</td>';
    tbody += '<td>' + Shipments[i].StatusNameE + '</td>';
    tbody += '<td>' + Shipments[i].ReasonNameE + '</td>';
    tbody += '<td>' + Shipments[i].COD + '</td>';
    tbody += '<td>' + Shipments[i].PaidToCust + '</td>';
    tbody += '<td>' + Shipments[i].AWBvsAWB + '</td>';
    tbody += '<td>' + Shipments[i].ReceivingDate + '</td>';
    tbody += '<td>' + Shipments[i].SpecialInstuctions + '</td>';
    tbody += '<td>' + Shipments[i].UpdateNotes + '</td>';
    tbody += '<td>' + Shipments[i].AuditDate + '</td>';
    //tbody += '<td>' 
    //  + '</td>';
    tbody += '</tr>';

  }
  tbody += '</tbody>';


  var tfoot = '';
  //tfoot += '<tfoot>';
  //tfoot += '<tr>';
  //tfoot += '<th></th>';
  //tfoot += '<th>Shipment No</th>';
  //tfoot += '<th>From City</th>';
  //tfoot += '<th>Consignee</th>';
  //tfoot += '<th>Address</th>';
  //tfoot += '<th>City</th>';
  //tfoot += '<th>Phone</th>';
  //tfoot += '<th>Mobile</th>';
  //tfoot += '<th>Wieght</th>';
  //tfoot += '<th>Contents</th>';
  //tfoot += '<th>Pieces</th>';
  //tfoot += '<th>Notes</th>';
  //tfoot += '</tr>';
  //tfoot += '</tfoot>';

  var t = thead + tbody + tfoot;
  $('#example').html(t);
  ConfigDT();
  UpdateSelectedShipments();

}
var getHistory = function (AWB) {
  var uri = ApiUrl + '/api/Free/V2/GetShipmentHistory/' + AWB;

  return $.ajax({
    url: uri,
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (Shimpment, textStatus, jqxhr) {
      console.log(Shimpment);
      BuildHistoryTable(Shimpment.HistoryData);
      $('#exampleModalLabel').text('AWB: ' + Shimpment.AWB);
      $('#exampleModal').modal('show');

    },
    error: function (jqXhr, textStatus, errorThrown) {

    }
  });
};

function BuildHistoryTable(HistoryData) {

  var thead = '';
  thead += '<thead>';
  thead += '<tr>';
  thead += '<th>Serial</th>';
  thead += '<th>Action Date</th>';
  thead += '<th>Status</th>';
  thead += '<th>Reason</th>';
  thead += '</tr>';
  thead += '</thead>';

  var tbody = '';
  tbody += '<tbody>';
  for (var i = 0; i < HistoryData.length; i++) {
    var s = i + 1;
    tbody += '<tr>';
    tbody += '<td>' + s + '</td>';
    tbody += '<td>' + HistoryData[i].ActionDate + '</td>';
    tbody += '<td>' + HistoryData[i].Status + '</td>';
    tbody += '<td>' + HistoryData[i].Reason + '</td>';
    tbody += '</tr>';

  }
  tbody += '</tbody>';


  var tfoot = '';

  var t = thead + tbody + tfoot;
  $('#example1').html(t);
  ConfigHistoryDT();

}
var ConfigHistoryDT = function () {
  var displayTable = $('#example1').DataTable(
    {
      bDestroy: true,
      'columnDefs': [{
        'orderable': false,
        targets: 0
      }],
      responsive: true,
      ordering: true,
      dom: 'Bfrtip'
    }
  );

};

var GetPOD = function (AWB) {

  var uri = ApiUrl + '/api/ClientUsers/V2/GetShipmentPOD/' + AWB;

  return $.ajax({
    url: uri,
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (ShipmentPOD, textStatus, jqxhr) {
      console.log(ShipmentPOD);
      if (ShipmentPOD.Status === 'OK') {
        $("#imgPOD").attr("src", ShipmentPOD.POD_URL);

        $('#ModalPODLabel').text('AWB: ' + ShipmentPOD.AWB);
        $('#ModalPOD').modal('show');
      }
      else {
        //alert(ShipmentPOD.Status);
        swal.fire({
          title: "AWB: " + ShipmentPOD.AWB,
          html: "<h4>" + ShipmentPOD.Status + "</h4>",
          type: "error",
          confirmButtonClass: "btn-success"
        });

        return;

      }

    },
    error: function (jqXhr, textStatus, errorThrown) {

    }
  });

};

var ConfigDT = function () {
  var table = $('#example').DataTable(
    {
      bDestroy: true,
      'columnDefs': [
        {
          'orderable': false,
          targets: 0
        },
        {
          "targets": 1,
          "data": null,
          "defaultContent":
            '<button class="btn-history" type="button">History</button>'
            + '<button class="btn-POD"  type="button">POD</button>'
        }
      ],
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
      ], 'order': [1, 'asc']
    }
  );

  SelectedShipments = [];

  // Handle click on "Select all" control
  $('#select-all').on('click', function () {

    // Check/uncheck all checkboxes in the table
    var rows = table.rows({ 'search': 'applied' }).nodes();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    UpdateSelectedShipments();

  });

  // Handle click on checkbox to set state of "Select all" control
  $('#example tbody').on('change', 'input[type="checkbox"]', function () {

    UpdateSelectedShipments();

    // If checkbox is not checked
    if (!this.checked) {
      var el = $('#select-all').get(0);
      // If "Select all" control is checked and has 'indeterminate' property
      if (el && el.checked && ('indeterminate' in el)) {
        // Set visual state of "Select all" control 
        // as 'indeterminate'
        el.indeterminate = true;
      }
    }
  });

  // Handle click on "History" button
  $('#example tbody').on('click', '.btn-history', function () {
    var data = table.rows($(this).parents('tr')).data();
    //var tr = $(this).closest('tr');
    //var row = table.row(tr);
    getHistory(data[0][2]);
    //console.log('history', data[0][2] );
  });


  // Handle click on "POD" button
  $('#example tbody').on('click', '.btn-POD', function () {
    var data = table.rows($(this).parents('tr')).data();
    GetPOD(data[0][2]);
  });

  //$('#example tbody').on('click', 'button', function () {
  //  console.log($(this).closest("tr"));
  //  console.log(table.row($(this).parents('tr')));
  //});

};

var PrintShipments = function () {
  if (SelectedShipments.length === 0) {
    return;
  }

  var Shipments = [];
  for (var i = 0; i < AllShipments.length; i++) {
    for (var s = 0; s < SelectedShipments.length; s++) {
      if (AllShipments[i].Serial === SelectedShipments[s].Serial) {
        Shipments.push(AllShipments[i]);
      }
    }
  }
  PrintReport(Shipments);

}


var PrintReport = function (Shipments) {
  var ds = { Courier: Courier, Shipments: Shipments };
  // Create a new report instance
  var report = new Stimulsoft.Report.StiReport();
  // Load report from url
  report.loadFile("../assets/reports/AWB.mrt");

  //my json object
  var sShipments = JSON.stringify(ds);

  // Create new DataSet object
  var dataSet = new Stimulsoft.System.Data.DataSet("Shimpments");
  // Load JSON Object
  dataSet.readJson(sShipments)
  // Load JSON data file from specified URL to the DataSet object
  //dataSet.readJsonFile("../assets/json/GetShipments.json");

  // Remove all connections from the report template
  report.dictionary.databases.clear();
  // Register DataSet object
  report.regData("Shimpments", "Shimpments", dataSet);


  // Render report
  report.render();
  // Print report using web browser
  report.print();
}

var UpdateSelectedShipments = function () {
  var table = $('#example').DataTable();
  var rows = table.rows({ 'search': 'applied' }).nodes();
  SelectedShipments = [];
  $('input[type="checkbox"]', rows).each(function () {
    if (this.checked) { SelectedShipments.push({ Serial: parseInt($(this).attr('Serial')) }); }
  });
  var btn = $('#btnPrint');

  if (SelectedShipments.length === 0) {
    document.getElementById('btnPrint1').style.visibility = 'hidden';
    document.getElementById('btnPrint2').style.visibility = 'hidden';
  }

  else {
    document.getElementById('btnPrint1').style.visibility = 'visible';
    document.getElementById('btnPrint2').style.visibility = 'visible';

  }

}

