var ApiUrl = 'http://localhost:35471/api/';
//var ApiUrl = 'http://41.32.225.24/DispatchAPI/api/';



var baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
var browserUrl = window.location.pathname;
var UrlId = browserUrl.substring(browserUrl.lastIndexOf('/') + 1);
var pageName = browserUrl.substring(browserUrl.lastIndexOf('/'));

function IsNullOrEmpty(value) {
  var isNullOrEmpty = true;
  if (value) {
    if ((typeof (value) === 'string')) {
      if (value.length > 0) {
        isNullOrEmpty = false;
      }

    }
  }
  return isNullOrEmpty;
}


function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
 
var userKey;
var ClientData;

if (userKey !== undefined) {
  userKey = ClientData.AccessToken;
}
 
$(document).ready(function () {

  var ClientID = Cookies.get('ClientID');

  ClientData = Cookies.get('ClientData');

  try {
  ClientData = JSON.parse(ClientData);

  } catch (e) {
    console.log(e);
  }

     $.ajaxSetup({
        global: true,
        cache:false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("AccessToken", ClientData.AccessToken);
          xhr.setRequestHeader("ClientID", ClientID);
        }
    });
    $(document).ajaxStart(function () {
        //$.LoadingOv
        //$('.content').loading({
        //    onStart: function (loading) {
        //        loading.overlay.slideDown(400);
        //    },
        //    onStop: function (loading) {
        //        loading.overlay.slideUp(400);
        //    }
        //});
    });

    $(document).ajaxComplete(function (event, xhr, settings) {

         if (xhr.status === 500) {
                 window.location.href = baseUrl + '?sessionExpired=true';
         }
    });
    $(document).ajaxStop(function () {
        //$('.content').loading('toggle');
        //try { $('#svd-state').hide(); } catch (err) { }
 
    });

  $(".outBtn").on('click', function () {
    
         return $.ajax({
           url: Logout,
            datatype: 'json',
            type: 'POST',
            data: JSON.stringify(cookieValue),
            contentType: 'application/json; charset=utf-8',
            success: function (result, textStatus, jqxhr) {
              Cookies.expire('ClientData');
              document.cookie = 'ClientData=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                 window.location.href = baseUrl;

            }
        });
        
    });
});

/* API Name */


//login
var Login = ApiUrl + 'ClientUsers/Login';
//Logout
var Logout = ApiUrl + 'ClientUsers/Logout';
//Details
var GetShipmentDetails = ApiUrl + 'ClientUsers/GetShipmentDetails/';
//SubmitContactUS
var SubmitContactUS = ApiUrl + 'ClientUsers/V2/SubmitContactUS';
                       
//SubmitContactUS
var ChangePasswordApi = ApiUrl + 'ClientUsers/ChangePassword';

