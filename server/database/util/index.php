<?php
  class OpenPARightsDB extends SQLite3 {
    function __construct() {
      $this->open('../ljp.db');
    }
  }
?>