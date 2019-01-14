/**
 * Surveys category
 * 
 * @author Pierre HUBERT
 */

/**
 * Apply all survey responses
 */
function ApplySurveyResponses(){

    let target = document.querySelector("#all-survey-responses tbody");

    data.survey_responses.forEach(response => {

        createElem2({
            appendTo: target,
            type: "tr",
            innerHTML:
                "<td>"+response.id+"</td>" +
                "<td>"+response.surveyID+"</td>" +
                "<td>"+response.choiceID+"</td>" +
                "<td>"+timeToStr(response.time_sent)+"</td>"
        })

    });

}