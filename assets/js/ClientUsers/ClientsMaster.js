function GetClientData() {
  var ClientData = getCookie('ClientData');

  if (IsNullOrEmpty(ClientData)) {
    window.location.href = $('#rdtClientsLogin').val();
  }

  ClientData = JSON.parse(ClientData);
  var AccessToken = ClientData.AccessToken;
  if (!IsNullOrEmpty(AccessToken)) {
    return ClientData;
  }
  else {
    window.location.href = $('#rdtClientsLogin').val();
  }

}

function UpdateMasterData() {
  var ClientData = JSON.parse(getCookie('ClientData'));
  document.getElementById("username1").textContent = ClientData.ClientName + ' - ' + ClientData.UserName;
  document.getElementById("username2").textContent = ClientData.UserName;
  document.getElementById("username3").textContent = ClientData.ClientName;
  document.getElementById("accountno").textContent = ClientData.AccountNo;
}

$(document).ready(function () {
  if (IsNullOrEmpty(ClientData.AccessToken)) {
    window.location.href = $('#rdtClientsLogin').val();
  }

  if (ClientData.RoleID!==2) {
    window.location.href = $('#rdtClientsLogin').val();
  }


});


