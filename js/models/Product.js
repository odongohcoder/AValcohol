define([
	'backbone',
], function (
	Backbone
) {
	var Product = Backbone.Model.extend({
		urlRoot: '/api/',

		defaults: {
			quantity: 1, // for use in cart,
			inCart: false // if this product is in the cart or not
		}
	});

	return Product;
});
