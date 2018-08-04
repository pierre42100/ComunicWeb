/**
 * English language
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.common.langs.en = {

    /**
     * Common
     */

    //Really really common messages
    _loading: "Loading...",
    _send: "Send",
    _choose: "Choisir",

    //Error messages
    "__fatal_error": "Fatal error",
    "__fatal_error_explanation": "A fatal error occured : <i>%p</i>. Please try to refresh the page...",


    /**
     * Components
     */

    //Menu bar - login form
    _menu_bar_login_btn: "Login",
    _menu_bar_login_passwd: "Password",
    _menu_bar_login_email: "Email address",

    //Menu bar - authenticated
    _menu_bar_search_placeholder: "Search...",
    _menu_bar_action_logout: "Logout",

    //Posts form
    _post_type_text: "Text",
    _post_type_youtube: "Youtube",
    _post_type_image: "Image",
    _post_type_movie: "Movie",
    _post_type_link: "Weblink",
    _post_type_pdf: "PDF",
    _post_type_countdown: "Timer",
    _post_type_survey: "Survey",
    
    _input_youtube_link_label: "Youtube video link",
    _no_movie_selected: "No movie selected.",
    _input_page_url_label: "Page URL",
    _input_countdown_enddate: "End date",
    _input_countdown_endtime: "End time",
    _input_survey_question_label: "Question for the survey",
    _input_survey_question_placeholder: "Question",
    _input_survey_answers_label: "Answers",
    _input_survey_answers_hint: "Type your answer and then press return (enter) key to confirm it.",

    _err_drag_image_post: "Please do not drag images directly in the message !",
    form_post_err_invalid_message: "The specified message is invalid !",
    form_post_err_no_image_selected: "Please choose an image !",
    form_post_err_invalid_youtube_link: "The specified Youtube link seems to be invalid !",
    form_post_err_no_movie_selected: "Please choose a movie !",
    form_post_err_no_pdf_selected: "Please pick a PDF !",
    form_post_err_invalid_url: "Please check the given URL !",
    form_post_err_no_end_date_selected: "Please specify a date for the countdown timer !",
    form_post_err_selected_end_date_invalid: "Specified date for the countdown timer is invalid !",
    form_post_err_no_question_for_survey: "Please specify a question for the survey !",
    form_post_err_not_enough_survey_options: "Please specify at least two options for the survey !",
    form_post_err_no_post_type_selected: "Please check you have chosen a post type !",
    form_post_err_send_new_post: "An error occured while trying to send a new post !",
    form_post_success_create_post: "The post has been successfully created !",

    //Like - Button
    like_btn_one_like: "1 like",
    like_btn_x_likes: "%p likes",
    like_btn_liking: "Liking",
    like_btn_like: "Like",


    /**
     * Pages
     */

    //Landing page
    _landing_main_caption: "Free social network that respects your privacy.",
    _landing_signup_link: "Sign up",
    _landing_signin_link: "Sign in",
    landing_page_learn_more: "Learn more",

    //Login form
    _login_page_top_msg: "Login to your Comunic account.",
    _login_page_remember_me: "Remember me",
    _login_page_email_placeholder: "Email",
    _login_page_password_placeholder: "Password",
    _login_page_submit: "Sign In",
    _login_page_error_head: "Login failed",
    _login_page_error_message: "Please check your usermail and password !",
    _login_page_bad_input: "Please check what you've typed !",
    _login_page_create_account_lnk: "Create an account",
    login_page_forgot_password: "Forgot password",

    //Create account page
    form_create_account_title: "Create an account",
    form_create_account_intro: "Use the following form to create an account and join the network : ",
    form_create_account_first_name_label: "First name",
    form_create_account_first_name_placeholder: "Your first name",
    form_create_account_last_name_label: "Last name",
    form_create_account_last_name_placeholder: "Your last name",
    form_create_account_email_address_label: "Email address <small><i class='fa fa-warning'></i> Warning! You will not be able to change this later !</small>",
    form_create_account_email_address_placeholder: "Your email address",
    form_create_account_password_label: "Password",
    form_create_account_password_placeholder: "Your password",
    form_create_account_confirm_password_label: "Confirm your password",
    form_create_account_confirm_password_placeholder: "Your password",
    form_create_account_terms_label: "I have read and accepted the <a href='%p' target='_blank'>terms of use of the network</a>",
    form_create_account_submit: "Create the account",
    form_create_account_login_with_existing: "Login with an existing account",
    form_create_account_err_need_accept_terms: "Please read and accept the terms of use of the website!",
    form_create_account_err_need_first_name: "Please check your first name !",
    form_create_account_err_check_last_name: "Please check your last name !",
    form_create_account_err_check_email_address: "Please check your email address !",
    form_create_account_err_check_password: "Please check your password !",
    form_create_account_err_passwd_differents: "The two passwords are not the same !",
    form_create_account_err_create_account_message: "An error occured while trying to create your account. It is most likely to be a server error, or the given email address is already associated with an account.",
    form_create_account_err_create_account_title: "Account creation failed",

    //Account created page
    account_created_message_title: "Congratulations!",
    account_created_message_body: "Your account has been successfully created! <br /> Login now to use all the features of Comunic!",
    account_created_message_login: "Login",

    //Latest posts page
    page_latest_posts_err_get_list_title: "Error",
    page_latest_posts_err_get_list_message: "Could not get the list of the latest posts ! Please try to refresh the page...",
    page_latest_posts_notice_no_post_title: "No post to display",
    page_latest_posts_notice_no_posts_message: "Posts from you and your friend will appear here...",

    //User page - Profile information
    user_page_profile_info_friends_link: "Friends",
    user_page_profile_info_loading: "Loading...",
    user_page_profile_info_conversation_button: "Conversation",
    user_page_profile_info_about_box_title: "About %p",
    user_page_profile_info_website: "Website",
    user_page_profile_info_note: "Note",
    user_page_profile_info_membership: "Membership",
    user_page_profile_info_member_for: "Member for %p",

    //User page - posts section
    user_page_posts_loading: "Loading posts...",
    user_page_posts_err_get_posts: "Couldn't get user posts!",
    user_page_posts_notice_no_posts_title: "No post yet",
    user_page_posts_notice_no_posts_message: "Nobody has posted a message on this page yet.",

    //User page - access forbidden page
    user_page_forbidden_err_sign_in_title: "Sign in required",
    user_page_forbidden_err_sign_in_message: "Please sign in to get access to this page.",
    user_page_forbidden_err_access_denied_title: "Access denied",
    user_page_forbidden_access_denied_message: "You don't have the right to access this page.",
    user_page_forbidden_private_account_notice: "This account is private.",
    user_page_forbidden_loading: "Loading...",

    //User page - friendship status section
    user_page_friendship_section_err_load_title: "Error",
    user_page_friendship_section_err_load_message: "Couldn't load friendship informations !",
    user_page_friendship_section_reject_request: "Reject request",
    user_page_friendship_section_accept_request: "Accept request",
    user_page_friendship_section_err_update_request_status: "Couldn't update request status !",
    user_page_friendship_section_cancel_request: "Cancel request",
    user_page_friendship_section_err_remove_request: "An error occured while trying to remove the request !",
    user_page_friendship_section_send_request: "Send request",
    user_page_friendship_section_err_send_request: "An error occured while trying to send the request !",
    user_page_friendship_section_following: "Following",
    user_page_friendship_section_follow: "Follow",
    user_page_friendship_section_err_update_following_status: "An error occured while trying to update following status !",
}