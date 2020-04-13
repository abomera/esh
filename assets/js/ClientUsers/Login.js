
var login = function (localUserName, localPassword) {

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/Login',
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ UserName: localUserName, Password: localPassword }),
    success: function (ClientData, textStatus, jqxhr) {

      if ($.isEmptyObject(ClientData)) {
        //$('#errorMsg').val(errorThrown);
        $('#errorMsg').removeClass('hidden');
        window.stop();
        return;
      }
      if (!IsNullOrEmpty(ClientData.AccessToken)) {
        setCookie('ClientData', JSON.stringify(ClientData), 1);
        var url;
        if (ClientData.RoleID === 1) {
          url = '../tracking.html';
        }
        if (ClientData.RoleID === 2) {
          url = $('#rdtClientsIndex').val();
        }

        window.location.href = url;

      }
      else {
        $('#errorMsg').removeClass('hidden');
      }

    },
    error: function (jqXhr, textStatus, errorThrown) {
      $('#errorMsg').val(errorThrown);
      $('#errorMsg').removeClass('hidden');
      window.stop();
    }
  });
};


var wireEvents = function () {

  $('#LoginValidation').submit(function (e) {

    e.preventDefault();
    var localUserName = $('#username').val();
    var localPassword = $('#password').val();
    var localClientID = $('#ClientID').val();

    if (localUserName == ""
      || localPassword == ""
      || localClientID == ""
    ) {
      window.stop();
    }
    else {
      setCookie('ClientID', localClientID, 1);
      login(localUserName, localPassword);
    }

  });
};


$(document).ready(function () {
  wireEvents();
});