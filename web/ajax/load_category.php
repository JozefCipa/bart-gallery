<?php

//$picturesCategory, $thumbsCount

try {
	$category = new PictureCategory($picturesCategory);
}
catch (Exception $e) {
	Response::sendJSON(["error" => $e->getMessage()]);
}

$thumbs  = $category->getPicturesThumbs($thumbsCount);

$data = [
	"categories"      => PictureCategory::getAllCategories(),
	"currentCategory" => [
		"name"        => ucfirst($picturesCategory),
		"count"       => $category->getPicturesCount(),
		"categoryUrl" => $category->getCategoryURL(),
		"mainPicture" => $category->getPictureByThumb($thumbs[0]),
		"thumbs"      => $thumbs
	]
];

Response::sendJSON($data);