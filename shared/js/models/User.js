define([
	'backbone',
	'backboneRelational',
	'../../../shared/js/models/UserAddress',
	'../../../shared/js/models/Card',
	'../../../vendor/moment/moment'
], function (
	Backbone,
	BackboneRelational,
	UserAddress,
	Card,
	moment
) {
	var User = Backbone.RelationalModel.extend({
		urlRoot: '/api/user',

		relations: [
			{
				type: Backbone.HasOne,
				key: 'address',
				relatedModel: UserAddress,
				includeInJSON: false,
				reverseRelation: {
					key: 'user',
					includeInJSON: true,
					type: Backbone.HasOne
				}
			},
			{
				type: Backbone.HasOne,
				key: 'card',
				relatedModel: Card,
				includeInJSON: false
			}
		],

		parse: function(response, xhr) {
			return response.user;
		},

		defaults: {
			email: null,
			first_name: null,
			last_name: null,
			phone_number: null,
			date_of_birth: null,
			mvp_user: 1 // this account does NOT need a password etc
		},

		initialize: function() {
			this.on('change:phone_number', this.stripPhoneNumber);

			// attach relation
			this.set('address', UserAddress.findOrCreate({}));
		},

		/**
		 * Strip everything but digits
		 */
		stripPhoneNumber: function() {
			var num = this.get('phone_number')

			if (!num) {
				return
			}

			num = num.replace(/\D/g,'');
			this.set('phone_number', num);
		},

		validate: function(attrs, options) {
			var errors = [];
			var defaultMessage = "This field is required";

			if (!attrs.first_name) {
				errors.push({
					attribute: 'first_name',
					message: defaultMessage
				});
			}

			if (!attrs.last_name) {
				errors.push({
					attribute: 'last_name',
					message: defaultMessage
				});
			}

			// some regex i pulled off stack overflow.. should strip anything not a digit
			if (!attrs.phone_number || !attrs.phone_number.match(/\d/g) || attrs.phone_number.match(/\d/g).length !== 10) {
				errors.push({
					attribute: 'phone_number',
					message: 'please enter a ten digit phone number'
				})
			}

			if (!attrs.email) {
				errors.push({
					attribute: 'email',
					message: 'please enter a valid email address'
				})
			}

			if (!attrs.date_of_birth) {
				errors.push({
					attribute: 'date_of_birth',
					message: 'please enter your date of birth'
				})
			} else if (!this.isTwentyOne(attrs.date_of_birth)) {
				errors.push({
					attribute: 'date_of_birth',
					message: 'you must be 21 to purchase alcohol in the US'
				})
			}

			return errors.length > 0 ? errors : null;
		},

		isTwentyOne: function(dateString) {
			var dob = moment(dateString);
			var now = moment();
			var twentyOneToday = now.subtract(21, 'years');
			return dob.isSameOrBefore(twentyOneToday);
		}
	});

	return User;
});