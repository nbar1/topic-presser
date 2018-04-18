import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import WeightedBar from './WeightedBar';

const Title = styled.div`
	font-size: 38px;
	text-align: center;
`;

const Consensus = styled.div`
	font-size: 24px;
	text-align: center;
`;

class Header extends Component {
	/**
	 * weightToText
	 *
	 * @returns {string}
	 */
	weightToText() {
		switch (true) {
			case (this.props.weight < 10):
				return 'Extremely Negative';

			case (this.props.weight < 25):
				return 'Very Negative';

			case (this.props.weight < 45):
				return 'Somewhat Negative';

			case (this.props.weight < 55):
				return 'Neutral';

			case (this.props.weight < 75):
				return 'Somewhat Positive';

			case (this.props.weight < 90):
				return 'Very Positive';

			default:
				return 'Extremely Positive';
		}
	}

	/**
	 * render
	 *
	 * @returns {void}
	 */
	render() {
		return (
			<div>
				<Title>{this.props.topic}</Title>
				<Consensus>{this.weightToText()}</Consensus>
				<WeightedBar weight={this.props.weight} />
			</div>
		);
	}
}

Header.propTypes = {
	weight: PropTypes.number.isRequired,
};

export default Header;
