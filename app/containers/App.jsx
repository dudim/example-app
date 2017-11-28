import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import getRates from '../actions/converter';
import Converter from '../components/converter';
import '../styles/app.styl';

const cyrrencySymbols = {
	EUR: '€',
	GBP: '£',
	RUB: '₽',
};

class App extends Component {
	render() {
		const { from, to, rate } = this.props.converter;

		return (
			<div className={'app-wrapper'}>
				<div className="app-wrapper-title">
					1 {cyrrencySymbols[from]} = {Math.ceil((rate) * 10000) / 10000} {cyrrencySymbols[to]}
				</div>
				<div className="app-wrapper-content">
					<Converter
						{...this.props.converter}
						getRates={this.props.getRates}
					/>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	converter: PropTypes.shape({
		currencies: PropTypes.array.isRequired,
		from: PropTypes.string.isRequired,
		to: PropTypes.string.isRequired,
		rate: PropTypes.number.isRequired,
		isLoading: PropTypes.bool.isRequired,
	}).isRequired,
	getRates: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	return {
		converter: state.converter,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getRates: bindActionCreators(getRates, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
