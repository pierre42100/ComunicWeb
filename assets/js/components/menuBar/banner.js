/**
 * Menu bar banner
 * 
 * @author Pierre Hubert
 */

let hasClosedBanner = false;

const MenubarBanner = {
    /**
     * Add menubar banner if required
     * 
     * @param {HTMLElement} target Target element
     * @returns {HTMLElement} The banner (if it was created)
     */
    addBanner: function(target) {
        if(hasClosedBanner ||
            !ServerConfig.conf.banner || 
            !ServerConfig.conf.banner.enabled && 
            ServerConfig.conf.banner.expire < ComunicDate.time())
            return;
        
        const banner = ServerConfig.conf.banner;

        const rootEl = createElem2({
            appendTo: target,
            type: "div",
            class: "banner alert alert-dismissible alert-" +(banner.nature == "information" ? "info" : (banner.nature == "success" ? "success" : "danger"))
        })

        // Close button
        createElem2({
            appendTo: rootEl,
            type: "button",
            class: "close",
            elemType: "button",
            innerHTML: "x",
            onclick: () => {
                rootEl.remove();
                hasClosedBanner = true;
            }
        })

        // icon
        createElem2({
            appendTo: rootEl,
            type: "i",
            class: "icon fa "+(banner.nature == "information" ? "fa-info" : (banner.nature == "success" ? "fa-check" : "fa-warning"))
        })

        // message
        createElem2({
            appendTo: rootEl,
            type: "span",
            innerHTML: banner.message.hasOwnProperty(currLang()) ? banner.message[currLang()] : banner.message["en"]
        })

        // link
        if (banner.link) {
            const link = createElem2({
                appendTo: rootEl,
                type: "a",
                href: banner.link,
                innerHTML: tr("Learn more")
            })
            link.target = "_blank";
        }

        return rootEl;
    }
};