import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ArticleWrapper = styled.div`
	padding: 10px;
	position: relative;

	&:nth-child(even) {
		background: #eee;
	}

	> a {
		color: #000;
		text-decoration: none;
	}
`;

const ArticleWeight = styled.div`
	border-radius: 10px;
	height: 20px;
	position: absolute;
	right: 9px;
	top: 9px;
	width: 20px;

	&.negative-3 {
		background: rgb(170, 0, 0);
	}

	&.negative-2 {
		background: rgb(147, 42, 34);
	}

	&.negative-1 {
		background: rgb(122, 90, 51);
	}

	&.neutral {
		background: rgb(112, 111, 59);
	}

	&.positive-1 {
		background: rgb(89, 159, 78);
	}

	&.positive-2 {
		background: rgb(79, 182, 88);
	}

	&.positive-3 {
		background: rgb(66, 215, 102);
	}
`;

class Article extends Component {
	/**
	 * weightToClass
	 *
	 * @returns {string}
	 */
	weightToText() {
		switch (true) {
			case (this.props.article.weight < 10):
				return 'weight negative-3';

			case (this.props.article.weight < 25):
				return 'negative-2';

			case (this.props.article.weight < 45):
				return 'negative-1';

			case (this.props.article.weight < 55):
				return 'neutral';

			case (this.props.article.weight < 75):
				return 'positive-1';

			case (this.props.article.weight < 90):
				return 'positive-2';

			default:
				return 'positive-3';
		}
	}

	/**
	 * render
	 *
	 * @returns {void}
	 */
	render() {
		return (
			<ArticleWrapper>
				<a href={this.props.article.url} target="_blank">{this.props.article.title}</a>
				<ArticleWeight className={this.weightToText()} title={`Positivity: ${this.props.article.weight}/100`} />
			</ArticleWrapper>
		);
	}
}

Article.propTypes = {
	article: PropTypes.object.isRequired,
};

export default Article;
