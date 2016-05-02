<?php

namespace App\Http\Services;

use App\Http\Repositories\Interfaces\UserAddressInterface;
use App\Http\Repositories\Interfaces\VendorInterface;

class VendorService extends BaseService
{
	protected $addressRepo;

	public function __construct(VendorInterface $vendorRepo, UserAddressInterface $addressRepo)
	{
		$this->repo = $vendorRepo;
		$this->addressRepo = $addressRepo;
	}

	public function login() {

	}

	/**
	 * returns all vendors for the given delivery zone id
	 * @param $address array
	 * @return array
	 */
	public function getVendorsForAddress($address) {
		$deliveryZoneId = $address['delivery_zone_id'];
		return $this->repo->getByDeliveryZone($deliveryZoneId);
	}

	/**
	 * @param $vendor array
	 * @return mixed collection
	 */
	public function getProductsForVendor($vendor) {
		$vendor = $this->repo->getById($vendor['id']);
		return $this->repo->getProducts($vendor);
	}

	/**
	 * returns a specific vendor prdouct
	 * @param $vendor_id
	 * @param $product_id
	 * @return mixed
	 */
	public function getProduct($vendor_id, $product_id) {
		$vendor = $this->repo->getById($vendor_id);
		$product = $this->repo->getProduct($vendor, $product_id);
		return $product;
	}

	/**
	 * returns all orders that a vendor has not accepted / rejected yet
	 * @param $vendor
	 */
	public function getPendingOrders($vendor) {
		$vendor = $this->repo->getById($vendor['id']);
		return $this->repo->getAllPendingOrders($vendor);
	}
}