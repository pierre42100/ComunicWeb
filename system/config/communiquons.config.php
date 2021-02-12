<?php
/**
 * comunic.io build configuration
 * 
 * @author Pierre HUBERT
 */

//This configuration is based on the offline configuration
require_once __DIR__."/offline.config.php";

class Communiquons extends Offline {

	/**
	 * API access and credentials
	 */
	const API_URL = "https://api.communiquons.org/";
	const API_SERVICE_NAME = "ComunicWEB";
	const API_SERVICE_TOKEN = "BVuWUt4m";

	/**
	 * Site URL
	 */
	const SITE_URL = "https://communiquons.org/";

	/**
	 * About website access
	 */
	const ABOUT_WEBSITE_URL = "https://about.communiquons.org/";

	/**
	 * Site production mode
	 */
	const PROD_MODE = TRUE;

	/**
	 * Path to assets (URL)
	 */
	const ASSETS_URL = "https://communiquons.org/assets/".BUILD_TIME."/";

	/**
	 * Site requires https connection
	 */
	const FORCE_HTTPS = true;

}