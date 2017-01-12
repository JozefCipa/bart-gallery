<?php

//$picturesCategory, $count

try {
	$category = new PictureCategory($picturesCategory);
}
catch (Exception $e) {
	Response::sendJSON(["error" => $e->getMessage()]);
}

$thumbs = $category->getPicturesThumbs($count);

Response::sendJSON(["thumbs" => $thumbs]);