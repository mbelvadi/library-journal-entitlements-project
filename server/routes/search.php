<?php
  $DEFAULT_PAGE_LENGTH = 20;

  $data = json_decode(file_get_contents("php://input"));
  $page = (property_exists($data, "page")) ? $data->page : -1;
  $pageLength = (property_exists($data, "pageLength")) ? $data->pageLength: $DEFAULT_PAGE_LENGTH;

  // perform actual search here and get results

  http_response_code(200);
  echo json_encode(array("results" => null, "query" => $data->query, "pagination" => array("currentPage" => $page, "totalPages" => 11, "pageLength" => $pageLength) ));
?>