/**
 * Privacy settings section
 * 
 * @author Pierre HUBERT
 */

const SettingsPrivacySection = {

	/**
	 * Open settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: async function(args, target){

		try {

			// Information box
			this.showInfoBox(target);

			// Data conservation policy
			await this.showDataConservationPolicy(target);

			//Export data box
			this.showExportDataBox(target);

			//Delete account box
			this.showDeleteAccountBox(target);
		}

		catch(e) {
			console.error(e);
			target.appendChild(ComunicWeb.common.messages.createCalloutElem("Failed to load page", "The page failed to load !", "danger"));
		}

	},

	/**
	 * Show privacy policy information box
	 * 
	 * @param {HTMLElement} target The target for the box
	 */
	showInfoBox: function(target){

		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-export-account-data-settings"
		});

		//Add box header
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		var boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: tr("About our policy")
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Box content
		createElem2({
			appendTo: boxBody,
			type: "p",
			innerHTML: "We give an high importance to our users privacy. Please take some time to check our <a href='"+ComunicWeb.__config.aboutWebsiteURL+"about/privacy' target='_blank'>Privacy Policy</a> and our <a href='"+ComunicWeb.__config.aboutWebsiteURL+"about/terms' target='_blank'>Terms of use</a>."
		})
	},


	/**
	 * Show data conservation policy
	 * 
	 * @param {HTMLElement} target 
	 */
	showDataConservationPolicy: async function(target) {
		// Load template
		const tpl = await Page.loadHTMLTemplate("pages/settings/privacy/ConservationPolicy.html");
		const el = document.createElement("div")
		el.innerHTML = tpl;
		target.appendChild(el)

		// Load user settings
		const settings = await SettingsInterface.getDataConservationPolicy();
		
		// Load server policy
		await ServerConfig.ensureLoaded();
		const serverPolicy = ServerConfig.conf;

		// Use Vue
		const oneDay = 60 * 60 * 24;
		const lifetimeOptions = [
			{label: tr("Never"), value: 0},
			{label: tr("7 days"), value: oneDay * 7},
			{label: tr("15 days"), value: oneDay * 15},
			{label: tr("1 month"), value: oneDay * 30},
			{label: tr("3 months"), value: oneDay * 30 * 3},
			{label: tr("6 months"), value: oneDay * 30 * 6},
			{label: tr("1 year"), value: oneDay * 365},
			{label: tr("5 years"), value: oneDay * 365 * 5},
			{label: tr("10 years"), value: oneDay * 365 * 10},
			{label: tr("50 years"), value: oneDay * 365 * 50}
		];

		let findOptionIndex = (value) => {
			if (!value) return lifetimeOptions[0].value;
			return [...lifetimeOptions].reverse().find(v => v.value <= value).value
		}

		const DataConservationPolicyVueApp = {
			data() {
				return {
					options: lifetimeOptions,
					settings: [
						{
							title: tr("Automatically delete unread notification after"),
							key: "notification_lifetime", 
							value: findOptionIndex(settings.notification_lifetime),
						},

						{
							title: tr("Automatically delete your comments after"),
							key: "comments_lifetime",
							value: findOptionIndex(settings.comments_lifetime)
						},

						{
							title: tr("Automatically delete your posts after"),
							key: "posts_lifetime",
							value: findOptionIndex(settings.posts_lifetime)
						},

						{
							title: tr("Automatically delete your conversation messages after"),
							key: "conversation_messages_lifetime",
							value: findOptionIndex(settings.conversation_messages_lifetime)
						},

						{
							title: tr("Automatically delete your likes after"),
							key: "likes_lifetime",
							value: findOptionIndex(settings.likes_lifetime)
						},

						{
							title: tr("Automatically delete your account if you have been inactive for"),
							key: "inactive_account_lifetime",
							value: findOptionIndex(settings.inactive_account_lifetime)
						}
					]
				}
			}
		}
		Vue.createApp(DataConservationPolicyVueApp).mount(el);
	},

	/**
	 * Show export personnal data box
	 * 
	 * @param {HTMLElement} target The target for the box
	 */
	showExportDataBox: function(target){

		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-export-account-data-settings"
		});

		//Add box header
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		var boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: tr("Export account data")
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Add a notice
		createElem2({
			appendTo: boxBody,
			type: "p",
			innerHTML: tr("You can export all the data of your account from here.")
		});

		//Add delete account button
		var exportAccountDataBtn = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "btn btn-primary",
			innerHTML: tr("Export account data")
		});

		exportAccountDataBtn.addEventListener("click", (e) => {

			//Request account deletion
			ComunicWeb.components.settings.helper.requestAccountDataExport();

		});

	},
		
	/**
	 * Display delete account box
	 * 
	 * @param {HTMLElement} target The target for the box
	 */
	showDeleteAccountBox: function(target){

		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-danger box-delete-account-settings"
		});

		//Add box header
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		var boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Delete account"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Add a notice
		createElem2({
			appendTo: boxBody,
			type: "p",
			innerHTML: tr("You can decide here to delete your account. <br /><b>Warning! Warning! Warning! This operation CAN NOT BE REVERTED !!!! All your data (post, conversation messages, comments...) will be permanently deleted ! You will not be able to recover from this operation !</b>")
		});

		//Add delete account button
		var deleteAccountBtn = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "btn btn-danger",
			innerHTML: tr("Delete your account")
		});

		deleteAccountBtn.addEventListener("click", function(e){

			//Request account deletion
			ComunicWeb.components.settings.helper.requestAccountDeletion();

		});
	},

}

ComunicWeb.pages.settings.sections.privacy = SettingsPrivacySection;