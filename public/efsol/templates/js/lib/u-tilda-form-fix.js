$(document).on('ready',function () {
    $('body').on('click', '.tn-atom, .t-btn, .t539 li a, .t142 a', function(){
        var thisHash = $(this).attr('href');
        if (thisHash == undefined) {
            thisHash = $(this).parent().parent().find('a').attr('href');
        }
        var getparams = thisHash.replace('#','').split('&').reduce(
            function(p,e){
                var a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
        },{});
        var form_title = getparams['form_title'];
        var product = getparams['product'];
        var utm_campaign = getparams['utm_campaign'];
        if (getparams['form_title']) {
            $('#callback-popup .h3-yellow-small span').text(form_title);
            $('#callback-popup input[name="product"]').attr('value', product);
            $('#callback-popup input[name="utm_campaign"]').attr('value', utm_campaign);
            $('#callback-popup').modal('show');
        }
    });
    // #form_title=Параметр&source=Параметр&fid=Параметр&product=Параметр&utm_campaign=Параметр
});