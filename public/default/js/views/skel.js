define([
	'marionette',
	'tpl!templates/'
], function(
	Mn,
	tpl
) {
	var view = Mn.ItemView.extend({
		template: tpl,

		behaviors: {
			Modal: {
				behaviorClass: Modal
			},
		},

		events: {
		},

		ui: {
		},

		initialize: function(options) {
		}
	});

	return view;
});