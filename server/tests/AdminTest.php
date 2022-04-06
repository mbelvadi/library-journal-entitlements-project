<?php declare(strict_types=1);
  use PHPUnit\Framework\TestCase;
  use GuzzleHttp\Client;

  final class AdminTest extends TestCase {
    private $basePath = '/library-journal-entitlements-project/server/routes';
    private $client;  
    private $adminKey;
    private $testCrknUrl = 'https://test.ca';
    private $testSchool = 'test school';

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

    public function testCreateAdminNoPasswords(): void {
      $response = $this->client->post("{$this->basePath}/admin/create", ['http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Invalid request.');
    }

    public function testCreateAdminShortPassword(): void {
      $data = array (
        'password' => 'test1',
        'confirmPassword' => 'test1'
      );
      $response = $this->client->post("{$this->basePath}/admin/create", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Password must be at least 6 characters.');
    }

    public function testCreateAdminDifferentPasswords(): void {
      $data = array (
        'password' => 'test124',
        'confirmPassword' => 'test123'
      );
      $response = $this->client->post("{$this->basePath}/admin/create", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Passwords do not match.');
    }

    public function testCreateAdmin(): void {
      $data = array (
        'password' => 'test123',
        'confirmPassword' => 'test123'
      );
      $response = $this->client->post("{$this->basePath}/admin/create", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('message', $resData);
      $this->assertEquals($resData['message'], 'Succesfully created admin account!');
    }

    /**
     * Since only one admin account is supported this test should fail.
     */
    public function testCreateSecondAdmin(): void {
      $data = array (
        'password' => 'test1234',
        'confirmPassword' => 'test1234'
      );
      $response = $this->client->post("{$this->basePath}/admin/create", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Admin is already setup.');
    }

    public function testLoginNoPassword(): void {
      $response = $this->client->post("{$this->basePath}/admin/login", ['http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Invalid request.');
    }

    public function testLoginWrongPassword(): void {
      $data = array (
        'password' => 'test1234',
      );
      $response = $this->client->post("{$this->basePath}/admin/login", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Incorrect password.');
    }

    public function testLoginCorrectPassword(): void {
      $data = array (
        'password' => 'test123',
      );
      $response = $this->client->post("{$this->basePath}/admin/login", ['body' => json_encode($data), 'http_errors' => false]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('adminKey', $resData);
    }

    public function testNoAdminKey(): void {
      $response = $this->client->post("{$this->basePath}/admin/wipe-database", ['http_errors' => false]);

      $this->assertEquals(401, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'admin key is required.');
    }

    public function testWrongAdminKey(): void {
      $response = $this->client->post("{$this->basePath}/admin/wipe-database?adminKey=123", ['http_errors' => false]);

      $this->assertEquals(401, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'invalid admin key. Please login again.');
    }

    public function testWipeDatabase(): void {
      $response = $this->client->post("{$this->basePath}/admin/wipe-database?adminKey={$this->adminKey}", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('files', $resData);
      $this->assertEqualsCanonicalizing($resData['files'], []);
    }

    public function testChangeCrknURLInvalidRequest(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-crkn-url", [
        'form_params' => [
          'adminKey' => $this->adminKey
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Invalid request.');
    }

    public function testChangeCrknURL(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-crkn-url", [
        'form_params' => [
          'adminKey' => $this->adminKey,
          'url' => $this->testCrknUrl,
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('message', $resData);
      $this->assertEquals($resData['message'], 'Successfully updated crkn URL.');
    }

    public function testChangeSchoolInvalidRequest(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-school", [
        'form_params' => [
          'adminKey' => $this->adminKey
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Invalid request.');
    }

    public function testChangeSchool(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-school", [
        'form_params' => [
          'adminKey' => $this->adminKey,
          'school' => $this->testSchool,
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('message', $resData);
      $this->assertEquals($resData['message'], 'Successfully updated school.');
    }

    public function testChangeRightsInvalidRequest(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-rights", [
        'form_params' => [
          'adminKey' => $this->adminKey
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(400, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('error', $resData);
      $this->assertEquals($resData['error'], 'Invalid request.');
    }

    public function testChangeRights(): void {
      $response = $this->client->post("{$this->basePath}/admin/change-rights", [
        'form_params' => [
          'adminKey' => $this->adminKey,
          'includeRights' => 'true',
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('message', $resData);
      $this->assertEquals($resData['message'], "Successfully updated 'rights' configuration.");
    }

    public function testGetConfigOptions(): void {
      $response = $this->client->post("{$this->basePath}/admin/config-options?adminKey={$this->adminKey}", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('includeNoRights', $resData);
      $this->assertArrayHasKey('url', $resData);
      $this->assertArrayHasKey('school', $resData);
      $this->assertEquals($resData['url'], $this->testCrknUrl);
      $this->assertEquals($resData['school'], $this->testSchool);
      $this->assertTrue($resData['includeNoRights']);
    }
  }
?>