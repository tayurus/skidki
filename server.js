'use strict';
//подключаемые модули
var express = require('express'), //собственно, сервер
    app = express(), // объект типа "сервер"
    bodyParser = require('body-parser'), //модуль, который парсит post-запрос
    fs = require('fs'),
    multer = require("multer"),
    path = require('path'),
    upload = multer({dest: "companies/"})

app.use(bodyParser.urlencoded({extended: false}));

//установка пути, где находятся файлы
app.use(express.static(__dirname));

/*Анализ post-запросов*/

//выгрузка списка компаний в админку
app.post('/getCompaniesList', function(req, res) {
    var companies = [];
    //перейти в директорию соответсвующую нужному городу и извлечь оттуда компании и нужной категории
    fs.readdir("companies/" + req.body.city + "/" + req.body.category, function(err, files) {
        if (err)
            console.log('/getCompaniesList ERROR WHILE READING INFO FILE!!!', err);
        console.log('getCompaniesList. ', files);
        console.log('city =  ', req.body.city, ' category = ', req.body.category);
        res.send(files);
    })
})

//выгрузка списка компаний на главную
app.post('/getCompaniesListByCategory', function(req, res) {
    var companies = [];
    //перейти в директорию соответсвующую нужному городу и извлечь оттуда компании и нужной категории
    fs.readdir("companies/" + req.body.city + "/" + req.body.category, function(err, files) {
        if (err)
            console.log('/getCompaniesListByCategory ERROR WHILE READING INFO FILE!!!', err);
        var companies = []
        var cycle = new Promise(function(resolve, reject) {
            files.forEach(function(item, index) {
                fs.readFile('companies/' + req.body.city + '/' + req.body.category + '/' + item + '/info.txt', 'utf8', function(err, data) {
                    var buf = {
                        logo1Url: 'companies/' + req.body.city + '/' + req.body.category + '/' + item + '/logo1.png',
                        name: item,
                        adres: data.split("\r\n")[0]
                    };
                    companies.push(buf)
                    console.log(buf)
                })
            })
            setTimeout(function(){resolve()},1000)
        });

        cycle.then(function() {
            res.send(companies)
        })

    })
})

app.post('/getCompany', function(req, res) {
    console.log('req.body.category = ', req.body.category);
    console.log('req.body.company = ', req.body.company);
    //чтение файла с данными
    fs.readFile('companies/' + req.body.city + '/' + req.body.category + '/' + req.body.company + '/info.txt', "utf8", function(err, data) {
        if (err){
            console.log('/getCompany ERROR WHILE READING INFO FILE!!!', err);
            return -1;
        }
        var desc = ""
        data.split("\r\n").forEach(function(item, index){
            if (index > 2)
                desc += item + '\r\n';
        })
        var resObject = {
            logo1Url: 'companies/' + req.body.city + '/' + req.body.category + '/' + req.body.company + '/logo1.png',
            logo2Url: 'companies/' + req.body.city + '/' + req.body.category + '/' + req.body.company + '/logo2.png',
            adres: data.split("\r\n")[0],
            site: data.split("\r\n")[1],
            phone: data.split("\r\n")[2],
            description: desc

        };
        res.send(resObject);
    })

})

app.post('/updateCompany',  upload.any())
app.post('/updateCompany', function(req, res) {

    var company;

    if (req.body.company == 'new')
        company = req.body.name
    else
        company = req.body.company;

    if (req.body.company == 'new')
    {
        fs.mkdir('companies/' +req.body.city+ '/'+req.body.category+'/'+company);
    }

    var newInfo = req.body.adres +
    '\r\n' + req.body.site +
    '\r\n' + req.body.phone +
    '\r\n' + req.body.description;

    //проверка
    if (typeof(req.files[0]) != 'undefined')
        if (req.files[0].fieldname == 'logo1')
            fs.rename('companies/' +req.files[0].filename, 'companies/' +req.body.city+ '/'+req.body.category+'/'+company+'/logo1.png')
        else if (req.files[0].fieldname == 'logo2')
            fs.rename('companies/' +req.files[0].filename, 'companies/' +req.body.city+ '/'+req.body.category+'/'+company+'/logo2.png')
    if (typeof(req.files[1]) != 'undefined')
        if (req.files[1].fieldname == 'logo1')
            fs.rename('companies/' +req.files[1].filename, 'companies/' +req.body.city+ '/'+req.body.category+'/'+company+'/logo1.png')
        else if (req.files[1].fieldname == 'logo2')
            fs.rename('companies/' +req.files[1].filename, 'companies/' +req.body.city+ '/'+req.body.category+'/'+company+'/logo2.png')

    //перезаписать файл info.txt новой информацией
    fs.writeFile( 'companies/' +req.body.city+ '/'+req.body.category+'/'+company + '/info.txt', newInfo, function(err){
        if (err) {
            console.log("UPDATE COMPANIE CAN NOT WRITE TO FILE ");
            throw err;
        }
    });

     if (req.body.name != req.body.company && req.body.company != 'new')
    {
	 	try {
	 		fs.renameSync('companies/' +req.body.city+ '/'+req.body.category+'/'+req.body.company,
     'companies/' +req.body.city+ '/'+req.body.category+'/'+req.body.name)
	 		}
	 		catch (e) {
	 					fs.renameSync('companies/' +req.body.city+ '/'+req.body.category+'/'+req.body.company,
     'companies/' +req.body.city+ '/'+req.body.category+'/'+req.body.name)
	 		}
     }

     var a;
     res.sendFile(__dirname + "/admin.html")


})
app.post('/addCompany', function(req, res) {})

/* АНАЛИЗ GET-запросов*/
app.get(['/admin', '/admin/*'], function(req, res) {
    res.setHeader('Content-type', 'text/html');
    res.sendFile(__dirname + '/admin.html');
});
app.get(['/', '/*'], function(req, res) {
    res.setHeader('Content-type', 'text/html');
    res.sendFile(__dirname + '/index.html');
});



//по кд слушаем порт
app.listen(8000);
