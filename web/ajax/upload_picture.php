<?php

$category    = $_POST["category"];
$pictureName = $_FILES["picture"]["name"];

$rssChannel      = new RSS(env("RSS_FILENAME"), env("RSS_FORM"));
$uploader        = new PictureUploader($_FILES["picture"], $category);

if (!$uploader->isValid())
	Response::sendJSON(["error" => "File must be an image !"]);

$uploader->createThumb(env("THUMB_DIMENSIONS")["WIDTH"], env("THUMB_DIMENSIONS")["HEIGHT"]);

$res = $uploader->save();

$rssChannel->addItem([
	"title"       => $pictureName,
	"link"        => $uploader->category->getCategoryURL() . $pictureName,
	"description" => $category,
	"pubDate"     => date(DateTime::RSS, time()),
	"guid"        => $category . "-" . $pictureName
])->save();

Response::sendJSON("ok");
