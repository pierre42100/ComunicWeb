/**
 * Sidebar main script file
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.components.sideBar.main = {
	show: function() {

		if(byId("main-sidebar")) return;

		var sideBar = createElem2({
			appendTo: byId("wrapper"),
			type: "aside",
			class: "main-sidebar",
			id: "main-sidebar",
		});

		var section = createElem2({
			appendTo: sideBar,
			type: "section",
			class: "sidebar"
		});

		// User panel
		var userPanel = createElem2({
			appendTo: section,
			type: "div",
			class: "user-panel"
		});

		getUserInfo(userID(), function(info){
			if(info.error)
				return userPanel.innerHTML = "Error!";
			
			// User account image
			createElem2({
				appendTo: userPanel,
				type: "div",
				class: "pull-left image cursor-pointer",
				onclick: () => openUserPage(info),
				children: [
					createElem2({
						type: "img",
						class: "img-circle",
						src: info.accountImage
					})
				],
			});

			// User name
			createElem2({
				appendTo: userPanel,
				type: "div",
				class: "pull-left info",
				children: [
					createElem2({
						type: "p",
						class: "cursor-pointer",
						innerHTML: userFullName(info),
						onclick: () => userIDorPath(info),
					}),

					createElem2({
						type: "a",
						innerHTML: "Settings",
						internalHref: "settings",
					}),
				]
			});
		});



		// Search form
		var searchForm = createElem2({
			appendTo: section,
			type: "form",
			class: "sidebar-form",
			children: [
				createElem2({
					type: "div",
					class: "input-group",
					children: [
						createElem2({
							type: "input",
							class: "form-control",
							elemType: "text",
							placeholder: "Search...",
						}),
		
						createElem2({
							type: "span",
							class: "input-group-btn",
							innerHTML: '<button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>',
						}),
					]
				})
			]
		});

		searchForm.addEventListener("submit", function(e){
			e.preventDefault();

			openPage("search?q=" + searchForm.getElementsByTagName("input")[0].value);
		});


		// User memberships
		let userMemberships = createElem2({
			appendTo: section,
			type: "ul",
			class: "sidebar-menu memberships-list" 
		});

		this.refreshMemberships(userMemberships);
	},

	/**
	 * Refresh user memberships
	 * 
	 * @param {HTMLElement} target 
	 */
	refreshMemberships: function(target){
		ComunicWeb.components.webApp.interface.getMemberships(
			() => notify("Could not refresh your memberships!", "error"), 
			(m, u, g) => this.applyMemberships(target, m, u, g)
		);


	},

	/**
	 * Apply memberships
	 * 
	 * @param {HTMLElement} target
	 * @param {*} memberships 
	 * @param {*} users 
	 * @param {*} groups 
	 */
	applyMemberships: function(target, memberships, users, groups) {

		// Empty liste
		target.innerHTML = "";

		memberships.forEach(e => {

			if(e.type == "friend")
				this.applyFriend(target, e.friend, users["user-"+e.friend.ID_friend]);
			
			if(e.type == "group")
				this.applyGroup(target, groups[e.id], e.last_activity);
		});
	},


	/**
	 * Apply a friend object
	 * 
	 * @param {HTMLElement} target 
	 * @param {*} friend 
	 * @param {*} user 
	 */
	applyFriend: function(target, friend, user) {

		let li = createElem2({
			appendTo: target,
			type: "li"
		});

		let a = createElem2({
			appendTo: li,
			onclick: () => openUserPage(user),
			type: "a"
		});

		// User icon
		createElem2({
			appendTo: a,
			type: "img",
			class: "img-circle",
			src: user.accountImage
		});

		// User name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: userFullName(user)
		});

	},

	/**
	 * Apply group information
	 * 
	 * @param {HTMLElement} target 
	 * @param {*} group 
	 * @param {*} lastactive 
	 */
	applyGroup: function(target, group, lastactive) {
		
		let li = createElem2({
			appendTo: target,
			type: "li"
		});

		let a = createElem2({
			appendTo: li,
			type: "a",
			onclick: () => openGroupPage(group)
		});

		// Group icon
		createElem2({
			appendTo: a,
			type: "img",
			src: group.icon_url
		});

		// Group name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: group.name
		});

	},
}