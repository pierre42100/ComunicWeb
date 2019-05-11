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
			class: "main-sidebar"
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
				internalHref: userIDorPath(info),
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
						internalHref: userIDorPath(info),
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
	}
}