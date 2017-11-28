import React, { Component } from 'react';
import PropTypes from 'prop-types';

const RATES_INTERVAL_DELAY = 10000;
const IS_TOUCH = 'ontouchstart' in window;

export default class Converter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fromValue: 1,
			toValue: '',
			fromWidth: 10,
			toWidth: 10,
		};

		this.latestInterval = this.getLatestInterval();
	}

	componentWillMount() {
		this.getRates();
	}

	componentWillReceiveProps(nextProps) {
		// загрузка ставок
		if (nextProps.rate && !this.state.toValue) {
			this.setState({
				toValue: this.roundingNumber(nextProps.rate),
			});
			this.fromInput.focus();
			this.fromInput.setSelectionRange(1, 1);
			this.setInputWidth();
		}

		if (nextProps.from !== this.props.from) {
			this.setState({
				toValue: this.roundingNumber(this.state.fromValue * nextProps.rate),
			});
			this.setInputWidth();
		}

		if (nextProps.to !== this.props.to) {
			this.setState({
				fromValue: this.roundingNumber(this.state.toValue / nextProps.rate),
			});
			this.setInputWidth();
		}
	}

	setInputWidth() {
		setTimeout(() => {
			this.setState({
				fromWidth: this.fromBuffer ? this.fromBuffer.offsetWidth : 0,
				toWidth: this.toBuffer ? this.toBuffer.offsetWidth : 0,
			});
		}, 10);
	}

	/**
	 * обновление ставок, каждые N секунд
	 * @returns {number}
	 */
	getLatestInterval() {
		return setInterval(() => this.getRates(), RATES_INTERVAL_DELAY);
	}

	/**
	 * получение ставок
	 * @param base
	 * @param symbols
	 */
	getRates(base = this.props.from, symbols = this.props.to) {
		this.props.getRates({
			base,
			symbols,
		});

		clearInterval(this.latestInterval);
		this.latestInterval = this.getLatestInterval();
	}

	/**
	 * округление до сотых
	 * @param number
	 * @returns {number}
	 */
	roundingNumber(number) {
		return Math.round((number) * 100) / 100;
	}

	/**
	 * выбор валюты
	 * @param currency
	 * @param isFrom
	 */
	changeCurrency(currency, isFrom) {
		const base = isFrom ? currency : this.props.from;
		const symbols = isFrom ? this.props.to : currency;

		this.getRates(base, symbols);
	}

	/**
	 * выбор количества валюты
	 * @param event
	 */
	changeValue(event) {
		const name = event.target.name;
		const value = event.target.value;

		if (!value || /^0\d/.test(value)) {
			return;
		}

		if (name === 'fromValue') {
			this.setState({
				[name]: value,
				toValue: this.roundingNumber(value * this.props.rate),
			});
		} else {
			this.setState({
				[name]: value,
				fromValue: this.roundingNumber(value / this.props.rate),
			});
		}

		this.setInputWidth();
	}

	/**
	 * валидация ввода
	 * @param event
	 */
	validateKeyPress(event) {
		const keyCode = event.keyCode || event.which;
		const keyValue = String.fromCharCode(keyCode);
		// только числа и точка
		if (!(/\d/.test(keyValue) || (/\./.test(keyValue) && !/\./.test(event.target.value)))
			|| event.target.value.toString().length > 6
		) {
			event.preventDefault();
		}
	}

	/**
	 * рендер навигации
	 * @param isFrom - списываемая валюта
	 */
	renderNav(isFrom) {
		const { from, to, currencies } = this.props;
		const activeCurrency = isFrom ? from : to;
		const excludedCurrency = isFrom ? to : from;

		return currencies.filter(currency => currency !== excludedCurrency)
			.map(currency => (
				<li
					role="presentation"
					key={currency}
					// eslint-disable-next-line max-len
					className={`converter-nav-item ${currency === activeCurrency ? 'converter-nav-item-active' : ''}`}
					onClick={() => this.changeCurrency(currency, isFrom)}
				>{currency}</li>
			),
			);
	}

	render() {
		const { from, to } = this.props;

		return (
			<div className="converter-screen">
				<div className="converter-item">
					<div className="converter-name">{from}</div>
					<div className={'converter-value'}>
						- <input
							ref={(input) => { this.fromInput = input; }}
							className={`converter-value-field ${this.props.isLoading ? 'state-loading' : ''}`}
							type={`${IS_TOUCH ? 'number' : 'text'}`}
							name="fromValue"
							value={this.state.fromValue}
							onChange={this.changeValue.bind(this)}
							onKeyPress={this.validateKeyPress.bind(this)}
							style={{ width: this.state.fromWidth }}
						/>
						<div
							ref={(buffer) => { this.fromBuffer = buffer; }}
							className="converter-value-buffer"
						>{this.state.fromValue}</div>
					</div>
					<ul className="converter-nav">
						{this.renderNav(true)}
					</ul>
				</div>

				<div className="converter-item">
					<div className="converter-name">{to}</div>
					<div className={'converter-value'}>
						+ <input
							className={`converter-value-field ${this.props.isLoading ? 'state-loading' : ''}`}
							type="text"
							name="toValue"
							value={this.state.toValue}
							onChange={this.changeValue.bind(this)}
							onKeyPress={this.validateKeyPress.bind(this)}
							style={{ width: this.state.toWidth }}
						/>
						<div
							ref={(buffer) => { this.toBuffer = buffer; }}
							className="converter-value-buffer"
						>{this.state.toValue}</div>
					</div>
					<ul className="converter-nav">
						{this.renderNav(false)}
					</ul>
				</div>
			</div>
		);
	}
}

Converter.propTypes = {
	currencies: PropTypes.array.isRequired,
	from: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	rate: PropTypes.number.isRequired,
	isLoading: PropTypes.bool.isRequired,
	getRates: PropTypes.func.isRequired,
};
