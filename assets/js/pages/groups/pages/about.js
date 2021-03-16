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

        const props = [
            {
                title: tr("Created"),
                value: timeDiffToStr(group.time_create),
                icon: "fa-clock-o"
            },

            {
                title: tr("Members"),
                value: tr("%1% members", {"1": group.number_members}),
                icon: "fa-users"
            },

            {
                title: tr("Who can create posts"),
                value: group.posts_level == "members" ? tr("Every members") : tr("Only moderators and administrators"),
                icon: "fa-plus"
            },

            {
                title: tr("Registration process"),
                value: group.registration_level == "closed" ? tr("Only one invitation") : (group.registration_level == "moderated" ? tr("By requesting memberships") : tr("Anyone can join without approval the group")),
                icon: "fa-sign-in"
            },

            {
                title: tr("Visibility"),
                icon: "fa-eye",
                value: group.visibility == "secrete" ? tr("Secrete group") : (group.visibility == "open" ? tr("Open group") : tr("Private group"))
            }
        ];

        if (group.description && group.description != null && group.description != "" && group.description != "null")
            props.unshift({
                title: tr("Description"),
                value: group.description,
                icon: "fa-sticky-note-o"
            })
        
        if (group.url && group.url != null && group.url != "" && group.url != "null")
            props.unshift({
                title: tr("URL"),
                value: group.url,
                icon: "fa-link",
                url: group.url
            })

        Vue.createApp({
            
            data: () => {
                return {
                    group: group,
                    props: props
                }
            },

            methods: {
            }

        }).mount(el);
    }
};