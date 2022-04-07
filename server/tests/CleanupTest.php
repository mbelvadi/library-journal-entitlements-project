<?php declare(strict_types=1);
  use PHPUnit\Framework\TestCase;
  use GuzzleHttp\Client;

  final class CleanupTest extends TestCase {
    private $basePath = '/library-journal-entitlements-project/server/routes';
    private $client;  
    private $adminKey;

    protected function setup(): void {
      $this->adminKey = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

      $dbPath = dirname(__DIR__, 1) . '/database/admin.db';
      $db = new SQLite3($dbPath);
      $db->exec("INSERT INTO ADMIN_TOKENS (token) VALUES ('$this->adminKey')");
      $db->close();
      
      $this->client = new Client([
        'base_uri' => 'http://localhost'
      ]);
    }

    /**
     * For development purposes... makes it easier to test as it removes all the changes made by the tests to the config file
     */
    protected function tearDown(): void {
      shell_exec('git restore ' . dirname(__DIR__, 1) . '/config.json');
    }

    public function testWipeDatabase(): void {
      $response = $this->client->post("{$this->basePath}/admin/wipe-database?adminKey={$this->adminKey}", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('files', $resData);
      $this->assertEqualsCanonicalizing($resData['files'], []);
    }

    public function testListFiles(): void {
      $response = $this->client->post("{$this->basePath}/list-files", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertEquals(count($resData), 0);
    }
  }
?>