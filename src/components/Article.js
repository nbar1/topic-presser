import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ArticleWrapper = styled.div`
	padding: 5px;

	&:nth-child(even) {
		background: #eee;
	}
`;

const Article = props => (
	<ArticleWrapper>
		{props.article.title} / {props.article.weight}
	</ArticleWrapper>
);

Article.propTypes = {
	article: PropTypes.object.isRequired,
};

export default Article;
