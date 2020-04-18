/**
 * Movies picker
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.movies.picker = {

	/**
	 * Display the movie picker
	 * 
	 * Allows the user to choose a movie from his collection
	 * 
	 * @param {function} callback What to do once a movie has been selected 
	 */
	pick: function(callback){

		//Create the modal
		var modal = createElem2({
			type: "div",
			class: "modal pick-movie-modal",
		});
		modal.setAttribute("role", "dialog");
		

		var modalDialog = createElem2({
			appendTo: modal,
			type: "div",
			class: "modal-dialog"
		});

		var modalContent = createElem2({
			appendTo: modalDialog,
			type: "div",
			class: "modal-content",
		});

		//Modal header
		var modalHeader = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-header"
		});

		var closeModal = createElem2({
			appendTo: modalHeader,
			type: "button",
			class: "close",
		});
		closeModal.onclick = function(){
			$(modal).modal('hide');
		}

		createElem2({
			appendTo: closeModal,
			type: "span",
			innerHTML: "x"
		});

		var modalTitle = createElem2({
			appendTo: modalHeader,
			type: "h4",
			class: "modal-title",
			innerHTML: "Pick a movie"
		});

		//Modal body
		var modalBody = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-body",
			innerHTML: "<p>Loading, please wait...</p>"
		});

		//Modal footer
		var modalFooter = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-footer"
		});

		var closeButton = createElem2({
			appendTo: modalFooter,
			type: "button",
			class: "btn btn-danger",
			innerHTML: "Cancel"
		});
		closeButton.onclick = function(){
			$(modal).modal('hide');
		}

		//Show the modal
		$(modal).modal('show');

		//Get the list of movies of the user
		ComunicWeb.components.movies.interface.getList(function(result){
			
			//In case of error
			if(result.error){
				ComunicWeb.common.notificationSystem.showNotification("Couldn't get the list of movies of the user !", "danger");
				return;
			}

			//Process the list of movies
			ComunicWeb.components.movies.picker._display_list(result, modal, modalBody, callback);

		});
	},

	/**
	 * Display the list of movies
	 * 
	 * @param {object} list The list of movies
	 * @param {HTMLElement} modalRoot The modal root node
	 * @param {HTMLElement} modalBody The modal body
	 * @param {function} callback What to do once a movie has been picked
	 */
	_display_list: function(list, modalRoot, modalBody, callback){

		//Empty modal body
		emptyElem(modalBody);

		//Create a table to display the list of movies
		var moviesTable = createElem2({
			appendTo: modalBody,
			type: "table",
			class: "table table-hover"
		});

		//Create table header
		var tableHead = createElem2({
			appendTo: moviesTable,
			type: "thead"
		});

		var tableTR = createElem2({
			appendTo: tableHead,
			type: "tr",
			innerHTML: "<th></th><th>Name</th><th></th>"
		});

		var tableBody = createElem2({
			appendTo: moviesTable,
			type: "tbody",
		});


		//Process the list of movies
		var i;
		for(i in list) {

			const movie = list[i];

			//Create a line
			const line = createElem2({
				appendTo: tableBody,
				type: "tr",
			});

			//Video cell
			var videoCell = createElem2({
				appendTo: line,
				type: "td"
			});

			var videoElem = createElem2({
				appendTo: videoCell,
				type: "video",
			});
			videoElem.setAttribute("controls", "");

			var videoSrc = createElem2({
				appendTo: videoElem,
				type: "source",
				src: list[i].url
			});
			videoSrc.setAttribute("type", list[i].file_type);

			//Name cell
			var nameCell = createElem2({
				appendTo: line,
				type: "td",
				innerHTML: list[i].name
			});

			//Actions cell
			var actionCell = createElem2({
				appendTo: line,
				type: "td",
			});

			const chooseButton = createElem2({
				appendTo: actionCell,
				type: "button",
				class: "btn btn-primary",
				innerHTML: "Choose"
			});
			chooseButton.setAttribute("data-movie-num", i);

			chooseButton.onclick = function(){

				//Hide the modal
				$(modalRoot).modal('hide');

				//Call callback
				callback(list[this.getAttribute("data-movie-num")]);
			}


			// Add delete button
			createElem2({
				appendTo: actionCell,
				type: "button",
				class: "btn btn-danger",
				innerHTML: "Delete",
				onclick: () => {

					ComunicWeb.common.messages.confirm("Do you really want to delete this movie ?", async res => {

						if(!res)
							return;

						try {
							await ComunicWeb.components.movies.interface.delete(movie.id)
							line.remove();
						} catch(e) {
							console.error(e);
							notify("Could not delete movie!", "danger");
						}

					})

				}
			})
		}
	},
}