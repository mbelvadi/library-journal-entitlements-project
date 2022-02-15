<?php
  class OpenDB extends SQLite3 {
    function __construct() {
      $this->open('../database/test.db');
    }
  }

  function createTestTable($db) {
    $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS COMPANY
      (ID INT PRIMARY KEY     NOT NULL,
      NAME           TEXT    NOT NULL,
      AGE            INT     NOT NULL,
      ADDRESS        CHAR(50),
      SALARY         REAL);
    EOF;

    $ret = $db->exec($sql);
    if(!$ret){
        echo $db->lastErrorMsg();
    } 
    $db->close();
  }

  function insertTestData($db) {
    $sql =<<<EOF
      INSERT OR REPLACE INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
      VALUES (1, 'Paul', 32, 'California', 20000.00 );

      INSERT OR REPLACE INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
      VALUES (2, 'Allen', 25, 'Texas', 15000.00 );

      INSERT OR REPLACE INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
      VALUES (3, 'Teddy', 23, 'Norway', 20000.00 );

      INSERT OR REPLACE INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
      VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00 );
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