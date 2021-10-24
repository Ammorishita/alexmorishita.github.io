import React from "react";
import Clock from "../../components/clock/clock";
import Weather from "../../components/weather/weather";
import Stocks from "../../components/stocks/stocks";
import Calculator from "../../components/calculator/calculator";
import Projects from "../../components/projects/projects2";

class Interface extends React.Component {
	constructor(props) {
		super();
		this.navigate = this.navigate.bind(this);
		this.state = {
			angle: 0,
			contentAngle: 0,
			activeComponent: "clock",
			buttonIndex: 0,
		};
		this.buttonData = [
			{
				name: "clock",
				label: "Clock",
				icon: "icon-clock",
			},
			{
				name: "weather",
				label: "Weather",
				icon: "icon-weather",
			},
			{
				name: "projects",
				label: "Projects",
				icon: "icon-game",
			},
			{
				name: "stocks",
				label: "Stock Chart",
				icon: "icon-stock",
			},
			{
				name: "calculator",
				label: "Investment Calculator",
				icon: "icon-calculator",
			},
		]
	}

	navigate(e) {
		const target = e.currentTarget;
		const rings = document.getElementById("interface-rings");
		const componentName = e.currentTarget.getAttribute('data-name');
		const isDesktop = window.matchMedia("(min-width: 60em)").matches;
		this.buttons = document.querySelectorAll('.interface__button');
		if (isDesktop) {
			const targetIndex = Number(target.getAttribute('data-order'));
			const count = this.buttons.length;
			const angleIncrement = 360 / count;

			let newAngle = 0;
			let tempForwardCount = this.state.buttonIndex;
			let tempReverseCount = this.state.buttonIndex;
			let counterForward = 0;
			let counterReverse = 0;
			for(let i=0;i<count;i++) {
				if(tempReverseCount === 0) {
					if(targetIndex === 0) {
						counterReverse = i;
						break;
					}
					tempReverseCount = count;
				}
				if(tempReverseCount === targetIndex) {
					counterReverse = i;
					break;
				}
				tempReverseCount--;
			}
			for(let i=0;i<count;i++) {
				if(tempForwardCount === count) {
					tempForwardCount = 0;
				}
				if(tempForwardCount === targetIndex) {
					counterForward = i;
					break;
				}
				tempForwardCount++;
			}
			// rotate clockwise if less steps forward
			// otherwise rotate reverse
			if(counterForward < counterReverse) {
				newAngle = this.state.angle + counterForward * angleIncrement;
			} else {
				newAngle = this.state.angle - (counterReverse * angleIncrement);
			}
			this.setState({
				angle: newAngle,
				activeComponent: componentName,
				buttonIndex: targetIndex,
			});
			rings.style.transform = `rotate(${newAngle}deg)`;
		} else {
		}
		this.buttons.forEach(x => {
			x.classList.remove('active');
		});
		target.classList.add('active');
		this.setState({
			activeComponent: componentName,
		});
	}

	render() {
		const resizer = (this.state.activeComponent === "stocks")
			? "interface__svg--stocks"
			: (this.state.activeComponent === "weather")
			? "interface__svg--weather"
			: "";
		
		return (
			<div className="interface">

				<div className="interface__container" id="interface">
					{/* <div className="interface__ring interface__ring--inner"></div> */}
					<div className="interface__rings" id="interface-rings">
						<div className="interface__ring interface__ring--glow"></div>
						<div className="interface__ring interface__ring--outer"></div>
						<div className="interface__ring interface__ring--inner"></div>
						<svg
							viewBox="-.5 0 101 100"
							className={`interface__svg ${resizer}`}
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="50" cy="50" r="50" />
						</svg>
					</div>
					<div className="interface__buttons">
						{this.buttonData.map((item, i) => {     
							const count = this.buttonData.length;
							const so = 0;
							const cw = true;
							const radius = (.95 * 750 - 65) / 2;
							const posY = String(radius + -radius * Math.cos((360 / count / 180) * (i + so) * Math.PI)) + 'px';
      						const posX = String(radius + radius * (cw ? Math.sin((360 / count / 180) * (i + so) * Math.PI) : -Math.sin((360 / count / 180) * (i + so) * Math.PI))) + 'px';

							const isDesktop = window.matchMedia('(min-width: 60em)').matches;
							const x = (isDesktop)
								? posX
								: "auto";
							const y = (isDesktop)
								? posY
								: "auto";
							const buttonPosition = {
								top: y,
								left: x,
							}
							const activeClass = this.state.activeComponent === item.name
								? "active"
								: "";
							return (
								<button key={i} type="button" style={buttonPosition} onClick={this.navigate} className={`interface__button button-unstyled button-${item.name} ${activeClass}`} data-name={item.name} data-order={i}>
									<span className="visually-hidden">{item.label}</span>
									<svg className="icon-svg button-icon">
										<use xlinkHref={`#${item.icon}`}></use>
									</svg>
								</button>
							);
						})}
					</div>
					<div className="interface__content" id="interface-content">
						<Clock name="clock" active={this.state.activeComponent}></Clock>
						<Weather name="weather" active={this.state.activeComponent}></Weather>
						<Projects name="projects" active={this.state.activeComponent}></Projects>
						<Calculator name="calculator" active={this.state.activeComponent}></Calculator>
						<Stocks name="stocks" active={this.state.activeComponent}></Stocks>
					</div>
				</div>
			</div>
		);
	}
}
export default Interface;
