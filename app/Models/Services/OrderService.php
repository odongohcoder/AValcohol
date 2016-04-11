<?php
/**
 * Created by PhpStorm.
 * User: Feek
 * Date: 1/25/16
 * Time: 2:35 PM
 */

namespace App\Models\Services;

use App\Models\Repositories\Interfaces\OrderInterface;
use App\Events\OrderWasSubmitted;
use Illuminate\Support\Facades\Event;

class OrderService extends BaseService
{
	protected $userService;
	protected $addressService;
	protected $productService;
	protected $vendorService;

	public function __construct(OrderInterface $repo, UserService $userService, UserAddressService $addressService, ProductService $productService,
								VendorService $vendorService)
	{
		$this->repo = $repo;
		$this->userService = $userService;
		$this->addressService = $addressService;
		$this->productService = $productService;
		$this->vendorService = $vendorService;
	}

	/**
	 * Creates a new order and charges the user
	 * @param $data
	 * @return mixed
	 */
	public function create($data) {
		$user = $this->userService->getUser($data['user']['id']);
		$address = $this->addressService->get($data['address']['id']);
		//$products = $this->productService->getAll($data['products']);

		$products = [];
		foreach($data['products'] as $product) {
			$product = $this->vendorService->getProduct($product);
			$products[] = $product;
		}

		$order = $this->repo->createOrder($user, $address, $products, $data);

		// notify pusher etc
		Event::fire(new OrderWasSubmitted($order));

		return $order;
	}
}