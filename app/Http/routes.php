<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->welcome();
});

$app->group(['prefix' => 'product', 'namespace' => 'App\Http\Controllers'], function($app) {
	$app->get('all', 'ProductController@getAll');
	$app->get('featured', 'ProductController@getAllFeatured');
	$app->get('beer', 'ProductController@getAllBeer');
});

$app->group(['prefix' => 'address', 'namespace' => 'App\Http\Controllers'], function($app) {
	$app->post('validate', 'AddressController@validateAddress');
	$app->post('', 'AddressController@create');
});

$app->group(['prefix' => 'order', 'namespace' => 'App\Http\Controllers'], function($app) {
	$app->post('', 'OrderController@createOrder');

	// To Do: ADMIN AUTH
	$app->get('pending-and-out-for-delivery', 'OrderController@getAllPendingAndOutForDelivery');
	$app->get('{id}', 'OrderController@getfullOrderInfo');
	$app->post('status', 'OrderController@updateStatus');
});

$app->group(['prefix' => 'user', 'namespace' => 'App\Http\Controllers'], function($app) {
	$app->post('', 'UserController@create');
	$app->put('{id}', 'UserController@update');
});

// To Do: ADMIN AUTH
$app->get('/environment', function() use ($app) {
	return $app->environment();
});

$app->get('/stripe/key', function() use ($app) {
	return response()->json([
		'key' => Dotenv::findEnvironmentVariable('STRIPE_KEY')
	]); // should i do this via config() helper?
});

if ($app->environment() !== 'production') {
	$app->group(['prefix' => 'logs', 'namespace' => '\Rap2hpoutre\LaravelLogViewer'], function ($app) {
		$app->get('', 'LogViewerController@index');
	});
}
