/**
 * Not authenticated menu bar components
 * 
 * @author Pierre HUBERT
 */

const NotAuthenticatedMenuBar = {
	/**
	 * Add not-authenticated user specific elements
	 * 
	 * @param {HTMLElement} menuHeader The container element of the Menubar
	 */
	addElements: function(menuHeader){

		//Create main menu
		var menuElem = createElem("div", menuHeader);
		menuElem.className = "navbar navbar-static-top";

		//Create nav element
		var navElem = createElem("nav", menuElem);
		navElem.className = "navbar navbar-static-top";

		//Create conatiner
		var container = createElem("div", navElem);
		container.className = "container";

		//Create navbar header
		var navbarHeader = createElem("div", container);
		navbarHeader.className = "navbar-header";

		//Create site name link
		var siteNameElem = createElem("a", navbarHeader);
		siteNameElem.className = "navbar-brand";
		siteNameElem.innerText = "Comunic";
		siteNameElem.onclick = (function(){
			ComunicWeb.common.page.openPage("home");
		});

		//Create navbar collapsed button
		var navbarCollapsedButton = createElem("button", navbarHeader);
		navbarCollapsedButton.type = "button";
		navbarCollapsedButton.className = "navbar-toggle collapsed";
		navbarCollapsedButton.setAttribute("data-toggle", "collapse");
		navbarCollapsedButton.setAttribute("data-target", "#navbar-collapse");

		//Create navbar icon
		var navbarCollapsIcon = createElem("i", navbarCollapsedButton);
		navbarCollapsIcon.className = "fa fa-bars";


		//Create an auto-collapsed element
		var navbarCollapse = createElem("div", container);
		navbarCollapse.id = "navbar-collapse";
		navbarCollapse.className = "navbar-collapse pull-right collapse";

		//Create login form
		var loginForm = createElem("form", navbarCollapse);
		loginForm.className = "navbar-form navbar-left menubar-loginForm";
		loginForm.setAttribute("role", "login");

		//Add email address formGroup
		var emailFormGroup = createElem("div", loginForm);
		emailFormGroup.className = "form-group";

		//Add email input
		var emailInput = createElem("input", emailFormGroup);
		emailInput.className = "form-control";
		emailInput.placeholder = lang("_menu_bar_login_email");
		emailInput.type = "email";
		emailInput.value = ComunicWeb.components.mailCaching.get();

		//Add password formGroup
		var passwordFormGroup = createElem("div", loginForm);
		passwordFormGroup.className = "form-group";

		//Add password input
		var passwordInput = createElem("input", passwordFormGroup);
		passwordInput.className = "form-control";
		passwordInput.placeholder = lang("_menu_bar_login_passwd");
		passwordInput.type = "password";

		//Add submit button formGroup
		var submitFromGroup = createElem("div", loginForm);
		submitFromGroup.className = "form-group";

		//Add submit input
		var submitInput = createElem("input", submitFromGroup);
		submitInput.className = "form-control";
		submitInput.value = lang("_menu_bar_login_btn");
		submitInput.type = "submit";

		//Add submit form behaviour
		loginForm.onsubmit = function(){
			//Enable screen overlay (use .remove() to remove)
			var screenOverlay = ComunicWeb.common.page.showTransparentWaitSplashScreen();

			//Try to login user; in case of failure redirect to login page
			//What to do once user is logged in (or not)
			var afterTryLogin = function(loginResult){

				//First, remove overlay
				screenOverlay.remove();

				//Check if login failed
				if(!loginResult){
					
					//Redirect to login page
					ComunicWeb.common.page.openPage("login", {
						loginFailedMessage: true,
						emailInput: emailInput.value,
					});

					//Return false
					return false;
			}
				
				//Open home page
				ComunicWeb.common.page.openPage("home");
			};

			//Try to login user
			ComunicWeb.user.userLogin.loginUser(emailInput.value, passwordInput.value, true, afterTryLogin);

			//Block form
			return false;
		}

		MenubarBanner.addBanner(menuHeader)
	}
}