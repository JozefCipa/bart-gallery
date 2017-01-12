<?php

//$picturesCategory, $thumbName

try{
	$category = new PictureCategory($picturesCategory);
}
catch(Exception $e){
	Response::sendJSON(["error" => $e->getMessage()]);
}

$picture = $category->getPictureByThumb($thumbName);

Response::sendJSON(["mainPicture" => $picture]);