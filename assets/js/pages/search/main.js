/**
 * Search main page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.search.main = {

	/**
	 * Open search page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

		var query = null;

		if(args.urlArgs){
			if(args.urlArgs.q)
				query = args.urlArgs.q;
		}

		//Create page container
		var pageContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "searchPage"
		});

		//Add search form
		var searchForm = createElem2({
			appendTo: pageContainer,
			type: "form"
		});

		//Add search input
		var inputGroup = createElem2({
			appendTo: searchForm,
			type: "div",
			class: "input-group input-group-sm"
		});

		var textInput = createElem2({
			appendTo: inputGroup,
			type: "input",
			class: "form-control",
			elemType: "text",
			placeholder: "Search a personn, a group..."
		});

		var inputGroupBtn = createElem2({
			appendTo: inputGroup,
			type: "div",
			class: "input-group-btn"
		});

		var submitButton = createElem2({
			appendTo: inputGroupBtn,
			type: "button",
			class: "btn btn-info btn-flat",
			innerHTML: "Submit"
		});

		var searchResults = createElem2({
			appendTo: pageContainer,
			type: "div",
			class: "resultsTarget"
		});

		searchForm.onsubmit = function(){
			openPage("search?q=" + textInput.value);
			return false;
		}

		//Check for query
		if(query){
			textInput.value = query;
			ComunicWeb.pages.search.main.submit(textInput.value, searchResults);
		}
	},
	
	/**
	 * Submit a new search
	 * 
	 * @param {String} query The query string
	 * @param {HTMLElement} target The target for the results
	 */
	submit: function(query, target){
		
		//Empty the target
		emptyElem(target);

		//Perform a query on the API
		ComunicWeb.components.search.interface.global(query, function(result){

			//Check for errors
			if(result.error){
				return target.appendChild(ComunicWeb.common.messages.createCalloutElem(
					"Error", 
					"An error occurred while trying to perform search...",
					"danger"
				));
			}

			//Get information about related users
			getMultipleUsersInfo(ComunicWeb.components.search.utils.getUsersId(result), function(usersInfo){

				if(usersInfo.error){
					return target.appendChild(ComunicWeb.common.messages.createCalloutElem(
						"Error", 
						"An error occurred while trying to get information about related users...",
						"danger"
					));
				}

				//Get information about related groups
				getInfoMultipleGroups(ComunicWeb.components.search.utils.getGroupsId(result), function(groupsInfo){

					if(groupsInfo.error){
						return target.appendChild(ComunicWeb.common.messages.createCalloutElem(
							"Error", 
							"An error occurred while trying to get information about related groups...",
							"danger"
						));
					}


					//Display results
					ComunicWeb.pages.search.main._display_search_results(target, result, usersInfo, groupsInfo);

				});

			});
		});

	},

	/**
	 * Display search results
	 * 
	 * @param {HTMLElement} target The target for the page
	 * @param {Array} results The list of results
	 * @param {Object} usersInfo Information about the related users
	 * @param {Object} groupsInfo Information about the related groups
	 */
	_display_search_results: function(target, results, usersInfo, groupsInfo){
		
		//Create results container
		var resultsContainer = createElem2({
			appendTo: target,
			type: "ul",
			class: "nav nav-pills nav-stacked results-container"
		});

		results.forEach(function(result){
			ComunicWeb.components.search.ui.display(result, usersInfo, groupsInfo, null, resultsContainer);
		});

	}
}