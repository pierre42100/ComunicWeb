/**
 * Likes category
 * 
 * @author Pierre HUBERT
 */

/**
 * Apply all user likes
 */
function ApplyUserLikes() {

    let target = document.querySelector("#all-likes-table tbody");

    data.likes.forEach(like => {

        createElem2({
            appendTo: target,
            type: "tr",
            innerHTML:
                "<td>" + like.id + "</td>" +
                "<td>" + timeToStr(like.time_sent) + "</td>" +
                "<td>" + like.elem_type + "</td>" +
                "<td>" + like.elem_id + "</td>"
        });

    });

}