<?php
/**
 * PHP offline build config for the website
 *
 * @author Pierre HUBERT
 */

class Offline {

	/**
	 * API access and credentials
	 */
	const API_URL = "https://devweb.local/comunic/api-v2/";
	const API_SERVICE_NAME = "ComunicWeb";
	const API_SERVICE_TOKEN = "12XU67pJUlnNQ";

	/**
	 * About website access
	 */
	const ABOUT_WEBSITE_URL = "http://127.0.0.1:4000/";

	/**
	 * Site URL
	 */
	const SITE_URL = "https://devweb.local/comunic/v2/output/";

	/**
	 * Site production mode
	 */
	const PROD_MODE = TRUE;

	/**
	 * Path to assets (relative to the build folder)
	 */
	const PATH_ASSETS = "assets/";

	/**
	 * Path to assets (URL)
	 */
	const ASSETS_URL = "https://devweb.local/comunic/v2/output/assets/";

	/**
	 * Third party CSS files
	 */
	const THIRD_PARTY_CSS = "third_party_css.css";

	/**
	 * Third party Javascript files
	 */
	const THIRD_PARTY_JS = "third_party.js";

	/**
	 * Third party Javascript files (unminified)
	 */
	const THIRD_PARTY_UNMINIFIED_JS = "third_party.unminified.js";

	/**
	 * Application CSS files
	 */
	const APP_CSS = "app.css";

	/**
	 * Application JS files
	 */
	const APP_JS = "app.js";

	/**
	 * Application JS files (unminifieds)
	 */
	const APP_UNMINIFIED_JS = "app.unminified.js";

	/**
	 * Language settings
	 */
	const DEFAULT_LANGUAGE = "en";

	/**
	 * Templates settings
	 */
	const TEMPLATES_PATH = "templates/";
}