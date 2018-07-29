/**
 * Search form component
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.search.form = {

	/**
	 * Store the text input area
	 */
	_textInput: null,

	/**
	 * Initializate a search form element
	 * 
	 * @param {HTMLElement} textInput The text input node
	 * @param {HTMLElement} searchResultBox The target of the results
	 * @return {Boolean} True for a success
	 */
	init: function(textInput, searchResultBox){
		//Log action
		ComunicWeb.debug.logMessage("Initializate search menu");

		//Create header
		var searchHeader = createElem("li", searchResultBox);
		searchHeader.className = "header";
		searchHeader.innerHTML = "Search results";

		//Box core
		var searchBoxCore = createElem("li", searchResultBox);
		var searchBoxContainer = createElem("div", searchBoxCore);
		searchBoxContainer.className = "searchBoxResultsContainer";
		
		//Create footer
		var searchFooter = createElem("li", searchResultBox);
		searchFooter.className = "footer";

		//Footer link
		var footerLink = createElem("a", searchFooter);
		footerLink.innerHTML = "See more results";
		footerLink.onclick = function(){
			openPage("search?q=" + this.getAttribute("data-searchValue"));
		}

		//Make input text lives
		textInput.onkeyup = function(){
			ComunicWeb.components.search.form.ontextchange(textInput, searchResultBox, searchBoxContainer, footerLink);
		}

		//Cache textinput area
		this._textInput = textInput;

		return true;
	},

	/**
	 * What to do on text change
	 * 
	 * @param {HTMLElement} textInput The text input node
	 * @param {HTMLElement} searchResultBox The main search box
	 * @param {HTMLElement} searchBoxContainer The target of the results
	 * @param {HTMLElement} footerLink The footer element
	 * @return {Boolean} True for a success
	 */
	ontextchange: function(textInput, searchResultBox, searchBoxContainer, footerLink){
		//We check if the text was removed
		if(textInput.value == ""){
			//Text was removed
			//Hide box
			searchResultBox.style.display = "none";
			return true;
		}

		//We show the box
		searchResultBox.style.display = "block";

		//Change "see more result" value
		footerLink.setAttribute("data-searchValue", textInput.value);

		//Perform a request on the server
		ComunicWeb.components.search.interface.global(textInput.value, function(results){
			
			//Continue only in case of success
			if(results.error)
				return false;
			
			//Get information about related groups and users
			getMultipleUsersInfos(ComunicWeb.components.search.utils.getUsersId(results), function(usersInfo){

				//Check for errors
				if(usersInfo.error)
					return;
				
				getInfoMultipleGroups(ComunicWeb.components.search.utils.getGroupsId(results), function(groupsInfo){

					//Remove any remainging element in searchResultBox
					emptyElem(searchBoxContainer);

					//Create menu list
					var menuList = createElem("ul", searchBoxContainer);
					menuList.className = "menu";

					if(groupsInfo.error)
						return;

					//Process the list of results
					results.forEach(function(result){
						ComunicWeb.components.search.ui.display(result, usersInfo, groupsInfo, function(){
							ComunicWeb.components.search.form.close();
						}, menuList);
					});

					//Enable slimscroll
					$(menuList).slimScroll({
						height: '100%'
					});
				});

			});
			
		});
		
	},

	/**
	 * Close and clear the search form
	 */
	close: function(){
		this._textInput.value = "";
		this._textInput.onkeyup();
	}
}