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
		document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").strokeStyle = `rgba(${THEME[__status__.theme].basicColor})`;
		document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").stroke();
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
			faviconPainting().radioRP("favicon-of-changeTheme", `favicon-of-changeTheme-to-${config.theme}`);
			faviconPainting().switcherRP("themeContrast", "favicon-of-switchTheme-to-contrast");
		},
		P: function () {
			faviconP();
			radioP(`favicon-of-changeTheme-to-${config.theme}`);
			switcherP("themeContrast", "favicon-of-switchTheme-to-contrast");
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
			faviconPainting().radioRP("favicon-of-changeTheme", `favicon-of-changeTheme-to-${config.theme}`)
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
							document.styleSheets[11].insertRule(`#_${decls[DECLS.indexOf("switchTheme-to-contrast")]}::before { color: rgba(${THEME[__status__.theme].basicActiveColor}); }`, document.styleSheets[11].cssRules.length);
							document.styleSheets[11].insertRule(`._${decls[DECLS.indexOf("switchTheme-to-contrast")]}::after { color: rgba(${THEME[__status__.theme].discActiveColor}); }`, document.styleSheets[11].cssRules.length);
							document.styleSheets[11].insertRule(`#_${decls[DECLS.indexOf("switchTheme-to-contrast")]} { pointer-events: none; }`, document.styleSheets[11].cssRules.length);
							break;
					};
					MEDIA_QUERY_LIST["prefers-color-scheme"].removeListener(autoThemeChangeTo);
					break;
			};
			break;
	};
};

var decls = [];
const DECLS = ["overlay", "wrapper", "header", "nav", "main", "brand", "logo", "radioButton", "switchButton", "button", "hyperlinkButton", "wrappingButton", "favicon-of-btn", "acrylic", "top-image", "left-in-main", "center-in-main", "right-in-main", "card-of-article", "image-in-card-of-article", "title-in-card-of-article", "content-in-card-of-article", "link-in-card-of-article", "info-in-card-of-article", "author-in-info-in-card-of-article", "timeStamp-in-info-in-card-of-article", "menuFlyOut", "caller-of-menuFlyOut", "calling-of-menuFlyOut", "group-in-menuFlyOut", "caller-of-menuFlyOut-bt-config", "favicon-of-caller-of-menuFlyOut-bt-config", "calling-of-menuFlyOut-bt-config", "menuFlyOut-bt-config", "changeTheme", "favicon-of-changeTheme", "changeTheme-to-auto", "favicon-of-changeTheme-to-auto", "changeTheme-to-light", "favicon-of-changeTheme-to-light", "changeTheme-to-dark", "favicon-of-changeTheme-to-dark", "changeTheme-to-night", "favicon-of-changeTheme-to-night", "switchTheme", "switchTheme-to-contrast", "favicon-of-switchTheme-to-contrast", "favicon-of-switchTheme"];

const THEME = {
	"light": {"absoluteColor": "255, 255, 255, 1", "absoluteInvertedColor": "0, 0, 0, 1", "basicColor": "26, 26, 26, 1", "basicActiveColor": "26, 26, 26, .61568", "discColor": "60.35, 60.35, 60.35, 1", "discActiveColor": "60.35, 60.35, 60.35, .61568", "miscColor": "165, 165, 165, 1", "basicBackgroundColor": "243, 243, 243, 1", "contentBackgroundColor": "249, 249, 249, 1", "layerCoverColor": "253, 253, 253, 1", "borderColor": "0, 0, 0, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "255, 255, 255, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonBackgroundColor": "255, 255, 255, .58431", "buttonBorderColor": "0, 0, 0, .07450", "buttonHoverBackgroundColor": "255, 255, 255, .31372", "buttonHoverBorderColor": "0, 0, 0, .29411", "buttonActiveBackgroundColor": "255, 255, 255, .25098", "buttonActiveBorderColor": "0, 0, 0, .08627", "buttonActiveColor": "0, 0, 0, .61568", "hyperlinkButtonColor": "41.5, 41.5, 41.5, 1", "hyperlinkButtonHoverBackgroundColor": "0, 0, 0, .03529", "hyperlinkButtonActiveBackgroundColor": "0, 0, 0, .02352", "hyperlinkButtonActiveColor": "59.5, 59.5, 59.5, 1", "wrappingButtonHoverColor": "0, 0, 0, .02352", "wrappingButtonActiveColor": "0, 0, 0, .03529", "buttonFaviconColor": "83, 83, 83, 1", "separatorColor": "0, 0, 0, .31372", "scrollbarColor": "0, 0, 0, .06274", "scrollbarThumbColor": "0, 0, 0, .17254", "scrollbarThumbHoverColor": "0, 0, 0, .27843", "scrollbarThumbActiveColor": "0, 0, 0, .48627", "scrollbarbuttonBackgroundColor": "163, 163, 163, 1"},
	"dark": {"absoluteColor": "0, 0, 0, 1", "absoluteInvertedColor": "255, 255, 255, 1", "basicColor": "255, 255, 255, 1", "basicActiveColor": "255, 255, 255, .77647", "discColor": "216.75, 216.75, 216.75, 1", "discActiveColor": "216.75, 216.75, 216.75, .77647", "miscColor": "102, 102, 102, 1", "basicBackgroundColor": "32, 32, 32, 1", "contentBackgroundColor": "39, 39, 39, 1", "layerCoverColor": "50, 50, 50, 1", "borderColor": "255, 255, 255, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "0, 0, 0, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonBackgroundColor": "255, 255, 255, .05098", "buttonBorderColor": "0, 0, 0, .29019", "buttonHoverBackgroundColor": "255, 255, 255, .10588", "buttonHoverBorderColor": "0, 0, 0, .39607", "buttonActiveBackgroundColor": "255, 255, 255, .08627", "buttonActiveBorderColor": "0, 0, 0, .27058", "buttonActiveColor": "255, 255, 255, .77647", "hyperlinkButtonColor": "234, 234, 234, 1", "hyperlinkButtonHoverBackgroundColor": "255, 255, 255, .05882", "hyperlinkButtonActiveBackgroundColor": "255, 255, 255, .03529", "hyperlinkButtonActiveColor": "216, 216, 216, 1", "wrappingButtonHoverColor": "255, 255, 255, .03921", "wrappingButtonActiveColor": "255, 255, 255, .05882", "buttonFaviconColor": "207, 207, 207, 1", "separatorColor": "255, 255, 255, 1", "scrollbarColor": "255, 255, 255, .12549", "scrollbarThumbColor": "255, 255, 255, 0.20000", "scrollbarThumbHoverColor": "255, 255, 255, .30196", "scrollbarThumbActiveColor": "255, 255, 255, .50196", "scrollbarbuttonBackgroundColor": "128, 128, 128, 1"},
	"night": {"absoluteColor": "0, 0, 0, 1", "absoluteInvertedColor": "255, 255, 255, 1", "basicColor": "230, 230, 230, 1", "basicActiveColor": "230, 230, 230, .71764", "discColor": "195.5, 195.5, 195.5, 1", "discActiveColor": "195.5, 195.5, 195.5, .71764", "miscColor": "86, 86, 86, 1", "basicBackgroundColor": "16, 16, 16, 1", "contentBackgroundColor": "23, 23, 23, 1", "layerCoverColor": "34, 34, 34, 1", "borderColor": "255, 255, 255, .15", "AcrylicBorderColor": "0, 0, 0, .15", "AcrylicBrushBlurAmount": "30", "AcrylicBrushTintLuminosityOpacity": "2.5", "AcrylicBrushTintColor": "0, 0, 0, 1", "AcrylicBrushTintOpacity": ".8", "AcrylicBrushNoiseOpacity": ".5", "buttonBackgroundColor": "255, 255, 255, .04705", "buttonBorderColor": "0, 0, 0, .42745", "buttonHoverBackgroundColor": "255, 255, 255, .09803", "buttonHoverBorderColor": "0, 0, 0, .53333", "buttonActiveBackgroundColor": "255, 255, 255, .08235", "buttonActiveBorderColor": "0, 0, 0, .37254", "buttonActiveColor": "255, 255, 255, .71764", "hyperlinkButtonColor": "218, 218, 218, 1", "hyperlinkButtonHoverBackgroundColor": "255, 255, 255, .05882", "hyperlinkButtonActiveBackgroundColor": "255, 255, 255, .03529", "hyperlinkButtonActiveColor": "200, 200, 200, 1", "wrappingButtonHoverColor": "255, 255, 255, .03921", "wrappingButtonActiveColor": "255, 255, 255, .05882", "buttonFaviconColor": "191, 191, 191, 1", "separatorColor": "255, 255, 255, 1", "scrollbarColor": "255, 255, 255, .11764", "scrollbarThumbColor": "255, 255, 255, .18431", "scrollbarThumbHoverColor": "255, 255, 255, .27450", "scrollbarThumbActiveColor": "255, 255, 255, .46274", "scrollbarbuttonBackgroundColor": "116, 116, 116, 1"},
	"lightContrast": {},
	"darkContrast": {}
};

var config = {
	"theme": "auto",
	"themeContrast": false,
	"accentColor": "127, 127, 127",
	"accentAlpha": "0.9",
	"articlesPrintPerTime": 10,
	"articleSentencesSnap": 5
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
	var dss2 = document.styleSheets[2];
	for (let i = document.styleSheets[2].cssRules.length - 1; i > -1; i--) {
		dss2.deleteRule(i)
	};
	dss2.insertRule(`::-webkit-scrollbar { background-color: rgba(${THEME[__status__.theme].scrollbarColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`::-webkit-scrollbar-thumb { background-color: rgba(${THEME[__status__.theme].scrollbarThumbColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`::-webkit-scrollbar-thumb:hover { background-color: rgba(${THEME[__status__.theme].scrollbarThumbHoverColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`::-webkit-scrollbar-thumb:active { background-color: rgba(${THEME[__status__.theme].scrollbarThumbActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`::selection { color: white; background-color: rgba(${config.accentColor}, ${config.accentAlpha}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`* { color: rgba(${THEME[__status__.theme].basicColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`body { background-color: rgba(${THEME[__status__.theme].contentBackgroundColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`hr { border-width: 0 0 1px 0; border-style: none none solid none; border-color: rgba(${THEME[__status__.theme].separatorColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("button")]} { background-color: rgba(${THEME[__status__.theme].buttonBackgroundColor}); box-shadow: rgba(${THEME[__status__.theme].buttonBorderColor}) 0 0 0 1px inset; }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("button")]}:hover { background-color: rgba(${THEME[__status__.theme].buttonHoverBackgroundColor}); box-shadow: rgba(${THEME[__status__.theme].buttonHoverBorderColor}) 0 0 0 1px inset; }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("button")]}:active { background-color: rgba(${THEME[__status__.theme].buttonActiveBackgroundColor}); box-shadow: rgba(${THEME[__status__.theme].buttonActiveBorderColor}) 0 0 0 1px inset; color: rgba(${THEME[__status__.theme].buttonActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("hyperlinkButton")]}:hover { background-color: rgba(${THEME[__status__.theme].hyperlinkButtonHoverBackgroundColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("hyperlinkButton")]}:active { background-color: rgba(${THEME[__status__.theme].hyperlinkButtonActiveBackgroundColor}); color: rgba(${THEME[__status__.theme].hyperlinkButtonActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}:hover { background-color: rgba(${THEME[__status__.theme].wrappingButtonHoverColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}:active { background-color: rgba(${THEME[__status__.theme].wrappingButtonActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}::after { color: rgba(${THEME[__status__.theme].discColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}:active::before { color: rgba(${THEME[__status__.theme].basicActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}:active::after { color: rgba(${THEME[__status__.theme].discActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("acrylic")]} { box-shadow: rgba(${THEME[__status__.theme].AcrylicBorderColor}) 0 0 0 1px inset; backdrop-filter: blur(${THEME[__status__.theme].AcrylicBrushBlurAmount}px) brightness(${THEME[__status__.theme].AcrylicBrushTintLuminosityOpacity}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div::before { content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: ${THEME[__status__.theme].AcrylicBrushTintOpacity}; background-color: rgba(${THEME[__status__.theme].AcrylicBrushTintColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div::after {
		content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: ${THEME[__status__.theme].AcrylicBrushNoiseOpacity}; background: url(data:image/png;base64,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);
	}`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("card-of-article")]} { box-shadow: rgba(${THEME[__status__.theme].borderColor}) 0 0 0 1px inset; }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("title-in-card-of-article")]} a:active { color: rgba(${THEME[__status__.theme].basicActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("info-in-card-of-article")]} * { color: rgba(${THEME[__status__.theme].discColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`._${decls[DECLS.indexOf("info-in-card-of-article")]} a:active { color: rgba(${THEME[__status__.theme].discActiveColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`#_${decls[DECLS.indexOf("logo")]} { color: rgba(${THEME[__status__.theme].basicColor}); }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`#_${decls[DECLS.indexOf("logo")]} g { fill: ${ToHex(THEME[__status__.theme].basicColor)}; }`, document.styleSheets[2].cssRules.length);
	dss2.insertRule(`#_${decls[DECLS.indexOf("top-image")]} { background: url() center / 100% no-repeat rgba(${THEME[__status__.theme].layerCoverColor}); }`, document.styleSheets[2].cssRules.length);
	switch (__status__.initialized) {
		case true:
			faviconPainting().RP();
			__status__.themeContrast = config.themeContrast;
			localStorage.setItem("config.theme", config.theme);
			localStorage.setItem("config.themeContrast", config.themeContrast);
			break;
	};
	dss2 = undefined;
};

async function articlesPrinting() {
	__status__.articlesPrintingTarget = (articles.length > __status__.articlesPrinted + config.articlesPrintPerTime) ? (__status__.articlesPrinted + config.articlesPrintPerTime) : articles.length;
	var tmp = "";
	var article = {};
	var articleContent = "";
	for (let i = __status__.articlesPrinted; i < __status__.articlesPrintingTarget; i++) {
		console.log(i);
		await fetch(`./assets/articles/${articles[i]}/index.json`)
			.then(response => response.json())
			.then(data => article = data);
		articleContent = article.content.replace(/<img.+>/, " ").split(".", config.articleSentencesSnap).join(".");
		switch (articleContent.endsWith(".")) {
			case false:
				articleContent += ".";
				break;
		};
		tmp += `
			<div id="_${articles[i]}" class="_${decls[DECLS.indexOf("card-of-article")]}">
				<span class="_${decls[DECLS.indexOf("title-in-card-of-article")]}"><a>${article.title}</a></span>
				<img class="_${decls[DECLS.indexOf("image-in-card-of-article")]}" src="./assets/articles/${articles[i]}/cover.png" onerror="this.remove();" />
				<span class="_${decls[DECLS.indexOf("content-in-card-of-article")]}"><br />${articleContent}</span>
				<span class="_${decls[DECLS.indexOf("link-in-card-of-article")]} _${decls[DECLS.indexOf("button")]}"></span>
				<div class="_${decls[DECLS.indexOf("info-in-card-of-article")]}">
					<span class="_${decls[DECLS.indexOf("author-in-info-in-card-of-article")]}"><a>${article.project}</a>&nbspBy&nbsp<a>${article.author}</a></span>
					<span class="_${decls[DECLS.indexOf("timeStamp-in-info-in-card-of-article")]}">${new Date(article.timeStamp).toLocaleDateString()}</span>
				</div>
			</div>
		`
	};
	document.getElementById(`_${decls[DECLS.indexOf("center-in-main")]}`).innerHTML += tmp;
	tmp = undefined;
	article = undefined;
	articleContent = undefined;
	__status__.articlesPrinted = __status__.articlesPrintingTarget;
	__status__.articlesPrinting = false;
};

function main() {
	var decl = "";
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
	decl = undefined;
	with (document.styleSheets[0]) {
		insertRule(`._${decls[DECLS.indexOf("button")]}, ._${decls[DECLS.indexOf("hyperlinkButton")]}, ._${decls[DECLS.indexOf("wrappingButton")]} { align-items: center; }`, length);
		insertRule(`._${decls[DECLS.indexOf("favicon-of-btn")]} { order: -1; pointer-events: none; }`, length);
		insertRule(`._${decls[DECLS.indexOf("wrappingButton")]} { width: calc(100% - 10px); height: 36px; margin: 2px 0; z-index: 2; }`, length);
		insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}::before { flex: 1; }`, length);
		insertRule(`._${decls[DECLS.indexOf("wrappingButton")]}::after { margin: 0 40px 0 0; }`, length);
		insertRule(`._${decls[DECLS.indexOf("menuFlyOut")]} { flex-direction: column; }`, length);
		insertRule(`._${decls[DECLS.indexOf("group-in-menuFlyOut")]} { width: 100%; padding: 3px 0; flex-direction: column; align-items: center; z-index: 2; }`, length);
		insertRule(`._${decls[DECLS.indexOf("calling-of-menuFlyOut")]} { display: none; position: absolute; height: 0; overflow-y: hidden; transition: cubic-bezier(0, 0, 0, 1) height .3s; }`, length);
		insertRule(`._${decls[DECLS.indexOf("acrylic")]} { box-shadow: 0 12px 20px rgba(0, 0, 0, .15); }`, length);
		insertRule(`._${decls[DECLS.indexOf("acrylic")]} > div { position: relative; width: 100%; }`, length);
		insertRule(`._${decls[DECLS.indexOf("card-of-article")]} { margin: 10px 0; padding: 0 2%; flex-direction: column; }`, length);
		insertRule(`._${decls[DECLS.indexOf("image-in-card-of-article")]} { width: 100%; }`, length);
		insertRule(`._${decls[DECLS.indexOf("title-in-card-of-article")]} *, ._${decls[DECLS.indexOf("content-in-card-of-article")]} { font-family: Georgia, 'Times New Roman', Times, serif; }`, length);
		insertRule(`._${decls[DECLS.indexOf("title-in-card-of-article")]} { padding: 20px 0; align-self: start; }`, length);
		insertRule(`._${decls[DECLS.indexOf("title-in-card-of-article")]} * { font-size: 20px; }`, length);
		insertRule(`._${decls[DECLS.indexOf("content-in-card-of-article")]} { font-size: 16px; }`, length);
		insertRule(`._${decls[DECLS.indexOf("link-in-card-of-article")]} { height: 36px; align-self: end; }`, length);
		insertRule(`._${decls[DECLS.indexOf("link-in-card-of-article")]}::after { margin: 0 15px; content: "Article\u0020page\u0020>"; }`, length);
		insertRule(`._${decls[DECLS.indexOf("info-in-card-of-article")]} { height: 49px; justify-content: space-between; align-items: center; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("overlay")]} { position: absolute; top: 0; width:100%; z-index: -1; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("wrapper")]}, #_${decls[DECLS.indexOf("header")]} { width:100%; flex-direction: column; align-items: center; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("nav")]}, #_${decls[DECLS.indexOf("main")]} { width: 85%; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("nav")]} { height: 54px; margin: 0 0 2px 0; justify-content: space-between; align-items: center; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("top-image")]} { width: 85%; height: 0; padding-top: 17.73%; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("logo")]} { width: 48px; height: 24px; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("logo")]}::after { position: relative; top: -4px; left: 6px; content: "Tremo"; font-size: 20px; font-weight: 600; filter: grayscale(1); }`, length);
		insertRule(`#_${decls[DECLS.indexOf("caller-of-menuFlyOut-bt-config")]} { width: 40px; height: 36px; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("calling-of-menuFlyOut-bt-config")]} { top: 42px; right: 7.5%; width: 298px; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("changeTheme-to-auto")]}::before { content: "Auto"; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("changeTheme-to-light")]}::before { content: "Light"; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("changeTheme-to-dark")]}::before { content: "Dark"; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("changeTheme-to-night")]}::before { content: "Night"; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("switchTheme-to-contrast")]}::before { content: "Contrast"; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("switchTheme-to-contrast")]}::after { content: "Coming soon..."; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("main")]} { padding: 21px 7.5%; justify-content: space-between; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("main")]} > div { flex-direction: column; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("left-in-main")]}, #_${decls[DECLS.indexOf("right-in-main")]} { width: 24%; }`, length);
		insertRule(`#_${decls[DECLS.indexOf("center-in-main")]} { width: 48%; }`, length);
	};
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
						<div id="_${decls[DECLS.indexOf("logo")]}">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24.000000px" height="24.000000px" viewBox="0 0 24.000000 24.000000">
								<g transform="translate(0.000000,24.000000) scale(0.002500,-0.002500)">
									<path d="M2649 7207 c-52 -19 -99 -50 -136 -89 -30 -32 -2293 -3787 -2293 -3806 0 -11 450 -295 457 -288 3 3 258 429 568 948 309 519 568 943 574 943 7 0 335 -546 730 -1213 395 -667 731 -1227 747 -1244 76 -80 215 -103 315 -50 30 16 67 46 84 68 16 22 347 583 735 1247 541 927 707 1204 716 1194 6 -6 350 -561 765 -1232 415 -671 767 -1232 783 -1247 66 -61 210 -77 301 -34 28 13 64 39 81 57 32 35 2309 3717 2303 3724 -2 1 -105 66 -228 144 -179 113 -227 139 -237 129 -6 -7 -265 -424 -575 -927 -511 -831 -564 -912 -576 -895 -8 11 -361 570 -785 1244 -424 674 -785 1240 -802 1258 -75 81 -176 99 -276 50 -31 -15 -67 -40 -82 -55 -14 -15 -340 -563 -723 -1218 -383 -654 -702 -1195 -708 -1202 -9 -10 -172 254 -732 1185 -396 658 -733 1211 -748 1229 -59 67 -186 107 -258 80z"/>
								</g>
							</svg>
						</div>
					</div>
					<div id="_${decls[DECLS.indexOf("caller-of-menuFlyOut-bt-config")]}" class="_${decls[DECLS.indexOf("caller-of-menuFlyOut")]} _${decls[DECLS.indexOf("hyperlinkButton")]}" data-pop-id="config" data-pop-type="menuFlyOut">
						<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}" class="_${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
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
		
		<span id="_${decls[DECLS.indexOf("overlay")]}">
			<div id="_${decls[DECLS.indexOf("calling-of-menuFlyOut-bt-config")]}" class="_${decls[DECLS.indexOf("calling-of-menuFlyOut")]} _${decls[DECLS.indexOf("acrylic")]}">
				<div id="_${decls[DECLS.indexOf("menuFlyOut-bt-config")]}" class="_${decls[DECLS.indexOf("menuFlyOut")]}">
					<div class="_${decls[DECLS.indexOf("group-in-menuFlyOut")]}">
						<div id="_${decls[DECLS.indexOf("changeTheme-to-auto")]}" class="_${decls[DECLS.indexOf("changeTheme")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]}">
							<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-changeTheme-to-auto")]}" class="_${decls[DECLS.indexOf("favicon-of-changeTheme")]} _${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
						</div>
						<div id="_${decls[DECLS.indexOf("changeTheme-to-light")]}" class="_${decls[DECLS.indexOf("changeTheme")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]}">
							<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-changeTheme-to-light")]}" class="_${decls[DECLS.indexOf("favicon-of-changeTheme")]} _${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
						</div>
						<div id="_${decls[DECLS.indexOf("changeTheme-to-dark")]}" class="_${decls[DECLS.indexOf("changeTheme")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]}">
							<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-changeTheme-to-dark")]}" class="_${decls[DECLS.indexOf("favicon-of-changeTheme")]} _${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
						</div>
						<div id="_${decls[DECLS.indexOf("changeTheme-to-night")]}" class="_${decls[DECLS.indexOf("changeTheme")]} _${decls[DECLS.indexOf("radioButton")]} _${decls[DECLS.indexOf("wrappingButton")]}">
							<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-changeTheme-to-night")]}" class="_${decls[DECLS.indexOf("favicon-of-changeTheme")]} _${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
						</div>
					</div>
					<hr />
					<div class="_${decls[DECLS.indexOf("group-in-menuFlyOut")]}">
						<div id="_${decls[DECLS.indexOf("switchTheme-to-contrast")]}" class="_${decls[DECLS.indexOf("switchTheme")]} _${decls[DECLS.indexOf("switchButton")]} _${decls[DECLS.indexOf("wrappingButton")]}">
							<canvas width="40px" height="36px" id="_${decls[DECLS.indexOf("favicon-of-switchTheme-to-contrast")]}" class="_${decls[DECLS.indexOf("favicon-of-switchTheme")]} _${decls[DECLS.indexOf("favicon-of-btn")]}"></canvas>
						</div>
					</div>
				</div>
			</span>
		</div>
	`;
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").lineWidth = 1.25;
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").beginPath();
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").moveTo(13, 12.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").lineTo(27, 12.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").moveTo(13, 17.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").lineTo(27, 17.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").moveTo(13, 22.5);
	document.getElementById(`_${decls[DECLS.indexOf("favicon-of-caller-of-menuFlyOut-bt-config")]}`).getContext("2d").lineTo(27, 22.5);
	faviconPainting().P();
	__status__.initialized = true;
	articlesPrinting();
};
main();

document.onclick = (event) => {
	switch (__status__.previousOpenCalling) {
		case undefined:
			break;
		default:
			switch (event.target.id === `_${decls[DECLS.indexOf("overlay")]}` || event.target.classList.contains(`_${decls[DECLS.indexOf("wrappingButton")]}`) || event.target.classList.contains(`_${decls[DECLS.indexOf("button")]}`)) {
				case true:
					for (let i = document.styleSheets[10].cssRules.length -1; i > -1; i--) {
						document.styleSheets[10].deleteRule(i);
					};
					__status__.previousOpenCalling = undefined;
					break;
			};
			break;
	};
	switch (event.target.classList.contains(`_${decls[DECLS.indexOf("caller-of-menuFlyOut")]}`)) {
		case true:
			document.styleSheets[10].insertRule(`#_${decls[DECLS.indexOf("overlay")]} { z-index: 1; }`, document.styleSheets[10].cssRules.length);
			document.styleSheets[10].insertRule(`#_${decls[DECLS.indexOf(`calling-of-${event.target.dataset.popType}-bt-${event.target.dataset.popId}`)]} { display: flex; }`, document.styleSheets[10].cssRules.length);
			document.styleSheets[10].insertRule(`#_${decls[DECLS.indexOf(`calling-of-${event.target.dataset.popType}-bt-${event.target.dataset.popId}`)]} { height: ${document.getElementById(`_${decls[DECLS.indexOf(`calling-of-${event.target.dataset.popType}-bt-${event.target.dataset.popId}`)]}`).scrollHeight}px; }`, document.styleSheets[10].cssRules.length);
			__status__.previousOpenCalling = event.target.dataset.popId;
			break;
	};
	switch (event.target.classList.contains(`_${decls[DECLS.indexOf("changeTheme")]}`) || event.target.classList.contains(`_${decls[DECLS.indexOf("switchTheme")]}`)) {
		case true:
			switch (event.target.id) {
				case `_${decls[DECLS.indexOf("changeTheme-to-auto")]}`:
					config.theme = "auto";
					break;
				case `_${decls[DECLS.indexOf("changeTheme-to-light")]}`:
					config.theme = "light";
					break;
				case `_${decls[DECLS.indexOf("changeTheme-to-dark")]}`:
					config.theme = "dark";
					break;
				case `_${decls[DECLS.indexOf("changeTheme-to-night")]}`:
					config.theme = "night";
					break;
				case `_${decls[DECLS.indexOf("switchTheme-to-contrast")]}`:
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

const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		document.getElementById(`_${decls[DECLS.indexOf("overlay")]}`).style.height = entry.borderBoxSize[0].blockSize + "px";
	};
});

resizeObserver.observe(document.getElementById(`_${decls[DECLS.indexOf("wrapper")]}`));

// with love.