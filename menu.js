#!/usr/bin/env node
var cheerio = require('cheerio');
var request = require('request');
var charset = require('charset');
var iconv = require('iconv');
var colors = require('colors');
var S = require('string');

var url = 'http://www.dieuduciel.com/en/home.php'

request({url: url, encoding: 'binary'}, function(err, resp, body) {
    enc = charset(resp.headers, body);

    if (enc != 'utf-8') {
	iconv = new iconv.Iconv(enc, 'UTF-8//TRANSLIT//IGNORE');
	html = iconv.convert(new Buffer(body, 'binary')).toString('utf-8');
    }

    if (err)
        throw err;

    console.log('Dieu du Ciel beer menu'.underline);
    console.log();

    $ = cheerio.load(body);

    $('#Tableau02 .float li a').each(function() {
	var name = $(this).attr('name');
	var deschtml = $(this).children().html();

	// Removed malformed span
	deschtml = deschtml.replace(/<span<><\/span<>/g, '');
	deschtml = deschtml.replace(/Type:/g, '');

	var desc = deschtml.split("<br>").map(function(d){return S(d).trim().s});
	var type = desc[1];
	var abv = desc[2];

	console.log(name.green);
	console.log(type + ", " + abv);
	console.log();
    });

    var uphtml = $('#Tableau_en_03 .datemodif').html();
    var update = uphtml.split("<br>");
    var update_date = update[1];

    console.log("Last update: " + update_date);
});
