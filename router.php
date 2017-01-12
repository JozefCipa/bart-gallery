<?php

require __DIR__ . "/config.php";

//Inspired by Laravel :)
//------------------------

Router::init();

//routes
Router::get("/api/thumbs/:picturesCategory/:count", function ($params) {
	Response::handle("ajax/loadThumbs", $params);
});

Router::get("/api/main-picture/:picturesCategory/:thumbName", function ($params) {
	Response::handle("ajax/loadMainPicture", $params);
});

Router::get("/api/pictures-category/:picturesCategory/:thumbsCount", function ($params) {
	Response::handle("ajax/loadCategory", $params);
});

Router::get("/api/load-categories", function(){
	Response::handle("ajax/loadCategories");
});

Router::post("/api/upload", function () {
	Response::handle("ajax/uploadPicture");
});

//start routing
Router::route();