<?php
  require '../vendor/autoload.php';
  use PhpOffice\PhpSpreadsheet\Spreadsheet;
  use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

  $DEFAULT_PAGE_LENGTH = 20;

  $data = json_decode(file_get_contents("php://input"));
  $page = (property_exists($data, "page")) ? $data->page : 1;
  $pageLength = (property_exists($data, "pageLength")) ? $data->pageLength: $DEFAULT_PAGE_LENGTH;

  $inputFileName = "../PAR-files/CRKN_PARightsTracking_ACS_2021_12_07_01_0.xlsx";
  $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($inputFileName);
  $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
  $spreadsheet = $reader->load($inputFileName);

  $sheetCount = $spreadsheet->getSheetCount();
  $sheets = array("");
  for ($i = 0; $i < $sheetCount; $i++) {
      $sheet = $spreadsheet->getSheet($i);
      $sheetData = $sheet->toArray(null, true, true, true);
      array_push($sheets, $sheetData);
  }

  http_response_code(200);
  echo json_encode(array("results" => $sheets, "query" => $data->query, "pagination" => array("currentPage" => $page, "totalPages" => 11, "pageLength" => $pageLength) ));
?>