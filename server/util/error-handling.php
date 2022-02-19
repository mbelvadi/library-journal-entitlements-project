<?php
  function apiErrorHandler($errno, $errstr, $errfile, $errline) {
    if (error_reporting()) {
      http_response_code(500);
      header('Content-Type: application/json; charset=utf-8');
      $response = array("errorNumber" => $errno, "message" => $errstr, "file" => $errfile, "line" => $errline);
      die(json_encode($response));
    }
  }
?>