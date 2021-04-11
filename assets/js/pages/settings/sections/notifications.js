/**
 * Notifications settings
 * 
 * @author Pierre Hubert
 */

class NotificationsSettings {
    static async Open(args, target) {

        try {
            // Get settings
            const settings =await SettingsInterface.getNotifications();

            // Load template
            const tpl = await Page.loadHTMLTemplate("pages/settings/notifications/NotificationsSection.html");
            const el = document.createElement("div")
            el.innerHTML = tpl;
            target.appendChild(el);

            // Create new application
            const VueApp = {
                data() {
                    return {
                        allow_sounds: settings.allow_notifications_sound,
                        allow_conversations: settings.allow_conversations
                    };
                },

                methods: {
                    async update() {
                        try {
                            let newSettings = {
                                allow_notifications_sound: el.querySelector("input[name='allow_sounds']").checked,
                                allow_conversations: el.querySelector("input[name='allow_conversations']").checked
                            }

                            await SettingsInterface.setNotifications(newSettings);

                            // Apply new settings immediatly
                            NotificationsSong.enableSong = newSettings.allow_notifications_sound;

                            notify(tr("Successfully updated settings!"), "success")

                        } catch(e) {
                            console.error(e)
                            notify(tr("Failed to update settings!"), "danger")
                        }                        
                    }
                }
            }

            Vue.createApp(VueApp).mount(el);

            el.querySelectorAll("input[type='checkbox']").forEach(e => {
                $(e).iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
            });

        }
        catch(e) {
            console.error(e);
            target.appendChild(ComunicWeb.common.messages.createCalloutElem(tr("Error"), tr("Failed to load notifications settings!"), "danger"))
        }
    }
}