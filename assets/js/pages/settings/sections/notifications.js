/**
 * Notifications settings
 * 
 * @author Pierre Hubert
 */

class NotificationsSettings {
    static async Open(args, target) {
        // Load template
		const tpl = await Page.loadHTMLTemplate("pages/settings/notifications/NotificationsSection.html");
		const el = document.createElement("div")
		el.innerHTML = tpl;
		target.appendChild(el);

        el.querySelectorAll("input[type='checkbox']").forEach(e => {
            $(e).iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                  radioClass: 'iradio_flat-blue'
            });
        });
    }
}