/**
 * Small media player
 * 
 * @author Pierre Hubert
 */

class SmallMediaPlayer {
    /**
     * @param {HTMLElement} target 
     * @param {String} url 
     */
    constructor(target, url, isVideo) {

        let link = createElem2({
            appendTo: target,
            type: "span",
            class: "a",
            innerHTML: "<i class='fa fa-play-circle'></i> "+(isVideo ? "Video" : "Audio")+" file"
        });

        link.addEventListener("click", e => {
            e.preventDefault();

            this.showPlayer(url, isVideo);
        })
    }


    /**
     * Show full screen player
     * @param {String} url 
     */
    async showPlayer(url, isVideo) {
        try {
            const tpl = await Page.loadHTMLTemplate("components/mediaPlayer.html")

            let el = document.createElement("div");
            el.innerHTML = tpl;
            document.body.appendChild(el);

            let target = el.querySelector(".media-target");
            if (!isVideo) {
                let audio = document.createElement("audio");
                audio.controls = true;
                audio.src = url;
                target.appendChild(audio);
            }
            else {
                let video = document.createElement("video");
                video.controls = true;
                video.src = url;
                target.appendChild(video);
            }


            el.querySelector(".close").addEventListener("click", e => el.remove());
            el.addEventListener("click", e => el.remove());
        }

        catch(e) {
            console.error(e);
            notify(tr("Failed to paly media!"), "danger");
        }
    }
}