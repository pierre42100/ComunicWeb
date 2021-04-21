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
        const presence = await ForezPresenceHelper.GetList(group.id);
        const users = await getUsers([...new Set(presence.map(e => e.userID))]);
        
        // Load template
        const tpl = await Page.loadHTMLTemplate("pages/groups/pages/presence.html");
        const el = document.createElement("div")
        el.innerHTML = tpl;
        target.appendChild(el);
        
        
        
        const calEvents = presence.map((e) => {
            return {
                title: users.get(e.userID).fullName,
                start: new Date(e.year, e.month - 1, e.day),
                backgroundColor: "#0073b7", //Blue
                borderColor: "#0073b7", //Blue
                editable: e.userID == userID(),
                allDay: true,
                description: users.get(e.userID).fullName
            }
        })
        
        const calendarTarget = el.querySelector(".calendar");
        const calendar = new FullCalendar.Calendar(calendarTarget, {
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,listMonth'
            },
            initialView: 'dayGridMonth',
            events: calEvents,

            // Update events
            eventResize: function(info) {
                const newDays = new Set(getDaysOfRange(info.event.start, info.event.end).map(el => el.getTime()));
                const oldDays = new Set(getDaysOfRange(info.oldEvent.start, info.oldEvent.end).map(el => el.getTime()));

                for (const el of newDays) {
                    if(oldDays.has(el)) {
                        newDays.delete(el)
                        oldDays.delete(el)
                    }
                }

                console.info("add", newDays)
                console.info("del", oldDays)
            }
        });

        calendar.render()
    }
}