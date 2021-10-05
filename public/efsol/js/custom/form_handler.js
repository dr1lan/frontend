$(document).ready(function () {

    const submitHandler = {
        successPopupSelector: '#callback-confirm',
        ajaxUrl: '/local/ajax/formhandler.php',
        errorClass: 'form-validation-error',
        requiredPropertiesMap: {
            phone: 'Телефон',
            agreement: 'Условия',
            files: 'Файлы'
        },
        errors: [],

        excludeSelector: ['.u-manuals-search', '.search', '[name="form_auth"]', '.u-manuals-mini-seach', '.filter'],

        init: function () {
            const excluded = submitHandler.excludeSelector.join(', ');

            $('form').not(excluded).each(function () {
                submitHandler.appendHiddenInput(this, 'h1_title', $('h1').text());
                submitHandler.appendHiddenInput(this, 'referer', window.location.href);

                const formUtmCampaign = $(this).find("input[name='utm_campaign']");
                const pageUtmCampaign = $('body').find("[data-page-utm_campaign]");

                if (formUtmCampaign.length && formUtmCampaign.val() == 0 && pageUtmCampaign.length && pageUtmCampaign.data('page-utm_campaign')) {
                    $(formUtmCampaign).val(pageUtmCampaign.data('page-utm_campaign'));
                }
            });

            $('form').not(excluded).on('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
                submitHandler.clearErrors(this);
                submitHandler.handleForm(this)
            });

        },

        handleForm: function ($form) {
            this.validateForm($form);
            if (this.errors.length > 0) {
                this.handleErrors();
            } else {
                this.submitAjax($form);
            }
        },

        validateForm: function ($form) {
            for (let key in this.requiredPropertiesMap) {
                if (this.requiredPropertiesMap.hasOwnProperty(key)) {
                    let currentSelector = 'input[name="' + key + '"]';
                    let value = $($form).find(currentSelector);
                    if (!!value.length) { //если на форме есть вообще такой инпут
                        this.validateInput(value);
                    }
                }
            }
        },

        validateInput: function (value) {
            //возможно придется разбить по типам
            switch (value[0].type) {
                case 'text':
                    if (value[0].value.length < 1) {
                        this.errors.push(value);
                    }
                    break;
                case 'tel':
                    if (value[0].value.length < 4) {
                        this.errors.push(value);
                    }
                    break;
                case 'file':
                    if (value[0].files.length > 0) {
                        if (value[0].files.length > 5) {
                            this.errors.push(value);
                        } else {
                            for (let i = 0; i < value[0].files.length; i++) {
                                let file = value[0].files[i];
                                let extension = file.name.match(/\.(doc|docx|pdf|xls|xlsx)$/gm);

                                if (file.size > 3145728 || extension === null) {
                                    this.errors.push(value);
                                    break;
                                }
                            }
                        }
                    }
                    break;
            }
        },

        handleErrors: function () {
            let _this = this;
            for (let index in this.errors) {
                let errorText = '';
                if (_this.errors.hasOwnProperty(index)) {
                    switch (_this.errors[index][0].name) {
                        case 'fullname':
                            errorText = 'Заполните поле "' + _this.requiredPropertiesMap.name + '"';
                            break;
                        case 'phone':
                            errorText = 'Заполните поле "' + _this.requiredPropertiesMap.phone + '"';
                            break;
                        case 'agreement' :
                            errorText = 'Согласитесь с условиями';
                            break;
                        case 'files' :
                            errorText = 'До 5 файлов.<br> Ограничение на размер файла - 3МБ.<br> Форматы прикрепляемых файлов - doc, docx, pdf, xls, xlsx.';
                            break;
                    }
                    _this.errors[index].after('<div class="' + _this.errorClass + '">' + errorText + '</div>');
                }
            }

            this.errors = [];
        },

        uploadFiles: async function ($form) {
            if ($form.files === undefined) return false;

            const token = 'AgAAAABM3BXPAAbTDeLNXUdbd0oVucRt3eFobTM';
            const path = '/Файлы из форм с сайта efsol.ru/';
            const input = $form.cloud_files;

            try {
                let files = $form.files.files;
                if (files.length > 0) {
                    // Создаем папку на диске
                    let dirPath = path + new Date().toLocaleDateString();
                    let createDir = await fetch('https://cloud-api.yandex.net/v1/disk/resources?path=' + encodeURI(dirPath), {
                        method: 'PUT', headers: {'Authorization': 'OAuth ' + token}
                    });

                    let dir = await createDir.json();
                    if (!dir.hasOwnProperty('error') || dir.error === 'DiskPathPointsToExistentDirectoryError') {
                        for (let i = 0; i < files.length; i++) {
                            let file = files[i];

                            let id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
                            let filePath = dirPath + '/' + id + '_' + file.name;

                            // Получаем ссылку для загрузки файла
                            let responseDownloadUrl = await fetch('https://cloud-api.yandex.net/v1/disk/resources/upload?path=' + encodeURI(filePath), {
                                headers: {'Authorization': 'OAuth ' + token}
                            });

                            let downloadUrl = await responseDownloadUrl.json();
                            if (downloadUrl.hasOwnProperty('href')) {
                                // Загружаем файл
                                let sendFile = await fetch(downloadUrl.href, {
                                    method: 'PUT',
                                    body: file
                                });
                                let response = await sendFile;
                                if (response.status == 201) {
                                    input.value += ((input.value.length > 0) ? ',' : '') + 'https://disk.yandex.ru/client/disk' + encodeURI(filePath);
                                }
                            }
                        }
                    }
                    // Сбрасываем файлы перед отправкой на сервер
                    $form.files.value = '';
                }
            } catch (e) {
                console.log(e);
            }
        },

        submitAjax: async function ($form) {
            let _this = this;
            $($form).find("button[type='submit']").attr('disabled', true);
            await this.uploadFiles($form);

            let formData = new FormData($($form)[0]);
            $.ajax({
                url: this.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false
            }).success(function (response) {
                $($form).trigger('reset');
                $($form).closest('.modal.fade').modal('hide');
                _this.successPopup();
                $($form).find("button[type='submit']").attr('disabled', false);
            });
        },

        successPopup: function () {
            $(this.successPopupSelector).modal("show");
        },

        handlePopupButton: function ($div, $button) {
            //переносим все дата-аттрибуты с кнопки, которая триггерит попап, на форму в виде скрытых инпутов
            let _this = this;
            let $form = $($div).find('form')[0];
            let buttonData = $($button).data();

            $($form).find('.js-cloudFile').hide();

            for (let key in buttonData) {
                if (buttonData.hasOwnProperty(key)) {
                    if (key === 'showfiles') {
                        if (buttonData.showfiles === 'Y') {
                            $($form).find('.js-cloudFile').show();
                        }
                    }
                    let currentSelector = 'input[name="' + key + '"]';
                    let $input = $($form).find(currentSelector);
                    if ($input.length > 0) {
                        $($input).val(buttonData[key]);
                    } else {
                        _this.appendHiddenInput($form, key, buttonData[key]);
                    }
                }
            }
        },

        appendHiddenInput: function ($form, name, value) {
            $($form).append('<input type="hidden" name="' + name + '" value="' + value + '">');
        },

        clearErrors: function ($form) {
            let _this = this;
            $($form).find('input').each(function () {
                $(this).siblings('.' + _this.errorClass).remove();
            });
        },
    };

    submitHandler.init();

    $('.modal.fade').on("show.bs.modal", function (e) {
        submitHandler.handlePopupButton(this, e.relatedTarget);
    });

});
