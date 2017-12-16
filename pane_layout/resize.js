

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
			barGrip.addEventListener("mousedown"	, this._mouseDown	.bind(this))
			barGrip.addEventListener("touchstart"	, this._touchDown	.bind(this))
			barGrip.addEventListener("mouseup"	, this._mouseUp	.bind(this))
			barGrip.addEventListener("touchend"	, this._touchUp   	.bind(this))
			barGrip.addEventListener("mousemove"	, this._mouseMove	.bind(this))
			barGrip.addEventListener("touchmove"	, this._touchMove	.bind(this))
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
		
		////document.removeEventListener("mouseup"	, this._mouseUp	.bind(this))
		////document.removeEventListener("touchend"	, this._touchUp  	.bind(this))
		////document.removeEventListener("mousemove"	, this._mouseMove	.bind(this))
		////document.removeEventListener("touchmove"	, this._touchMove	.bind(this))
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





