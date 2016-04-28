<?php

use App\Models\DeliveryZone;
use App\Models\DeliveryZone\Point;

/**
 * Created by PhpStorm.
 * User: Feek
 * Date: 4/19/16
 * Time: 2:50 PM
 */
class DeliveryZoneTest extends TestCase
{
	use \Laravel\Lumen\Testing\DatabaseTransactions;

	public function setup() {
		parent::setup();
		DeliveryZone::create([
			'name' => 'Test1',
			'points' => [new Point(0,0), new Point(0,4), new Point(4,4), new Point(4, 0)]
		]);
	}

	public function testDoesContainPoint() {
		$zone = DeliveryZone::where(['name' => 'Test1'])->first();

		$inZone = $zone->doesContainPoint(new Point(1, 1));
		$notInZone = $zone->doesContainPoint(new Point(4,5));

		$this->assertTrue($inZone);
		$this->assertFalse($notInZone);
	}

	public function testGetZonesContainingPoint() {
		$inZone = DeliveryZone::getZonesContainingPoint(new Point(1, 1));
		$notInTestZone = DeliveryZone::getZonesContainingPoint(new Point(4,5));

		$this->assertFalse($inZone->isEmpty());

		// assert not of the zones returned are Test1
		foreach ($notInTestZone as $zone) {
			$this->assertNotEquals('Test1', $zone->name);
		}

		$zoneTwo = DeliveryZone::create([
			'name' => 'Zone 2',
			'points' => [new Point(0,0), new Point(0,2), new Point(2,2), new Point(2, 0)]
		]);

		$multipleZones = DeliveryZone::getZonesContainingPoint(new Point(1, 1));
		$this->assertTrue($multipleZones->count() >= 2);
	}
}