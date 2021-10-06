$(document).ready(function () {
    $('#scan_submit').click(function () {
        $.ajax({
            url: '/scan',
            type: 'POST',
            data: {url: $('#scan_url').val()},
            dataType: 'json',
            beforeSend: function () {
                $('#loader').removeClass('hidden')
            },
            success: function (response) {
                $.redirect('/report', {
                    report: response.report
                })
            },
            complete: function () {
                $('#loader').addClass('hidden')
            },
            error: function (error) {
                console.log(error)
            }
        });
    });

});
