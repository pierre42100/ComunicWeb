/**
 * Send a mail to the administration option
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.passwordForgotten.mailAdmin = {

	/**
	 * Send a mail to admin
	 * 
	 * @param {String} email The email address of the user
	 * @param {HTMLElement} target The target for the form
	 */
	open: function(email, target){

		//Create container
		var container = createElem2({
			appendTo: target,
			type: "div",
			class: "reset-password-by-mail-step"
		});

		//Add title
		createElem2({
			appendTo: container,
			type: "h1",
			class: "title",
			innerHTML: "Email us"
		});

		//Message
		add_p(container, "You decided to reset your password by contacting us. " +
				"Please find a way to prove us your identity in your mail, and if possible, send " +
				"your email from your account email address.");

		//Add admin email address
		createElem2({
			appendTo: container,
			type: "a",
			class: "btn btn-default btn-mail",
			innerHTML: "contact@communiquons.org",
			href: "mailto:contact@communiquons.org"
		});
	},

}