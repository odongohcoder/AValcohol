<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\Models\Product::class, function(Faker\Generator $faker) {
	return [
		'upc' => $faker->randomNumber(9),
		'name' => $faker->name(),
		'featured' => $faker->boolean(10), // will be true 10 percent of the time
		'image_url' => 'genesee-cream-ale.jpg'
	];
});

$factory->define(App\Models\User::class, function(Faker\Generator $faker) {
	return [
		'email' => $faker->email(),
		'password' => $faker->password()
	];
});

$factory->define(App\Models\UserAddress::class, function(Faker\Generator $faker) {

	return [
		'street' => $faker->streetName(),
		'city' => $faker->city(),
		'state' => $faker->citySuffix(),
		'zipcode' => $faker->randomNumber(5),
		'location' => [
			'latitude' => $faker->latitude,
			'longitude' => $faker->longitude
		],
		'delivery_zone_id' => \App\Models\DeliveryZone::orderByRaw('RAND()')->first()->id
	];
});

$factory->define(App\Models\UserProfile::class, function(Faker\Generator $faker) {
	$max = 'now';
	$max = new DateTime('today');
	$max->sub(new DateInterval('P21Y')); // subtract 21 years from today

	return [
		'first_name' => $faker->firstName,
		'last_name' => $faker->lastName,
		'phone_number' => substr(str_replace(['(', ')', '.', '-', 'x', '+'], '', $faker->phoneNumber), 0, 10),
		'date_of_birth' => $faker->date('Y-m-d', $max)
	];
});

$factory->define(App\Models\Order::class, function(\Faker\Generator $faker) {
	$users = \App\Models\User::orderByRaw('RAND()')->get();
	// don't create an order for a user that is a vendor
	$user = null;

	foreach($users as $u) {
		if ($u->isVendor() === false) {
			$user = $u;
			break;
		}
	}

	if (!$user) {
		dd('all users in db are apparently vendors');
	}

	return [
		'amount' => $faker->randomNumber(2),
		'user_id' => $user->id,
		'user_address_id' => $u->address->id,
		'vendor_id' => 1 // temp
	];
});

$factory->define(App\Models\OrderStatus::class, function(\Faker\Generator $faker) {
	return [
		'vendor_status' => $faker->boolean() < 50 ? 'pending' : 'accepted',
		'delivery_status' => $faker->boolean() < 50 ? 'pending' : 'out-for-delivery',
		'charge_id' => uniqid(),
		'charge_authorized' => $faker->boolean(90),
		'charge_captured' => $faker->boolean()
	];
});

$factory->define(App\Models\Vendor::class, function(\Faker\Generator $faker) {
	$zone = factory(\App\Models\DeliveryZone::class)->create();
	return [
		'name' => $faker->company,
		'address' => $faker->address,
		'phone_number' => $faker->phoneNumber,
		'delivery_zone_id' => $zone->id
	];
});

$factory->define(App\Models\VendorSetting::class, function(\Faker\Generator $faker) {
	return [

	];
});

$factory->define(\App\Models\DeliveryZone::class, function(\Faker\Generator $faker) {
	return [
		'name' => 'FactoryZone',
		'points' => [
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude),
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude),
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude),
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude),
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude),
			new \App\Models\DeliveryZone\Point($faker->latitude, $faker->longitude)
		]
	];
});