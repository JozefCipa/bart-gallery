<?php

class RSS
{
	private $filename;
	private $items;
	private $document;

	function __construct($filename, $channelData)
	{

		$this->filename = "./$filename";

		//write initialization RSS data
		if (!file_exists($filename)) {
			$file = fopen($filename, "w");
			fwrite($file, $channelData);
			fclose($file);
		}

		$this->document = new DOMDocument();
		$this->document->load($filename);

		$this->items = $this->getItems();
	}

	/**
	 * Add RSS item to array
	 *
	 * @param $item
	 * @return $this
	 */
	function addItem($item)
	{
		array_unshift($this->items, $item);

		if (count($this->items) > env("RSS_ITEMS_COUNT")) {
			$this->items = array_slice($this->items, 0, env("RSS_ITEMS_COUNT"));
		}

		return $this;
	}

	/**
	 * Make updates and save file
	 */
	function save()
	{
		$this->removeRSSItems();
		$this->updateContent();

		//save list
		file_put_contents($this->filename, $this->document->saveXML());
	}

	/**
	 * Update value of given element
	 *
	 * @param $elementName
	 * @param $index
	 * @param $value
	 * @return $this
	 */
	function updateElementValue($elementName, $index, $value)
	{

		$this->document->getElementsByTagName($elementName)->item($index)->nodeValue = $value;

		return $this;
	}

	/**
	 * Update variable data in RSS file
	 */
	private function updateContent()
	{

		//update dates
		$lastBuild   = $this->document->getElementsByTagName("pubDate")->item(0)->nodeValue;
		$currentTime = date(DateTime::RSS, time());

		$this->document->getElementsByTagName("lastBuildDate")->item(0)->nodeValue = $lastBuild != "" ? $lastBuild : $currentTime;
		$this->document->getElementsByTagName("pubDate")->item(0)->nodeValue       = $currentTime;

		$this->updateRSSItems();
	}

	/**
	 * Parse item elements from XML to associative array
	 *
	 * @return array|null
	 */
	private function getItems(){
		$items = $this->document->getElementsByTagName("item");

		$itemsArr = [];

		if ($items->length < 1) {
			return [];
		}

		foreach ($items as $item) {

			$parsedXMLitem = [];

			foreach ($item->childNodes as $childNode) {

				// Explanation of #text ---> http://stackoverflow.com/questions/4598409/printing-content-of-a-xml-file-using-xml-dom
				if ($childNode->nodeName == "#text") {
					continue;
				}

				$parsedXMLitem[$childNode->nodeName] = $childNode->textContent;
			}

			$itemsArr[] = $parsedXMLitem;
		}

		return $itemsArr;
	}

	/**
	 * Convert items array to RSS <item>s and write it
	 */
	private function updateRSSItems()
	{

		$channel = $this->document->getElementsByTagName("channel")->item(0);

		foreach ($this->items as $item) {

			$rssItem = $this->document->createElement("item");

			foreach ($item as $element => $value) {

				$el = $this->document->createElement($element, $value);

				$rssItem->appendChild($el);
			}

			$channel->appendChild($rssItem);
		}
	}

	/**
	 * Remove all RSS items from xml
	 */
	private function removeRSSItems()
	{
		$items = $this->document->getElementsByTagName('item');

		for ($i = $items->length - 1; $i >= 0; $i--) {
			$item = $items->item($i);
			$item->parentNode->removeChild($item);
		}
	}
}