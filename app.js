/*
Author: Ryan Peters
Date: 03/07/16
Assignment: How To
Description: Node application uses express handlebars to display a guide for using
   the Library of Congress Prints and Photgraphs Online Catalog API.
*/
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'home'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

/***************************************************************
** Description: Displays the Intro page
***************************************************************/
app.get('/intro', function(req,res,next){
	var context = {};
	context.title='How To Search The Library of Congerss Prints And Photographs Online Catalog';
	context.next = 'usingAPI';
    res.render('intro',context);
});

/***************************************************************
** Description: Displays Using the API page
***************************************************************/
app.get('/usingAPI', function(req, res){
	var context = {};
	context.title = 'Getting Started';
	context.prev = '/intro';
	context.next = '/searchParam';
	res.render('getStart', context);
});

/***************************************************************
** Description: Displays page about the search parameters
***************************************************************/
app.get('/searchParam', function(req, res){
	var context = {};
	context.title = 'Search Parameters';
	context.prev = '/usingAPI';
	context.next = '/resultParam';
	res.render('searchParam', context);
});

/***************************************************************
** Description: Displays page about the result parameters
***************************************************************/
app.get('/resultParam', function(req, res){
	var context = {};
	context.title = 'Result Parameters';
	context.prev = '/searchParam';
	context.next = '/response';
	res.render('resultParam', context);
});

/***************************************************************
** Description: Displays page about the response
***************************************************************/
app.get('/response', function(req, res){
	var context = {};
	context.title = 'Response'
	context.prev = '/resultParam';
	context.next = '/dispPics';
	res.render('response', context);
});

/***************************************************************
** Description: Sends a requests to the API and displays images
**    from the request.
***************************************************************/
app.get('/dispPics', function(req, res){	
	var context = {};
	request({url:'http://loc.gov/pictures/search/?q=world war 2&c=5&fo=json', json:true}, function(err, response, body) {
		if(!err && res.statusCode < 400){
			context.title='Using The API To Display Pictures';
			var picParams = [];
			for(var p in body.results){
				picParams.push({img_src:'http:' + body.results[p].image.full, img_alt:body.results[p].image.alt, img_title:body.results[p].title})
			}
			context.picture = picParams;
			context.prev = 'response';
			res.render('dispPics', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

/***************************************************************
** Description: Reports page not found error to the user.
***************************************************************/
app.use(function(req, res){
	res.type('plain/text');
	res.status(404);
	res.send('404 - Not Found');
});

/***************************************************************
** Description: Reports general server error to the user.
***************************************************************/
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
})

/***************************************************************
** Description: Sets the app to start listening
***************************************************************/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});