/**
 * Password input field
 * 
 * @author Pierre Hubert
 */

class PasswordInput {

    /**
     * Create password input field
     * 
     * @param {HTMLElement} target The target for the password input
     * @param {String} label The label for the input
     * @param {String} placeholder The placeholder to use
     */
    constructor(target, label, placeholder) {
        this._input = createFormGroup({
			target: target,
			label: label,
			placeholder: placeholder,
			type: "password",
		});

        this._input.parentNode.parentNode.classList.add("password-input-group");

        this._input.addEventListener("keyup", () => this._refreshArea());
        this._input.addEventListener("change", () => this._refreshArea());

        this.helpArea = createElem2({
            appendTo: this._input.parentNode,
            type: "span",
            class: "help-block"
        });

        this._refreshArea();
    }

    setFirstName(firstName) {
        this._firstName = firstName;
        this._refreshArea();
    }

    setLastName(lastName) {
        this._lastName = lastName;
        this._refreshArea();
    }

    setEmail(email) {
        this._email = email.length > 2 ? email : null;
        this._refreshArea();
    }

    /**
     * @param {User} user 
     */
    setUser(user) {
        this._firstName = user.firstName;
        this._lastName = user.lastName;
    }

    isValid() {
        this._refreshArea();
        return this._valid;
    }

    get value() {
        return this._input.value;
    }

    _refreshArea() {
        
        this.helpArea.innerHTML = "";
        
        /** @type {String} */
        const password = this._input.value.trim().toLowerCase();
        const policy = ServerConfig.conf.password_policy;

        if (password.length == 0) {
            this._valid = false;
            return;
        }

        this._good = [];
        this._bad = [];

        // Check email
        this._performMandatoryCheck(
            tr("Password must not contains part of email address"),
            !policy.allow_email_in_password && this._email,
            () => !password.includes(this._email.toLowerCase()) && !this._email.toLowerCase().includes(password)
        );

        // Check name
        this._performMandatoryCheck(
            tr("Password must not contains part of name"),
            !policy.allow_name_in_password && this._firstName && this._lastName,
            () => !password.includes(this._firstName.toLowerCase()) && !password.includes(this._lastName)
        );


        // Check password length
        this._performMandatoryCheck(
            tr("Password must be composed of at least %num_chars% characters", {num_chars: policy.min_password_length}),
            true,
            () => password.length >= policy.min_password_length
        );

        // Check if mandatory arguments are respected
        this._valid = this._bad.length == 0;


        // Check categories presence
        if(policy.min_categories_presence > 0) {

            let count = 0

            this._performCategoryCheck(
                this._input.value,
                tr("At least %num% upper case character", {num: policy.min_number_upper_case_letters}),
                "[A-Z]",
                policy.min_number_upper_case_letters
            ) && count++

            this._performCategoryCheck(
                this._input.value,
                tr("At least %num% lower case character", {num: policy.min_number_lower_case_letters}),
                "[a-z]",
                policy.min_number_lower_case_letters
            ) && count++


            this._performCategoryCheck(
                password,
                tr("At least %num% digit character", {num: policy.min_number_digits}),
                "[0-9]",
                policy.min_number_digits
            ) && count++


            this._performCategoryCheck(
                password,
                tr("At least %num% special character", {num: policy.min_number_special_characters}),
                "[^0-9a-zA-Z]",
                policy.min_number_special_characters
            ) && count++

            if (count < policy.min_categories_presence)
                this._valid = false;
            
            if (policy.min_categories_presence < 4)
                this._performMandatoryCheck(
                    tr(
                        "At least %num% of the following : upper case letter, lower case letter, digit or special character",
                        {num: policy.min_categories_presence}
                    ),
                    true,
                    () => count >= policy.min_categories_presence
                );
        }
        

        if (this._valid) {
            this.helpArea.innerHTML = tr("You can use this password");
            return;
        }

        for(let bad of this._bad)
            this._addTip(false, bad);

        for(let good of this._good)
            this._addTip(true, good);
    }

    _performMandatoryCheck(check_label, requisite, check) {
        if (!requisite)
            return;

        const pass = check();
        if (!pass)
            this._bad.push(check_label);
        
        else
            this._good.push(check_label);
        
        return pass;
    }

    _performCategoryCheck(password, check_label, regex, numRequired) {
        if (numRequired < 1)
            return true;
        
        const pass = [...password.matchAll(regex)].length >= numRequired;

        if (!pass)
            this._bad.push(check_label);
        
        else
            this._good.push(check_label);
        
        return pass;
        
    }

    _addTip(isGood, content) {
        this.helpArea.innerHTML += "<i class='fa "+(isGood ? "fa-check": "fa-close ")+"'></i> " + content + "<br />";
    }
}
