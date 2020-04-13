$(document).ready(function () {
  $('[data-mask]').inputmask();
  $('.select2').select2();
  $('#PickupDate').datepicker({
    autoclose: true
    , format: 'yyyy-mm-dd'
  });

  $('#PickupForm').submit(function (e) {

    e.preventDefault();
    //Do any validations here
    SavePickup();
  })


  var prmsClientUserInfo = GetClientUserInfo();
  prmsClientUserInfo.then(function (prmsClientUserInfo) {
    var _ClientUserInfo = prmsClientUserInfo[0];
    $('#NumberOfAWBs').val(1);
    $('#PickupAddress').val(_ClientUserInfo.Address1);
    $('#Phone').val(_ClientUserInfo.ContactNo);
    $('#ContactPerson').val(_ClientUserInfo.ContactPerson);
    var prmsCities = GetCities();
    prmsCities.then(function (Cities) {
      $("#CityID").html(GetHtmlCities(Cities, _ClientUserInfo.CityID));
    });

    var prmsProduct = GetProducts();
    prmsProduct.then(function (Products) {
      $("#ProductID").html(GetHtmlProducts(Products, _ClientUserInfo.ProductID));
    });

  });


});

var SavePickup = function () {

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/SavePickup',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(
      {
        NumberOfAWBs: $('#NumberOfAWBs').val(),
        PickupAddress: $('#PickupAddress').val(),
        Phone: $('#Phone').val(),
        ContactPerson: $('#ContactPerson').val(),
        PickupDate: $('#PickupDate').val(),
        ProductID: $('#ProductID').val(),
        CityID: $('#CityID').val(),
        Notes: $('#Notes').val()
      }
      ),
    success: function (ReturnVal, textStatus, jqxhr) {
      if (ReturnVal > 0) {
        window.location.href = $('#rdtClientsIndex').val();
      }

    },
    error: function (jqXhr, textStatus, errorThrown) {
      $('#errorMsg').val(errorThrown);
      $('#errorMsg').removeClass('hidden');
      window.stop();
    }
  });
}