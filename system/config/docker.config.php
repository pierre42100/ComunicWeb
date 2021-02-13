<?php
/**
 * Docker container build configuration
 *
 * @author Pierre HUBERT
 */

//This configuration is based on the offline configuration
require_once __DIR__."/offline.config.php";

class Docker extends Offline {

	/**
	 * Container URL
	 */
	const CONTAINER_URL = 'http://<?php echo $_SERVER["HTTP_HOST"]; ?>/';

	/**
	 * API access and credentials
	 */
	const API_URL = self::CONTAINER_URL."api/";
	const API_CLIENT_NAME = "client";

	/**
	 * Site URL
	 */
	const SITE_URL = self::CONTAINER_URL;

	/**
	 * Site production mode
	 */
	const PROD_MODE = TRUE;

	/**
	 * Path to assets (URL)
	 */
	const ASSETS_URL = self::CONTAINER_URL."assets/".BUILD_TIME."/";
}