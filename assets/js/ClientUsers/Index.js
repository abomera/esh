var Delivered = 0;
var UnDelivered = 0;
var ReScheduled = 0;
var TotalShimpments = 0;
var UnDeliveredReasons;

window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
var color = window.chartColors;

function GetShimpmentsSummary() {
  var uri = ApiUrl + 'api/ClientUsers/GetShipmentsSummary';

  return $.ajax({
    url: uri,
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (Summary, textStatus, jqxhr) {

      Delivered = Summary.MainSummary.Delivered;
      UnDelivered = Summary.MainSummary.UnDelivered;
      ReScheduled = Summary.MainSummary.ReScheduled;
      TotalShimpments = Summary.MainSummary.TotalShimpments;
      UnDeliveredReasons = Summary.UnDeliveredReasons;


      $('#TotalShipments').html(TotalShimpments);
      $('#Delivered').html(Delivered);
      $('#UnDelivered').html(UnDelivered);
      $('#ReScheduled').html(ReScheduled);

      DrawStatusChart();
      DrawReasonChart();
    },
    error: function (jqXhr, textStatus, errorThrown) {

    }
  });

}
function DrawStatusChart() {
  var config = {
    type: 'bar',
    data: {
      datasets: [{
        data: [
                Delivered,
                UnDelivered,
                ReScheduled,
                //parseInt((Delivered / TotalShimpments) * 1000) / 10,
                //parseInt((UnDelivered / TotalShimpments) * 1000) / 10,
                //parseInt((ReScheduled / TotalShimpments) * 1000) / 10,
        ],
        backgroundColor: ['#00a65a', '#dd4b39 ', '#f39c12'],
        label: 'Shipment Status'
      }],
      labels: [
          "Delivered",
          "Un-Delivered",
          "Re-Scheduled"
      ]
    },
    options: {
      responsive: true
    }
  };

  var ctx = document.getElementById("StatusChart").getContext("2d");
  window.myPie = new Chart(ctx, config);

}
function DrawReasonChart() {
  var labels = UnDeliveredReasons.map(function (e) {
    return e.ReasonName;
  });
  var data = UnDeliveredReasons.map(function (e) {
    return e.ReasonValue;
  });

  var config = {
    type: 'pie',
    data: {
      datasets: [{
        data: data,
        backgroundColor: [color.red,color.orange,color.yellow,color.blue,color.grey,color.green],
        label: 'Un-Delivery Reasons'
      }],
      labels: labels
    },
    options: {
      responsive: true
    }
  };

  var ctx = document.getElementById("ReasonChart").getContext("2d");
  window.myPie = new Chart(ctx, config);

}


$(document).ready(function () {
  GetShimpmentsSummary();
});



