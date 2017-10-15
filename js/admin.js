$(document).ready(function() {

    //реакция на выбор категории
    $('.categories select').on('change', function(e) {
        $.post('/getCompaniesList', {
            city: $('.cities select').val(),
            category: $(this).val()
        }, function(data) {
            data.forEach(function(el, index) {
                $('.companies select').append($("<option></option>").text(el));
            })
        })
    })
    $('.categories select').val('auto').change()

    //реакция на выбор компании
    $('.companies select').on('change', function(e) {
        $.post('/getCompany', {
            city: $('.cities select').val(),
            category: $(".categories select option:selected").val(),
            company: $(".companies select option:selected").val()
        }, function(data) {
            $('.logo1').css('backgroundImage', 'url(' + data.logo1Url + ')')
            $('.logo2').css('backgroundImage', 'url(' + data.logo2Url + ')')
            $('[name="name"]').val($(".companies select option:selected").val())
            $('[name="adres"]').val(data.adres)
            $('[name="site"]').val(data.site)
            $('[name="phone"]').val(data.phone)
            $('[name="description"]').val(data.description)
        })
    })

    $('.btn-success').click(function(e) {
        setTimeout(function(){e.preventDefault()},500);
    })
})
