import React, { Component } from "react";
import NavMenu from "./NavMenu";
import "./Layout.css";

export class Layout extends Component {
	static displayName = Layout.name;

	render() {
		return (
			<>
				<NavMenu />
				<div className="layoutContainer">{this.props.children}</div>
			</>
		);
	}
}
