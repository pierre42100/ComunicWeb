/**
 * Groups about page
 * 
 * @author Pierre Huber
 */

const GroupAboutPage = {
    /**
     * @param {AdvancedGroupInfo} group 
     * @param {HTMLElement} target 
     */
    display: async function(group, target) {
        // Load template
		const tpl = await Page.loadHTMLTemplate("pages/groups/pages/about.html");
		const el = document.createElement("div")
		el.innerHTML = tpl;
		target.appendChild(el);

        Vue.createApp({
            
            data: () => {
                return {
                    group: group
                }
            },

            methods: {
            }

        }).mount(el);
    }
};