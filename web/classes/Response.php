<?php

class Response
{

	/**
	 * Load file by path
	 *
	 * @param $filePath
	 * @param array $args
	 */
	public static function handle($filePath, $args = []){

		//change to underscore_case syntax
		$filePath = ltrim(strtolower(preg_replace('/[A-Z]/', '_$0', $filePath)), '_');

		$filePath .= ".php"; //add extension
		$filePath = ltrim($filePath, "/"); //remove / from start
		$filePath = env("WEB_DIR") . $filePath;

		if(! file_exists($filePath))
			Response::notFound();

		extract($args);
		require $filePath;

		die();
	}

	public static function sendJSON($data){
		$data = json_encode($data);

		header('Content-Type: application/json');
		die($data);
	}

	public static function notFound()
	{
		header("HTTP/1.1 404 Not Found");
		die("404 - Not Found.");
	}
}