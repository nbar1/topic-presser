import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WeightedBarWrapper = styled.div`
	background: linear-gradient(to right, rgba(170, 0, 0, 1) 0%, rgba(43, 219, 90, 1) 100%);
	height: 25px;
	margin: 20px auto;
	position: relative;
	width: 500px;
`;

const WeightedBarSlider = styled.div`
	background: rgba(0, 0, 0, 0.5);
	height: 35px;
	left: ${props => (props.weight)}%;
	margin-left: -10px;
	position: absolute;
	top: -5px;
	transition: left 1s ease-in-out;
	width: 20px;
`;

class WeightedBar extends Component {
	render() {
		return (
			<WeightedBarWrapper>
				<WeightedBarSlider weight={(this.props.weight)} />
			</WeightedBarWrapper>
		);
	}
}

WeightedBar.propTypes = {
	weight: PropTypes.number.isRequired,
};

export default WeightedBar;
