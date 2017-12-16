


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

class Resize {
	constructor (area, top, bottom, bar, barGrip, direction) {
		/*---assign attributes*/{
			//---passed values
			this.area	=	area	;
			this.top	=	top	;
			this.bottom	=	bottom	;
			this.bar	=	bar	;
			this.barGrip	=	barGrip	;
			this.direction	=	direction	;
		
			//---const
			this.DRAG_BUFFER_SIZE	=	4	;

			//---operating attributes
			this.resizeActive	=	false	;
			this.resizeStarted	=	false	;
			this.resizeStartPos	=	0	;
		}
		
		/*---processes*/{
			barGrip.addEventListener("mousedown",	this._mouseDown	.bind(this))
			barGrip.addEventListener("touchstart",	this._touchDown	.bind(this))
		}
	}
	
	
	
	/*
	Call the oppropriate sub functions to get the correct data to the main event handlers (`_down`, `_move`, `_up`)
	*/
	_mouseDown	(e) {	this._mouse	(this._down	.bind(this),	e);	}
	_mouseMove	(e) {	this._mouse	(this._move	.bind(this),	e);	}
	_mouseUp	(e) {	this._mouse	(this._up	.bind(this),	e);	}
	_touchDown	(e) {	this._touch	(this._down	.bind(this),	e);	}
	_touchMove	(e) {	this._touch	(this._move	.bind(this),	e);	}
	_touchUp	(e) {	this._touch	(this._up	.bind(this),	e);	}
	
	_mouse(toCall, e) {
		if (this.direction === "C") {
			return this._eventCaller(toCall, e, e.pageY)
		} else {
			return this._eventCaller(toCall, e, e.pageX)
		}
	}
	_touch(toCall, e) {
		if (this.direction === "C") {
			return this._eventCaller(toCall, e, e.touches[0].pageY)
		} else {
			return this._eventCaller(toCall, e, e.touches[0].pageX)
		}
	}
	/*
	Handles preventing default.
	*/
	_eventCaller(toCall, e, y) {
		if (toCall(y)) {
			return true;
		} else {
			e.preventDefault();
			return false;
		}
	}
	
	
	
	
	
	_down (y) {
		this.resizeStarted = true
		this.resizeStartPos = y
		
		document.addEventListener("mouseup"	, this._mouseUp	.bind(this))
		document.addEventListener("touchend"	, this._touchUp   	.bind(this))
		document.addEventListener("mousemove"	, this._mouseMove	.bind(this))
		document.addEventListener("touchmove"	, this._touchMove	.bind(this))
		
		return false
	}
	_move (y) {
		if (this.resizeStarted) {
			if (this.resizeStartPos < y - this.DRAG_BUFFER_SIZE || this.resizeStartPos > y + this.DRAG_BUFFER_SIZE) {
				this.resizeActive = true
				try {
					e.target.setCapture()
				} catch (e) { "catch resize e.target.setCapture()"}
			}
		}
		if (this.resizeActive) {
			this._setTopHeight(this._calulateTopHeight(y));
		}
		//if either
		if (this.resizeStarted || this.resizeActive) {
			return false
		}
	}
	_up (y) {
		var preventDefault = false
		//---actions
		////if (!this.resizeActive && this.resizeStarted) {
		////	if (this.getHeight("top") != 'auto') {
		////		this.setHeight("top", 'auto')
		////	}
		////	else {
		////		this.setHeight("top", '0px')
		////	}
		////	////if (this.getHeight("top") != 'auto') {
		////	////	this.setHeight("top", "50px")//auto not working ////'auto')
		////	////}
		////	////else {
		////	////	this.setHeight("top", '0px')
		////	////}
		////}
		//
		//---resize
		
		if (this.resizeActive) {
			this._setTopHeight(this._calulateTopHeight(y));
		}
		//---preventDefault stuff
		if (this.resizeStarted || this.resizeActive) {
			preventDefault = true
		}
		//---reset vars
		this.resizeActive	= false
		this.resizeStarted	= false
		document.removeEventListener("mouseup"	, this._mouseUp	.bind(this))
		document.removeEventListener("touchend"	, this._touchUp  	.bind(this))
		document.removeEventListener("mousemove"	, this._mouseMove	.bind(this))
		document.removeEventListener("touchmove"	, this._touchMove	.bind(this))
		//---apply prevent default
		if (preventDefault) {
			try {
				document.releaseCapture()
			} catch (e) { console.log("catch resize document.releaseCapture()") }
			return false
		}
	}
	
	
	
	
	
	_calulateTopHeight(eventY) {
		return (this._getRelEventY(eventY)/this._getClientHeight())*100 + "%";
	}
	
	
	
	_getRelEventY(eventY) {
		if (this.direction === "C") {
			return eventY - (this.area.getBoundingClientRect().top + this.area.clientTop)
		}
		else {
			return eventY - (this.area.getBoundingClientRect().left + this.area.clientLeft)
		}
	}
	_getClientHeight() {
		if (this.direction === "C") {
			return this.area.clientHeight
		}
		else {
			return this.area.clientWidth
		}
	}
	_setTopHeight(height) {
		if (this.direction === "C") {
			this.top.style.height = height
		}
		else {
			this.top.style.width = height
		}
	}
}



////class Resize {
////	/*
////	Split components will create an intance of this class.
////	*/
	
////	constructor (area, top, bottom, bar, barGrip, direction) {
////		this.area	=	area	;
////		this.top	=	top	;
////		this.bottom	=	bottom	;
////		this.bar	=	bar	;
////		this.barGrip	=	barGrip	;
////		this.direction	=	direction	;
		
////		////this.AUTO_MIN_HEIGHT = "64px"
////		////this.AUTO_MAX_HEIGHT = "calc(100% - 64px)"
////		this.DRAG_BUFFER_SIZE	=	4	;

////		this.resizeActive	=	false	;
////		this.resizeStarted	=	false	;
////		this.resizeStartPos	=	0	;
		
////		////this.getElement("barGrip").addEventListener("mousedown", this.mouseDown(e).bind(this))
////		////this.getElement("barGrip").addEventListener("touchstart", this.touchDown(e).bind(this))
////		document.addEventListener("mouseup"	, this.mouseUp	.bind(this))
////		document.addEventListener("touchend"	, this.touchUp   (e)	.bind(this))
////		document.addEventListener("mousemove"	, this.mouseMove(e)	.bind(this))
////		document.addEventListener("touchmove"	, this.touchMove(e)	.bind(this))
////	}

////	mouseDown (e) {
////		if (this.vH === "V") {
////			return this.mouseTouchDown(e.pageY, e)
////		} else {
////			return this.mouseTouchDown(e.pageX, e)
////		}
////	}
////	touchDown (e) {
////		if (this.vH === "V") {
////			return this.mouseTouchDown(e.touches[0].pageY, e)
////		} else {
////			return this.mouseTouchDown(e.touches[0].pageX, e)
////		}
////	}
////	mouseTouchDown (y, e) {
////		this.resizeStarted = true
////		this.resizeStartPos = y
////		this.startRenderingPos = this.getRenderingHeight("top")
////		e.preventDefault()
////		return false
////	}

////	mouseUp (e) {
////		return this.mouseTouchUp(e)
////	}
////	touchUp (e) {
////		return this.mouseTouchUp(e)
////	}
////	mouseTouchUp (e) {
////		var preventDefault = false
////		//---actions
////		if (!this.resizeActive && this.resizeStarted) {
////			if (this.getHeight("top") != 'auto') {
////				this.setHeight("top", 'auto')
////			}
////			else {
////				this.setHeight("top", '0px')
////			}
////			////if (this.getHeight("top") != 'auto') {
////			////	this.setHeight("top", "50px")//auto not working ////'auto')
////			////}
////			////else {
////			////	this.setHeight("top", '0px')
////			////}
////		}
////		//---preventDefault stuff
////		if (this.resizeStarted || this.resizeActive) {
////			preventDefault = true
////		}
////		//---reset vars
////		this.resizeActive = false
////		this.resizeStarted = false
////		//---apply prevent default
////		if (preventDefault) {
////			try {
////				document.releaseCapture()
////			} catch (e) { console.log("catch resize document.releaseCapture()") }
////			e.preventDefault()
////			return false
////		}
////	}

////	mouseMove (e) {
////		if (this.vH === "V") {
////			return this.mouseTouchMove(e.pageY, e)
////		} else {
////			return this.mouseTouchMove(e.pageX, e)
////		}
////	}
////	touchMove (e) {
////		if (this.vH === "V") {
////			return this.mouseTouchMove(e.touches[0].pageY, e)
////		} else {
////			return this.mouseTouchMove(e.touches[0].pageX, e)
////		}
////	}
////	mouseTouchMove (y, e) {
////		if (this.resizeStarted) {
////			if (this.resizeStartPos < y - this.DRAG_BUFFER_SIZE || this.resizeStartPos > y + this.DRAG_BUFFER_SIZE) {
////				this.resizeActive = true
////				try {
////					e.target.setCapture()
////				} catch (e) { "catch resize e.target.setCapture()"}
////			}
////		}
////		if (this.resizeActive) {
////			this.setHeight("top", ((y-this.resizeStartPos)+this.startRenderingPos) + 'px')
////		}
////		//if either
////		if (this.resizeStarted || this.resizeActive) {
////			e.preventDefault()
////			return false
////		}
////	}



////	getHeight (part) {
////		if (this.vH === "V") {
////			return this.getElement(part).style.height
////		} else {
////			return this.getElement(part).style.width
////		}
////	}
////	getRenderingHeight (part) {
////		if (this.vH === "V") {
////			return this.getElement(part).clientHeight//clientHeight or scrollHeight or offsetHeight
////		} else {
////			return this.getElement(part).clientWidth
////		}
////	}
////	setHeight (part, height) {
////		if (this.vH === "V") {
////			this.getElement(part).style.height = height
////			if (height == "auto") {
////				this.getElement(part).style.minHeight = this.AUTO_MIN_HEIGHT
////				this.getElement(part).style.maxHeight = this.AUTO_MAX_HEIGHT
////			} else {
////				this.getElement(part).style.minHeight = "0"
////				this.getElement(part).style.maxHeight = "100%"
////			}
////		} else {
////			this.getElement(part).style.width = height
////			if (height == "auto") {
////				this.getElement(part).style.minWidth = this.AUTO_MIN_HEIGHT
////				this.getElement(part).style.maxWidth = this.AUTO_MAX_HEIGHT
////			} else {
////				this.getElement(part).style.minWidth = "0"
////				this.getElement(part).style.maxWidth = "100%"
////			}
////		}
////	}
////	getElement (part) {
////		return document.getElementById(this.id+"_"+part)
////	}
////}







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

	/**
	Use this class to create a PaneLayout
	*/
window.PaneLayout = class {
		/**
		Create a pane layout.
		Params:
			`containerElement`	is the element that the `paneLayout` will fill.
				Any content in the element will be removed.
			`startingPane`	Currently the layout needs a single pane to start, this will be inproved later in development
		*/
	constructor(containerElement, startingPane) {
		this.containerElement	= containerElement;
		
		this._paneStuff	= new _PaneStuff(containerElement);
		
		{	;
			let key	= this._paneStuff.addPane(startingPane, this._renderPane(startingPane))	;
			
			this._paneStuff.put_floating	(key)	;
		}
	}
	
		/**
		Add a pane to the layout.
		Returns:
			Object with
				`"key"`	: the identifier used for pane
				`"el"`	: the dom element of pane (may not be in document yet) 
		*/
	addPane(pane, addToLayout=false, beforeDom=null) {
		////this.panes[this.panesNextKey] = {pane:pane, el:el}
		
		////return {key:this.panesNextKey++, el:el, pane:pane}
	}
	
	addPane_unrendered(pane) {
		var key	=	this._paneStuff.addPane	(pane, this._renderPane(pane))	;
		return key;
	}
	addPane_split(pane, otherDomRef, splitDirection) {
		var key	=	this._paneStuff.addPane	(pane, this._renderPane(pane))	;
		/*null*/		this._paneStuff.put_split	(key, otherDomRef, splitDirection)	;
		return key;
	}
	addPane_splitWith(pane, otherPaneKey, splitDirection) {
		this.addPane_split(pane, this._paneStuff._panes[otherPaneKey].domRef, splitDirection);
	}
	addPane_tabbed(pane, otherDomRef) {
		var key	=	this._paneStuff.addPane	(pane, this._renderPane(pane))	;
		/*null*/		this._paneStuff.put_tabbed	(key, otherDomRef)	;
		return key;
	}
	addPane_tabbedWith(pane, otherPaneKey) {
		this.addPane_tabbed(pane, this._paneStuff._panes[otherPaneKey].domRef);
		
	}
	addPane_addToTabs(pane, otherDomRef) {
		
	}
	addPane_addToTabsWith(pane, otherPaneKey) {
		
	}
	
		/**
		Render pane to el
		Returns:
			Rendered element of pane. 
		*/
	_renderPane(pane) {
		var el	= pane.render()
		if (typeof el === "string") {
			let	outer	;
			
			outer	= document.createElement("div")	;
			outer.innerHTML	= el	;
			el	= outer	;
		}
		
		return el;
	}
	
	////	/**
	////	Will update the DOM with any changes to the layout.
	////	This should be called automatically by any methods that change the layout.
	////	*/
	////_updateDom() {
	////	this.containerElement.appendChild(this._panes[this._paneLayout[0].pane].el);
	////}
	
}















////class _LayoutDom {
////	constructor(paneStuff, containerElement) {
////		this._paneStuff	=	paneStuff	;
////		this._containerElement	=	containerElement	;
					
////		////this._renderedLayout	=	[]	;
		
		
////		this._containerElement.style.position	=	"relative"
////		this._containerElement.innerHTML	=	""	;
////	}
	
////	updateDom() {
////		while (this._containerElement.children.length < this._paneStuff._paneLayout.length) {
////			let el = document.createElement("div")	;
////			/*---`el` class*/ {
////				if (this._containerElement.children.length === 0) {// main floater / non floater
////					el.classList.add("paneLayout_mainFloater");
////				}
////				else {
////					el.classList.add("paneLayout_floater")	;
////				}
////			}
				
////			this._containerElement.appendChild(el)	;
////		}
////		while (this._containerElement.children.length > this._paneStuff._paneLayout.length) {
////			//Todo
////		}
		
		
////		this._containerElement.appendChild(this._paneStuff._panes[this._paneStuff._paneLayout[0].pane].el)
		
////	}
	
////	//div.container
////	//	div.main
////	//		div.split.splitVertical
////	//			div.splitTop
////	//				pane
////	//			div.bar
////	//			div.splitBottom
////	//				pane
////	//	div.floater
////	//		pane
	
	
	
////	////diggingUpdate(renderedLayout, layout, parentEl) {
		
////	////	if (renderedLayout.is !== layout.is) {
////	////		if (renderedLayout !== null) {
////	////			//remove old
////	////			renderedLayout.el.parent.removeChild(renderedLayout.el)	;
////	////		}
////	////		//add
////	////		if (layout.is === "pane") {
////	////			parentEl.
////	////		}
////	////	}
		
////	////	[
////	////		[
////	////			{is:"pane"}
////	////		].is="split"
////	////		{is:"pane"}
////	////	]
////	////	[
////	////		[
////	////			{el:el}
////	////		].el=splitEl.bar=.barGrip=
////	////		{}.el
////	////	]
////	////}
////}

















class _PaneStuff {
	constructor(containerElement)	{
			this._containerElement	=	containerElement	;
			this._panes	=	{}	;
			this._panesNextKey	=	0	;
			
			this._containerElement.style.position	=	"relative"
			this._containerElement.innerHTML	=	""	;
		}
	
	
	/**
	Add a pane to `_panes`.
	This is a dumb function without much inteligent subsiquent opperation.
	Returns:
		The key of the pane, this should be used to add to pane layout.
	*/
	addPane(pane, el)	{
			el.setAttribute("data-paneLayout-key", this._panesNextKey);
			el.setAttribute("data-paneLayout-is", "pane");
			pane.setKey(this._panesNextKey);
			this._panes[this._panesNextKey] =	{
					el:el, 
					pane:pane
				};
			return this._panesNextKey++;
		}
	
	
	/**
	Removes a pane from `_panes`.
	This is a dumb function without much inteligent subsiquent opperation.
	*/
	deletePane(key)	{
			delete	this._panes[key];
		}
	
	
	
	
	_make_floater(child) {
		var el = document.createElement("div");
		el.style.width	= "100%"
		el.style.height	= "100%"
		el.appendChild(child);
		
		return el;
	}
	_make_tabbed(first, second)
		{
			/* If changing this be sure to update `this._getElFromDomRef`
			*/
			function tabClicked(e) {
				var tabId	= e.target.parentIndex()+1;
				var tabsEl	= e.target.parentElement;
				var tabbedEl	= tabsEl.parentElement;
				
				for (let tab of tabsEl.children) {
					if (tab.getAttribute("data-paneLayout-is") === "tabbed-tabs-tab") {
						tab.classList.remove	("paneLayout-tabbed-tab-active")	;
						tab.classList.add	("paneLayout-tabbed-tab-inactive")	;
					}
				}
				e.target.classList.remove	("paneLayout-tabbed-tab-inactive")	;
				e.target.classList.add	("paneLayout-tabbed-tab-active")
				
				{
					let count = 0;
					for (let tab of tabbedEl.children) {
						if (count !== 0) {
							if (count === tabId) {
								tab.classList.remove	("paneLayout-tabbed-tabContent-inactive")	;
								tab.classList.add	("paneLayout-tabbed-tabContent-active")	;
							}
							else {
								tab.classList.remove	("paneLayout-tabbed-tabContent-active")	;
								tab.classList.add	("paneLayout-tabbed-tabContent-inactive")	;
							}
						}
						count++;
					}
				}
			}
			
			var tabbedEl = div
				(
					{	"attributes"	:	[	["data-paneLayout-is", "tabbed"]	],
						"classList"	:	[	"paneLayout-tabbed"	]
					},
					[
						//tabsEl
						div	(	{	"attributes"	:	[	["data-paneLayout-is", "tabbed-tabs"]	],
									"classList"	:	[	"paneLayout-tabbed-tabs"	]
								},
								[
									div	(	{	"classList"	:	[	"paneLayout-tabbed-tab"	,
															"paneLayout-tabbed-tab-active"	],
												"attributes"	:	[	["data-paneLayout-is", "tabbed-tabs-tab"]	],
												"eventListeners"	:	[	["click",tabClicked]	],
											},
											this._panes[first.getAttribute("data-paneLayout-key")].pane.getName()
										),
									div	(
											{	"classList"	:	[	"paneLayout-tabbed-tab"	,
															"paneLayout-tabbed-tab-inactive"	],
												"attributes"	:	[	["data-paneLayout-is", "tabbed-tabs-tab"]	],
												"eventListeners"	:	[	["click",tabClicked]	],
											},
											this._panes[second.getAttribute("data-paneLayout-key")].pane.getName()
										),
										//filler
									div	(
											{	"classList"	:	[	"paneLayout-tabbed-tabs-filler"	],
											},
											""
										)
								]
							),
						
						//firstEl
						div	(	{	"classList"	:	[	"paneLayout-tabbed-tabContent"	,
												"paneLayout-tabbed-tabContent-active"	],
								},
								first
							),
						
						//secondEl
						div	(	{	"classList"	:	[	"paneLayout-tabbed-tabContent"	,
												"paneLayout-tabbed-tabContent-inactive"	],
								},
								second
							)
					]
				)
			////var tabbedEl = document.createElement("div");
			////tabbedEl.setAttribute("data-paneLayout-is", "tabbed");
			////tabbedEl.classList.add("paneLayout-tabbed");
			
			
			////var tabsEl = document.createElement("div");
			////tabsEl.setAttribute("data-paneLayout-is", "tabbed-tabs");
			////tabsEl.classList.add("paneLayout-tabbed-tabs");
			////let firstTab	= null;
			////let secondTab	= null;
			////let tabFiller	= null;
			////{
			////	firstTab = document.createElement("div");
			////	firstTab.classList.add("paneLayout-tabbed-tab");
			////	firstTab.classList.add("paneLayout-tabbed-tab-active");
			////	firstTab.innerHTML = this._panes[first.getAttribute("data-paneLayout-key")].pane.getName()
			////	firstTab.addEventListener("click", )
			////}{
			////	secondTab = document.createElement("div");
			////	secondTab.classList.add("paneLayout-tabbed-tab");
			////	secondTab.classList.add("paneLayout-tabbed-tab-inactive");
			////	secondTab.innerHTML = this._panes[second.getAttribute("data-paneLayout-key")].pane.getName()
			////}{
			////	tabFiller = document.createElement("div");
			////	tabFiller.classList.add("paneLayout-tabbed-tabs-filler");
			////}
			////tabsEl.appendChild(firstTab);
			////tabsEl.appendChild(secondTab);
			////tabsEl.appendChild(tabFiller);
			
			
			////var f	= document.createElement("div"); 
			////var s	= document.createElement("div");
			////{
			////	f.classList.add("paneLayout-tabbed-tabContent");
			////	f.classList.add("paneLayout-tabbed-tabContent-active");
			////	f.appendChild(	first	);
			////}{
			////	s.classList.add("paneLayout-tabbed-tabContent");
			////	s.classList.add("paneLayout-tabbed-tabContent-inactive");
			////	s.appendChild(	second	);
			////}
			
			////tabbedEl.appendChild(tabsEl);
			////tabbedEl.appendChild(f);
			////tabbedEl.appendChild(s);
			
			
			return tabbedEl;
		}
	
	_make_split(top,bottom,direction)
		{
			/* If changing this be sure to update `this._getElFromDomRef`
			*/
			var splitEl = document.createElement("div");
			splitEl.setAttribute("data-paneLayout-is", "split");
			splitEl.classList.add("paneLayout-split");
			splitEl.classList.add("paneLayout-split"+direction);
			
			
			var t	= document.createElement("div"); 
			var b	= document.createElement("div"); 
			var bar	= document.createElement("div");
			var grip = document.createElement("div");
		
			{
				t.classList.add("paneLayout-split-top");
				t.classList.add("paneLayout-split"+direction+"-top");
				t.appendChild(	top	);
			}{
				b.classList.add("paneLayout-split-bottom");
				b.classList.add("paneLayout-split"+direction+"-bottom");
				b.appendChild(	bottom	);
			}{
				bar.classList.add("paneLayout-split-bar");
				bar.classList.add("paneLayout-split"+direction+"-bar");
				
				grip.classList.add("paneLayout-split-barGrip");
				grip.classList.add("paneLayout-split"+direction+"-barGrip");
				
				bar.appendChild(grip);
			}
			
			
			splitEl.appendChild(t);
			splitEl.appendChild(bar);
			splitEl.appendChild(b);
			
			new Resize(splitEl, t, b, bar, grip, direction);
			
			return splitEl;
		}
	
	_getElFromDomRef(domRef, refDepth=0, parentEl=null)
		{
			var el = null;
			
			if (refDepth === 0) {// `parentEl` will be `null` as well
				el = this._containerElement.children[domRef[0]].firstChild;
			}
			else if (parentEl.getAttribute("data-paneLayout-is") === "split") {
				if (domRef[refDepth] === "0") {
					el = parentEl.children[0].firstChild;
				}
				else if (domRef[refDepth] === "1") {
					el = parentEl.children[2].firstChild;
				}
			}
			else if (parentEl.getAttribute("data-paneLayout-is") === "tabbed") {
				el = parentEl.children[String(Number(domRef[refDepth])+1)].firstChild;
			}
			
			
			if (refDepth === domRef.length-1) {// Found
				return el;
			}
			else {
				return this._getElFromDomRef(domRef, refDepth+1, el);
			}
		}
	
	
	/**
	Put methods to add to paneLayout.
	These methods are "dumb" (they will not do things like check for new pane prexisting in `_paneLayout`).
	*/
	//---Put Methods 
		put_floating(paneKey)	{
				this._panes[paneKey].domRef = String( this._containerElement.children.length );
				
				var floaterEl = this._make_floater(this._panes[paneKey].el);
				this._containerElement.appendChild(floaterEl)	;
			}
	
		put_replace(paneKey, otherPaneDomRef)
			{
				var layoutContainer	= this._layoutRefDigger(otherPaneLayoutRef)	;
				var lastLayoutRefIndex	= otherPaneLayoutRef[otherPaneLayoutRef.length-1]	;
			
				layoutContainer[lastLayoutRefIndex] = {is:"pane", pane:paneKey}	;
			}
	
		put_split(paneKey, otherDomRef, splitDirection, topOrBottom="top")
			{
				/*---Validate*/{
					if (topOrBottom !== "top" && topOrBottom !== "bottom") {
						console.log(topOrBottom);
						throw new Exception("topOrBottom cannot be '"+topOrBottom+"'")
					}
				}
				
				var otherEl	= this._getElFromDomRef(otherDomRef)	;
				var otherKey	= otherEl.getAttribute("data-paneLayout-key")	;
				var parent	= otherEl.parentElement	;
				var placeHolder	= document.createElement("div")	;
				
				/*---`placeHolder`*/{
					parent.replaceChild(placeHolder, otherEl)
				}
				
				/*---DOM ref*/{
					/*always*/	this._panes[	paneKey	]	.domRef 	= 	String(otherDomRef)+(topOrBottom==="top"?"0":"1");
					if (otherKey) {	this._panes[	otherKey	]	.domRef 	= 	String(otherDomRef)+(topOrBottom==="top"?"1":"0");	}
				}
				/*---Create Split El and add to DOM*/{
					var splitEl = this._make_split(this._panes[paneKey].el, otherEl, splitDirection);
					parent.replaceChild(splitEl, placeHolder);
				}
				
			}
	
		put_tabbed(paneKey, otherDomRef)
			{
				
				var otherEl	= this._getElFromDomRef(otherDomRef)	;
				var otherKey	= otherEl.getAttribute("data-paneLayout-key")	;
				var parent	= otherEl.parentElement	;
				var placeHolder	= document.createElement("div")	;
				
				/*---`placeHolder`*/{
					parent.replaceChild(placeHolder, otherEl)
				}
				
				/*---DOM ref*/{
					/*always*/	this._panes[	paneKey	]	.domRef 	= 	String(otherDomRef)+("0");
					if (otherKey) {	this._panes[	otherKey	]	.domRef 	= 	String(otherDomRef)+("1");	}
				}
				/*---Create Tabbed El and add to DOM*/{
					var tabbedEl = this._make_tabbed(this._panes[paneKey].el, otherEl);
					parent.replaceChild(tabbedEl, placeHolder);
				}
				////var layoutContainer	= this._layoutRefDigger(otherPaneLayoutRef)	;
				////var lastLayoutRefIndex	= otherPaneLayoutRef[otherPaneLayoutRef.length-1]	;
			
				////let newTabbed;
				////{
				////	newTabed	= [	layoutContainer[lastLayoutRefIndex]	,	
				////			{is:"pane", pane:paneKey}	]	;
				////	newTabed.is	= "tabbed";
				////}
				////layoutContainer[lastLayoutRefIndex] = newTabed	;
			}
		
		put_inTabbed(paneKey, otherDomRef)
			{
				var layoutContainer	= this._layoutRefDigger(otherPaneLayoutRef)	;
				var lastLayoutRefIndex	= otherPaneLayoutRef[otherPaneLayoutRef.length-1]	;
			
				layoutContainer[lastLayoutRefIndex].push({is:"pane", pane:paneKey})	;
			}
	//---
	
	
	/**
	Digs into layout to get a layout ref, using recursion.
	Returns:
		The last object with the refed item in it
		To access the refed item use `returned[lastRefIndex]`
	*/
	_layoutRefDigger(layoutRef, refDepth=0, layoutPart=null)	{
			if (layoutPart === null) {
				layoutPart = this._paneLayout;
			}
			
			if (layoutRef.length - 1 === refDepth) {
				return layoutPart;
			}
			else {
				return digger(layoutRef, refDepth+1, layoutPart[layoutRef[refDepth]]);
			}
		}
} 


