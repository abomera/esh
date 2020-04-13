$(document).ready(function () {

    if (IsNullOrEmpty(ClientData.AccessToken)) {
        window.location.href = "/mpsonline/Clients/Login";
    }


    $('.selectpicker').selectpicker();

    $("#UserName").html("Welcome " + ClientData.Username);

});

$("#Search").on('click', function () {

    refNo = $("#refNo").val();
    if (refNo === "") {
        $("#errMsgSrc").html("");
        $("#errMsgSrc").html("<span class='text-danger'>Please Enter Shipment No</span>");
        return;
    }


    return $.ajax({
        url: GetShipmentDetails + refNo,
        datatype: 'json',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (result, textStatus, jqxhr) {
            $("#errMsgSrc").html("");
            // shipment Info
            $("#shpmntNo").html(result.ShipmentInfo[0].AWB);
            $("#Subject").val(result.ShipmentInfo[0].AWB);
            $("#IDNO").html(result.ShipmentInfo[0].IDNO);
            $("#Consimage").html(result.ShipmentInfo[0].ConsigneeName);
            $("#Contents").html(result.ShipmentInfo[0].Contents);
            $("#Contents").html(result.ShipmentInfo[0].Contents);
            $("#FromCity").html(result.ShipmentInfo[0].FromCity);
            $("#ToCity").html(result.ShipmentInfo[0].ToCity);
            $("#Product").html(result.ShipmentInfo[0].Product);
            $("#Recipient").html(result.ShipmentInfo[0].Recipient);
            $("#RecipientName").html(result.ShipmentInfo[0].RecipientName);
            $("#Weight").html(result.ShipmentInfo[0].Weight);
            $("#pckDate").html(new Date(result.ShipmentInfo[0].PickupDate).toLocaleDateString());
            $("#Product").html(result.ShipmentInfo[0].Product);
            $("#Address").html(result.ShipmentInfo[0].Address);
            $("#Reason").html(result.ShipmentInfo[0].Reason);
            $("#Phoness").html(result.ShipmentInfo[0].Phone1 + " - " + result.ShipmentInfo[0].Phone2 + " - " + result.ShipmentInfo[0].Phone3);
            $("#Data1").html(result.ShipmentInfo[0].Data1);
            $("#Data2").html(result.ShipmentInfo[0].Data2);
            $("#Data3").html(result.ShipmentInfo[0].Data3);
            $("#Data4").html(result.ShipmentInfo[0].Data4);


            //complaint Table
            try
            {
              if ($.fn.DataTable.isDataTable('#complainTble')) {
                    $('#complainTble').DataTable().destroy();
                }
            $('#complainTble tbody').empty();                
            }
            catch(err)
{

}


            var tbodyElComp = $('#complainTble tbody');
            tbodyElComp.html('');
            $.each(result.Complaints, function (k, v) {
                clsd = "";
                if (v.IsClosed === true) {
                    clsd = "<span class='alert alert-success p-1'>Closed</span>";
                }
                if (v.IsClosed === false) {
                    clsd = "<span class='alert alert-danger p-1'>Open</span>";
                }
                tbodyElComp.append('\
                        <tr><td></td>\
                            <td class="hidden-sm-up">' + v.ComplaintID + '</td>\
                             <td>' + v.ComplaintType + '</td>\
                            <td>' + v.ComplaintStatus + '</td>\
                            <td>' + v.ComplaintSubject + '</td>\
                            <td>' + v.CompplaintDetails + '</td>\
                            <td>' + v.LastAction + '</td>\
                            <td>' + clsd + '</td>\
                            <td>' + new Date(v.ComplaintDate).toLocaleDateString() + '</td>\
                            <td>' + v.ClientUser + '</td>\
                            <td>' + v.Ref + '</td>\
                             <td class="hidden-sm-up">' + JSON.stringify(v.Actions) + '</td>\
                         </tr>\
                    ');
            });
            var tableC;
            try {
                tableC = $('#complainTble').DataTable({
                    "columnDefs": [{
                        "targets": 0,
                        "data": null,
                        "orderable": false,
                        "className": 'details-control',
                        "defaultContent": ''
                    }],
                    "order": [
                        [1, 'asc']
                    ]
                });
            } catch(err) {

            }

            try {
                $('#complainTble tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = tableC.row(tr);

                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        // Open this row
                        row.child(format(row.data())).show();
                        tr.addClass('shown');
                    }
                });

            } catch(err) {

            }

            try {
                // Customer Support Table
                // if ($.fn.DataTable.isDataTable('#SupportTble')) {
                //     $('#SupportTble').DataTable().destroy();
                // }
                $('#SupportTble tbody').empty();
                var tbodyElSuprt = $('#SupportTble tbody');
                tbodyElSuprt.html('');
                $.each(result.Calls, function (k, v) {
                    tbodyElSuprt.append('\
                        <tr>\
                            <td>' + v.CallType + '</td>\
                            <td>' + v.CallStatus + '</td>\
                            <td>' + new Date(v.CallDate).toLocaleDateString() + '</td>\
                            <td>' + v.CallResult + '</td>\
                            <td>' + v.Notes1 + '</td>\
                            <td>' + v.Notes2 + '</td>\
                            <td>' + v.Notes3 + '</td>\
                          </tr>\
                    ');
                });
                $('#SupportTble').dataTable();

            } catch(err) {

            }

            try {
                // if ($.fn.DataTable.isDataTable('#trackingTable')) {
                //     $('#trackingTable').DataTable().destroy();
                // }
                $('#trackingTable tbody').empty();


                var tbodyElTrack = $('#trackingTable tbody');
                tbodyElTrack.html('');
                $.each(result.Tracking, function (k, v) {
                    tbodyElTrack.append('\
                        <tr>\
                            <td>' + new Date(v.AuditDate).toLocaleDateString() + '</td>\
                            <td>' + v.StatusName + '</td>\
                            <td>' + v.Reason + '</td>\
                            <td>' + v.Recipient + '</td>\
                            <td>' + v.Column1 + '</td>\
                          </tr>\
                    ');
                });
                $('#trackingTable').dataTable();

            } catch(err) {

            }

            // Tracking table



        }
    });
});

function format(d) {
    comp = JSON.parse(d[11]);
    // `d` is the original data object for the row



    trs = ''; //just a variable to construct
    $.each(comp, function (k, v) {
        clsd = "";
        if (v.IsClosed === true) {
            clsd = "<span class='alert alert-success p-1'>Closed</span>";
        }
        if (v.IsClosed === false) {
            clsd = "<span class='alert alert-danger p-1'>Open</span>";
        }
        trs += '<tr>\
                 <td>' + v.Username + '</td>\
                 <td>' + v.ActionDate + '</td>\
                 <td>' + v.Status + '</td>\
                 <td>' + clsd + '</td>\
                 <td>' + v.Notes + '</td>\
            </tr>'
    });

    return '<table cellpadding="5" class="table-bordered" cellspacing="0" border="0" style="padding-left:50px;"><thead><tr><th>UserName</th><th>Action Date</th><th>Status</th><th>Is Closed</th><th>Notes</th></tr></thead>' +
        trs +
        '</table>';
    //console.log(trs);
}


$("#AddComplain").on('click', function () {
  AWB = $("#Subject").val();
    TypeID = $("#Type").find(":selected").val();
    console.log('TypeID:',TypeID);
    Subject = $("#Subject").val();
    compaintMSG = $("#compaintMSG").val();
    complainType = $("#ComType").find(":selected").val();
    if (AWB == "") {
        $("#errMsgSrc").html("");
        $("#errMsgSrc").html("<span class='text-danger'>Please Enter Shipment No.</span>");
        return;
    } else {
        $("#errMsgSrc").html("");

    }

    // if (Subject == "") {
    //     $("#errMsgSub").html("");
    //     $("#errMsgSub").html("<span class='text-danger'>Please Enter Subject.</span>");
    //     return;
    // } else {
    //     $("#errMsgSub").html("");
    // }

    if (compaintMSG == "") {
        $("#errMsgCom").html("");
        $("#errMsgCom").html("<span class='text-danger'>Please Enter Complaint</span>");
        return;
    } else {
        $("#errMsgCom").html("");

    }

    return $.ajax({
        url: SubmitContactUS,
        datatype: 'json',
        type: 'POST',
        data: JSON.stringify({
            Message: compaintMSG,
            AWB: AWB,
            TypeID: TypeID,
            Subject: Subject
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, textStatus, jqxhr) {
            if (result === true) {
                $("#compaintMSG").val("");
                $.toast({
                    text: 'Compaint Added Successfully',
                    position: 'bottom-center',
                    loaderBg: '#bf2026',
                    icon: 'success',
                    hideAfter: 3000,
                    stack: 6
                });
            }
        }
    });

});



$("#Type").on('change', function () {
    select = $("#Type").val();
    console.log(select);
    if (select == 2) {
        $(".comTypeS").html("");
        $(".comTypeS").append('<option value="1">Change delivery time</option><option value="2">Change delivery location</option><option value="3">Change consignee data</option><option value="4">Other</option>');
    } else if (select == 3) {
        $(".comTypeS").html("");
        $(".comTypeS").append('<option value="1">Shipment not delivered</option><option value="2">Delivery delay</option><option value="3">Mistreatment</option><option value="4">Other</option>');

    } else {
        $(".comTypeS").html("");
        $(".comTypeS").append('<option value="4"> Other</option>');
    }

});
