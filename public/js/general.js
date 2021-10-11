$(document).ready(function () {
    $('#scan_submit').click(function () {
        let url = $('#scan_url').val();
        if (isValidUrl(url)) {
            $('.t-form__errorbox-bottom').hide();
            $.ajax({
                url: '/scan',
                type: 'POST',
                data: {url: url},
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
        } else {
            $('.t-form__errorbox-bottom').show();
        }
    });

    function isValidUrl(url) {
        let regExp = /(^https?:\/\/)[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;

        return regExp.test(url);
    }
});
