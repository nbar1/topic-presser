import React, { Component } from 'react';

import Header from './components/Header';
import ArticleList from './components/ArticleList';

const initalProps = {
	topic: 'My Topic',
	weight: 50,
};

const articles = [
	{
		weight: 100,
		title: 'good article 1',
	},
	{
		weight: 100,
		title: 'good article 2',
	},
	{
		weight: 0,
		title: 'bad article 1',
	},
	{
		weight: 0,
		title: 'bad article 2',
	},
	{
		weight: 15,
		title: 'bad article 3',
	},
];

class App extends Component {
	/**
	 * determineWeight
	 *
	 * @returns {number}
	 */
	determineWeight() {
		let weight = 0;
		articles.map(article => weight += article.weight);

		return weight / articles.length;
	}

	/**
	 * render
	 *
	 * @returns {void}
	 */
	render() {
		initalProps.weight = this.determineWeight();

		return (
			<div className="App">
				<Header {...initalProps} />
				<ArticleList articles={articles} />
			</div>
		);
	}
}

export default App;
