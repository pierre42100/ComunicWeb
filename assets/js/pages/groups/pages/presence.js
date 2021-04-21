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

        const colors = ["#f012be", "#f39c12", "#0073b7", "#00a65a", "#dd4b39", "#605ca8"];
        
        const calendarTarget = el.querySelector(".calendar");
        const calendar = new FullCalendar.Calendar(calendarTarget, {
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,listMonth'
            },
            initialView: 'dayGridMonth',
            locale: "fr",
            //dayMaxEvents: true,
            
            // Data source
            events: async function(info, success, failure) {
                try {
                    let presences = await ForezPresenceHelper.GetList(group.id);
                    const users = await getUsers([...new Set(presences.map(e => e.userID))]);
                    
                    presences.sort((one, two) => {
                        if (one.userID < two.userID)
                            return -1;
                        
                        if (one.userID > two.userID)
                            return 1;
                        
                        return one.date - two.date;
                    })

                    presences.forEach((e) => e.end = addOneDay(e.date));

                    
                    // Merge contiguous presence days
                    for(let i = 0; i < presences.length; i++) {
                        while(true) {
                            if (presences.length == i + 1)
                                break;
                            
                            let curr = presences[i];
                            let next = presences[i + 1];

                            if(curr.userID != next.userID || curr.end.getTime() != next.date.getTime())
                                break;
                            
                            curr.end = next.end;
                            presences.splice(i + 1, 1)
                        }
                    }
                    
                    const events = presences.map((e) => {
                        return {
                            title: users.get(e.userID).fullName,
                            start: e.date,
                            end: e.end,
                            backgroundColor: colors[e.userID % colors.length], //Blue
                            borderColor: colors[e.userID % colors.length], //Blue
                            editable: e.userID == userID(),
                            allDay: true,
                            description: users.get(e.userID).fullName,
                            userID: e.userID,
                        }
                    });
                    
                    success(events);
                    
                } catch(e) {
                    console.error(e);
                    failure(e);
                }
            },
            
            // Update events size
            eventResize: async function(info) {
                try {
                    await ForezPresenceHelper.UpdateEvents(group.id, info.oldEvent.start, info.oldEvent.end, info.event.start, info.event.end)
                    
                    calendar.getEventSources()[0].refetch()
                } catch(e) {
                    console.error(e);
                    notify(tr("Failed to update presence!"), "danger")
                }
            },

            // Drag event
            eventDrop: async function(info) {
                try {
                    await ForezPresenceHelper.UpdateEvents(group.id, info.oldEvent.start, info.oldEvent.end, info.event.start, info.event.end)

                    calendar.getEventSources()[0].refetch()
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
            },

            // Delete event
            eventClick: async function(info) {
                
                if (info.event.extendedProps.userID != userID())
                    return;

                if (lastClick == null || new Date().getTime() - lastClick.getTime() > 500)
                {
                    lastClick = new Date()
                    return;
                }

                try {
                    await ForezPresenceHelper.UpdateEvents(group.id, info.event.start, info.event.end, new Date(), new Date(new Date().getTime() - 1))
                    
                    calendar.getEventSources()[0].refetch()
                } catch(e) {
                    console.error(e);
                    notify(tr("Failed to update presence!"), "danger")
                }
            },
        });
        
        calendar.render()
    }
}