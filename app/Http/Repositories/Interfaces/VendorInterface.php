<?php
/**
 * Created by PhpStorm.
 * User: Feek
 * Date: 3/16/16
 * Time: 3:50 PM
 */

namespace App\Http\Repositories\Interfaces;

use App\Models\User;
use App\Models\Vendor;

interface VendorInterface
{
	public function create(User $user, $data);
	public function getById($id);
	public function getProducts(Vendor $vendor);
	public function getProduct(Vendor $vendor, $productId);
	public function getAllPendingOrders(Vendor $vendor);
	public function getByDeliveryZone($deliveryZoneId);
}