<?php
  class OpenDB extends SQLite3 {
    function __construct() {
      $this->open('../database/ljp.db');
    }
  }

  function createTestTable($db) {
    $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS PA_RIGHTS
      (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title VARCHAR(255) NOT NULL,
      title_id CHARACTER(20) NOT NULL,
      print_issn CHARACTER(20),
      online_issn CHARACTER(20),
      former_title CHARACTER(20),
      succeeding_title CHARACTER(20),
      agreement_code VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      collection_name VARCHAR(255),
      title_metadata_last_modified VARCHAR(255),
      filename VARCHAR(255) NOT NULL,
      has_rights CHARACTER(20) NOT NULL);
    EOF;

    $ret = $db->exec($sql);
    if(!$ret){
        echo $db->lastErrorMsg();
    } 
    $db->close();
  }

  function insertTestData($db) {
    $sql =<<<EOF
      INSERT OR REPLACE INTO PA_RIGHTS (id, title, title_id, print_issn, online_issn, former_title, succeeding_title, agreement_code, year, collection_name, title_metadata_last_modified, filename, has_rights)
      VALUES (1, 'Accounts of Chemical Research', 'achre4', '0001-4842', '1520-4898', 'N', 'N', 'CRKN_ACS_LIC_2001', 2001, 'CRKN Custom Package', '#########', 'CRKN_PARightsTracking_ACS_2021_12_07_01_0.xlsx', 'Y');
    EOF;

    $ret = $db->exec($sql);
    if(!$ret) {
        echo $db->lastErrorMsg();
    } 
    $db->close();
  }

  function initDB() {
    createTestTable(new OpenDB());
    insertTestData(new OpenDB());

    echo json_encode("Succesfully initialized test db");
  }

  initDB();
?>