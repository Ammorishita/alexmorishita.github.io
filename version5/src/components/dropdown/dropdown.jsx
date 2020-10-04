import React from 'react';

class Dropdown extends React.Component {
	constructor(props) {
		super();
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.state = {
			active : true
		};
	}

	toggleDropdown(e) {
		// this.setState({
		// 	active : !this.state.active
		// });
		const element = document.getElementById('dropdown');
		element.style.visibility = 'hidden';
		element.style.position = 'absolute';
		element.style.display = 'block';
		const position = window.getComputedStyle(element).getPropertyValue('position');
		const height = element.offsetHeight;
		element.style.visibility = 'visible';
		element.style.visibility = position;
		element.style.height = '0px';
		let inc = height / 40;
		let currentHeight = element.offsetHeight;
		const timer = setInterval(() => {
			const h = parseInt(element.style.height);
			element.style.height = h + inc + 'px';
			console.log('h', h);
			console.log('inc', inc);
			currentHeight = parseInt(element.style.height, 10);
			// console.log('current height', currentHeight);
			if(currentHeight >= height) {
				element.style.height = '';
				clearInterval(timer);
			}
		},16);
	}
	render() {
		return (
			<div>
				<div className="dropdown" id="dropdown">
					<div className="dropdown__content">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis cumque laborum deleniti, perferendis quas itaque doloremque nesciunt vitae vel dolorNobis cumque laborum deleniti, perferendis quas m totam amet exNobis cumque laborum deleniti, perferendis quas itaque doloremque nesciunt vitae vel dolore, quia laudantium molestias repes repellendus? Et ducimus laboriosam totam amet exe, quia laudantium molestias repellendus? Et ducimus laboriosam totam amet ex!</div>
				</div>
				<button className="dropdown__button button-unstyled" type="button" onClick={this.toggleDropdown} data-toggle="dropdown">Toggle</button>
			</div>
		)
	}
}
export default Dropdown;