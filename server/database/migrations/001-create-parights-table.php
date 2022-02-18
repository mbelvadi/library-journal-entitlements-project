<?php
  require '../util/index.php';

  function createPARightsTable($db) {
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

  function runMigration() {
    createPARightsTable(new OpenPARightsDB());
  }
?>