
var GetParamData = function () {
  try {
    var ParamData;

    ParamData = getUrlParameter('x');

    ParamData = JSON.parse(ParamData);

    console.log(ParamData);

    $('#txtSubject').val(ParamData.AWB);
    $('#txtMessage').val(ParamData.Comments);

  } catch (e) {
    console.log(e);
  }
};


$(document).ready(function () {

  GetParamData();

});

var SubmitContactUS = function () {
  typeID = $('#cmbTypes').val();
  Subject = $('#txtSubject').val();
  Message = $('#txtMessage').val();

  if (typeID === "" || Subject === "" || Message === "") {
    $("#errorMsg").html('<div class="alert alert-danger text-black">Please Check Type,Subject and Message</div>');
    return;
  }


  var ContactUS = {
    TypeID: $('#cmbTypes').val(),
    Subject: $('#txtSubject').val(),
    Message: $('#txtMessage').val(),
  };

  return $.ajax({
    url: ApiUrl + 'api/ClientUsers/V2/SubmitContactUS',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(ContactUS),
    success: function (ReturnValue, textStatus, jqxhr) {
      if (ReturnValue === true) {
        swal.fire({
          title: "Done",
          text: "Data saved successfully",
          type: "success",
          confirmButtonClass: "btn-success"
        });
      }
      setTimeout(function () {
        var url = $('#rdtClientsIndex').val();
        window.location.href = url;
      }, 5000);

      

    },
    error: function (jqXhr, textStatus, errorThrown) {
      window.stop();
    }
  });
};
