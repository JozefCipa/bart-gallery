<?php

class Router
{

	private static $routes;

	/**
	 * Initialize empty static array of routes
	 */
	static function init()
	{
		self::$routes = [
			"GET"  => [],
			"POST" => []
		];
	}

	/**
	 * Add GET route
	 *
	 * @param $url
	 * @param $callback
	 */
	static function get($url, $callback)
	{
		self::$routes["GET"][$url] = $callback;
	}

	/**
	 * Add POST route
	 *
	 * @param $url
	 * @param $callback
	 */
	static function post($url, $callback)
	{
		self::$routes["POST"][$url] = $callback;
	}

	/**
	 * Redirects by URL
	 */
	static function route()
	{

		$url       = self::getURL();
		$parsedURL = self::parseURL($url);

		if ($parsedURL !== false) {
			call_user_func(self::$routes[$parsedURL["method"]][$parsedURL["path"]], $parsedURL["params"]);
		} else {
			Response::notFound();
		}

	}

	//---------------------------------------------------------

	/**
	 * Return URL address
	 *
	 * @return string
	 */
	private static function getURL()
	{

		$protocol = array_key_exists("HTTPS", $_SERVER) ? "https://" : "http://";

		//get full URL
		$url = $protocol . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
		$url = str_replace(env("BASE_URL"), "", $url);

		return $url;
	}

	/**
	 * Return request method and parameters from URL
	 *
	 * @param $url
	 * @return array|bool
	 */
	private static function parseURL($url)
	{

		$method = $_SERVER["REQUEST_METHOD"];

		$route = self::getRouteFromUrl($url, $method);

		if ($route == false)
			Response::notFound();

		//$urlTemplate retrieved from routeExists
		$params = self::findVariables($url, $route);


		return [
			"method" => $method,
			"path"   => $route,
			"params" => $params
		];
	}

	/**
	 * Return array of key-value pairs from URL template and current URL
	 *
	 * @param $currentUrl URL retrieved from $_SERVER variable
	 * @param $urlTemplate URL stored in $routes
	 * @return array
	 */
	private static function findVariables($currentUrl, $urlTemplate)
	{

		$templateSegments = self::parseUrlToSegments($urlTemplate);
		$urlSegments      = self::parseUrlToSegments($currentUrl);

		$params = [];
		foreach ($templateSegments as $key => $segment) {
			if (self::isVariableSegment($segment)) {
				$params[ltrim($segment, ":")] = $urlSegments[$key];
			}
		}

		return $params;
	}

	/**
	 * Return segments from splitted URL
	 *
	 * @param $urlPath
	 * @return array
	 */
	private static function parseUrlToSegments($urlPath)
	{
		return explode("/", trim($urlPath, "/"));
	}

	/**
	 * Check if $segment matches :something
	 *
	 * @param $segment
	 * @return bool
	 */
	private static function isVariableSegment($segment)
	{
		return preg_match("/:[a-z]*/", $segment);
	}

	/**
	 * Try to find right route from URL, because route may contains :variables
	 *
	 * @param $url
	 * @param $method
	 * @return bool|int|string
	 */
	public static function getRouteFromUrl($url, $method)
	{
		foreach(self::$routes[$method] as $templateURL => $c){

			$templateURLSegments = self::parseUrlToSegments($templateURL);
			$URLSegments = self::parseUrlToSegments($url);

			if(count($templateURLSegments) != count($URLSegments))
				continue;

			//remove :variable values from both of arrays
			foreach($templateURLSegments as $key => $segment){
				if(self::isVariableSegment($segment)){
					unset($templateURLSegments[$key]);
					unset($URLSegments[$key]);
				}
			}

			if($templateURLSegments === $URLSegments)
				return $templateURL;
		}

		return false;
	}
}