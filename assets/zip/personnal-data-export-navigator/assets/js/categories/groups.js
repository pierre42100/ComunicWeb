/**
 * Groups membership
 * 
 * @author Pierre Hubert
 */

/**
 * Apply the list of groups
 */
function ApplyGroups() {
    const target = byId("groups-list-table")

    data.groups.forEach(group => {

		let groupTR = createElem2({
			appendTo: target,
			type: "tr"
		});

        const addCell = (content) => createElem2({
            appendTo: groupTR,
            type: "td",
            innerHTML: content,
        })

        addCell(group.id)

		let groupLogoCell = createElem2({
			appendTo: groupTR,
			type: "td"
		});

		let groupLogo = createElem2({
			appendTo: groupLogoCell,
			type: "img",
            class: "group-logo",
            src: getFilePathFromURL(group.icon_url)
		});

        addCell(group.name)
		addCell(group.number_members)
        addCell(group.visibility)
        addCell(group.registration_level)
        addCell(group.posts_level)
        addCell(group.virtual_directory)
        addCell(group.membership)
        addCell(group.following ? "Yes" : "No")
	});
}