/**
 * Messages functions
 * 
 * @author Pierre HUBERT
 */

/**
 * Create a callout element and return it
 * 
 * @param {String} calloutTitle The title of the callout
 * @param {String} calloutMessage The message of the callout
 * @param {String} calloutType The type of the callout (danger, info, warning, success)
 */
ComunicWeb.common.messages.createCalloutElem = function(calloutTitle, calloutMessage, calloutType){
    //Prepare callout message
    calloutMessage = "<p>" + calloutMessage + "</p>";
    
    //By default, it is an info callout
    if(!calloutType)
        var calloutType = "info";

    //Create callout main container
    var calloutElem = document.createElement('div');
    calloutElem.className = "callout callout-" + calloutType;

    //Add title
    if(calloutTitle != ""){
        var calloutTitleElem = document.createElement("h4");
        calloutTitleElem.innerHTML =  calloutTitle;
        calloutElem.appendChild(calloutTitleElem)
    }

    //Add callout body
    var calloutBody = document.createElement("div");
    calloutBody.innerHTML = calloutMessage;
    calloutElem.appendChild(calloutBody);

    //Return created element
    return calloutElem;
}

/**
 * Create loading callout element
 * 
 * @param {HTMLElement} target Optionnal, the target of the callout element
 * @return {HTMLElement} Generated loading callout element
 */
ComunicWeb.common.messages.createLoadingCallout = function(target){

    var elem = this.createCalloutElem(lang("messages_loading_layout_title"), lang("messages_loading_layout_message"), "info");

    if(target)
        target.appendChild(elem);

    return elem;

}


/**
 * Create dialog skeleton
 * 
 * @param {object} info Information about the callout to create
 * @argument {string} type The type of modal
 * @argument {string} title The title of the modal
 * @return {object} Information about the created dialog
 */
ComunicWeb.common.messages.createDialogSkeleton = function(info){

    data = {};

    //Get modal type
    var modalType = info.type ? info.type : "default";

    //Get modal title
    var modalTitle = info.title ? info.title : "";

    //Create a modal root
    data.modal = createElem2({
        type: "div",
        class: "modal modal-" + modalType
    });

    var modalDialog = createElem2({
        appendTo: data.modal,
        type: "div",
        class: "modal-dialog"
    });

    data.modalContent = createElem2({
        appendTo: modalDialog,
        type: "div",
        class: "modal-content",
    });

    //Modal header
    data.modalHeader = createElem2({
        appendTo: data.modalContent,
        type: "div",
        class: "modal-header"
    });

    data.closeModal = createElem2({
        appendTo: data.modalHeader,
        type: "button",
        class: "close",
    });

    createElem2({
        appendTo: data.closeModal,
        type: "span",
        innerHTML: "x"
    });

    //Modal title
    data.modalTitle = createElem2({
        appendTo: data.modalHeader,
        type: "h4",
        class: "modal-title",
        innerHTML: modalTitle
    });

    //Modal body
    data.modalBody = createElem2({
        appendTo: data.modalContent,
        type: "div",
        class: "modal-body",
    });

    //Modal footer
    data.modalFooter = createElem2({
        appendTo: data.modalContent,
        type: "div",
        class: "modal-footer"
    });

    data.cancelButton = createElem2({
        appendTo: data.modalFooter,
        type: "button",
        class: "btn btn-default",
        innerHTML: lang("messages_dialog_cancel")
    });

    return data;
}

/**
 * Create a confirmation dialog
 * 
 * @param {string} message The confirmation message
 * @param {function} callback What to do once the user has made is choice
 * The function must includes one parameters which is a boolean.
 * - TRUE if the user accepted the action
 * - FALSE if the user decided to cancel it
 */
ComunicWeb.common.messages.confirm = function(message, callback){

    //Create a modal root
    var modal = createElem2({
        type: "div",
        class: "modal modal-danger confirm-modal"
    });

    var modalDialog = createElem2({
        appendTo: modal,
        type: "div",
        class: "modal-dialog"
    });

    var modalContent = createElem2({
        appendTo: modalDialog,
        type: "div",
        class: "modal-content",
    });

    //Modal header
    var modalHeader = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-header"
    });

    var closeModal = createElem2({
        appendTo: modalHeader,
        type: "button",
        class: "close",
    });
    closeModal.setAttribute("data-confirm", "false");

    createElem2({
        appendTo: closeModal,
        type: "span",
        innerHTML: "x"
    });

    var modalTitle = createElem2({
        appendTo: modalHeader,
        type: "h4",
        class: "modal-title",
        innerHTML: lang("messages_dialog_confirm_title")
    });

    //Modal body
    var modalBody = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-body",
        innerHTML: "<p>"+message+"</p>"
    });

    //Modal footer
    var modalFooter = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-footer"
    });

    var cancelButton = createElem2({
        appendTo: modalFooter,
        type: "button",
        class: "btn btn-default pull-left",
        innerHTML: lang("messages_dialog_confirm_cancel")
    });
    cancelButton.setAttribute("data-confirm", "false");

    var confirmButton = createElem2({
        appendTo: modalFooter,
        type: "button",
        class: "btn btn-danger",
        innerHTML: lang("messages_dialog_confirm_confirm")
    });
    confirmButton.setAttribute("data-confirm", "true");

    //Create the response function
    var respond = function(){

        //Check if the operation was confirmed or not
        var accept = this.getAttribute("data-confirm") == "true";

        //Close modal
        $(modal).modal('hide');
        emptyElem(modal);
        modal.remove();

        //Call callback
        callback(accept);
    }

    //Make the buttons live
    cancelButton.onclick = respond;
    confirmButton.onclick = respond;
    closeModal.onclick = respond;

    //Show the modal
    $(modal).modal('show');

}

/**
 * Prompt the user to input a string
 * 
 * @param {string} title The title of the edit box
 * @param {string} message The label for the input field
 * @param {string} defaultValue The default value of the input string
 * @param {function} callback What to do once the user has made is choice
 * The callback function must includes one parameters which is a boolean or a string.
 * - The content of the typed string (if any)
 * - FALSE if the user decided to cancel the dialog
 */
ComunicWeb.common.messages.inputString = function(title, message, defaultValue, callback){

    //Create a modal root
    var modal = createElem2({
        type: "div",
        class: "modal modal-primary input-string-modal"
    });

    var modalDialog = createElem2({
        appendTo: modal,
        type: "div",
        class: "modal-dialog"
    });

    var modalContent = createElem2({
        appendTo: modalDialog,
        type: "div",
        class: "modal-content",
    });

    //Modal header
    var modalHeader = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-header"
    });

    var closeModal = createElem2({
        appendTo: modalHeader,
        type: "button",
        class: "close",
    });
    closeModal.setAttribute("data-confirm", "false");

    createElem2({
        appendTo: closeModal,
        type: "span",
        innerHTML: "x"
    });

    var modalTitle = createElem2({
        appendTo: modalHeader,
        type: "h4",
        class: "modal-title",
        innerHTML: title
    });

    //Modal body
    var modalBody = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-body",
    });

    //Setup form
    var textInput = createFormGroup({
        target: modalBody,
        type: "text",
        label: message,
        placeholder: ""
    });
    textInput.value = defaultValue;

    //Modal footer
    var modalFooter = createElem2({
        appendTo: modalContent,
        type: "div",
        class: "modal-footer"
    });

    var cancelButton = createElem2({
        appendTo: modalFooter,
        type: "button",
        class: "btn btn-default pull-left",
        innerHTML: lang("messages_dialog_input_string_cancel")
    });
    cancelButton.setAttribute("data-confirm", "false");

    var submitButton = createElem2({
        appendTo: modalFooter,
        type: "button",
        class: "btn btn-primary",
        innerHTML: lang("messages_dialog_input_string_submit")
    });
    submitButton.setAttribute("data-confirm", "true");

    //Create the response function
    var respond = function(){

        //Check if the operation was confirmed or not
        var cancel = this.getAttribute("data-confirm") != "true";

        //Close modal
        $(modal).modal('hide');
        emptyElem(modal);
        modal.remove();

        //Call callback
        //The operation was not cancelled
        if(!cancel)
            callback(textInput.value);

        //The user cancelled the operation
        else
            callback(false);
    }

    //Make the buttons live
    cancelButton.onclick = respond;
    submitButton.onclick = respond;
    closeModal.onclick = respond;

    //Show the modal
    $(modal).modal('show');

}

/**
 * Prompt the user to input his password
 * 
 * @param {Object} info Additionnal information
 */
ComunicWeb.common.messages.promptPassword = function(info){

    var dialog = ComunicWeb.common.messages.createDialogSkeleton({
        type: "danger",
        title: "Password required"
    });
    $(dialog.modal).modal("show");

    //Create modal close function
    var closeModal = function(e, password){
        $(dialog.modal).modal("hide");
        emptyElem(dialog.modal);
        dialog.modal.remove();

        //Callback
        if(info.callback)
            info.callback(password);
    };
    dialog.cancelButton.addEventListener("click", closeModal);
    dialog.closeModal.addEventListener("click", closeModal);

    //Set dialog body
    var passwordForm = createElem2({
        appendTo: dialog.modalBody,
        type: "div"
    });

    createElem2({
        appendTo: passwordForm,
        type: "p",
        innerHTML: "We need your password to continue."
    });

    //Create pasword input group
    var inputGroup = createElem2({
        appendTo: passwordForm,
        type: "div",
        class: "input-group input-group-sm"
    });

    //Create password input
    var passwordInput = createElem2({
        appendTo: inputGroup,
        type: "input",
        class: "form-control",
        elemType: "password"
    });

    //Create input group
    var inputGroupContainer = createElem2({
        appendTo: inputGroup,
        type: "span",
        class: "input-group-btn"
    });

    //Add submit button
    var submitButton = createElem2({
        appendTo: inputGroupContainer,
        type: "button",
        class: "btn btn-danger",
        innerHTML: "Confirm deletion"
    });

    submitButton.addEventListener("click", function(e){

        //Check given password
        var password = passwordInput.value;
        if(password.length < 4)
            return notify("Please check given password !", "danger");
        
        //Close modal
        closeModal(null, password);

    });
}