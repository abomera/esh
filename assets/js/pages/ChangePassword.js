//document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

var checkPassword = function (str) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(str);
};

var CheckForm = function () {
  var currentpassword = $('#currentpassword').val();
  var pwd1 = $('#pwd1').val();
  var pwd2 = $('#pwd2').val();

  if (currentpassword == "") {
    alert("Current password cannot be blank!");

    $('#currentpassword').focus();
    window.stop();
    return;
  }



  if (pwd1 != "" && pwd1 == pwd2) {
    console.log('');
  } else {
    alert("Please check that you've entered and confirmed your password!");
    $('#pwd1').focus();
    return;
  }
return true;
};

var DoCahngePassword = function () {

  var currentpassword = $('#currentpassword').val();
  var pwd1 = $('#pwd1').val();
  var pwd2 = $('#pwd2').val();

  return $.ajax({
    url: ChangePasswordApi,
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({ Password: currentpassword, NewPassword1: pwd1, NewPassword2: pwd2 }),
    success: function (Response, textStatus, jqxhr) {

      if (Response === "") {
        var url = '/MpsOnline/Clients/Login';
        window.location.href = url;
      }
      else {
        alert( Response);
        window.stop();
      }

    },
    error: function (jqXhr, textStatus, errorThrown) {
      alert(textStatus);
    }
  });
};


var ChangePassword = function () {
  if (CheckForm()) {
    DoCahngePassword();
  }
}