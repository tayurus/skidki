$(document).ready(function(){

    var urlChanged = function (url) {
        console.log('process', url);
        var tokens = url.split('/').filter(function (v) { return !!v; });

        if (tokens[0] == 'cats') {
            var category = tokens[1];
            var city = tokens[2];
            $('.description').remove()
            $('.list ul').remove()
            $('.list').append('<ul></ul>')
            $.post('/getCompaniesListByCategory', {
                city: city,
                category: category
            }, function(data){
                $('li').remove()
                data.forEach(function(item, index){
                    $('ul')
                        .append(
                            '<li class="company">\
                                <div class="company-logo" style = "background-image:url(\'/'+item.logo1Url+'\')"></div>\
                                <div class="company-name">'+item.name+'</div>\
                                <div class="company-adres">'+item.adres+'</div>\
                                <div class="company-button"><a>Подробнее</a></div>\
                            </li>'
                        );
                })
            });
        } else if (tokens[0] == 'companies') {
            $.post('/getCompany', {
                category: tokens[1],
                city: tokens[2],
                company: decodeURI(tokens[3])
            }, function (data) {
                //убрать список компаний
                $('.list ul').remove()
                $('.list').append('\
                    <div class="description">\
                        <div class="description-logo" style = "background-image:url(\'/'+data.logo2Url+'\')"></div>\
                        <div class="description-row">\
                            <div class="description-adres">'+data.adres+'</div>\
                            <div class="description-site"><a href="https://'+data.site+'">'+data.site+'</a></div>\
                            <div class="description-tel">'+data.phone+'</div>\
                        </div>\
                        <div class="description-text">'+data.description+'</div>\
                    </div>'
                );
            });
            /* ... */
        } else {
            /* переход на домашнюю страницу */
            // alert('Home');
        }
    };

    /*
        Редиректит пользователя и вызывает обработчик
     */
    var redirectTo = function (url) {
        urlChanged(url);
        history.pushState({}, '', url);
    };

    /*
        Вызывается при нажатии "назад"
     */
    window.onpopstate = function () {
        urlChanged(window.location.pathname);
    }

    /*
        Говорим что урл изменился когда только страница открылась
        Чтобы можно было открыть /cats/auto/Nizhnevartorsk 
        и увидеть нужное дерьмо
     */    
    urlChanged(window.location.pathname);

    /* */

    var currCategory = 'auto';
    
    // При выборе категории
    $('.menu-item-link').click(function (e) {
        currCategory = $(this).attr('data-category');
        redirectTo('/cats/' + currCategory + '/' + $('.menu-city select').val());
    });

    //при нажатии на "Подробнее"
    $(document).on('click', '.company-button', function () {
        redirectTo(
            '/companies/' +
            currCategory + '/' + 
            $('.menu-city select').val() + '/' + 
            $(this).parent().find('.company-name').text()
        );
    });
    
})
