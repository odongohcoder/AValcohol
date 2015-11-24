define([
	'marionette',
	'App',
	'tpl!templates/product-categories.html'
], function (
	Mn,
	App,
	tpl
) {
	var ProductCategoriesView = Mn.ItemView.extend({
		template: tpl,

		events: {
			'click @ui.link' : 'linkClicked'
		},

		ui: {
			link: 'a'
		},

		initialize: function (options) {
			this.router = App.router;
			this.endpoint = options.endpoint;
		},

		linkClicked: function(e) {
			e.preventDefault();
			var link =  e.target.innerHTML.toLowerCase();
			var endpoint = 'home/' + link;
			this.router.navigate(endpoint, {trigger: true});
		},

		/**
		 * THIS CAN BE MORE EFFICIENT
		 * to toggle the active class, cycling through all of them and then adding class active
		 */
		onShow: function() {
			var view = this;

			this.$el.find('a').each(function(i, element) {
				$link = $(element);
				var text = $link.text().toLowerCase();
				if (text === view.endpoint) {
					$link.parent().addClass('active'); // add active link to parent li
				} else {
					$link.removeClass('active');
				}
			});
		}
	});

	return ProductCategoriesView;
});
