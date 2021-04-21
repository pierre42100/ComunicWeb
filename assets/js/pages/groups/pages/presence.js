/**
* Group presence tab
* 
* This is a Forez feature
* 
* @author Pierre Hubert
*/

class GroupPresencePage {
    /**
    * Show the page
    * 
    * @param {AdvancedGroupInfo} group 
    * @param {HTMLElement} target 
    */
    static async Show(group, target) {
        // Load template
        const tpl = await Page.loadHTMLTemplate("pages/groups/pages/presence.html");
        const el = document.createElement("div")
        el.innerHTML = tpl;
        target.appendChild(el);
        
        let lastClick = null;
        
        const calendarTarget = el.querySelector(".calendar");
        const calendar = new FullCalendar.Calendar(calendarTarget, {
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,listMonth'
            },
            initialView: 'dayGridMonth',

            // Data source
            events: async function(info, success, failure) {
                try {
                    const presence = await ForezPresenceHelper.GetList(group.id);
                    const users = await getUsers([...new Set(presence.map(e => e.userID))]);
                    success(presence.map((e) => {
                        return {
                            title: users.get(e.userID).fullName,
                            start: new Date(e.year, e.month - 1, e.day),
                            backgroundColor: "#0073b7", //Blue
                            borderColor: "#0073b7", //Blue
                            editable: e.userID == userID(),
                            allDay: true,
                            description: users.get(e.userID).fullName
                        }
                    }));

                } catch(e) {
                    console.error(e);
                    failure(e);
                }
            },

            // Update events
            eventResize: async function(info) {
                try {
                    await ForezPresenceHelper.UpdateEvents(group.id, info.oldEvent.start, info.oldEvent.end, info.event.start, info.event.end)
                } catch(e) {
                    console.error(e);
                    notify(tr("Failed to update presence!"), "danger")
                }
            },

            // Add new event
            dateClick: async function(info) {
                if (lastClick == null || new Date().getTime() - lastClick.getTime() > 500)
                {
                    lastClick = new Date()
                    return;
                }

                try {
                    await ForezPresenceHelper.AddDay(group.id, info.date.getFullYear(), info.date.getMonth() + 1, info.date.getDate())

                    calendar.getEventSources()[0].refetch()
                } catch(e) {
                    console.error(e);
                    notify(tr("Failed to update presence!"), "danger")
                }
            }
        });

        calendar.render()
    }
}