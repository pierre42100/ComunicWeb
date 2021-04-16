/**
 * Function to check data input in forms
 * 
 * @author Pierre HUBERT
 */
const FormChecker = {

    /**
     * Check an input
     * 
     * @param {elem} input The input element to check
     * @param {Boolean} inFormGroup Specify wether the input is in a formgroup or not
     * @param {number} minLength Minimum length of input
     * @return {Boolean} True or false depending of the validity of the field
     */
    checkInput: function(input, inFormGroup, minLength = 3){
        //Check input existence
        if(!input){
            //Error message
            ComunicWeb.debug.logMessage("ComunicWeb.common.formChecker.checkInput requires at least on input !");
            return false;
        }

        //Extract input type
        var inputType = input.type;

        //Prepare checking
        var inputOK = true;

        //TextInput
        if(inputType == "text"){
            inputOK = (input.value.length < minLength ? false:true);
        }

        //MailInput
        else if(inputType == "email"){
            inputOK = checkMail(input.value);
        }

        //Password input
        else if(inputType == "password"){
            inputOK = (input.value.length < 3 ? false:true);
        }

        //Unsupported input type
        else {
            ComunicWeb.debug.logMessage("ComunicWeb.common.formChecker.checkInput input type '" + inputType + "' not supported !");
            return false;
        }

        //If possible, change input state
        if(inFormGroup){
            //Retrieve parent node
            var parentNode = input.parentNode;

            //If there is no error, remove has-error attribute
            if(inputOK){
                if(parentNode.className.indexOf("has-error") != -1){
                    //Remove has-error attribute
                    parentNode.className = parentNode.className.replace("has-error", "");
                }
            }

            //If there is an error, check the has-error attribute is present
            if(!inputOK){
                if(parentNode.className.indexOf("has-error") == -1){
                    //Add has-error attribute
                    parentNode.className = parentNode.className + " has-error";
                }
            }
        }

        //Return result
        return inputOK;
    }

};


ComunicWeb.common.formChecker = FormChecker;