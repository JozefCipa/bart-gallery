<?php

class PictureUploader
{

	public $category;
	private $categoryPath;
	private $categoryThumbsPath;
	private $picture;
	private $thumbPicture;
	private $preparedThumb;
	private $pictureName;
	private $pictureExtensions = [
		"jpg",
		"jpeg",
		"png",
		"gif"
	];
	private $extension;

	function __construct($picture, $categoryName)
	{
		try {
			$this->category = new PictureCategory($categoryName);
		} catch (Exception $e) {
			$this->category = PictureCategory::createCategory($categoryName);
		}

		$this->categoryPath       = $this->category->getCategoryPath()["category"];
		$this->categoryThumbsPath = $this->category->getCategoryPath()["thumbs"];

		$this->pictureName = $picture["name"];
		$this->picture     = $picture;
	}

	/**
	 * Check if uploaded file is valid picture
	 *
	 * @return bool
	 */
	function isValid()
	{
		$this->extension = pathinfo($this->pictureName, PATHINFO_EXTENSION);

		return in_array(strtolower($this->extension),
			$this->pictureExtensions) && getimagesize($this->picture["tmp_name"]);
	}

	/**
	 * Create cropped thumbnail picture
	 * Source: https://gist.github.com/jasdeepkhalsa/4339969
	 *
	 * @param $width
	 * @param $height
	 * @return $this
	 */
	function createThumb($width, $height)
	{
		switch (strtolower($this->extension)) {
			case "jpg":
			case "jpeg":
				$this->thumbPicture = imagecreatefromjpeg($this->picture["tmp_name"]);
				break;
			case "png":
				$this->thumbPicture = imagecreatefrompng($this->picture["tmp_name"]);
				break;
			case "gif":
				$this->thumbPicture = imagecreatefromgif($this->picture["tmp_name"]);
				break;
			default:
				$this->thumbPicture = null;
		}

		$originalSize = [
			"width"  => imagesx($this->thumbPicture),
			"height" => imagesy($this->thumbPicture),
		];

		//calculate aspects
		$originalAspect = $originalSize["width"] / $originalSize["height"];
		$thumbAspect    = $width / $height;


		if ($originalAspect >= $thumbAspect) {
			// If image is wider than thumbnail (in aspect ratio sense)
			$newHeight = $height;
			$newWidth  = $originalSize["width"] / ($originalSize["height"] / $height);
		} else {
			// If the thumbnail is wider than the image
			$newWidth  = $width;
			$newHeight = $originalSize["height"] / ($originalSize["width"] / $height);
		}

		$this->preparedThumb = imagecreatetruecolor($width, $height);


		// Resize and crop
		imagecopyresampled($this->preparedThumb,
							$this->thumbPicture,
							0 - ($newWidth - $width) / 2, // Center the picture horizontally
							0 - ($newHeight - $height) / 2, // Center the picture vertically
							0,
							0,
							$newWidth,
							$newHeight,
							$originalSize["width"],
							$originalSize["height"] );
	}

	/**
	 * Save picture and thumb to category directory and return URL to uploaded main picture
	 *
	 * @return array
	 */
	function save()
	{
		$pictureLocation      = $this->categoryPath . $this->pictureName;
		$pictureThumbLocation = $this->categoryThumbsPath . $this->pictureName;

		//save standard picture
		move_uploaded_file($this->picture["tmp_name"], $pictureLocation);

		//save thumb from standard picture
		switch (strtolower($this->extension)) {
			case "jpg":
			case "jpeg":
				imagejpeg($this->preparedThumb, $pictureThumbLocation);
				break;
			case "png":
				imagepng($this->preparedThumb, $pictureThumbLocation);
				break;
			case "gif":
				imagegif($this->preparedThumb, $pictureThumbLocation);
				break;
		}

	}
}