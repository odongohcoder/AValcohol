<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLongLatToAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('
			ALTER TABLE user_addresses 
			ADD location POINT NOT NULL 
			AFTER zipcode
		');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('
			ALTER TABLE user_addresses 
			DROP location POINT
		');
    }
}
