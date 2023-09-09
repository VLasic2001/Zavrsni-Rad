import React, { Component } from "react";
import "./Layout.css";

export class Layout extends Component {
	static displayName = Layout.name;

	render() {
		return (
			<>
				<div className="layoutContainer">{this.props.children}</div>
			</>
		);
	}
}
