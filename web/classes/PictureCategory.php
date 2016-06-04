<?php

class PictureCategory
{
	private $categoryPath;
	private $categoryName;
	private static $picturesPattern = "*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}";

	/**
	 * Used when creating new category to not throwing exception "no pictures in category"
	 *
	 * @var bool
	 */
	private static $creatingNewCategory = false;

	function __construct($categoryName)
	{
		$this->categoryName = strtolower($categoryName);
		$this->categoryPath = env("GALLERY") . $categoryName;

		if (!file_exists($this->categoryPath)) {
			throw new Exception("Category $this->categoryName doesn't exist !");
		} else if ($this->getPicturesCount() < 1 && !self::$creatingNewCategory) {
				throw new Exception("Category $this->categoryName hasn't had any pictures yet !");
		}
	}

	/**
	 * Create directory for new category
	 *
	 * @param $categoryName
	 * @return PictureCategory
	 */
	static function createCategory($categoryName)
	{
		self::$creatingNewCategory = true;

		//create dirs
		mkdir(env("GALLERY") . $categoryName);
		mkdir(env("GALLERY") . $categoryName . "/thumbs");

		//create instance
		$instance = new PictureCategory($categoryName);

		self::$creatingNewCategory = false;

		return $instance;
	}

	/**
	 * Return count of pictures in category
	 *
	 * @return int
	 */
	function getPicturesCount()
	{
		return count(glob($this->categoryPath . "/" . self::$picturesPattern, GLOB_BRACE));
	}

	/**
	 * Return URL to category directory
	 *
	 * @return string
	 */
	function getCategoryURL()
	{
		return env("BASE_URL") . "/" . ltrim($this->categoryPath, "./") . "/";
	}

	/**
	 * Return file path to category directory
	 *
	 * @return array
	 */
	function getCategoryPath()
	{
		return [
			"category" => $this->categoryPath . "/",
			"thumbs"   => $this->categoryPath . "/thumbs/"
		];
	}

	/**
	 * Return names of pictures thumbs
	 *
	 * @param $count
	 * @return array
	 */
	function getPicturesThumbs($count)
	{

		$thumbs = glob($this->categoryPath . "/thumbs/" . self::$picturesPattern, GLOB_BRACE);

		//sort by date
		array_multisort(
			array_map( 'filemtime', $thumbs ),
			SORT_NUMERIC,
			SORT_DESC,
			$thumbs
		);

		$thumbs = array_map(function ($thumb) {
			return str_replace($this->categoryPath . "/", "", $thumb);
		}, $thumbs);

		return array_slice($thumbs, 0, $count);
	}

	/**
	 * Return URL of main picture by its thumb name
	 *
	 * @param $thumbName
	 * @return string
	 */
	function getPictureByThumb($thumbName)
	{

		//thumbs are called same as originals
		//stored in /thumbs subdirectory of category directory

		//creating URL
		$mainPictureURL = $this->getCategoryURL();
		$mainPictureURL .= basename($thumbName); //append picture name

		return $mainPictureURL;
	}

	/**
	 * Return category names which have some pictures
	 *
	 * @return array
	 */
	static function getAllCategories()
	{
		$categories = [];

		$galleryIterator = new DirectoryIterator(env("GALLERY"));

		foreach ($galleryIterator as $Item) {
			if (!$Item->isDot()) {
				$categoryPath = $Item->getPath() . "/" . $Item->getFilename();
				if (glob($categoryPath . "/" . self::$picturesPattern, GLOB_BRACE)) {
					$categories[] = $Item->getFilename();
				}
			}
		}

		return $categories;
	}
}