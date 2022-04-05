<?php declare(strict_types=1);
  use PHPUnit\Framework\TestCase;
  use GuzzleHttp\Client;
  use GuzzleHttp\Promise;
  use GuzzleHttp\Stream\Stream;

  final class SearchTest extends TestCase {
    private $basePath = '/library-journal-entitlements-project/server/routes';
    private $client;  

    protected function setup(): void {
      $this->client = new Client([
        'base_uri' => 'http://localhost'
      ]);
    }

    /**
     * Simple search with just a normal 'query' parameter
     */
    public function testSimpleSearch(): void {
      $data = array (
        'query' => 'test'
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
    }

    /**
     * Simple search with an empty string for the 'query' parameter
     */
    public function testEmptySearch(): void {
      $data = array (
        'query' => '',
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
    }

    /**
     * Search with empty request body
     */
    public function testEmptySearchBody(): void {
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode(array()), 'http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData["error"], "query must be specified");
    }

    /**
     * Search with no request body
     */
    public function testNoSearchBody(): void {
      $response = $this->client->post("{$this->basePath}/search", ['http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData["error"], "query must be specified");
    }

    /**
     * Search with 'year' parameter
     */
    public function testSearchWithYear(): void {
      $year = 2000;
      $data = array (
        'query' => 'test',
        'year' => $year,
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);

      $allResultsInYear = true;
      foreach ($resData["results"] as $res) {
        if ($res["year"] != $year) {
          $allResultsInYear = false;
          break;
        }
      }
      $this->assertTrue($allResultsInYear);
    }

    /**
     * Search with 'startYear' and 'endYear' parameters
     */
    public function testSearchWithYearRange(): void {
      $startYear = 1999;
      $endYear = 2006;
      $data = array (
        'query' => 'chemical',
        'startYear' => $startYear,
        'endYear' => $endYear,
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);

      $allResultsInYearRange = true;
      foreach ($resData["results"] as $res) {
        if ($res["year"] < $startYear || $res["year"] > $endYear) {
          $allResultsInYearRange = false;
          break;
        }
      }
      $this->assertTrue($allResultsInYearRange);
    }

    /**
     * Search with 'startYear' parameter
     */
    public function testSearchWithStartYear(): void {
      $startYear = 2009;
      $data = array (
        'query' => 'biology',
        'startYear' => $startYear
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);

      $allResultsAfterStartYear = true;
      foreach ($resData["results"] as $res) {
        if ($res["year"] < $startYear) {
          $allResultsAfterStartYear = false;
          break;
        }
      }
      $this->assertTrue($allResultsAfterStartYear);
    }

    /**
     * Search with 'endYear' parameter
     */
    public function testSearchWithEndYear(): void {
      $endYear = 2009;
      $data = array (
        'query' => 'biology',
        'endYear' => $endYear
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
      
      $allResultsBeforeEndYear = true;
      foreach ($resData["results"] as $res) {
        if ($res["year"] > $endYear) {
          $allResultsBeforeEndYear = false;
          break;
        }
      }
      $this->assertTrue($allResultsBeforeEndYear);
    }

    /**
     * Search with 'startYear', 'endYear', and 'year' specified.
     * The year range paramters should have higher precedence than the 'year'.
     */
    public function testSearchYearRangePriority(): void {
      $year = 2000;
      $startYear = 2003;
      $endYear = 2009;
      $data = array (
        'query' => 'chemistry',
        'year' => $year,
        'startYear' => $startYear,
        'endYear' => $endYear
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
      
      $allResultsInYearRange = true;
      foreach ($resData["results"] as $res) {
        if ($res["year"] < $startYear || $res["year"] > $endYear) {
          $allResultsInYearRange = false;
          break;
        }
      }
      $this->assertTrue($allResultsInYearRange);
    }

    /**
     * Search with emoji
     */
    public function testEmojiSearch(): void {
      $data = array (
        'query' => '😊test'
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
    }

    /**
     * Search with foreign characters
     */
    public function testForeignSearch(): void {
      $data = array (
        'query' => '영문학'
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
    }

    /**
     * Search with quotes
     */
    public function testQuoteSearch(): void {
      $data = array (
        'query' => "\"`'"
      );
      $response = $this->client->post("{$this->basePath}/search", ['body' => json_encode($data)]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('results', $resData);
    }
  }
?>