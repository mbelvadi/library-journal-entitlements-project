<?php
  function validAdmin ($adminKey, $dbRoute) {
    $db = new SQLite3($dbRoute);
    $results = $db->query("SELECT * FROM ADMIN_TOKENS WHERE token = '$adminKey' AND valid_till >= strftime('%s', 'now')");
    $resultsArray = array();
    while ($res= $results->fetchArray(1)) {
      array_push($resultsArray, $res);
    }
  
    if(count($resultsArray) !== 1) {
      http_response_code(401);
      echo json_encode(array("error" => "invalid admin key. Please login again."));
      return false;
    }
    return true;
  }
?>