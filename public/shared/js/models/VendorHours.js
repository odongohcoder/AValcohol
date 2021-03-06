define([
	'backbone',
	'shared/js/models/Vendor',
	'backboneRelational'
], function (
	Backbone,
	Vendor
) {
	var VendorHours = Backbone.RelationalModel.extend({
		urlRoot: function() {
			var vendorId = this.get('vendor_id') || this.get('vendor').id;
			return '/api/vendor/' + vendorId + '/hours';
		},

		parse: function(response) {
			return response.vendor_store_hours;
		},

		relations: [
			{
				type: Backbone.HasOne,
				key: 'vendor',
				relatedModel: Vendor,
				includeInJSON: Backbone.Model.prototype.idAttribute,
				keyDestination: 'vendor_id' // this might break things in the future, but i want to send vendor_id to backend for now
			}
		],

		defaults: {
			day_of_week: null,
			open_time: null,
			close_time: null
		},

		validate: function(attrs, options) {
			var errors = [];
			var defaultMessage = "This field is required";

			if (!attrs.day_of_week) {
				errors.push({
					attribute: 'day_of_week',
					message: defaultMessage
				});
			}

			if (!attrs.open_time) {
				errors.push({
					attribute: 'open_time',
					message: defaultMessage
				});
			}

			if (!attrs.close_time) {
				errors.push({
					attribute: 'close_time',
					message: defaultMessage
				});
			}

			return errors.length > 0 ? errors : null;
		},

		/*
		|--------------------------------------------------------------------------
		| utils
		|--------------------------------------------------------------------------
		|
		| woot woot.
		|
		*/

		days: {
			0 : 'Sunday',
			1 : 'Monday',
			2 : 'Tuesday',
			3 : 'Wednesday',
			4 : 'Thursday',
			5 : 'Friday',
			6 : 'Saturday',
		},

		displayDayOfWeek: function() {
			return this.days[this.get('day_of_week')];
		}
	});

	return VendorHours;
});
