const express = require('express');
const bodyParser = require('body-parser');
const profileInformation = require('./profileInformation');
const chalk = require('chalk');
const MongoClient = require('MongoDB').MongoClient;
const articleParser = require('article-parser').extract;

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

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Initialize MongoDB
 */
MongoClient.connect(profileInformation.mongoUrl, (error, client) => {
	if (error) {
		// eslint-disable-next-line
		return console.log(error);
	}

	db = client.db('topic-presser');
});

/**
 * Routes
 */
app.get('/articles/:page?', function(request, response) {
	let page = request.params.page || 1;

	db.collection(profileInformation.mongoCollection).find({}).sort({key: 1}).skip(pageSize * (page - 1)).limit(pageSize).toArray((error, results) => {
		response.send(results);
	});
});

app.post('/article/save', function(request, response) {
	if (request.body.url === undefined || request.body.weight === undefined) {
		return response.sendStatus(200);
	}

	articleParser(request.body.url).then(article => {
		let articleDocument = {
			url: article.url,
			title: article.title,
			weight: request.body.weight,
			ISODateTime: new Date().toISOString(),
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

app.get('/article/info', function(request, response) {
	let articleUrl = request.query.url;

	articleParser(articleUrl).then(article => {
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({
			title: article.title,
		}));
	});
});

// eslint-disable-next-line
app.listen(3001, () => console.log('topic-presser-server running on port 3001'));
