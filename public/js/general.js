$(document).ready(function () {
    $('#name input').val('');
    $('#tel input').val('').inputmask("+7 999 999-99-99");
    $('#scan_url').val('');

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

    $('#form262927501_submit').click(function () {
        let name = $('#name input').val();
        let phone = $('#tel input').val();
        if (!name) {
            $('#name .t-input-error').text('Обязательное поле').show();
        } else {
            $('#name .t-input-error').hide();
        }

        if (!phone) {
            $('#tel .t-input-error').text('Обязательное поле').show();
        } else {
            $('#tel .t-input-error').hide();
        }

        if (name && phone) {
            $.ajax({
                type: "POST",
                url: '/request_call',
                data: {name: name, phone: phone},
                dataType: 'json',
                success: function(data)
                {
                    if (data.status) {
                        $('#form262927501 .t-form__inputsbox').hide();
                        $('.js-successbox').show();
                    } else {
                        $('#form262927501 .t-form__inputsbox').hide();
                        $('.js-errorbox').show();
                    }
                },
                error: function (error) {
                    $('#form262927501 .t-form__inputsbox').hide();
                    $('.js-errorbox').show();
                }
            });
        }
    })
});
