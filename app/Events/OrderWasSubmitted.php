<?php
/**
 * Created by PhpStorm.
 * User: Feek
 * Date: 12/19/15
 * Time: 6:04 PM
 */

namespace App\Events;

use App\Models\Order;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderWasSubmitted extends Event implements ShouldBroadcast
{
	use SerializesModels;

	public $order;
	protected $env;

	public function __construct(Order $order)
	{
		$this->order = $order;
		$this->env =  $_ENV['APP_ENV']; // should probably figure out how to load this directly from $app->environment()....
	}

	/**
	 * The channel this event should broadcast on
	 */
	public function broadcastOn()
	{
		// change channel name if not production so we don't bloat actual orders
		if ($this->env != 'production') {
			return ['dev.orders'];
		}

		return ['orders'];
	}

	/**
	 * The data to send to the consumer
	 * @return array
	 */
	public function broadcastWith()
	{
		// fetch the relations
		$this->order->load('user', 'product', 'address');

		return [
			'order' => $this->order
		];
	}
}