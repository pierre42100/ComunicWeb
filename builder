#!/usr/bin/env php

###########################
# ComunicWeb build script #
#                         #
# @author Pierre HUBERT   #
###########################

<?php

//Output directory
define("OUTPUT_DIRECTORY", __DIR__."/output/");

//Temporary file
define("TEMP_FILE", __DIR__."/output/temp");

//Defines some utilities

/**
 * Display a message on the screen
 * 
 * @param string $message The message to display on the screen
 * @param bool $new_section Specify whether the message refers to a 
 * new build section or not
 */
function notice(string $message, bool $new_section = false) {
	echo ($new_section ? "\n\n" : "").$message,"\n";
}

/**
 * Append a string at the begining of each entry of an array
 * 
 * @param string $input The string to append to each array entry
 * @param array $array The array to process
 * @return array Updated array
 */
function array_put_begining(string $input, array $array){
	
	foreach($array as $num => $val)
		$array[$num] = $input.$val;
	
	return $array;
}

/**
 * Copy an array of file into a specific target file
 * 
 * @param array $files The list of file to copy
 * @param string $target The target file to create
 * @param bool TRUE for a success / FALSE else
 */
function files_to_file(array $files, string $target) : bool {

	$source = "";

	foreach($files as $file){
		$source .= file_get_contents($file)."\n";
	}

	return file_put_contents($target, $source) != FALSE;
}

/**
 * Copy an array of files into a specific target file using uglifyJS
 * 
 * @param string $begin_path The begining of each path
 * @param array $files The name of the source file
 * @param string $target The target file
 * @return bool TRUE in case of success / FALSE in case of failure
 */
function js_files_to_file(string $begin_path, array $files, string $target){

	$source = "";

	//Delete any previous temporary file
	if(file_exists(TEMP_FILE))
		unlink(TEMP_FILE);

	foreach($files as $file){

		$uglifyjs = true;

		//Check if file entry is an array or a string
		if(is_string($file))
			$file = $begin_path.$file;

		//It is an array
		else if(is_array($file)) {

			//Check if we have special information for uglifyjs
			if(isset($file["uglifyjs"]))
				$uglifyjs = $file["uglifyjs"];
			
			$file = $begin_path.$file["path"];
		}

		//Else the kind of entry is not supported
		else
			throw new Exception("Excepted string or array, got something else for javascript entry!");

		//Compress file
		if(FALSE && $uglifyjs){
			notice("Parsing with UGLIFYJS: ".$file);
			exec("/usr/bin/uglifyjs '".$file."' -c -o ".TEMP_FILE, $output, $exit_code);

			//Get the content of the file
			$source .= "\n".file_get_contents(TEMP_FILE);

			if($exit_code != 0){
				notice("An error (".$exit_code.") occured while parsing file ".$file, TRUE);
				exit(10);
			}

		}

		//Else we take the file as is
		else 
			$source .= "\n".file_get_contents($file);
	
		
	}

	//Delete the temp file
	unlink(TEMP_FILE);

	return file_put_contents($target, $source) != FALSE;

}

/**
 * Delete the entire content of directory
 * 
 * @param string $path The path of the directory to delete
 */
function delDir(string $path){
	if(is_dir($path) == TRUE){
		$rootFolder = scandir($path);
		if(sizeof($rootFolder) > 2){
			foreach($rootFolder as $folder){
				if($folder != "." && $folder != ".."){
					//Pass the subfolder to function
					delDir($path."/".$folder);
				}
			}

			//On the end of foreach the directory will be cleaned, and you will can use rmdir, to remove it
			rmdir($path);
		}
	}
	else {
		if(file_exists($path) == TRUE){
			//Suppression du fichier
			unlink($path);
		}
	}
}

// copies files and non-empty directories
function rcopy(string $src, string $dst) {
	if (is_dir($src)) {
	  mkdir($dst, 0777, true);
	  $files = scandir($src);
	  foreach ($files as $file)
	  if ($file != "." && $file != "..") rcopy("$src/$file", "$dst/$file"); 
	}
	else if (file_exists($src)) copy($src, $dst);
}


//Initialize page
require_once __DIR__."/system/system.php";


/**
 * Build application
 */
function build() {

if(!isset($_SERVER['argv'][2]))
	exit(notice("Usage: ./build build [configuration]", TRUE));

//Defines some variables
$debug_conf = "dev";
$release_conf = $_SERVER['argv'][2];


//Load configurations
notice("Load configurations.", TRUE);
notice("Debug config: ".$debug_conf);
notice("Release config: ".$release_conf);

load_config($debug_conf);
$debug = new $debug_conf;
$path_debug_assets = __DIR__."/".$debug::PATH_ASSETS;

load_config($release_conf);
$release = new $release_conf;
$path_release_assets = OUTPUT_DIRECTORY.$release::PATH_ASSETS;




//Clean directory
notice("Clean build directory", TRUE);
if(file_exists(OUTPUT_DIRECTORY))
	delDir(OUTPUT_DIRECTORY);
mkdir(OUTPUT_DIRECTORY, 0777, true);
mkdir($path_release_assets, 0777, true);
mkdir($path_release_assets."/css", 0777, true);
mkdir($path_release_assets."/zip", 0777, true);



//Create unminified version
notice("Create unminified files versions", TRUE);

//3rd party CSS
notice("Third Party CSS");
$thirdPartyDebugFiles = array_put_begining($path_debug_assets, $debug::THIRD_PARTY_CSS);
$targetThirdPartyCSS = $path_release_assets.$release::THIRD_PARTY_CSS;
files_to_file($thirdPartyDebugFiles, $targetThirdPartyCSS);

//3rd party JS
notice("Third Party JS");
$targetThirdPartyJS = $path_release_assets.$release::THIRD_PARTY_JS;
js_files_to_file($path_debug_assets, $debug::THIRD_PARTY_JS, $targetThirdPartyJS);

//App CSS
notice("App CSS");
$appDebugFiles = array_put_begining($path_debug_assets, $debug::APP_CSS);
$targetAppCSS = $path_release_assets.$release::APP_CSS;
files_to_file($appDebugFiles, $targetAppCSS);

//App JS
notice("App JS");
$targetAppJS = $path_release_assets.$release::APP_JS;
js_files_to_file($path_debug_assets, $debug::APP_JS, $targetAppJS);


//Make some adpations on third party files
$source = file_get_contents($targetThirdPartyCSS);
$source = str_replace("../fonts/fontawesome", "fontawesome_fonts/fontawesome", $source);
$source = str_replace("../fonts/ionicons", "ionicons_fonts/ionicons", $source);
$source = str_replace("../fonts/glyphicons", "fonts/glyphicons", $source);
file_put_contents($targetThirdPartyCSS, $source);

//Copy font awesome files + ionicons files + bootstrap fond + and twemojies files + Google Fonts
rcopy($path_debug_assets."3rdparty/adminLTE/plugins/font-awesome/fonts", $path_release_assets."fontawesome_fonts");
rcopy($path_debug_assets."3rdparty/adminLTE/plugins/ionicons/fonts", $path_release_assets."ionicons_fonts");
rcopy($path_debug_assets."3rdparty/adminLTE/bootstrap/fonts", $path_release_assets."fonts");
rcopy($path_debug_assets."3rdparty/twemoji/2/72x72/", $path_release_assets."3rdparty/twemoji/2/72x72/");
rcopy($path_debug_assets."3rdparty/adminLTE/plugins/googleFonts/googleFonts/", $path_release_assets."googleFonts/");
rcopy($path_debug_assets."3rdparty/wdt-emoji/sheets/", $path_release_assets."3rdparty/wdt-emoji/sheets/");

//Copy iCheck images
rcopy($path_debug_assets."3rdparty/adminLTE/plugins/iCheck/flat/icheck-flat-imgs/", $path_release_assets."icheck-flat-imgs/");

//Copy images and templates
rcopy($path_debug_assets."img/", $path_release_assets."img/");
rcopy($path_debug_assets."templates/", $path_release_assets."templates/");

//Copy songs
rcopy($path_debug_assets."audio/", $path_release_assets."audio/");

//Copy dark theme
rcopy($path_debug_assets."css/dark_theme.css", $path_release_assets."css/dark_theme.css");

//Copy pacman
rcopy($path_debug_assets."3rdparty/pacman", $path_release_assets."3rdparty/pacman");


//Build and copy personnal data navigator
notice("Build personnal data export navigator and add it to built files");
exec($path_debug_assets."zip/personnal-data-export-navigator-builder.sh");
rcopy($path_debug_assets."zip/personnal-data-export-navigator.zip", $path_release_assets."zip/personnal-data-export-navigator.zip");


//Begin to write root PHP File
notice("Generate PHP root file");
$page_src = '<?php
//We check if it is a redirection to handle 404 errors
if(isset($_SERVER["REDIRECT_URL"])){
    //We check if it is an asset request
    if(preg_match("<assets>", $_SERVER["REDIRECT_URL"])){
        //This is a 404 not found error...
        echo "<p>Error! 404 not found</p>";
        http_response_code(404);
        exit();
    }
}';

// Begin .htaccess file
$htaccess = '<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.php [L]
</IfModule>
';

//Check if we have to force https connection
if(defined(get_class($release)."::FORCE_HTTPS")){
	if($release::FORCE_HTTPS){

		//Inform user
		notice("This build will work only with https.");

		//Add rules in .htaccess
		$htaccess .= "\n\nRewriteCond %{HTTPS} !on\n";
		$htaccess .= "RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}";

		//Add rules in root PHP file
		$page_src .= "\n//Force HTTPS connection\n";
		$page_src .= "if(!isset(\$_SERVER[\"HTTPS\"]) || \$_SERVER[\"HTTPS\"] != \"on\")\n";
		$page_src .= "\theader('Location: https://'.\$_SERVER['HTTP_HOST'].\$_SERVER['REQUEST_URI']);\n";
	}
}


//Write .htaccess file
file_put_contents(OUTPUT_DIRECTORY.".htaccess", $htaccess);

//Write root index file
$page_src .= ' ?>';
$page_src .= load_page($release_conf);
file_put_contents(OUTPUT_DIRECTORY."index.php", $page_src);

//Done
notice("Done.", TRUE);

} //BUILD

/**
 * Clean build directory
 */
function clean(){
	notice("Cleaning build directory.", TRUE);
	delDir(OUTPUT_DIRECTORY);
}

//Get the action and do it
if(!isset($_SERVER['argv'][1]))
	exit("Usage: ./build [action]");
$action = $_SERVER['argv'][1];

switch($action){

	case "build":
		build();
		break;
	
	case "clean":
		clean();
		break;
	
	default:
		notice("Accepted commands are build, clean.", TRUE);

}