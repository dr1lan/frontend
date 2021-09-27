$(document).ready(function () {

    $('#scan').click(function () {
        $.ajax({
           url: '/scan',
            type: 'POST',
            data: {url: $('#task_url').val()},
            dataType: 'json',
            success: function (response) {
               console.log(response)
              $.redirect('/report', {
                  report: response.report
              })
            },
            error: function (error) {
               console.log(error)
            }
        });
    });

});
