<?php
/**
 * comunic.io build configuration
 * 
 * @author Pierre HUBERT
 */

//This configuration is based on the offline configuration
require_once __DIR__."/offline.config.php";

class Comunic_io extends Offline {

	/**
	 * API access and credentials
	 */
	const API_URL = "https://api.communiquons.org/";
	const API_SERVICE_NAME = "ComunicIO";
	const API_SERVICE_TOKEN = "UxvYud4xSOslVFANWYcD";

	/**
	 * Site URL
	 */
	const SITE_URL = "https://comunic.io/";

	/**
	 * About website access
	 */
	const ABOUT_WEBSITE_URL = "https://about.comunic.io/";

	/**
	 * Site production mode
	 */
	const PROD_MODE = TRUE;

	/**
	 * Path to assets (URL)
	 */
	const ASSETS_URL = "https://comunic.io/assets/";

	/**
	 * Site requires https connection
	 */
	const FORCE_HTTPS = true;

}