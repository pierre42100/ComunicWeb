/**
 * Group tags
 * 
 * @author Pierre Hubert
 */

const GroupTabs = {

    /**
     * @param {AdvancedGroupInfo} group Group information
     * @param {HTMLElement} target Target
     * @param {String} activePage Current active page
     */
    show: async function(group, target, activePage) {
        // Load template
		const tpl = await Page.loadHTMLTemplate("pages/groups/sections/GroupTabs.html");
		const el = document.createElement("div")
		el.innerHTML = tpl;
		target.appendChild(el);

        Vue.createApp({
            
            data: () => {
                return {
                    isAdmin: group.membership == "administrator",
                    canSeeMembers: group.is_members_list_public || group.membership == "administrator" || group.membership == "moderator",
                    activePage: activePage
                }
            },

            methods: {
                openPage: (uri) => openPage("groups/" + group.id + "/" + uri)
            }

        }).mount(el);
    }

}