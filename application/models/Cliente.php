<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cliente extends CI_Model {


	function __construct() {
		$this->table = "customer";
		parent::__construct($this->table);

	}

}