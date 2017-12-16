


function div (data, content){
	if (typeof content === "undefined") {
		content	= data	;
		classList	= []	;
		id	= null	;
		eventListeners	= []	;
		attributes	= []	;
	}
	else {
		classList	= data	.classList	;
		id	= data	.id	;
		eventListeners	= data	.eventListeners	;
		attributes	= data	.attributes	;
		
		if (typeof classList	=== "undefined") {	classList	= []	}
		if (typeof id	=== "undefined") {	id	= null	}
		if (typeof eventListeners	=== "undefined") {	eventListeners	= []	}
		if (typeof attributes	=== "undefined") {	attributes	= []	}
	}
	
	
	var el	= document.createElement("div");
	if (id != null) {
		el.id	= id;
	}
	for (cls of classList) {
		el.classList.add(cls);
	}
	
	if (!Array.isArray(content)) {
		content = [content];
	}
	for (child of content) {
		if (typeof child === "string") {
			el.innerHTML += child;
		}
		else {
			el.appendChild(child);
		}
	}
	
	for (listener of eventListeners) {
		el.addEventListener(...listener);
	}
	
	for (attribute of attributes) {
		el.setAttribute(...attribute);
	}
	
	return el;
}

(window.Element || Node).prototype.parentIndex = function () {
	var searchParent = this.parentNode;
	if (searchParent === null) return -1;
	var childElements = searchParent.children,
		lo = -1, mi, hi = childElements.length;
	while (1 + lo !== hi) {
		mi = (hi + lo) >> 1;
		if (!(this.compareDocumentPosition(childElements[mi]) & 0x2)) {
				hi = mi;
				continue;
		}
		lo = mi;
	}
	return childElements[hi] === this ? hi : -1;
}