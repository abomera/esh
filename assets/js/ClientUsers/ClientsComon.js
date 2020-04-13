function AjaxControl() {

  var ClientID = getCookie('ClientID');
  var ClientData = getCookie('ClientData');
  var AccessToken = "";
  try {
    ClientData = JSON.parse(ClientData);
    AccessToken = ClientData.AccessToken;

  } catch (e) {
    console.log(e);
  }
  //console.log(ClientData.AccessToken);

  $.ajaxSetup({
    global: true,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("AccessToken", AccessToken);
      xhr.setRequestHeader("ClientID", ClientID);
    }, complete: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        deleteCookie('ClientData');
        var url = $('#rdtClientsLogin').val();
        window.location.href = url;

      }
    }
  });


  $(document).ajaxStart(function () {
    $.LoadingOverlay("show");
  });

  $(document).ajaxComplete(function (event, xhr, settings) {
    //do any thing here
    $.LoadingOverlay("hide");
  });

  $(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
  });

}

$(document).ready(function () {
  AjaxControl();
});

function logout() {

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/Logout',
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (ClientData, textStatus, jqxhr) {
      deleteCookie('ClientData');
      var url = $('#rdtClientsLogin').val();
      window.location.href = url;

    },
    error: function (jqXhr, textStatus, errorThrown) {
      window.stop();
    }
  });
};

function GetProducts() {
  return Promise.resolve($.ajax({
    url: ApiUrl + 'api/ClientUsers/GetProducts',
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8'
  }));

}
function GetCities() {
  return Promise.resolve($.ajax({
    url: ApiUrl + 'api/ClientUsers/GetCities',
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8'
  }));

}
function GetClientUserInfoV2() {
  return Promise.resolve($.ajax({
    url: ApiUrl + 'api/ClientUsers/V2/GetClientUserInfo',
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8'
  }));

}
function GetClientUserInfo() {
  return Promise.resolve($.ajax({
    url: ApiUrl + 'api/ClientUsers/GetClientUserInfo',
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8'
  }));

}


function GetHtmlCities(Cities, SelectedID) {
  var options = '';
  for (var i = 0; i < Cities.length; i++) {
    options += '<option value="' + Cities[i].CityID + '"'
    if (Cities[i].CityID === SelectedID) {
      options += ' selected="selected" '

    }
    options += '>' + Cities[i].CityName + '</option>';
  }
  return options;
}

function GetHtmlProducts(Products, SelectedID) {
  var options = '';
  for (var i = 0; i < Products.length; i++) {
    options += '<option value="' + Products[i].ProductID + '"'
    if (Products[i].ProductID === SelectedID) {
      options += ' selected="selected" '

    }
    options += '>' + Products[i].ProductName + '</option>';
  }
  return options;
}
