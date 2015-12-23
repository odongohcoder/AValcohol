<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function(Blueprint $table) {
			$table->increments('id');
			$table->decimal('amount');
			$table->enum('status', ['pending', 'out-for-delivery', 'delivered', 'pending-refund', 'refunded']);
			$table->unsignedInteger('product_id');
			$table->unsignedInteger('user_id');
			$table->unsignedInteger('user_address_id');
			$table->timestamps();
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('orders');
    }
}