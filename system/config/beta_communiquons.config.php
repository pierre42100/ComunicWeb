<?php
/**
 * Online build configuration
 * 
 * @author Pierre HUBERT
 */

//This configuration is based on the offline configuration
require_once __DIR__."/offline.config.php";

class Beta_communiquons extends Offline {

	/**
	 * API access and credentials
	 */
	const API_URL = "https://api.communiquons.org/";
	const API_SERVICE_NAME = "ComunicWebBeta";
	const API_SERVICE_TOKEN = "txC7K5snAT";

	/**
	 * Site URL
	 */
	const SITE_URL = "https://beta.communiquons.org/";

	/**
	 * Site production mode
	 */
	const PROD_MODE = TRUE;

	/**
	 * Path to assets (URL)
	 */
	const ASSETS_URL = "https://beta.communiquons.org/assets/";

	/**
	 * Site requires https connection
	 */
	const FORCE_HTTPS = true;

}