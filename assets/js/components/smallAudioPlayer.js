/**
 * Small audio player
 * 
 * @author Pierre Hubert
 */

class SmallAudioPlayer {
    /**
     * @param {HTMLElement} target 
     * @param {String} url 
     */
    constructor(target, url) {

        let link = createElem2({
            appendTo: target,
            type: "span",
            class: "a",
            innerHTML: "<i class='fa fa-play-circle'></i> Audio file"
        });

        link.addEventListener("click", e => {
            e.preventDefault();

            this.showPlayer(url);
        })
    }


    /**
     * Show full screen player
     * @param {String} url 
     */
    async showPlayer(url) {
        const tpl = await Page.loadHTMLTemplate("components/audioPlayer.html")

        let el = document.createElement("div");
        el.innerHTML = tpl;
        document.body.appendChild(el);

        el.querySelector("audio").src = url;

        el.querySelector(".close").addEventListener("click", e => el.remove());
        el.addEventListener("click", e => el.remove());
    }
}