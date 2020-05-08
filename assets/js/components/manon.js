/**
 * Manon's special (hidden) features
 * 
 * @author Pierre Hubert
 */

/**
 * Check if it is Manon's birthday
 */
async function checkManonBirthday(force) {

	if(force !== true) {
		// Manon's feature only
		if(userID() !== 150)
			return;
		
		const date = new Date();

		if(date.getMonth() != 4 && date.getDay() != 8)//TODO: replace
			return;
	}

	// Load clippy
	const css = document.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = ComunicWeb.__config.assetsURL + "3rdparty/clippy.js/clippy.css"
	document.head.appendChild(css);

	const js = document.createElement("script");
	js.type = "text/javascript";
	js.src = ComunicWeb.__config.assetsURL + "3rdparty/clippy.js/clippy.min.js"
	document.body.appendChild(js);

	await new Promise((res, rej) => js.addEventListener("load", res));

	
	// Configure clippy
	clippy.BASE_PATH = ComunicWeb.__config.assetsURL + "3rdparty/clippy.js/Agents/";

	// Load Merlin
	const agent = await new Promise((res, rej) => clippy.load('Merlin', res));



	// Wait for Manon
	await new Promise((res, rej) => window.addEventListener("mousedown", res, {once: true}));




	// Show the agent
	agent.show();

	agent.play("Announce");

	

	agent.speak("Joyeux anniversaire Manon ! Que cette nouvelle année qui commence pour toi t'apporte la joie !", true);
	setTimeout(() => agent.stopCurrent(), 8000);

	agent.play("Pleased", 6000, () => agent.hide());

}


// Do the check on first page load only
document.addEventListener("wsOpen", () => {
	setTimeout(() => checkManonBirthday(), 1000);
}, {
	once: true
})