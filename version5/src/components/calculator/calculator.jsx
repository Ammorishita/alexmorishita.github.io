import React from "react";

class Calculator extends React.Component {
	constructor(props) {
		super();
		this.getInputValue = this.getInputValue.bind(this);
		this.state = {
			initial: 0,
			years: 1,
			rate: 0,
			total: 0
		};
	}

	componentDidMount() { }

	componentDidUpdate() {
	}

	getInputValue(e) {
		const target = e.target;
		const value = target.value;
		const maxLimit = target.getAttribute("length");
		const length = value.length;
		const name = target.name;
		if (length > maxLimit) {
			target.value = value.slice(0, maxLimit);
		} else {
			// FV   =   P (1  +  r / n)Y
			const r = this.state.rate / 100;
			const P = this.state.initial;
			// const Y = this.state.years;
			// const c = this.state.contributions;
			let total;
			if (name === "initial") {
				total = value * Math.pow((1 + r), this.state.years);
			} else if (name === "years") {
				total = P * Math.pow((1 + r), value);
			} else if (name === "rate") {
				total = P * Math.pow((1 + (value / 100)), this.state.years);
			}
			total = total.toFixed(2);
			const formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			this.setState({
				[name]: value,
				total: formattedTotal,
			});
		}
	}

	render() {
		const activeClass = (this.props.active === "calculator")
			? "calculator active"
			: "calculator";
		return (
			<div className={activeClass}>
				<form className="form">
					<label className="form__label">
						Initial Investment
						<div className="form__input-wrapper">

							<input
								type="number"
								className="form__input"
								name="initial"
								length="8"
								onKeyUp={this.getInputValue}
							/>
							<span className="form__input-symbol">$</span>
						</div>
					</label>
					<label className="form__label">
						Number of Years
						<div className="form__input-wrapper">
							<input
								type="number"
								name="years"
								placeholder="1"
								length="2"
								className="form__input form__input--clear"
								onKeyUp={this.getInputValue}
							/>

						</div>
					</label>
					<label className="form__label">
						Return Rate
						<div className="form__input-wrapper">
							<input
								type="number"
								name="rate"
								length="4"
								placeholder="0"
								className="form__input form__input--clear"
								onKeyUp={this.getInputValue}
							/>
							<span className="form__input-symbol form__input-symbol--secondary">
								%
				</span>

						</div>
					</label>
					<p className="form__total">Total Balance: ${this.state.total}</p>
				</form>
			</div>
		);
	}
}
export default Calculator;
