/**
 * Data export visualization navigator
 *
 * @author Pierre HUBERT
 */

/**
 * Refresh tabs visibility accordingly to the hash of
 * the current URL
 */
function RefreshTabsVisibility(){

	var hash = location.href.toString().split("#")[1];

	if(!hash)
		return;

	document.querySelectorAll(".category").forEach(el => {

		el.style.display = el.id === hash ? "block" : "none";

	});

}

/**
 * Automatically switch the tab when it
 * is required by the user
 */
window.addEventListener("hashchange", RefreshTabsVisibility);


//Page initialization
RefreshTabsVisibility();