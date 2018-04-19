import React, { Component } from 'react';
import axios from 'axios';

import Header from './components/Header';
import ArticleList from './components/ArticleList';

const topic = 'My Topic';

class App extends Component {
	state = {
		topic,
		articles: [],
		weight: 50,
	}

	constructor(props) {
		super(props);
		this.getArticles();
	}

	/**
	 * determineWeight
	 *
	 * @param {array} articles
	 * @returns {number}
	 */
	determineWeight(articles) {
		let weight = 0;
		articles.map(article => weight += parseInt(article.weight, 10));

		return (weight / articles.length);
	}

	/**
	 * getArticles
	 *
	 * @returns {void}
	 */
	getArticles() {
		axios.get('http://localhost:3001/articles')
			.then(response => {
				this.setState({
					articles: response.data,
					weight: this.determineWeight(response.data),
				});
			});
	}

	/**
	 * render
	 *
	 * @returns {void}
	 */
	render() {
		return (
			<div className="App">
				<Header {...this.state} />
				<ArticleList articles={this.state.articles} />
			</div>
		);
	}
}

export default App;
