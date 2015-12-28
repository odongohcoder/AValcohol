define([
	'marionette',
	'tpl!templates/billing-info-entry.html'
], function (
	Mn,
	tpl
) {
	var view = Mn.ItemView.extend({
		template: tpl,
		tagName: 'form',
		className: 'payment-form',

		initialize: function (options) {
		}
	});

	return view;
});
