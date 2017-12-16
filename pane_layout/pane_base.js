

window.PaneBase = class {
	constructor () {
		this.key = null;
	}
	getName() {
		console.log("PaneLayout: No Override for `getName` on Pane");
		return "Pane"
	}
	getBackgroundColor() {
		return "#fff"
	}
	setKey(key) {
		this.key = key;
	}
	render() {
		throw new Exception("PaneLayout: `render` method on pane not implemented")
	}
}