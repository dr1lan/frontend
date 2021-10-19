$(document).ready(function () {
    $('#scan_submit').click(function () {
        let url = $('#scan_url').val();
        if (isValidUrl(url)) {
            $('.t-form__errorbox-bottom').hide();
            $.ajax({
                url: '/make_report',
                type: 'POST',
                data: {url: url},
                dataType: 'json',
                beforeSend: function () {
                    $('#loader').removeClass('hidden')
                },
                success: function (response) {
                    if (typeof response.report !== 'undefined' && response.report !== null) {
                        $.redirect('/report', {
                            report: response.report
                        })
                    } else {
                        $('.t-form__errorbox-item.js-rule-error').text(response);
                        $('.t-form__errorbox-bottom').show();
                    }
                },
                complete: function () {
                    $('#loader').addClass('hidden')
                },
                error: function (error) {
                    $('.t-form__errorbox-item.js-rule-error').text(error.responseText);
                    $('.t-form__errorbox-bottom').show();
                }
            });
        } else {
            $('.t-form__errorbox-bottom').show();
        }
    });

    function isValidUrl(url) {
        let regExp = /[a-zа-я0-9~_\-\.]+\.[a-zа-я]{2,9}(\/|:|\?[!-~]*)?$/i;

        return regExp.test(url);
    }
});
