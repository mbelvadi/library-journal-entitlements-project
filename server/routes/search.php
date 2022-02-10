<?php
  $data = json_decode(file_get_contents("php://input"));

  // Just return posted data for now
  http_response_code(200);
  echo json_encode(array("message" => $data));
?>