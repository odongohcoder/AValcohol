/**
 * Created by Feek on 8/3/16.
 */
define([
	'marionette',
	'backgrid',
	'moment',
	'shared/js/models/Vendor',
	'shared/js/models/VendorHours',
	'behaviors/LoadingIndicator',
	'tpl!templates/vendor-hours.html'
], function (
	Mn,
	Backgrid,
	moment,
	Vendor,
	VendorHours,
	LoadingIndicator,
	tpl
) {
	var VendorHoursView = Mn.ItemView.extend({
		template: tpl,

		templateHelpers: function () {
			return {
				vendor: this.model
			}
		},

		behaviors: {
			LoadingIndicator: {
				behaviorClass: LoadingIndicator
			}
		},


		events: {
			'click @ui.save' : 'createNewVendorHoursEntry'
		},

		ui: {
			'dayOfWeek' : '.day-of-week',
			'openTime' 	: '.open-time',
			'closeTime' : '.close-time',
			'save' 		: '.save',
			'grid' 		: '.grid'
		},

		initialize: function(options) {
			this.model = Vendor.findOrCreate({id : options.id});
			this.triggerMethod('setListener', this.model);
			this.initializeBackgridComponents();
			this.model.fetch().done(this.render);
		},

		onRender: function() {
			this.ui.grid.html(this.grid.render().el);
		},

		initializeBackgridComponents: function() {
			var collection = this.model.get('hours');
			collection.comparator = 'day_of_week';
			this.initializeGrid(collection);
		},

		createNewVendorHoursEntry: function(evt) {
			evt.preventDefault();

			var vendorHoursModel = VendorHours.findOrCreate({
				day_of_week : this.ui.dayOfWeek.val(),
				open_time : this.ui.openTime.val(),
				close_time : this.ui.closeTime.val(),
				vendor : this.model
			});

			if (vendorHoursModel.isValid()) {
				vendorHoursModel.save();
				this.model.get('hours').add(vendorHoursModel);
			} else {
				alert('invalid data entered.');
			}
		},

		initializeGrid: function(collection) {
			this.grid = new Backgrid.Grid({
				columns: [
					{
						name: 'day_of_week',
						label: 'Day',
						editable: false,
						sortable: false,
						cell: Backgrid.StringCell.extend({
							render: function() {
								this.$el.html(this.model.displayDayOfWeek());
								return this;
							}
						})
					},
					{
						name: 'open_time',
						label: 'Open',
						editable: false,
						sortable: false,
						cell: Backgrid.StringCell.extend({
							render: function() {
								this.$el.html(moment(this.model.get('open_time'), 'HH:mm').format('h:mm a'));
								return this;
							}
						})
					},
					{
						name: 'close_time',
						label: 'Close',
						editable: false,
						sortable: false,
						cell: Backgrid.StringCell.extend({
							render: function() {
								this.$el.html(moment(this.model.get('close_time'), 'HH:mm').format('h:mm a'));
								return this;
							}
						})
					},
					{
						label: 'Actions',
						editable: false,
						sortable: false,
						cell: Backgrid.StringCell.extend({
							render: function() {
								this.$el.html('remove');
								return this;
							}
						})
					},
				],
				collection: collection
			});
		}
	});

	return VendorHoursView;
});
