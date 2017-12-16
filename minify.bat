@echo off


IF EXIST pane_layout.js (
	del pane_layout.js
)

type "pane_layout\common.js" >> pane_layout.js

type "pane_layout\resize.js" >> pane_layout.js
type "pane_layout\pane_base.js" >> pane_layout.js

type "pane_layout\pane_layout.js" >> "pane_layout.js"


IF EXIST pane_layout.min.js (
	del pane_layout.min.js
)

closureCompiler pane_layout

pause