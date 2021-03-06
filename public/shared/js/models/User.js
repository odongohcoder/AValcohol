define([
	'backbone',
	'backboneRelational',
	'shared/js/models/UserAddress',
	'shared/js/models/UserProfile',
	'shared/js/models/Card',
	'shared/js/models/Role',
	'shared/js/util/ClientSideDeleteMixin',
	'moment'
], function (
	Backbone,
	BackboneRelational,
	UserAddress,
	UserProfile,
	Card,
	Role,
	ClientSideDeleteMixin,
	moment
) {
	var User = Backbone.RelationalModel.extend(_.extend(ClientSideDeleteMixin, {
		urlRoot: '/api/user',

		relations: [
			{
				type: Backbone.HasOne,
				key: 'profile',
				relatedModel: UserProfile,
				includeInJSON: false
			},
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
			},
			{
				type: Backbone.HasMany,
				key: 'roles',
				relatedModel: Role,
				includeInJSON: false
			}
		],

		parse: function(response, xhr) {
			return response.user;
		},

		defaults: {
			email: null,
			mvp_user: 1 // this account does NOT need a password etc
		},

		initialize: function(attributes, options) {
			this.on('change:phone_number', this.stripPhoneNumber);

			// attach relation
			this.set('address', UserAddress.findOrCreate({}, options));
		},

		/**
		 * Strip everything but digits
		 */
		stripPhoneNumber: function() {
			var num = this.get('phone_number');

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
		},

		isAdmin: function() {
			var roles = this.get('roles');
			if (roles && roles.find({	name : 'administrator'	})) {
				return true;
			}
			return false;
		}
	}));

	return User;
});
