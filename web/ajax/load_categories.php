<?php

Response::sendJSON(["categories" => PictureCategory::getAllCategories()]);