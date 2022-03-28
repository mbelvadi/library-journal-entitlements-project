<?php
  function createPARightsTable($db) {
    $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS PA_RIGHTS
      (title VARCHAR(255) NOT NULL,
      title_id CHARACTER(20),
      print_issn CHARACTER(20),
      online_issn CHARACTER(20),
      has_former_title CHARACTER(20),
      has_succeeding_title CHARACTER(20),
      agreement_code VARCHAR(255),
      year INT NOT NULL,
      collection_name VARCHAR(255),
      title_metadata_last_modified VARCHAR(255),
      filename VARCHAR(255) NOT NULL,
      has_rights CHARACTER(20) NOT NULL,
      is_crkn_record BOOLEAN NOT NULL DEFAULT FALSE,
      package_name VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT (strftime('%s', 'now')));
    EOF;

    $ret = $db->exec($sql);
    if(!$ret){
        echo $db->lastErrorMsg();
    } 
    $db->close();
  }

  function runMigration() {
    createPARightsTable(new SQLite3('../ljp.db'));
  }
  runMigration();
?>