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


        Vue.createApp({
            
            data: () => {
                return {
                   
                }
            },

            methods: {
            }

        }).mount(el);

        
        const calEvents = presence.map((e) => {
            return {
                title: users.get(e.userID).fullName,
                start: new Date(e.year, e.month - 1, e.day),
                backgroundColor: "#0073b7", //Blue
                borderColor: "#0073b7", //Blue
                editable: false,
                allDay: true
            }
        })

        $(el.getElementsByClassName("calendar")).fullCalendar({
            header: {
            },
            buttonText: {
              today: 'today',
              month: 'month',
              week: 'week',
              day: 'day'
            },
            //Random default events
            events: calEvents,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function (date, allDay) { // this function is called when something is dropped
      
              // retrieve the dropped element's stored Event Object
              var originalEventObject = $(this).data('eventObject');
      
              // we need to copy it, so that multiple events don't have a reference to the same object
              var copiedEventObject = $.extend({}, originalEventObject);
      
              // assign it the date that was reported
              copiedEventObject.start = date;
              copiedEventObject.allDay = allDay;
              copiedEventObject.backgroundColor = $(this).css("background-color");
              copiedEventObject.borderColor = $(this).css("border-color");
      
              // render the event on the calendar
              // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
              $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
      
              // is the "remove after drop" checkbox checked?
              if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
              }
      
            }
          });
    }
}