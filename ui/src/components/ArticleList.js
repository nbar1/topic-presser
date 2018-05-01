import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Article from './Article';

const ArticleListWrapper = styled.div`
	border: 2px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
	margin: 0 auto;
	width: 700px;
`;

const ArticleList = props => (
	<ArticleListWrapper>
		{props.articles.map((article, index) => {
			return <Article article={article} key={index} />;
		})}
	</ArticleListWrapper>
);

ArticleList.propTypes = {
	articles: PropTypes.array.isRequired,
};

export default ArticleList;
