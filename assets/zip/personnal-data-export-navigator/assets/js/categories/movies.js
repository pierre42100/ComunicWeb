/**
 * Movies category
 * 
 * @author Pierre HUBERT
 */

/**
 * Apply the list of movies of the user
 */
function ApplyMovies(){

    let target = document.querySelector("#full-movie-list-table tbody");

    //Process the list of movies
    data.movies.forEach(movie => {

        createElem2({
            appendTo: target,
            type: "tr",
            innerHTML:
                "<td>" + movie.id + "</td>" +
                "<td>" + movie.name + "</td>" +
                "<td>" + movie.file_type + "</td>" +
                "<td>" + movie.size + "</td>" +
                "<td> <a href='"+getFilePathFromURL(movie.url)+"'>Open</a></td>"
        });

    });

}