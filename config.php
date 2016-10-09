<?php

mb_internal_encoding("UTF-8");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

spl_autoload_register(function ($className) {
	require env("WEB_DIR") . "classes/$className.php";
});

$properties = [
	"BASE_URL"        => "http://localhost:8080/bart.sk.fotogaleria",
	"WEB_DIR"         => "./web/",
	"GALLERY"         => "./public/gallery/",
	"THUMB_DIMENSIONS" => [
		"HEIGHT" => 320,
		"WIDTH" => 480
	],
	"RSS_ITEMS_COUNT" => 5,
	"RSS_FILENAME"    => "rss.xml",
	"RSS_FORM"        =>
		"<rss version=\"2.0\">
<channel>
<title>Galeria</title>
<link>http://localhost:8080/bart.sk.fotogaleria/public/</link>
<description>View your pictures in a web gallery</description>
<language>sk-SK</language>
<pubDate></pubDate>
<lastBuildDate></lastBuildDate>
<docs>http://blogs.law.harvard.edu/tech/rss</docs>
<generator>Weblog Editor 2.0</generator>
<managingEditor>editor@example.com</managingEditor>
<webMaster>cipa.jozef@gmail.com</webMaster>
</channel>
</rss>"
];

//create RSS xml file
new RSS(env("RSS_FILENAME"), env("RSS_FORM"));

/**
 * Return global variable value
 *
 * @param $property
 * @return mixed
 */
function env($property) {
	global $properties;

	return $properties[$property];
}

/**
 * Temporary function for debugging
 *
 * @param $variable
 * @param bool $die
 */
function debug($variable, $die = false, $var_dump = true)
{
	if($var_dump){
		echo "<pre>";
		var_dump($variable);
		echo "</pre>";
	}
	else{
		echo "<pre>";
		print_r($variable);
		echo "</pre>";
	}

	if ($die) {
		die();
	}
}
