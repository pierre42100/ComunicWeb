/**
 * Posts UI
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.posts.ui = {

	/**
	 * Show a single post
	 * 
	 * @param {Object} infos Informations about the post
	 * @param {HTMLElement} target The target for the post
	 */
	display_post: async function(info, target) {
		
		// Safari strange bug
		if(target === undefined)
			target = arguments[1]

		//Check if it is required to create a post root element or not
		if(target.className.includes("post"))
			postRoot = target;

		else
			//Create post root element
			var postRoot = createElem2({
				appendTo: target,
				type: "div",
				class: "post"
			});

		//Display user block
		var userBlock = createElem2({
			appendTo: postRoot,
			type: "div",
			class: "user-block"
		});

		//Display user account image
		var userAccountImage = createElem2({
			appendTo: userBlock,
			type: "img",
			class: "img-circle img-bordered-sm",
			src: ComunicWeb.__config.assetsURL + "img/defaultAvatar.png"
		});

		//Add user name
		var userNameBlock = createElem2({
			appendTo: userBlock,
			type: "span",
			class: "username",
		});

		var userName = createElem2({
			appendTo: userNameBlock,
			type: "a",
			innerHTML: "Loading"
		});

		//Second user area
		var secondUserArea = createElem2({
			appendTo: userNameBlock,
			type: "span",
			class: "second-user-area"
		});

		//Add post description
		var postDescription = createElem2({
			appendTo: userBlock,
			type: "span",
			class: "description"
		});

		//Show the age of the post
		postDescription.innerHTML = lang("dates_ago", [ComunicWeb.common.date.timeDiffToStr(info.post_time)]);


		/**
		 * Apply post creator information
		 * 
		 * @param {Object} info Information about the user
		 */
		var applyUserInfo = function(info){
			userAccountImage.src = info.accountImage;
			userName.innerHTML = info.firstName + " " + info.lastName;

			userName.onclick = function(){
				openUserPage(info);
			}
		}

		/**
		 * Add a separator between to name (user/group) in name header
		 */
		var addSeparatorForUsers = function(){
			add_space(secondUserArea);
			createElem2({
				appendTo: secondUserArea,
				type: "span",
				class: "fa fa-caret-right"
			});
			add_space(secondUserArea);
		}

		//Determine the source of the post
		//User page
		if(info.user_page_id != 0){

			//Determine which users to get information about
			var usersToFetch = Array();
			usersToFetch.push(info.userID);
			if(info.user_page_id != info.userID)
				usersToFetch.push(info.user_page_id)

			getMultipleUsersInfo(usersToFetch, function(result){
				if(result.error) {
					ComunicWeb.debug.logMessage("Could not get some users info!");
					userName.innerHTML = lang("posts_ui_error");
					return;
				}

				//Apply main user information
				applyUserInfo(result["user-"+info.userID]);

				//Add second user (if required)
				if(info.user_page_id != info.userID){

					//Add separator
					addSeparatorForUsers();

					//Add second user information
					var infoSecondUser = result["user-"+info.user_page_id];
					var secondUser = createElem2({
						appendTo: secondUserArea,
						type: "a",
						innerHTML: userFullName(infoSecondUser)
					});
					secondUser.addEventListener("click", function(e){
						openUserPage(infoSecondUser);
					});
				}

			});
		}


		//Group page
		if(info.group_id != 0){

			//Get information about the user who created the post
			ComunicWeb.user.userInfos.getUserInfos(info.userID, function(result){
				if(result.firstName)
					applyUserInfo(result);
			});

			//Get information about the related group
			addSeparatorForUsers();

			getInfoGroup(info.group_id, function(info){
				ComunicWeb.debug.logMessage("Could not get a group info!");

				//Add group information
				var groupLink = createElem2({
					appendTo: secondUserArea,
					type: "a",
					innerHTML: info.name
				});
				groupLink.addEventListener("click", function(e){
					openGroupPage(info);
				});
			});
		}


		//Create top right area
		var topRightArea = createElem2({
			insertAsFirstChild: userBlock,
			type: "div",
			class: "pull-right top-right-buttons",
		});

		//Load informations about visibility
		var visibilityTarget = createElem2({
			appendTo: topRightArea,
			type: "div",
			class: "visibility"
		});


		//Get informations about the current visibility level
		var visibilityInfos = ComunicWeb.components.posts.visibilityLevels[info.visibility_level];

		//Check user level access
		if(info.user_access != "full"){

			//The user can't change the visibility level of the post
			//Display visibility level as a simple icon
			createElem2({
				appendTo: visibilityTarget,
				type: "i",
				class: "read-only fa "+visibilityInfos.icon
			});

		}
		else {

			//The user can change the visibility level of the post
			//Create button gropu
			var visibilityButtonGroup = createElem2({
				appendTo: visibilityTarget,
				type: "div",
				class: "btn-group"
			});

			//Visibility choose button
			var visibilityChooseButton = createElem2({
				appendTo: visibilityButtonGroup,
				type: "button",
				class: "btn btn-default dropdown-toggle",
				elemType: "button",
			});
			visibilityChooseButton.setAttribute("data-toggle", "dropdown");

			//Set the current value of the button
			visibilityChooseButton.innerHTML = "<i class='fa " + visibilityInfos.icon + "'></i>";

			//Add dropdown menu
			var visibilityDropdown = createElem2({
				appendTo: visibilityButtonGroup,
				type: "ul",
				class: "dropdown-menu"
			});

			//Process all visibility levels
			//For pages only
			if(info.user_page_id != 0){
				var privateChoice = this._add_visibility_menu_item(visibilityDropdown, "private");
				var friendsChoice = this._add_visibility_menu_item(visibilityDropdown, "friends");
			}

			//For groups only
			if(info.group_id != 0){
				var membersChoice = this._add_visibility_menu_item(visibilityDropdown, "members");
			}

			//Public
			var publicChoice = this._add_visibility_menu_item(visibilityDropdown, "public");

			var onVisibilityLevelChoice = function(){

				//Get the new visibility level
				var new_level = this.getAttribute("data-level");

				//Lock button
				visibilityChooseButton.disabled = true;

				//Make a request on the server to update the level
				ComunicWeb.components.posts.interface.set_visibility_level(info.ID, new_level, function(response){

					//Unlock button
					visibilityChooseButton.disabled = false;

					//Check for errors
					if(response.error){
						ComunicWeb.common.notificationSystem.showNotification(lang("posts_ui_err_update_visibility"), "danger");
						return;
					}

					//Change the level on the button
					visibilityChooseButton.innerHTML = "<i class='fa " + ComunicWeb.components.posts.visibilityLevels[new_level].icon + "'></i>";

				});
			}

			//Set the items lives
			if(info.user_page_id != 0){
				privateChoice.onclick = onVisibilityLevelChoice;
				friendsChoice.onclick = onVisibilityLevelChoice;
			}
			
			if(info.group_id != 0)
				membersChoice.onclick = onVisibilityLevelChoice;

			publicChoice.onclick = onVisibilityLevelChoice;
			
		}

		//Add a button to edit the post if the user is allowed
		if(info.user_access == "full"){

			var editButtonDiv = createElem2({
				appendTo: topRightArea,
				type: "div",
				class: "edit-post-div"
			});

			var editButtonLink = createElem2({
				appendTo: editButtonDiv,
				type: "a",
				innerHTML: "<i class='fa fa-pencil'></i>"
			});


			//Make buttons lives
			editButtonLink.onclick = function(){

				//Open post editor
				ComunicWeb.components.posts.edit.open(info, postRoot);

			};
		}

		//Add a button to delete the post if the user is allowed
		if(info.user_access == "full" || info.user_access == "intermediate"){

			var deleteButtonDiv = createElem2({
				appendTo: topRightArea,
				type: "div",
				class: "del-post-div"
			});

			var deleteButtonLink = createElem2({
				appendTo: deleteButtonDiv,
				type: "a",
				innerHTML: "<i class='fa fa-trash'></i>"
			});

			//Make delete button lives
			deleteButtonLink.onclick = function(){
				
				//Create a confirmation dialog
				ComunicWeb.common.messages.confirm(lang("posts_ui_confirm_delete"), function(accept){
					
					//Check if the user cancelled the operation
					if(!accept)
						return;
					
					postRoot.style.visibility = "hidden";

					//Delete the post
					ComunicWeb.components.posts.interface.delete(info.ID, function(response){

						//Check for error
						if(response.error){

							//Display an error
							ComunicWeb.common.notificationSystem.showNotification(lang("posts_ui_err_delete_post"), "danger");
							
							//Make the post visible
							postRoot.style.visibility = "visible";

							return;
						}
						
						//Delete the post
						emptyElem(postRoot);
						postRoot.remove();

					});
				});

			}
		}

		//Add post attachement (if any)
		if(info.kind == "text"){
			//Do nothing
		}

		//In case of image
		else if(info.kind == "image"){

			//Image link
			var imageLink = createElem2({
				appendTo: postRoot,
				type:"a",
				href: info.file_path_url,
			});

			//Image element
			createElem2({
				appendTo: imageLink,
				type: "img",
				src: info.file_path_url,
				class: "post-image"
			});

			//Enable lightbox
			imageLink.onclick = function(){
				$(this).ekkoLightbox({
					alwaysShowClose: true,
				});
				return false;
			}
		}

		//In case of video
		else if(info.kind == "movie"){

			var videoContainer = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "post-video"
			});

			//Create video element
			var video = createElem2({
				appendTo: videoContainer,
				type: "video",
				class: "video-js vjs-default-skin"
			});
			video.setAttribute("controls", "");

			//Add source
			var video_src = createElem2({
				appendTo: video,
				type: "source",
				src: info.video_info.url
			});
			video_src.type = info.video_info.file_type;

			//Enable videoJS
			//videojs(video);

		}

		//In case of YouTube video
		else if(info.kind == "youtube"){

			//Create frame placeholder
			var youtube_placeholder = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "post-youtube post-youtube-placeholder"
			});

			//Title 
			createElem2({
				appendTo: youtube_placeholder,
				type: "div",
				class: "title",
				innerHTML: "<i class='fa fa-youtube-play'></i> YouTube Movie"
			});

			createElem2({
				appendTo: youtube_placeholder,
				type: "a",
				class: "btn btn-default",
				innerHTML: "Open on YouTube",
				href: "https://youtube.com/watch?v=" + info.file_path,
			}).target = "_blank";

			var openHere = createElem2({
				appendTo: youtube_placeholder,
				type: "div",
				class: "cursor-pointer",
				innerHTML: "Open here"
			});

			openHere.addEventListener("click", function(){

				//Create iframe
				var youtube_iframe = createElem2({
					insertBefore: youtube_placeholder,
					type: "iframe",
					class: "post-youtube",
					src: "https://www.youtube-nocookie.com/embed/"+info.file_path+"?rel=0"
				});
				youtube_iframe.setAttribute("frameborder", 0);
				youtube_iframe.setAttribute("gesture", "media");
				youtube_iframe.setAttribute("allow", "encrypted-media");
				youtube_iframe.setAttribute("allowfullscreen", "");

				youtube_placeholder.remove();

			});

		}

		//In case of PDF
		else if(info.kind == "pdf"){

			//Create PDF button
			var buttonContainer = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "post-pdf",
			});

			var button = createElem2({
				appendTo: buttonContainer,
				type: "a",
				class: "btn btn-app",
				href: info.file_path_url,
			});
			button.target = "_blank";

			createElem2({
				appendTo: button,
				type: "i",
				class: "fa fa-file-pdf-o"
			});

			createElem2({
				appendTo: button,
				type: "span",
				innerHTML: "PDF"
			});

		}

		//In case of weblink
		else if(info.kind == "weblink"){

			var linkContainer = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "attachment-block clearfix"
			});

			//Link image
			var link_img = createElem2({
				appendTo: linkContainer,
				type: "img",
				src: (info.link_image != null ? info.link_image : ComunicWeb.__config.assetsURL + "img/world.png"),
				class: "attachment-img",
			});

			//Link heading
			var link_heading = createElem2({
				appendTo: linkContainer,
				type: "h4",
				class: "attachment-heading",
				innerHTML: (info.link_title != null ? info.link_title : "Web page")
			});


			//Add attachement text
			var link_attachment_text = createElem2({
				appendTo: linkContainer,
				type: "div",
				class: "attachment_text",
			});

			var link_a_url = createElem2({
				appendTo: link_attachment_text,
				type: "a",
				href: info.link_url,
				innerHTML: info.link_url
			});
			link_a_url.target = "_blank";

			//Add description (if any)
			if(info.link_description != null){
				var link_description = createElem2({
					appendTo: link_attachment_text,
					type: "p",
					innerHTML: info.link_description
				});
			}


		}

		//In case of countdown timer
		else if (info.kind == "countdown"){

			//Create countdown target
			var target = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "post-countdown"
			});
			

			// Manon's birthday is a sacred day, like the end of the world
			// nobody must know when it will happen !
			//
			// Psst: it is on May 25, 11h10m00s
			//
			// => Easter egg
			//
			const endDate = new Date(info.time_end*1000);
			if(endDate.getMonth() == 4 && endDate.getDate() == 25 && endDate.getHours() == 11 && endDate.getMinutes() == 10) {
				target.appendChild(ComunicWeb.common.messages.createCalloutElem("Hold up!", "You MAY NOT KNOW when this countdown will end!", "danger"));

				createElem2({
					appendTo: target,
					type: "p",
					innerHTML: "<strong>Ends in &infin; days &infin; hours &infin; minutes &infin; seconds</strong>"
				})

				createElem2({
					appendTo: target,
					type: "p",
					innerHTML: "This is not a common behavior of the Countdown timer. If you want this message to disappear, just create a new post with another end date..."
				})

				add_p(target);
				add_p(target);
			}


			else
				//Initialize countdown timer
				ComunicWeb.components.countdown.init(info.time_end, target);
		}

		//In case of survey
		else if(info.kind == "survey"){
			
			//Add survey question
			var surveyQuestion = createElem2({
				appendTo: postRoot,
				type: "h4",
				innerHTML: info.data_survey.question,
				class: "post-survey-question"
			});

			//Answer container
			var surveyResponse = createElem2({
				appendTo: postRoot,
				type: "div",
			});

			//Create row
			var row = createElem2({
				appendTo: postRoot,
				type: "div",
				class: "row post-survey-chart-container"
			});

			//Create canvas column
			var leftColumn = createElem2({
				appendTo: row,
				type: "div",
				class: "col-md-8"
			});

			//Chart container
			var chartContainer = createElem2({
				appendTo: leftColumn,
				type: "div",
				class: "chart-responsive"
			});

			//Create canvas
			var canvas = createElem2({
				appendTo: chartContainer,
				type: "canvas",
			});
			canvas.style.height = "150px";

			//Create data column
			var rightColumn = createElem2({
				appendTo: row,
				type: "div",
				class: "col-md-4"
			});

			//Initialize legend
			var charLegend = createElem2({
				appendTo: rightColumn,
				type: "ul",
				class: "chart-legend clearfix"
			});

			//Define chart options
			var pieOptions = {
				//Boolean - Whether we should show a stroke on each segment
				segmentShowStroke: true,
				//String - The colour of each segment stroke
				segmentStrokeColor: "#fff",
				//Number - The width of each segment stroke
				segmentStrokeWidth: 1,
				//Number - The percentage of the chart that we cut out of the middle
				percentageInnerCutout: 50, // This is 0 for Pie charts
				//Number - Amount of animation steps
				animationSteps: 100,
				//String - Animation easing effect
				animationEasing: "easeOutBounce",
				//Boolean - Whether we animate the rotation of the Doughnut
				animateRotate: true,
				//Boolean - Whether we animate scaling the Doughnut from the centre
				animateScale: false,
				//Boolean - whether to make the chart responsive to window resizing
				responsive: true,
				// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
				maintainAspectRatio: false,
				//String - A legend template
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
				//String - A tooltip template
				tooltipTemplate: "<%=value %> <%=label%>"
			  };

			//Generate survey data
			var colors = [
				{fg: "#f56954", bg: "#f56954"},
				{fg: "#00a65a", bg: "#00a65a"},
				{fg: "#f39c12", bg: "#f39c12"},
				{fg: "#00c0ef", bg: "#00c0ef"},
				{fg: "#3c8dbc", bg: "#3c8dbc"},
				{fg: "#d2d6de", bg: "#d2d6de"}
			];

			var surveyData = [];
			var survey_choices = info.data_survey.choices;
			var color_id = 0;
			var i;
			for (i in survey_choices){
				
				//Get the color
				if(!colors[color_id])
					color_id = 0;
				var curr_color = colors[color_id];

				//Generate choice informations
				var choiceInfos = {
					value: survey_choices[i].responses,
					label: survey_choices[i].name,
					color: curr_color.fg,
					highlight: curr_color.bg,
				}

				//Add the choice to the list
				surveyData.push(choiceInfos);

				//Increment color
				color_id++;

			}

			//Initialie chart
			var pieChart = new Chart(canvas.getContext("2d"));
			pieChart.Doughnut(surveyData, pieOptions);

			//Fill legend
			var i;
			for(i in surveyData){
				
				//Legend list elem
				var lengendLi = createElem2({
					appendTo: charLegend,
					type: "li"
				});

				createElem2({
					appendTo: lengendLi,
					type: "i",
					class: "fa fa-circle-o"
				}).style.color = surveyData[i].color;

				createElem2({
					appendTo: lengendLi,
					type: "span",
					innerHTML: " " + (surveyData[i].value > 0 ? "("+surveyData[i].value+") " : "") + surveyData[i].label
				});

			}

			//Display survey response options if the user is signed in
			if(signed_in()){

				//Check if the user gave a response to the survey
				if(info.data_survey.user_choice != 0){
					
					//Create a text to display user choice
					var choosedResponseElem = createElem2({
						appendTo: surveyResponse,
						class: "survey-given-response",
						type: "p",
						innerHTML: lang("posts_ui_survey_your_response", [info.data_survey.choices[info.data_survey.user_choice].name])
					});

					//Offer the user to cancel his choice
					var cancelReponseLink = createElem2({
						appendTo: choosedResponseElem,
						type: "a",
						innerHTML: lang("posts_ui_cancel_response_survey")
					});

					//Make cancel button lives
					cancelReponseLink.onclick = function(){

						ComunicWeb.common.messages.confirm(lang("posts_ui_confirm_cancel_survey_response"), function(confirm){

							//Check if the user cancelled
							if(!confirm)
								return;
							
							//Make a request on the server
							ComunicWeb.components.posts.interface.cancel_survey_response(info.ID, function(response){

								//Check for errors
								if(response.error){
									ComunicWeb.common.notificationSystem.showNotification(lang("posts_ui_err_cancel_response_survey"), "danger");
									return;
								}

								//Reload post
								ComunicWeb.components.posts.actions.reload_post(info.ID, postRoot);

							});

						});

					}
				}

				else {

					//Offer the user the possibility to respond the survey
					var surveyResponseForm = createElem2({
						appendTo: surveyResponse,
						type: "div",
						class: "input-group"
					});

					//Create response chooser
					var surveyResponseChooser = createElem2({
						appendTo: surveyResponseForm,
						type: "select",
						class: "form-control"
					});

					//Display options
					for(j in survey_choices){
						
						//Create an element for the choice
						option = createElem2({
							appendTo: surveyResponseChooser,
							type: "option",
							innerHTML: survey_choices[j].name,
							value: survey_choices[j].choiceID,
						});

					}

					//Add confirm button
					var chooseButtonSpan = createElem2({
						appendTo: surveyResponseForm,
						type: "span",
						class: "input-group-btn"
					});

					var chooseButton = createElem2({
						appendTo: chooseButtonSpan,
						type: "button",
						class: "btn btn-default",
						innerHTML: lang("posts_ui_send_survey_response")
					});

					//Make confirm button lives
					chooseButton.onclick = function(){
						
						//Get selected answer ID
						var choice_id = surveyResponseChooser.value;

						//Lock send button
						chooseButton.disabled = true;

						//Perform a request on the server
						ComunicWeb.components.posts.interface.survey_send_response(info.ID, choice_id, function(response){

							//Unlock button
							chooseButton.disabled = false;

							//Check for errors
							if(response.error){
								ComunicWeb.common.notificationSystem.showNotification("Could not send response to survey !", "danger");
								return;
							}

							//Reload post
							ComunicWeb.components.posts.actions.reload_post(info.ID, postRoot);


						});
					}
				}


				// Offer the user to create a new response, if possible
				if(info.data_survey.user_choice == 0 && info.data_survey.allowNewChoices) {

					const link = createElem2({
						appendTo: surveyResponse,
						type: "div",
						class: "a txt-center",
						innerHTML: tr("Add a new choice to this survey")
					});

					link.addEventListener("click", async () => {

						try {
							const choice = await showInputTextDialog(
								tr("Create a choice"),
								tr("Please specify the new choice you would like to create for this survey:"),
								""
							);

							await PostsInterface.createSurveyChoice(info.ID, choice);

							//Reload post
							ComunicWeb.components.posts.actions.reload_post(info.ID, postRoot);

						} catch(e) {
							console.error(e);
							notify(tr("Could not create a new choice for this survey!"), "danger");
						}
					});
				}


				// If the user is the owner of the survey, offer him to close it
				if(info.data_survey.userID == userID() && info.data_survey.allowNewChoices) {

					const link = createElem2({
						appendTo: surveyResponse,
						type: "div",
						class: "a txt-center",
						innerHTML: tr("Block creation of new choices")
					});

					link.addEventListener("click", async () => {

						try {
							if(!await showConfirmDialog(tr("Do you want to prevent new choices from being created? This can not be reverted!")))
								return;

							await PostsInterface.blockNewSurveyChoices(info.ID);

							//Reload post
							ComunicWeb.components.posts.actions.reload_post(info.ID, postRoot);

						} catch(e) {
							console.error(e);
							notify(tr("Could not block new choices from being created!"), "danger");
						}
					});
				}
			}
		}

		//If the kind of post was not implemented
		else {
			//Log error
			ComunicWeb.debug.logMessage("Not implemented kind of post: " + info.kind);
			ComunicWeb.common.error.submitError("notice", "Unimplemented kind of post: " + info.kind, 0, {});
		}


		//Add post content
		var postContent = createElem2({
			appendTo: postRoot,
			type: "div",
			class: "post_content",
			innerHTML: lineBreakToPTags(BBCodeParser.process(removeHtmlTags(info.content)))
		});

		//Parse emojies
		ComunicWeb.components.textParser.parse({
			element: postContent,
			user: await userInfo(info.userID)
		});

		//Add bottom elements container
		var bottomArea = createElem2({
			appendTo: postRoot,
			type: "ul",
			class: "list-inline post-buttons"
		});

		//Load likes
		var likesTarget = createElem2({
			appendTo: bottomArea,
			type: "li",
		});

		var userLiking = null;
		if(signed_in()){
			userLiking = info.userlike;
		}

		//Call component
		ComunicWeb.components.like.button.display(
			"post",
			info.ID,
			info.likes,
			userLiking,
			likesTarget
		);

		//Load comments (if possible)
		if(info.comments != null)
			ComunicWeb.components.comments.ui.display(info.comments, info.ID, postRoot);
		
		// Register for post updates
		if(UserWebSocket.IsConnected)
			PostsInterface.register(info.ID);

		// Auto-unregister when the post goes out of scope
		const ev = async (e) => {
			if(postRoot.isConnected)
				return;
			
			document.removeEventListener("openPage", ev);

			PostsInterface.unregister(info.ID);
		}
		document.addEventListener("openPage", ev);
	},

	/**
	 * Add a visibility level choice to a dropodown menu
	 * 
	 * @param {HTMLElement} target The target menu
	 * @param {Object} name The name of the visibility level
	 * @return {HTMLElement} The created element container
	 */
	_add_visibility_menu_item: function(target, name){

		//Create container
		var itemContainer = createElem2({
			appendTo: target,
			type: "li",
		});

		//Create link container
		var itemLink = createElem2({
			appendTo: itemContainer,
			type: "a"
		});
		itemLink.setAttribute("data-level", name);

		//Add visibility icon
		createElem2({
			appendTo: itemLink,
			type: "i",
			class: "fa " + ComunicWeb.components.posts.visibilityLevels[name].icon
		});

		//Add visibility label
		createElem2({
			appendTo: itemLink,
			type: "span",
			innerHTML: ComunicWeb.components.posts.visibilityLevels[name].name
		});

		return itemLink;

	},

}