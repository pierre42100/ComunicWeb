/**
 * Conversation file upload progress
 * 
 * Show a progress bar letting the user know when
 * is file is sent.
 * 
 * @author Pierre Hubert
 */

class FileUploadProgress {

    /**
     * Initialise a new progress bar
     * 
     * @param {HTMLElement} target 
     */
    constructor(target) {
        const progressContainerElem = createElem2({
            appendTo: target,
            type: "div",
            class: "progress progress-xs progress-striped active"
        });
        progressContainerElem.style.marginBottom = "0px"

        this.progresselem = createElem2({
            appendTo: progressContainerElem,
            type: "div",
            class: "progress-bar progress-bar-success",
        })

        this.setProgress(0)
    }

    /**
     * Apply a new progress
     * 
     * @param {number} progress Between 0 and 1
     */
    setProgress(progress) {
        this.progresselem.style.width = Math.floor(progress*100) + "%"
    }

    /**
     * Remove the progress element
     * from the page
     */
    remove() {
        this.progresselem.parentNode.remove()
    }
}