


////class LayoutElement {
////	constructor() {
		
////	}
	
////	render() {
////		return "<div>Hello World of Pane Layout!</div>"
////	}
////}

class LoremEl extends PaneBase {
	constructor(color) {
		super()
		this.color = color
	}
	
	setKey(key) {
		this.key = key;
	}
	
	getBackgroundColor() {
		return this.color;
	}
	
	click() {
		paneLayout.addPane_tabbedWith(new LoremEl('#'+Math.floor(Math.random()*16777215).toString(16)), this.key);
	}
	
	render() {
		var el = document.createElement("div");
		el.innerHTML = "Hello World!";
		el.addEventListener("click", this.click.bind(this));
		el.style.backgroundColor = this.color;
		el.classList.add("full");
		return el;
		return `<div style="background-color:${this.color};">Hello World of Pane Layout!</div>`
	}
}



var paneLayout = new PaneLayout(document.body, new LoremEl("#00ff00"));
