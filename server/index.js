const express = require('express');
const bodyParser = require('body-parser');
const profileInformation = require('./profileInformation');
const chalk = require('chalk');
const MongoClient = require('MongoDB').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const articleParser = require('article-parser').extract;
const sentiment = require('sentiment');
const striptags = require('striptags');

/**
 * Global Variables
 */
let app = express();
let db;
let pageSize = profileInformation.articlePageSize;

/**
 * Initialize Express
 */
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Initialize MongoDB
 */
MongoClient.connect(profileInformation.mongoUrl, (error, client) => {
	if (error) {
		// eslint-disable-next-line
		return console.log(error);
	}

	db = client.db(profileInformation.mongoDB);
});

/**
 * Routes
 */
app.get('/articles/:page?', function(request, response) {
	let page = request.params.page || 1;

	db.collection(profileInformation.mongoCollection).find({approved: true}, ).sort({ISODateTime: -1}).skip(pageSize * (page - 1)).limit(pageSize).toArray((error, results) => {
		response.send(results);
	});
});

app.post('/article/add', function(request, response) {
	if (request.body.url === undefined || request.body.weight === undefined) {
		return response.sendStatus(500);
	}

	db.collection(profileInformation.mongoCollection)
		.find({url: request.body.url})
		.toArray((error, results) => {
			if (results.length > 0 === true) {
				// duplicate
				response.sendStatus(409);
				return;
			};

			articleParser(request.body.url).then(article => {
				let articleDocument = {
					url: article.url,
					title: article.title,
					weight: request.body.weight,
					ISODateTime: new Date().toISOString(),
					approved: false,
				}

				if (articleDocument.title === undefined || articleDocument.title === null) {
					articleDocument.title = article.url;
				}

				db.collection(profileInformation.mongoCollection).save(articleDocument, error => {
					if (error) {
						throw error;
					}

					// eslint-disable-next-line
					console.log(`${chalk.green('Saved Article')} ✔ ${articleDocument.weight} / ${articleDocument.url} / ${articleDocument.title}`);

					response.sendStatus(200);
				});
			});
		});
});

app.post('/article/approve', function(request, response) {
	if (request.body.id === undefined) {
		return response.sendStatus(500);
	}

	db.collection(profileInformation.mongoCollection).update({_id: ObjectID(request.body.id)}, {$set: {approved: true}}, error => {
		if (error) {
			return response.sendStatus(500);
		}

		// eslint-disable-next-line
		console.log(`${chalk.yellow('Approved Article')} ✔ ${request.body.id}`);

		response.sendStatus(200);
	});
});

app.get('/article/info', function(request, response) {
	let articleUrl = request.query.url;

	articleParser(articleUrl).then(article => {
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({
			url: article.url,
			title: article.title,
			source: article.source,
			sentiment: sentiment(striptags(article.content), 'en'),
		}));
	});
});

// eslint-disable-next-line
app.listen(3001, () => console.log('topic-presser-server running on port 3001'));
