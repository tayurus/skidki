$(document).ready(function(){
    var currCategory = 'auto';
    //при выборе категории
    $('.menu-item-link').click(function(e){
        $('.description').remove()
        $('.list ul').remove()
        $('.list').append('<ul></ul>')
        currCategory = $(this).attr('data-category')
        $.post('/getCompaniesListByCategory', {
            city:$('.menu-city select').val(),
            category:$(this).attr('data-category')
        }, function(data){
            $('li').remove()
            data.forEach(function(item, index){

                $('ul').append('<li class="company">\
                                    <div class="company-logo" style = "background-image:url(\''+item.logo1Url+'\')"></div>\
                                    <div class="company-name">'+item.name+'</div>\
                                    <div class="company-adres">'+item.adres+'</div>\
                                    <div class="company-button"><a>Подробнее</a></div>\
                                </li>')
            })
        })
    })

    //при нажатии на "Подробнее"
    $(document).on('click', '.company-button', function(){
        $.post('/getCompany', {
            city:$('.menu-city select').val(),
            category:currCategory,
            company: $(this).parent().find('.company-name').text()
        }, function(data){
            //убрать список компаний
            $('.list ul').remove()
            $('.list').append('<div class="description">\
                                    <div class="description-logo" style = "background-image:url(\''+data.logo2Url+'\')"></div>\
                                    <div class="description-row">\
                                        <div class="description-adres">'+data.adres+'</div>\
                                        <div class="description-site"><a href="https://'+data.site+'">'+data.site+'</a></div>\
                                        <div class="description-tel">'+data.phone+'</div>\
                                    </div>\
                                    <div class="description-text">'+data.description+'</div>\
                                </div>')
        })
    })
})
