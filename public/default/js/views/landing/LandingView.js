define([
	'marionette',
	'App',
	'views/landing/CannotDeliverView',
	'shared/js/models/UserAddress',
	'behaviors/ModelValidation',
	'behaviors/LoadingIndicator',
	'tpl!templates/landing/landing.html',
	'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyBcB7pNSUkuNH6awEIE57njndRXQpQBsEI&libraries=places'
], function (
	Mn,
	app,
	CannotDeliverView,
	UserAddress,
	ModelValidation,
	CollectionLoading,
	tpl
) {
	var LandingView = Mn.ItemView.extend({
		template: tpl,
		modelsToValidate: [],
		className: 'class row expanded collapse',

		events: {
			'click @ui.orderNow' 		: 'showAddressForm',
			'click @ui.submitAddress' 	: 'addressSubmitted',
			'keydown @ui.streetAddress' : 'addressSubmitted'
		},

		ui: {
			'logo'			: '.logo',
			'tagline'		: '.info',
			'addressArea'	: '.address-form',
			'orderNow' 		: '.order-now',
			'streetAddress' : '.street-address',
			'submitAddress' : '.submit-address',
			'alertArea' 	: '.alert-area'
		},

		behaviors: {
			ModelValidation: {
				behaviorClass: ModelValidation
			},
			CollectionLoading: {
				behaviorClass: CollectionLoading
			}
		},

		initialize: function () {
			this.router = app.router;
			this.user = app.user;
			this.address = this.user.get('address');
			this.triggerMethod('setListener', this.address);
			this.modelsToValidate.push(this.user, this.address); // dont think we need to listen to user, but why not..
		},

		onShow: function () {
			var input = this.ui.streetAddress[0];
			var options = {
				types: ['address'], // only precise locations, no businesses or landmarks
			};
			this.autocomplete = new google.maps.places.Autocomplete(input, options);

			this.ui.tagline.animateCss('fadeIn', {removeAnimateClass: true});
			this.ui.logo.animateCss('pulse');
		},

		/**
		 * enter or click button will continue
		 * @param e
		 */
		addressSubmitted: function(e) {
			if (e.keyCode && e.keyCode !== 13) {
				return;
			}
			e.preventDefault();
			this.updateUserAddress();
		},

		/**
		 * Parses the autocomplete info and stores it in a UserAddressModel
		 */
		updateUserAddress: function() {
			var place = this.autocomplete.getPlace();
			
			if (!place) {
				return;
			}

			var state, zip;

			// bruteforce to find which element of the array is tha state / zip
			// this could be more efficient
			_.each(place.address_components, function(component) {
				_.each(component.types, function(type) {
					if (type === 'administrative_area_level_1') {
						state = component.short_name;
					}
					else if(type === 'postal_code') {
						zip = component.short_name;
					}
				});
			});

			this.address.set({
				'street' : place.name,
				'city' : place.vicinity,
				'state' : state,
				'zipcode' : zip,
				'location' : {
					'longitude' : place.geometry.location.lng(),
					'latitude' : place.geometry.location.lat()
				}
			});

			if (this.address.isValid()) {
				this.address.getDeliveryZone().done(function(resp) {
					if (resp.success) {
						this.showUserHome();
					} else {
						this.showCannotDeliverView();
					}
				}.bind(this));
			}
		},

		/**
		 * redirects page to show the user home (products)
		 */
		showUserHome: function() {
			this.router.navigate('#home', {trigger: true});
		},

		showCannotDeliverView: function() {
			app.rootView.getRegion('modalRegion').show(new CannotDeliverView());
		},

		showAddressForm: function(evt) {
			evt.preventDefault();

			this.ui.tagline.animateCss('fadeOutDown', {callback: function() {
				this.ui.tagline.remove();
				this.ui.addressArea.animateCss('fadeInDown');
			}.bind(this)});
		}
	});

	return LandingView;
});