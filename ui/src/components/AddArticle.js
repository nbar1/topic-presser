import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AddArticleWrapper = styled.div`
	border: 2px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
	margin: 15px auto 0;
	padding: 10px;
	width: 700px;
`;

const Title = styled.div`
	font-size: 24px;
	margin-bottom: 10px;
`;

const Description = styled.div`
	font-size: 16px;
`;

const ArticleTitle = styled.div`
	font-size: 16px;
	font-weight: bold;
	margin-top: 15px;
`;

const ArticleSource = styled.div`
	font-size: 12px;
	margin-bottom: 15px;
`;

const Slider = styled.input`
	appearance: none;
	background: linear-gradient(to right, rgba(170, 0, 0, 1) 0%, rgba(43, 219, 90, 1) 100%);
	height: 25px;
	margin: 5px 0 70px;
	outline: none;
	width: 100%;

	&::-webkit-slider-thumb {
		appearance: none;
		background: rgba(0, 0, 0, 0.8);
		height: 35px;
		cursor: pointer;
		width: 20px;
	}
`;

const SliderLabelNegative = styled.div`
	float: left;
	font-size: 12px;
	font-weight: bold;
`;

const SliderLabelPositive = styled.div`
	float: right;
	font-size: 12px;
	font-weight: bold;
`;

const AddArticleForm = styled.form`
	position: relative;

	input[type="text"] {
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		font-size: 24px;
		margin: 15px 2px 5px;
		padding: 5px 10px;
		width: 99.5%;
	}
`;

const SubmitButton = styled.input`
	background: #6bb168;
	border: none;
	border-radius: 4px;
	border: none;
	color: #fff;
	font-size: 18px;
	margin-top: -45px;
	padding: 10px 20px;
	position: absolute;
	right: 0;
`;

const LoadingInfo = styled.div`
	background: transparent;
	position: absolute;
	height: 20px;
	right: 8px;
	top: 25px;
	width: 20px;
`;

const SentForReview = styled.div`
	color: #279227;
	float: right;
	font-weight: bold;
`;

const ArticleError = styled.div`
	color: rgb(170, 0, 0);
	float: right;
	font-weight: bold;
`;

class AddArticle extends Component {
	/**
	 * state
	 *
	 * @type {object}
	 */
	state = {
		weight: 50,
		url: '',
		title: '',
		loadingInfo: false,
		sentForReview: false,
		hasError: false,
	};

	/**
	 * updateSlider
	 *
	 * @param {object} event
	 * @returns {void}
	 */
	updateSlider(event) {
		this.setState({
			weight: event.target.value,
		});
	}

	/**
	 * updateUrl
	 *
	 * @param {object} event
	 * @returns {void}
	 */
	updateUrl(event) {
		let url = event.target.value;

		this.setState({
			url: url,
			loadingInfo: true,
			sentForReview: false,
			hasError: false,
		});

		if (url === '') {
			this.setState({
				loadingInfo: false,
			});

			return;
		}

		axios.get(`http://localhost:3001/article/info?url=${url}`)
			.then(response => response.data)
			.then(data => {
				this.setState({
					title: data.title,
					source: data.source,
					url: data.url,
					loadingInfo: false,
				});
			});
	}

	/**
	 * submitForm
	 *
	 * @param {object} event
	 * @returns {void}
	 */
	submitForm(event) {
		event.preventDefault();
		event.stopPropagation();

		axios.post('http://localhost:3001/article/add', {
			url: this.state.url,
			weight: this.state.weight,
		})
			.then(response => {
				this.setState({
					url: '',
					title: '',
					source: '',
					sentForReview: true,
				});
			})
			.catch(error => {
				this.setState({
					hasError: true,
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
			<AddArticleWrapper>
				{this.state.sentForReview ? <SentForReview>Sent For Review</SentForReview> : ''}
				{this.state.hasError ? <ArticleError>Error</ArticleError> : ''}
				<Title>Add Article</Title>
				<Description>The article you submit must be relevant to the topic. All submissions are subject to review before being accounted for. Use the slider to provide a positive or negative tone for the article.</Description>

				<AddArticleForm onSubmit={this.submitForm.bind(this)}>
					<input type="text" placeholder="Article URL" value={this.state.url} onChange={this.updateUrl.bind(this)} />
					{this.state.loadingInfo ? <LoadingInfo /> : ''}

					{this.state.title ? <ArticleTitle>{this.state.title}</ArticleTitle> : ''}
					{this.state.source ? <ArticleSource>{this.state.source}</ArticleSource> : ''}

					{this.state.title ? <div>
						<SliderLabelNegative>Negative</SliderLabelNegative>
						<SliderLabelPositive>Positive</SliderLabelPositive>
						<Slider type="range" min="0" max="100" step="5" value={this.state.weight} onChange={this.updateSlider.bind(this)} />
					</div> : ''}

					{this.state.title ? <SubmitButton type="submit" value="Add Article" /> : ''}
				</AddArticleForm>
			</AddArticleWrapper>
		);
	}
}

export default AddArticle;
