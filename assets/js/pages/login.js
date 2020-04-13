$(document).ready(function () {
     function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


    sessinEx = getParameterByName('sessionExpired');
    if (sessinEx === 'true') {
        $("#ssionEX").html('');
        $("#ssionEX").html('<div class="alert alert-danger">Session expired. Please login again</div>');
     }

});


$('#loginBtn').on('click', function (e) {
    var $btn = $(this).button('loading');
    var UserName = $('#userName').val();
    var Password = $('#Password').val();
    if (UserName === "" || UserName === "") {
        $.toast({
            text: 'Please enter username and password',
            position: 'bottom-center',
            loaderBg: '#bf2026',
            icon: 'warning',
            hideAfter: 3000,
            stack: 6
        });
        setTimeout(function () {
            $btn.button('reset');
        }, 500);
        return;
    }


    return $.ajax({
        url: Login,
        datatype: 'json',
        type: 'PUT',
        data: JSON.stringify({ UserName: UserName, Password: Password }),
        contentType: 'application/json; charset=utf-8',
        success: function (result, textStatus, jqxhr) {
            console.log(result);
          //  $btn.button('reset');
            if (result === null) {
                $btn.button('reset');
                $.toast({
                    text: 'Username or password is incorrect',
                    position: 'bottom-center',
                    loaderBg: '#bf2026',
                    icon: 'warning',
                    hideAfter: 3000,
                    stack: 6
                });
            } else {
                Cookies.set('ClientData', JSON.stringify(result));
                Cookies.set('Username', result.ClientName);
                tt = Cookies.get('Username');
                 window.location.href = "tracking.html";
            }

        }
    });



});