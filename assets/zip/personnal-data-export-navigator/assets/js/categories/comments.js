/**
 * Comments category
 * 
 * @author Pierre HUBERT
 */

/**
 * Apply full comments list
 */
function ApplyCommentsList() {

    let target = document.querySelector("#all-comments-table tbody");

    data.comments.forEach(comment => {

        let commentEl = createElem2({
            appendTo: target,
            type: "tr",
            innerHTML: 
                "<td>"+comment.ID+"</td>" +
                "<td>"+comment.postID+"</td>" +
                "<td>"+timeToStr(comment.time_sent)+"</td>" +
                "<td>"+comment.content+"</td>"
        });


        if(comment.img_path != null){
            
            let imageContainer = createElem2({
                appendTo: commentEl,
                type: "td"
            });

            let imageElem = createElem2({
                appendTo: imageContainer,
                type: "img",
                class: "comment-img"
            });

            applyURLToImage(imageElem, comment.img_url);

        }

    });

}