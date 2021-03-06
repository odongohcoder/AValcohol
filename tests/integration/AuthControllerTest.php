<?php

/**
 * Created by PhpStorm.
 * User: Feek
 * Date: 4/3/16
 * Time: 3:48 PM
 */
class AuthControllerTest extends TestCase
{
	use \Laravel\Lumen\Testing\DatabaseTransactions;

	protected $vendor;
	protected $vendorRawPassword;
	
	function setUp()
	{
		parent::setUp();
		$this->prepareRequestsWithAdminPrivileges();

		$faker = \Faker\Factory::create();
		$data = [
			'email' => $faker->email,
			'password' => $faker->password,
			'name' => 'first last',
			'address' => '123 candy cane lane',
			'phone_number' => '1231231234',
			'delivery_zone_id' => '1'
		];
		$this->vendorRawPassword = $data['password'];
		$this->post('/admin/vendor', $data, $this->authHeader);
		$this->vendor = \App\Models\User::whereEmail($data['email'])->with('vendor')->first();
	}

	function testVendorCanLogin() {
		$this->assertNotNull($this->vendor, 'Vendor was unable to be made by the vendor create endpoint');

		$this->post('auth/login', [
			'email' => $this->vendor->email,
			'password' => $this->vendorRawPassword
		]);

		$this->seeJsonStructure([
			'token'
		]);

	}

	function testIncorrectLoginFails() {
		$this->post('auth/login', [
			'email' => $this->vendor->email,
			'password' => 'asdfdasdfea'
		]);

		$this->seeJson([
			'user_not_found'
		]);
	}
}