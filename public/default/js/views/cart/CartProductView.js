define([
	'marionette',
	'App',
	'tpl!templates/cart/cart-product.html'
], function (
	Mn,
	App,
	tpl
) {
	var CartProductView = Mn.ItemView.extend({
		template: tpl,
		tagName: 'div',
		className: '',

		templateHelpers: function() {
			var view = this;

			return {
				img_url: '/img/products/' + view.model.get('image_url'),
				price: view.model.get('pivot').sale_price
			}
		},

		events: {
			'click @ui.remove' : 'removeFromCart',
			'click @ui.decreaseQuantity' : 'decreaseQuantity',
			'click @ui.increaseQuantity' : 'increaseQuantity'
		},

		modelEvents: {
			'change:quantity' : 'quantityChanged'
		},

		ui: {
			'remove' : '.remove',
			'decreaseQuantity' : '.subtract',
			'increaseQuantity' : '.add'
		},

		initialize: function (options) {
		},

		quantityChanged: function(model, quantity) {
			this.render();
		},

		/**
		 * If there is more than one quantity, it will subtract one quantity instead of fully removing
		 * from cart
		 * @param e
		 */
		/*
		removeFromCart: function(e) {
			e.preventDefault();
			var view = this;

			var quantity = this.model.get('quantity');
			if (quantity > 1) {
				this.model.set('quantity', quantity - 1);
			} else {
				this.$el.fadeOut('fast', function() {
					App.cart.remove(view.model);
				});
			}
		}
		*/

		removeFromCart: function(e) {
			// may have been called internally
			if (e) {
				e.preventDefault();
			}

			var view = this;
			this.model.set('inCart', false);

			this.$el.fadeOut('fast', function() {
				App.cart.remove(view.model, { removeAll: true }); // remove all quantities
			});
		},

		decreaseQuantity: function() {
			App.cart.remove(this.model, {}); // let cart handle this logic
		},

		increaseQuantity: function() {
			App.cart.add(this.model, {}); // let cart handle this logic
		}
	});

	return CartProductView;
});
