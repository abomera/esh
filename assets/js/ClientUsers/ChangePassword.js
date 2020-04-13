//document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

var checkPassword = function (str) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(str);
};

var checkForm = function (e) {
  e.preventDefault();
  var currentpassword = $('#currentpassword').val();
  var pwd1 = $('#pwd1').val();
  var pwd2 = $('#pwd2').val();

  if (currentpassword == "") {
    document.getElementById("errorMsg").textContent = "Current password cannot be blank!";

    $('#currentpassword').focus();
    window.stop();
    return;
  }


  if (pwd1 != "" && pwd1 == pwd2) {
    if (!checkPassword(pwd1)) {
      document.getElementById("errorMsg").textContent = "The password you have entered is not valid!";
      $('#pwd1').focus();
      window.stop();
      return;
    }
  } else {
    document.getElementById("errorMsg").textContent = "Please check that you've entered and confirmed your password!";
    $('#pwd1').focus();
    window.stop();
    return;
  }
  return true;
};

var changepassowrd = function () {

  var currentpassword = $('#currentpassword').val();
  var pwd1 = $('#pwd1').val();
  var pwd2 = $('#pwd2').val();

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/ChangePassword',
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ Password: currentpassword, NewPassword1: pwd1, NewPassword2: pwd2 }),
    success: function (Response, textStatus, jqxhr) {

      if (Response === "") {
        var url = $('#rdtClientsIndex').val();
        window.location.href = url;
      }
      else {
        document.getElementById("errorMsg").textContent = Response;
        window.stop();
      }

    },
    error: function (jqXhr, textStatus, errorThrown) {
      document.getElementById("errorMsg").textContent = errorThrown;
      window.stop();
    }
  });
};


var wireEvents = function () {

  $('#myForm').submit(function (e) {
    if (checkForm(e)) {
      changepassowrd();
    }
    else {
      window.stop();

    }

  })

}

$(document).ready(function () {
  wireEvents();
});
