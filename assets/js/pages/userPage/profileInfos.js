/**
 * Profile informations displaying handler
 * 
 * Handlers the rendering of informations such as
 * the name of the user, or account informations
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.userPage.profileInfos = {

	/**
	 * Display profile informations
	 * 
	 * @param {Object} infos Informations about the user
	 * @param {HTMLElement} target The target of the profile informations
	 */
	display: function(infos, target){

		//Create the main box
		this.createMainBox(infos, target);

		//About user box
		this.createAboutUserBox(infos, target);

	},

	/**
	 * Display the main informations about the user
	 * 
	 * @param {Object} infos Informations about the user
	 * @param {HTMLElement} target The target of the box
	 */
	createMainBox: function(infos, target){
		
		//Create box container
		var boxContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary"
		});

		//Setup box body
		var boxBody = createElem2({
			appendTo: boxContainer,
			type: "div",
			class: "box-body box-profile"
		});

		//Add user image
		var userImage = createElem2({
			appendTo: boxBody,
			type: "img",
			class: "profile-user-img img-responsive img-circle",
			src: infos.accountImage
		});

		//Add user name
		var userName = createElem2({
			appendTo: boxBody,
			type: "h3",
			class: "profile-username text-center",
			innerHTML: infos.firstName + " " + infos.lastName
		});


		//Add user virtual directory (if any)
		if(infos.virtualDirectory != ""){
			var userTag = createElem2({
				appendTo: boxBody,
				type: "div",
				innerHTML: "@"+ infos.virtualDirectory,
				class: "user-tag-in-profile"
			});
		}


		//Show user likes
		var userLikesTarget = createElem2({
			appendTo: boxBody,
			type: "div"
		});
		userLikesTarget.style.textAlign = "center";
		userLikesTarget.style.marginBottom = "10px";

		//Check wether user is linking or not
		var userLiking = null;
		if(signed_in()){
			userLiking = infos.user_like_page;
		}

		//Call component
		ComunicWeb.components.like.button.display(
			"user",
			infos.userID,
			infos.pageLikes,
			userLiking,
			userLikesTarget
		);



		//Add a list of informations about user
		var listInfos = createElem2({
			appendTo: boxBody,
			type: "url",
			class: "list-group list-group-unbordered"
		});

		//Add number of friends
		var friendsLi = createElem2({
			appendTo: listInfos,
			type: "li",
			class: "list-group-item"
		});
		createElem2({
			appendTo: friendsLi,
			type: "b",
			innerHTML: lang("user_page_profile_info_friends_link")
		});
		var friendsListLink = createElem2({
			appendTo: friendsLi,
			type: "a",
			class: "pull-right",
			innerHTML: infos.number_friends
		});

		//Make the user number lives
		friendsListLink.onclick = function(){

			ComunicWeb.components.friends.listModal.display(infos.userID);

		};

		//Add user status informations (if required)
		if(signed_in()){
			if(userID() != infos.userID){

				// Get user status
				var userStatus = createElem2({
					appendTo: boxBody,
					type: "div",
					innerHTML: lang("user_page_profile_info_loading"),
				});
				userStatus.style.textAlign = "center";
				ComunicWeb.pages.userPage.friendshipStatus.display(infos.userID, userStatus);

				//Add separator
				userStatus.style.marginBottom = "5px";

				//Create conversation button
				var conversationButton = createElem2({
					appendTo: boxBody,
					type: "button",
					class: "btn btn-default btn-block",
					innerHTML: "<i class='fa fa-comments'></i> " + lang("user_page_profile_info_conversation_button")
				});

				conversationButton.onclick = function(){
					ComunicWeb.components.conversations.manager.openPrivate(infos.userID);
				}
			}
		}
		
	},

	/**
	 * Create the about the user box
	 * 
	 * @param {Object} infos Informations about the user
	 * @param {HTMLElement} target The target for the box
	 */
	createAboutUserBox: function(infos, target){

		//Create box root
		var boxRoot = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary about-user-box"
		});

		//Add box header
		var boxHeader = createElem2({
			appendTo: boxRoot,
			type: "div",
			class: "box-header with-border"
		});

		//Add box title
		createElem2({
			appendTo: boxHeader,
			type: "h3",
			class: "box-title",
			innerHTML: lang("user_page_profile_info_about_box_title", [infos.firstName])
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: boxRoot,
			type: "div",
			class: "box-body"
		});

		//Add user email address
		if(infos.email_address){
			const emailAddress = createElem2({
				appendTo: boxBody,
				type: "strong"
			});
			createElem2({
				appendTo: emailAddress,
				type: "i",
				class: "fa fa-envelope-o margin-r-5"
			});
			createElem2({
				appendTo: emailAddress,
				type: "span",
				innerHTML: tr("Email address")
			});
			createElem2({
				appendTo: boxBody,
				type: "p",
				class: "text-muted",
				innerHTML: infos.email_address
			});

			//Add separator
			createElem2({
				appendTo: boxBody,
				type: "hr",
			});
		}

		//Add location
		if(infos.location){
			const location = createElem2({
				appendTo: boxBody,
				type: "strong"
			});
			createElem2({
				appendTo: location,
				type: "i",
				class: "fa fa-map-marker margin-r-5"
			});
			createElem2({
				appendTo: location,
				type: "span",
				innerHTML: tr("Location")
			});
			createElem2({
				appendTo: boxBody,
				type: "p",
				class: "text-muted",
				innerHTML: infos.location
			});

			//Add separator
			createElem2({
				appendTo: boxBody,
				type: "hr",
			});
		}

		
		//Add user website (if any)
		if(infos.personnalWebsite){
			var userWebsite = createElem2({
				appendTo: boxBody,
				type: "strong"
			});
			createElem2({
				appendTo: userWebsite,
				type: "i",
				class: "fa fa-link margin-r-5"
			});
			createElem2({
				appendTo: userWebsite,
				type: "span",
				innerHTML: lang("user_page_profile_info_website")
			});
			var websiteLinkContainer = createElem2({
				appendTo: boxBody,
				type: "p",
				class: "text-muted",
			});
			createElem2({
				appendTo: websiteLinkContainer,
				type: "a",
				href: infos.personnalWebsite,
				innerHTML: infos.personnalWebsite
			}).target="_blank";

			//Add separator
			createElem2({
				appendTo: boxBody,
				type: "hr",
			});
		}

		//Add user public note (if any)
		if(infos.publicNote){
			var userNote = createElem2({
				appendTo: boxBody,
				type: "strong"
			});
			createElem2({
				appendTo: userNote,
				type: "i",
				class: "fa fa-file-text-o margin-r-5"
			});
			createElem2({
				appendTo: userNote,
				type: "span",
				innerHTML: lang("user_page_profile_info_note")
			});
			var publicNotes = createElem2({
				appendTo: boxBody,
				type: "p",
				class: "text-muted",
				innerHTML: infos.publicNote
			});

			//Parse text
			ComunicWeb.components.textParser.parse({
				element: publicNotes,
				user: infos
			});

			//Add separator
			createElem2({
				appendTo: boxBody,
				type: "hr",
			});
		}

		//Add informations about membership
		var membershipInfos = createElem2({
			appendTo: boxBody,
			type: "strong"
		});
		createElem2({
			appendTo: membershipInfos,
			type: "i",
			class: "fa fa-clock-o margin-r-5"
		});
		createElem2({
			appendTo: membershipInfos,
			type: "span",
			innerHTML: lang("user_page_profile_info_membership")
		});
		createElem2({
			appendTo: boxBody,
			type: "p",
			class: "text-muted",
			innerHTML: lang("user_page_profile_info_member_for", [ComunicWeb.common.date.timeDiffToStr(infos.account_creation_time)])
		});
		
	},
};