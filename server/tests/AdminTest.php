<?php declare(strict_types=1);
  use PHPUnit\Framework\TestCase;
  use GuzzleHttp\Client;

  final class AdminTest extends TestCase {
    private $basePath = '/library-journal-entitlements-project/server/routes';
    private $client;  
    private $adminKey;
    private $testCrknUrl = 'https://www.crkn-rcdr.ca/en/perpetual-access-rights-reports-storage';
    private $testSchool = 'Univ. of Prince Edward Island';
    private $testColor = '#5c8827';
    private $testTitle = 'test title :)';
    private $testFaviconUrl = 'https://files.upei.ca/misc/icons/upeifavicon.ico';
    private $testMainLogo = 'https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg';

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

      $response2 = $this->client->post("{$this->basePath}/admin/change-rights", [
        'form_params' => [
          'adminKey' => $this->adminKey,
          'includeRights' => 'false',
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response2->getStatusCode());
      $resData = json_decode($response2->getBody(true)->getContents(), true);
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
      $this->assertFalse($resData['includeNoRights']);
    }

    public function testUploadFile(): void {
      $testFilePath = dirname(__DIR__, 1) . '/tests/testSpreadsheet.xlsx';
      $response = $this->client->post("{$this->basePath}/admin/upload", [
        'multipart' => [
          [
            'name'     => 'file',
            'contents' => file_get_contents($testFilePath),
            'filename' => 'testSpreadsheet.xlsx',
          ],
          [
            'name' => 'adminKey',
            'contents' => $this->adminKey,
          ]
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('files', $resData);
      $this->assertEquals(count($resData['files']), 1);
      $this->assertEquals($resData['files'][0], 'testSpreadsheet.xlsx');
    }

    public function testListFiles(): void {
      $response = $this->client->post("{$this->basePath}/list-files", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertEquals($resData[0], 'testSpreadsheet.xlsx');
    }

    public function testSetStyleInvalidRequest(): void {
      $response = $this->client->post("{$this->basePath}/admin/set-style", [
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

    public function testSetStyle(): void {
      $response = $this->client->post("{$this->basePath}/admin/set-style", [
        'form_params' => [
          'adminKey' => $this->adminKey,
          'color' => $this->testColor,
          'favicon' => $this->testFaviconUrl,
          'logo' => $this->testMainLogo,
          'pageTitle' => $this->testTitle,
        ],
        'http_errors' => false
      ]);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('message', $resData);
      $this->assertEquals($resData['message'], "Successfully updated style config.");
    }

    public function testGetStyle(): void {
      $response = $this->client->post("{$this->basePath}/style", []);

      $this->assertEquals(200, $response->getStatusCode());
      $resData = json_decode($response->getBody(true)->getContents(), true);
      $this->assertArrayHasKey('color', $resData);
      $this->assertArrayHasKey('favicon', $resData);
      $this->assertArrayHasKey('pageTitle', $resData);
      $this->assertArrayHasKey('logo', $resData);
      $this->assertEquals($resData['color'], $this->testColor);
      $this->assertEquals($resData['pageTitle'], $this->testTitle);
      $this->assertEquals($resData['logo'], $this->testMainLogo);
      $this->assertEquals($resData['favicon'], $this->testFaviconUrl);
    }

    public function testGetErrorLog(): void {
      $response = $this->client->post("{$this->basePath}/admin/error-log-download?adminKey={$this->adminKey}", []);

      $this->assertEquals(200, $response->getStatusCode());
    }
  }
?>