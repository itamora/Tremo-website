function detectZoom() {
	var ratio = 0,
		screen = window.screen,
		ua = navigator.userAgent.toLowerCase();
	
	if (window.devicePixelRatio !== undefined) {
		ratio = window.devicePixelRatio;
	}
	else if (~ua.indexOf('msie')) {
		if (screen.deviceXDPI && screen.logicalXDPI) {
			ratio = screen.deviceXDPI / screen.logicalXDPI;
		};
	}
	else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
		ratio = window.outerWidth / window.innerWidth;
	};
	return ratio;
};

function detectTheme(event) {
	switch (event.matches) {
		case true:
			return "dark";
			break;
		default:
			return "light";
			break;
	};
};

function detectThemeContrast() { // change Theme when Contrast on || change Theme when Contrast off || turn off Contrast
	for (let i = document.styleSheets[11].cssRules.length -1; i > -1; i--) {
		document.styleSheets[11].deleteRule(i);
	};
	switch (config.themeContrast) {
		case false: // change Theme when Contrast off || turn off Contrast
			coloring();
			break;
		default: // change Theme when Contrast on
			switch (__status__.theme) {
				case "night":
					config.themeContrast = !config.themeContrast;
					break;
				default:
					__status__.theme = `${__status__.theme}Contrast`;
					break;
			};
			coloring();
			break;
	};
};

function autoThemeChangeTo(event) {
	__status__.theme = detectTheme(event);
	detectThemeContrast()
};

function faviconPainting() {
	function faviconP() {
		document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").strokeStyle = `rgba(${THEME[__status__.theme].basicForegroundColor})`;
		document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").stroke();
	};
	function radioP(id) {
		document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").fillStyle = `rgba(${THEME[__status__.theme].buttonFaviconColor})`;
		document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").arc(20, 18, 2.25, 0, 2 * Math.PI);
		document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").fill();
	};
	function switcherP(configItem, id) {
		switch (config[configItem]) {
			case false:
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).height = document.getElementById(`_${decls[DECLS.indexOf(id)]}`).height;
				break;
			default:
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").strokeStyle = `rgba(${THEME[__status__.theme].buttonFaviconColor})`;
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").lineWidth = 1;
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").beginPath();
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").moveTo(13, 18.5);
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").lineTo(18, 23.5);
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").lineTo(27, 14.5);
				document.getElementById(`_${decls[DECLS.indexOf(id)]}`).getContext("2d").stroke()
				break;
		};
	};
	return {
		radioRP: function (cls, id) {
			Array.from(document.getElementsByClassName(`_${decls[DECLS.indexOf(cls)]}`)).forEach((canvas) => {
				canvas.height = canvas.height;
			});
			radioP(id);
		},
		switcherRP: function (configItem, id) {
			switcherP(configItem, id);
		},
		RP: function () {
			faviconP();
			faviconPainting().radioRP("favicon-of-theme-changeTo", `favicon-of-theme-changeTo-${config.theme}`);
			faviconPainting().switcherRP("themeContrast", "favicon-of-theme-switcher-contrast");
		},
		P: function () {
			faviconP();
			radioP(`favicon-of-theme-changeTo-${config.theme}`);
			switcherP("themeContrast", "favicon-of-theme-switcher-contrast");
		}
	};
};

function themeContrastChangeTo() { // change Theme the same || turn on Contrast
	switch (config.themeContrast) {
		case !__status__.themeContrast: // turn on Contrast
			__status__.theme = `${__status__.theme}Contrast`;
			coloring();
			break;
		default: // change Theme the same
			faviconPainting().radioRP("favicon-of-theme-changeTo", `favicon-of-theme-changeTo-${config.theme}`)
			localStorage.setItem("config.theme", config.theme);
			break;
	};
};

const MEDIA_QUERY_LIST = {
	"prefers-color-scheme": window.matchMedia("(prefers-color-scheme: dark)")
};

function themeChangeTo() {
	switch (config.theme) {
		case __status__.theme: // change Theme the same
			themeContrastChangeTo();
			break;
		default:
			switch (config.theme) {
				case "auto":
					switch (detectTheme(MEDIA_QUERY_LIST["prefers-color-scheme"])) {
						case __status__.theme: // change Theme the same
							themeContrastChangeTo();
							break;
						default:
							autoThemeChangeTo(MEDIA_QUERY_LIST["prefers-color-scheme"])
							MEDIA_QUERY_LIST["prefers-color-scheme"].removeListener(autoThemeChangeTo);
							MEDIA_QUERY_LIST["prefers-color-scheme"].addListener(autoThemeChangeTo);
							break;
					};
					break;
				default:
					__status__.theme = config.theme;
					detectThemeContrast()
					switch (config.theme) {
						case "night":
							document.styleSheets[11].insertRule(`#_${decls[DECLS.indexOf("theme-switch-contrast")]}::before { color: rgba(${THEME[__status__.theme].basicActiveForegroundColor}); }`, document.styleSheets[11].cssRules.length);
							document.styleSheets[11].insertRule(`._${decls[DECLS.indexOf("theme-switch-contrast")]}::after { color: rgba(${THEME[__status__.theme].discActiveForegroundColor}); }`, document.styleSheets[11].cssRules.length);
							document.styleSheets[11].insertRule(`#_${decls[DECLS.indexOf("theme-switch-contrast")]} { pointer-events: none; }`, document.styleSheets[11].cssRules.length);
							break;
					};
					MEDIA_QUERY_LIST["prefers-color-scheme"].removeListener(autoThemeChangeTo);
					break;
			};
			break;
	};
};

var decls = [];
const DECLS = ["wrapper", "header", "nav", "brand", "logo", "caller-of-menuFlyOut-of-config", "favicon-of-caller-of-menuFlyOut-of-config", "calling-of-menuFlyOut-of-config", "menuFlyOut-of-config", "main", "menuFlyOut", "group-in-menuFlyOut", "radioButton", "switchButton", "button", "wrappingButton", "favicon-in-button", "interaction-caller", "interaction-calling", "theme-changeTo", "favicon-of-theme-changeTo", "theme-changeTo-auto", "favicon-of-theme-changeTo-auto", "theme-changeTo-light", "favicon-of-theme-changeTo-light", "theme-changeTo-dark", "favicon-of-theme-changeTo-dark", "theme-changeTo-night", "favicon-of-theme-changeTo-night", "theme-switcher", "theme-switcher-contrast", "favicon-of-theme-switcher-contrast", "acrylic", "top-image", "left-in-main", "center-in-main", "right-in-main", "card-of-article", "image-in-card-of-article", "textBox-in-card-of-article", "title-in-textBox-in-card-of-article", "para-in-textBox-in-card-of-article", "timeStamp-in-textBox-in-card-of-article"];

const THEME = {
	"light": {"accentColor": "", "basicForegroundColor": "26, 26, 26, 1", "basicActiveForegroundColor": "45, 45, 45, 1", "discForegroundColor": "83, 83, 83, 1", "discActiveForegroundColor": "143, 143, 143, 1", "miscForegroundColor": "165, 165, 165, 1", "UNUSED": "172, 172, 172, 1", "basicBackgroundColor": "243, 243, 243, 1", "contentBackgroundColor": "249, 249, 249, 1", "layerCoverColor": "253, 253, 253, 1", "buttonBackgroundColor": "251, 251, 251, 1", "borderColor": "0, 0, 0, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "255, 255, 255, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonHoverColor": "0, 0, 0, .02352", "buttonActiveColor": "0, 0, 0, .03529", "buttonFaviconColor": "83, 83, 83, 1", "menuSeparatorColor": "0, 0, 0, .05882", "scrollbarColor": "241, 241, 241, 1", "scrollbarThumbColor": "193, 193, 193, 1", "scrollbarThumbHoverColor": "168, 168, 168, 1", "scrollbarThumbActiveColor": "120, 120, 120, 1", "scrollbarButtonColor": "163, 163, 163, 1"},
	"dark": {"accentColor": "", "basicForegroundColor": "255, 255, 255, 1", "basicActiveForegroundColor": "234, 234, 234, 1", "discForegroundColor": "215, 215, 215, 1", "discActiveForegroundColor": "197, 197, 197, 1", "miscForegroundColor": "102, 102, 102, 1", "UNUSED": "94, 94, 94, 1", "basicBackgroundColor": "32, 32, 32, 1", "contentBackgroundColor": "39, 39, 39, 1", "layerCoverColor": "50, 50, 50, 1", "buttonBackgroundColor": "45, 45, 45, 1", "borderColor": "255, 255, 255, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "0, 0, 0, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonHoverColor": "255, 255, 255, .03921", "buttonActiveColor": "255, 255, 255, .05882", "buttonFaviconColor": "207, 207, 207, 1", "menuSeparatorColor": "255, 255, 255, .15686", "scrollbarColor": "66, 66, 66, 1", "scrollbarThumbColor": "104, 104, 104, 1", "scrollbarThumbHoverColor": "123, 123, 123, 1", "scrollbarThumbActiveColor": "161, 161, 161, 1", "scrollbarButtonColor": "128, 128, 128, 1"},
	"night": {"accentColor": "", "basicForegroundColor": "230, 230, 230, 1", "basicActiveForegroundColor": "211, 211, 211, 1", "discForegroundColor": "194, 194, 194, 1", "discActiveForegroundColor": "178, 178, 178, 1", "miscForegroundColor": "86, 86, 86, 1", "UNUSED": "78, 78, 78, 1", "basicBackgroundColor": "16, 16, 16, 1", "contentBackgroundColor": "23, 23, 23, 1", "layerCoverColor": "34, 34, 34, 1", "buttonBackgroundColor": "29, 29, 29, 1", "borderColor": "255, 255, 255, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "0, 0, 0, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonHoverColor": "255, 255, 255, .03921", "buttonActiveColor": "255, 255, 255, .05882", "buttonFaviconColor": "191, 191, 191, 1", "menuSeparatorColor": "255, 255, 255, .15686", "scrollbarColor": "50, 50, 50, 1", "scrollbarThumbColor": "88, 88, 88, 1", "scrollbarThumbHoverColor": "107, 107, 107, 1", "scrollbarThumbActiveColor": "145, 145, 145, 1", "scrollbarButtonColor": "116, 116, 116, 1"},
	"lightContrast": {},
	"darkContrast": {}
};

var config = {
	"theme": "auto",
	"themeContrast": false,
	"articlesPrintPerTime": 10
};

var __status__ = {
	"theme": "",
	"themeContrast": false,
	"previousOpenCalling": undefined,
	"initialized": false,
	"articlesPrinted": 0,
	"articlesPrintingTarget": 0,
	"articlesPrinting": false
};

function coloring() {
	for (let i = document.styleSheets[1].cssRules.length - 1; i > -1; i--) {
		document.styleSheets[1].deleteRule(i)
	};
	document.styleSheets[1].insertRule(`::-webkit-scrollbar { background-color: rgba(${THEME[__status__.theme].scrollbarColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`::-webkit-scrollbar-thumb { background-color: rgba(${THEME[__status__.theme].scrollbarThumbColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`::-webkit-scrollbar-thumb:hover { background-color: rgba(${THEME[__status__.theme].scrollbarThumbHoverColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`::-webkit-scrollbar-thumb:active { background-color: rgba(${THEME[__status__.theme].scrollbarThumbActiveColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`* { color: rgba(${THEME[__status__.theme].basicForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`body { background-color: rgba(${THEME[__status__.theme].basicBackgroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("button")]}:hover { background-color: rgba(${THEME[__status__.theme].buttonHoverColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("button")]}:active { background-color: rgba(${THEME[__status__.theme].buttonActiveColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("button")]}::after { color: rgba(${THEME[__status__.theme].discForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("button")]}:active::before { color: rgba(${THEME[__status__.theme].basicActiveForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("button")]}:active::after { color: rgba(${THEME[__status__.theme].discActiveForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("group-in-menuFlyOut")]}:not(:last-of-type) { border-width: 0 0 1px 0; border-style: none none solid none; border-color: rgba(${THEME[__status__.theme].menuSeparatorColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("acrylic")]} { box-shadow: rgba(${THEME[__status__.theme].AcrylicBorderColor}) 0 0 0 1px inset; backdrop-filter: blur(${THEME[__status__.theme].AcrylicBrushBlurAmount}px) brightness(${THEME[__status__.theme].AcrylicBrushTintLuminosityOpacity}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div::before { content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: ${THEME[__status__.theme].AcrylicBrushTintOpacity}; background-color: rgba(${THEME[__status__.theme].AcrylicBrushTintColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div::after {
		content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: ${THEME[__status__.theme].AcrylicBrushNoiseOpacity}; background: url(data:image/png;base64,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);
	}`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("card-of-article")]} { box-shadow: rgba(${THEME[__status__.theme].borderColor}) 0 0 0 1px inset; }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`._${decls[DECLS.indexOf("timeStamp-in-textBox-in-card-of-article")]} { color: rgba(${THEME[__status__.theme].miscForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`#_${decls[DECLS.indexOf("logo")]} { box-shadow: 0 0 0 2px rgba(${THEME[__status__.theme].basicActiveForegroundColor}) inset; color: rgba(${THEME[__status__.theme].basicActiveForegroundColor}); }`, document.styleSheets[1].cssRules.length);
	document.styleSheets[1].insertRule(`#_${decls[DECLS.indexOf("top-image")]} { background: url() center / 100% no-repeat rgba(${THEME[__status__.theme].layerCoverColor}); }`, document.styleSheets[1].cssRules.length);
	switch (__status__.initialized) {
		case true:
			faviconPainting().RP();
			__status__.themeContrast = config.themeContrast;
			localStorage.setItem("config.theme", config.theme);
			localStorage.setItem("config.themeContrast", config.themeContrast);
			break;
	};
};

async function articlesPrinting() {
	__status__.articlesPrintingTarget = (articles.length > __status__.articlesPrinted + config.articlesPrintPerTime) ? (__status__.articlesPrinted + config.articlesPrintPerTime) : articles.length;
	var tmp = "";
	var article = {};
	// var img = new Image();
	for (let i = __status__.articlesPrinted; i < __status__.articlesPrintingTarget; i++) {
		console.log(i);
		await fetch(`./assets/articles/${articles[i].uuid}/index.json`)
			.then(response => response.json())
			.then(data => article = data);
		tmp += `
			<div id="_${articles[i].uuid}" class="_${decls[DECLS.indexOf("card-of-article")]}">
				<img class="_${decls[DECLS.indexOf("image-in-card-of-article")]}" src="./assets/articles/${articles[i].uuid}/cover.png" onerror="this.remove();" />
				<div class="_${decls[DECLS.indexOf("textBox-in-card-of-article")]}">
					<span class="_${decls[DECLS.indexOf("title-in-textBox-in-card-of-article")]}">${article.title}</span>
					<span class="_${decls[DECLS.indexOf("para-in-textBox-in-card-of-article")]}">${article.para.replace(/<img.+>/, " ").split(".", 5).join(".")}...</span>
					<span class="_${decls[DECLS.indexOf("timeStamp-in-textBox-in-card-of-article")]}">${new Date(article.timeStamp).toLocaleDateString()}</span>
				</div>
			</div>
		`
	};
	document.getElementById(`_${decls[DECLS.indexOf("center-in-main")]}`).innerHTML += tmp;
	// for (let i = __status__.articlesPrinted; i < __status__.articlesPrintingTarget; i++) {
		// img = new Image();
		// img.src = `./assets/articles/${articles[i].uuid}/cover.png`;
		// img.onerror = () => {document.getElementById(`_${articles[i].uuid}`).firstElementChild.remove();}
		// console.log(img);
	// };
	tmp = undefined;
	article = undefined;
	// img = undefined;
	__status__.articlesPrinted = __status__.articlesPrintingTarget;
	__status__.articlesPrinting === false;
};

function main() {
	var decl;
	for (let i = decls.length; i < DECLS.length; i++) {
		decl = `${ALPHABET[Math.trunc(Math.random() * 36)] + ALPHABET[Math.trunc(Math.random() * 36)] + ALPHABET[Math.trunc(Math.random() * 36)] + ALPHABET[Math.trunc(Math.random() * 36)] + ALPHABET[Math.trunc(Math.random() * 36)]}`;
		switch (decls.includes(decl)){
			case false:
				decls.push(decl);
				break;
			default:
				i--;
				break;
		};
	};
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("button")]} { align-items: center; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("favicon-in-button")]} { order: -1; pointer-events: none; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("wrappingButton")]} { width: calc(100% - 10px); height: 36px; margin: 2px 0; z-index: 1; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}::before { flex: 1; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}::after { margin: 0 40px 0 0; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("menuFlyOut")]} { flex-direction: column; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("group-in-menuFlyOut")]} { width: 100%; flex-direction: column; align-items: center; padding: 3px 0; z-index: 1; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("interaction-caller")]}, ._${decls[DECLS.indexOf("interaction-calling")]}, ._${decls[DECLS.indexOf("button")]} { border-radius: 5px; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("interaction-calling")]} { display: none; position: absolute; height: 0; overflow-y: hidden; transition: cubic-bezier(0, 0, 0, 1) height .3s; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("acrylic")]} { box-shadow: 0 12px 20px rgba(0, 0, 0, .15); }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div { position: relative; width: 100%; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("card-of-article")]} { margin: 6px 0; flex-direction: column; border-radius: 5px; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("image-in-card-of-article")]} { border-radius: 5px 5px 0 0 ; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("textBox-in-card-of-article")]} { padding: 36px 36px; flex-direction: column; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`._${decls[DECLS.indexOf("title-in-textBox-in-card-of-article")]} { font-size: 20px; font-weight: 600; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("wrapper")]}, #_${decls[DECLS.indexOf("header")]} { width:100%; flex-direction: column; align-items: center; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("nav")]}, #_${decls[DECLS.indexOf("main")]} { width: 85%; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("nav")]} { height: 54px; margin: 0 0 2px 0; justify-content: space-between; align-items: center; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("top-image")]} { width: 85%; height: 0; padding-top: 17.73%; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("logo")]} { width: 24px; height: 24px; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("logo")]}::after { position: relative; top: -2px; left: 30px; content: "Tremo"; font-size: 20px; font-weight: 600; filter: grayscale(1); }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("caller-of-menuFlyOut-of-config")]} { width: 40px; height: 36px; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("calling-of-menuFlyOut-of-config")]} { top: 42px; right: 7.5%; width: 298px; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-changeTo-auto")]}::before { content: "Auto"; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-changeTo-light")]}::before { content: "Light"; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-changeTo-dark")]}::before { content: "Dark"; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-changeTo-night")]}::before { content: "Night"; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-switcher-contrast")]}::before { content: "Contrast"; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("theme-switcher-contrast")]}::after { content: "Coming soon..."; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("main")]} { height: 2000px; padding: 25px 7.5%; justify-content: space-around; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("main")]} > div { flex-direction: column; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("left-in-main")]}, #_${decls[DECLS.indexOf("right-in-main")]} { width: 24%; }`, document.styleSheets[0].cssRules.length);
	document.styleSheets[0].insertRule(`#_${decls[DECLS.indexOf("center-in-main")]} { width: 48%; }`, document.styleSheets[0].cssRules.length);
	switch (localStorage["config.theme"]) {
		case undefined:
			break;
		default:
			config.theme = localStorage["config.theme"]
			config.themeContrast = JSON.parse(localStorage["config.themeContrast"])
			break;
	};
	themeChangeTo();
	document.querySelector("body").innerHTML = `
		<div id="_${decls[DECLS.indexOf("wrapper")]}">
			<div id="_${decls[DECLS.indexOf("header")]}">
				<div id="_${decls[DECLS.indexOf("nav")]}">
					<div id="_${decls[DECLS.indexOf("brand")]}">
						<div id="_${decls[DECLS.indexOf("logo")]}"></div>
					</div>
					<div id="_${decls[DECLS.indexOf("caller-of-menuFlyOut-of-config")]}" class="_${decls[DECLS.indexOf("interaction-caller")]} _${decls[DECLS.indexOf("button")]}">
						<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}" class="_${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
						<div id="_${decls[DECLS.indexOf("calling-of-menuFlyOut-of-config")]}" class="_${decls[DECLS.indexOf("interaction-calling")]} _${decls[DECLS.indexOf("acrylic")]}">
							<div id="_${decls[DECLS.indexOf("menuFlyOut-of-config")]}" class="_${decls[DECLS.indexOf("menuFlyOut")]}">
								<div class="_${decls[DECLS.indexOf("group-in-menuFlyOut")]}">
									<div id="_${decls[DECLS.indexOf("theme-changeTo-auto")]}" class="_${decls[DECLS.indexOf("theme-changeTo")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]} _${decls[DECLS.indexOf("button")]}">
										<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-theme-changeTo-auto")]}" class="_${decls[DECLS.indexOf("favicon-of-theme-changeTo")]} _${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
									</div>
									<div id="_${decls[DECLS.indexOf("theme-changeTo-light")]}" class="_${decls[DECLS.indexOf("theme-changeTo")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]} _${decls[DECLS.indexOf("button")]}">
										<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-theme-changeTo-light")]}" class="_${decls[DECLS.indexOf("favicon-of-theme-changeTo")]} _${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
									</div>
									<div id="_${decls[DECLS.indexOf("theme-changeTo-dark")]}" class="_${decls[DECLS.indexOf("theme-changeTo")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]} _${decls[DECLS.indexOf("button")]}">
										<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-theme-changeTo-dark")]}" class="_${decls[DECLS.indexOf("favicon-of-theme-changeTo")]} _${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
									</div>
									<div id="_${decls[DECLS.indexOf("theme-changeTo-night")]}" class="_${decls[DECLS.indexOf("theme-changeTo")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]} _${decls[DECLS.indexOf("button")]}">
										<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-theme-changeTo-night")]}" class="_${decls[DECLS.indexOf("favicon-of-theme-changeTo")]} _${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
									</div>
								</div>
								<div class="_${decls[DECLS.indexOf("group-in-menuFlyOut")]}">
									<div id="_${decls[DECLS.indexOf("theme-switcher-contrast")]}" class="_${decls[DECLS.indexOf("theme-switcher")]} _${decls[DECLS.indexOf("switcherButton")]} _${decls[DECLS.indexOf("wrappingButton")]} _${decls[DECLS.indexOf("button")]}">
										<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-theme-switcher-contrast")]}" class="_${decls[DECLS.indexOf("favicon-of-theme-switcher")]} _${decls[DECLS.indexOf("favicon-in-button")]}"></canvas>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="_${decls[DECLS.indexOf("top-image")]}"></div>
			</div>
			<div id="_${decls[DECLS.indexOf("main")]}">
				<div id="_${decls[DECLS.indexOf("left-in-main")]}"></div>
				<div id="_${decls[DECLS.indexOf("center-in-main")]}"></div>
				<div id="_${decls[DECLS.indexOf("right-in-main")]}"></div>
			</div>
		</div>
	`;
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").lineWidth = 1.25;
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").beginPath();
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").moveTo(13, 12.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").lineTo(27, 12.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").moveTo(13, 17.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").lineTo(27, 17.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").moveTo(13, 22.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-of-config")]}`).getContext("2d").lineTo(27, 22.5);
	faviconPainting().P();
	__status__.initialized = true;
	articlesPrinting();
};
main();

document.onclick = (event) => {
	var callingIsOpen;
	switch (__status__.previousOpenCalling) {
		case undefined:
			break;
		default:
			switch (document.querySelector(`#${__status__.previousOpenCalling}`).contains(event.target) || event.target.classList.contains(__status__.previousOpenCalling)) {
				case false:
					for (let i = document.styleSheets[10].cssRules.length -1; i > -1; i--) {
						document.styleSheets[10].deleteRule(i);
					};
					callingIsOpen = false;
					break;
				case true:
					callingIsOpen = true;
					break;
			};
			break;
	};
	switch (event.target.classList.contains(`_${decls[DECLS.indexOf("interaction-caller")]}`)) {
		case true:
			switch (__status__.previousOpenCalling) {
				case event.target.lastElementChild.id:
					__status__.previousOpenCalling = undefined;
					break;
				default:
					document.styleSheets[10].insertRule(`#${event.target.lastElementChild.id} { display: flex; }`, document.styleSheets[10].cssRules.length);
					document.styleSheets[10].insertRule(`#${event.target.lastElementChild.id} { height: ${document.querySelector(`#${event.target.lastElementChild.id}`).scrollHeight}px; }`, document.styleSheets[10].cssRules.length);
					document.styleSheets[10].insertRule(`#${event.target.id} { background-color: rgba(${THEME[__status__.theme].buttonActiveColor}); }`, document.styleSheets[10].cssRules.length);
					__status__.previousOpenCalling = event.target.lastElementChild.id;
					break;
			};
			break;
		default:
			switch (callingIsOpen) {
				case false:
					__status__.previousOpenCalling = undefined;
					break;
			};
			break;
	};
	switch (event.target.classList.contains(`_${decls[DECLS.indexOf("theme-changeTo")]}`) || event.target.classList.contains(`_${decls[DECLS.indexOf("theme-switch")]}`)) {
		case true:
			switch (event.target.id) {
				case `_${decls[DECLS.indexOf("theme-changeTo-auto")]}`:
					config.theme = "auto";
					break;
				case `_${decls[DECLS.indexOf("theme-changeTo-light")]}`:
					config.theme = "light";
					break;
				case `_${decls[DECLS.indexOf("theme-changeTo-dark")]}`:
					config.theme = "dark";
					break;
				case `_${decls[DECLS.indexOf("theme-changeTo-night")]}`:
					config.theme = "night";
					break;
				case `_${decls[DECLS.indexOf("theme-switcher-contrast")]}`:
					config.themeContrast = !config.themeContrast
					break;
			};
			themeChangeTo();
			break;
	};
};

document.onscroll = () => {
	switch (__status__.articlesPrinting === false && Math.round(document.querySelector(`._${decls[DECLS.indexOf("card-of-article")]}:last-of-type`).getBoundingClientRect().bottom) <= window.innerHeight && __status__.articlesPrinted < articles.length) {
		case true:
			__status__.articlesPrinting = true;
			articlesPrinting();
			break;
	};
};

// with love.