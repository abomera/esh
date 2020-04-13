var ParamData;
var HasParamData = false;

var GetParamData = function () {
  try {
    ParamData = getUrlParameter('x');
    ParamData = JSON.parse(ParamData);
    HasParamData = true;
  } catch (e) {
    HasParamData = false;
  }
};

var ApplyParamData = function () {
  try {
    if (!HasParamData) {
      return;
    }

    $('#FromAddress').val(ParamData.AddressOrgn);
    $('#ToAddress').val(ParamData.AddressDest);

    $('#lblDistance').text('Distance : ' + ParamData.Distance.text);
    $('#lblDuration').text('Duration : ' + ParamData.Duration.text);

  } catch (e) {
    console.log(e);
  }

};

$(document).ready(function () {

  GetParamData();

  $('[data-mask]').inputmask();
  $('.select2').select2();

  var prmsClientUserInfo = GetClientUserInfoV2();
  prmsClientUserInfo.then(function (prmsClientUserInfo) {
    var _ClientUserInfo = prmsClientUserInfo;
    $('#FromAddress').val(_ClientUserInfo.Address1);
    $('#FromPhone').val(_ClientUserInfo.ContactNo);
    $('#FromContactPerson').val(_ClientUserInfo.ContactPerson);
    var prmsCities = GetCities();
    prmsCities.then(function (Cities) {
      var CityHTML = GetHtmlCities(Cities, _ClientUserInfo.CityID);
      $("#FromCityID").html(CityHTML);
      $("#ToCityID").html(CityHTML);
    });
    var prmsProduct = GetProducts();
    prmsProduct.then(function (Products) {
      $("#ProductID").html(GetHtmlProducts(Products, _ClientUserInfo.ProductID));
    });

    $('#COD').val('0');
    $('#Weight').val('1');
    $('#Pieces').val('1');
    $('#Distance').val('0');


    ApplyParamData();



  });

  // Toolbar extra buttons
  var btnFinish = $('<button></button>').text('Finish')
    .addClass('btn btn-info disabled btn-finish')
    .on('click', function () {
      if (!$(this).hasClass('disabled')) {
        //return false;
        var elmForm = $("#myForm");
        if (elmForm) {
          elmForm.validator('validate');
          var elmErr = elmForm.find('.has-error');
          if (elmErr && elmErr.length > 0) {
            alert('Oops we still have error in the form');
            return false;
          } else {
            //alert('Great! we are ready to submit form');
            SaveShipment();
            return false;
          }
        }
      }
      else
        return false;
    });

  var btnCancel = $('<button></button>').text('Cancel')
    .addClass('btn btn-danger')
    .on('click', function () {
      $('#smartwizard').smartWizard("reset");
      $('#myForm').find("input, textarea").val("");
    });

  // Smart Wizard
  $('#smartwizard').smartWizard({
    //cycleSteps:true,
    //useURLhash:false,
    selected: 0,
    theme: 'dots',
    transitionEffect: 'fade',
    showStepURLhash: false,
    toolbarSettings: {
      toolbarPosition: 'both',
      toolbarExtraButtons: [btnFinish, btnCancel]
    },
    anchorSettings: {
      markDoneStep: true, // add done css
      markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
      removeDoneStepOnNavigateBack: true, // While navigate back done step after active step will be cleared
      enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
    }
  });

  $("#smartwizard").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
    var elmForm = $("#form-step-" + stepNumber);
    // stepDirection === 'forward' :- this condition allows to do the form validation
    // only on forward navigation, that makes easy navigation on backwards still do the validation when going next
    if (stepDirection === 'forward' && elmForm) {
      elmForm.validator('validate');
      var elmErr = elmForm.children('.has-error');
      if (elmErr && elmErr.length > 0) {
        // Form validation failed
        return false;
      }
    }
    return true;
  });

  // Initialize the beginReset event
  $("#smartwizard").on("beginReset", function (e) {
    return confirm("Do you want to clear all data?");
  });

  $("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection) {
    // Enable finish button only on last step
    if (stepNumber === 3) {
      $('.btn-finish').removeClass('disabled');
    } else {
      $('.btn-finish').addClass('disabled');
    }
  });

});

var PrintReport = function (ShimpmentInfos) {
  // Create a new report instance
  var report = new Stimulsoft.Report.StiReport();
  // Load report from url
  report.loadFile("../assets/reports/AWB.mrt");

  //my json object
  var sShipments = JSON.stringify(ShimpmentInfos);

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

var SaveShipment = function () {
  var Shipment = {
    FromCityID: $('#FromCityID').val(),
    FromAddress: $('#FromAddress').val(),
    FromPhone: $('#FromPhone').val(),
    FromContactPerson: $('#FromContactPerson').val(),
    ToCityID: $('#ToCityID').val(),
    ToConsigneeName: $('#ToConsigneeName').val(),
    ToAddress: $('#ToAddress').val(),
    ToPhone: $('#ToPhone').val(),
    ToMobile: $('#ToMobile').val(),
    ToRef: $('#ToRef').val(),
    ToContactPerson: $('#ToContactPerson').val(),
    ProductID: $('#ProductID').val(),
    COD: $('#COD').val(),
    Weight: $('#Weight').val(),
    Pieces: $('#Pieces').val(),
    Contents: $('#Contents').val(),
    SpecialInstuctions: $('#SpecialInstuctions').val(),
    Data1: $('#Data1').val(),
    Data2: $('#Data2').val(),
    Data3: $('#Data3').val(),
    Data4: $('#Data4').val(),
    FromLat: 0,
    FromLng: 0,
    ToLat: 0,
    ToLng: 0,
    Distance: 0,
    Duration: 0
  };
  console.log(Shipment, HasParamData);
  if (HasParamData === true) {
    Shipment.FromLat = ParamData.PositionOrgn.lat;
    Shipment.FromLng = ParamData.PositionOrgn.lng;
    Shipment.ToLat = ParamData.PositionDest.lat;
    Shipment.ToLng = ParamData.PositionDest.lng;
    Shipment.Distance = ParamData.Distance.value;
    Shipment.Duration = ParamData.Duration.value;
  }
  console.log(Shipment);

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/SaveShipment',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(Shipment),
    success: function (ShimpmentInfos, textStatus, jqxhr) {
      if (ShimpmentInfos[0].AWB !== "") {
        swal.fire({
          title: "<h3>Shipment saved successfully</h3>",
          html: "<h4>Shipment No. : " + ShimpmentInfos[0].AWB + "<br/>Print shipment now</h2>",
          type: "success",
          showCancelButton: true,
          confirmButtonClass: "btn-success",
          confirmButtonText: "Yes, print it!",
          cancelButtonText: "No, cancel"
        }).then((result) => {
          if (result.value) {
            PrintReport(ShimpmentInfos);
          }
          window.location.href = $('#rdtClientsNewShipment').val();
        });

      }

    },
    error: function (jqXhr, textStatus, errorThrown) {
      $('#errorMsg').val(errorThrown);
      $('#errorMsg').removeClass('hidden');
      window.stop();
    }
  });
};

