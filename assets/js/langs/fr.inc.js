/**
 * French language
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.common.langs.fr = {

    /**
     * Common
     */

    //Really really common messages
    _loading: "Chargement...",
    _send: "Envoyer",
    _choose: "Choisir",

    //Error messages
    "__fatal_error": "Erreur fatale",
    "__fatal_error_explanation": "Une erreur fatale a survenue : <i>%p</i>. Veuillez réessayer de recharger la page...",

    //Dates
    dates_s: "%p s",
    dates_min: "%p min",
    dates_h: "%p h",
    dates_one_day: "1 jour",
    dates_days: "%p jours",
    dates_one_month: "1 mois",
    dates_months: "%p mois",
    dates_one_year: "1 an",
    dates_years: "%p ans",
    dates_ago: "%p",

    //Messages
    messages_loading_layout_title: "Chargement en cours",
    messages_loading_layout_message: "Veuillez patienter pendant le chargement de cette page...",
    messages_dialog_cancel: "Annuler",
    messages_dialog_confirm_title: "Confirmer l'opération",
    messages_dialog_confirm_confirm: "Confirmer",
    messages_dialog_confirm_cancel: "Annuler",
    messages_dialog_input_string_cancel: "Annuler",
    messages_dialog_input_string_submit: "Valider",


    /**
     * Components
     */

    //Menu bar - login form
    _menu_bar_login_btn: "Connexion",
    _menu_bar_login_passwd: "Mot de passe",
    _menu_bar_login_email: "Addresse mail",

    //Menu bar - authenticated
    _menu_bar_search_placeholder: "Recherche...",
    menu_bar_action_conversations: "Conversations",
    menu_bar_action_groups: "Groupes",
    menu_bar_action_settings: "Param&egrave;tres",
    _menu_bar_action_logout: "Déconnexion",

    //Posts - Actions
    posts_actions_err_get_single: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration d'informations sur le post !",

    //Posts - Editor
    posts_edit_cancel: "Annuler",
    posts_edit_update: "Mettre &agrave; jour",
    posts_edit_err_invalid_content: "Veuillez v&eacute;rifier le contenu du post !",
    posts_edit_err_update_content: "Une erreur a survenue lors de la tentative de mise à jour du contenu du post !",
    posts_edit_success_update: "Le post a &eacute;t&eacute; mis &agrave; jour !",
    posts_edit_title: "Mettre &agrave; jour le post",

    //Posts - UI
    posts_ui_error: "Erreur",
    posts_ui_err_update_visibility: "Une erreur a survenue lors de la mise &agrave; jour du niveau de visibilit&eacute; du post !",
    posts_ui_confirm_delete: "Voulez-vous vraiment supprimer ce post ? Cette op&eacute;ration est irr&eacute;versible !",
    posts_ui_err_delete_post: "Une erreur a survenue lors de la tentative de suppresion du post !",
    posts_ui_survey_your_response: "Votre r&eacute;ponse : %p ",
    posts_ui_confirm_cancel_survey_response: "Voulez-vous vraiment annuler votre r&eacute;ponse au sondage ?",
    posts_ui_err_cancel_response_survey: "Une erreur a survenue lors de l'annulation de la r&ecaute;ponse !",
    posts_ui_send_survey_response: "Envoyer",
    posts_ui_cancel_response_survey: "Annuler",

    //Posts form
    _post_type_text: "Texte",
    _post_type_youtube: "Youtube",
    _post_type_image: "Image",
    _post_type_movie: "Vidéos",
    _post_type_link: "Lien web",
    _post_type_pdf: "PDF",
    _post_type_countdown: "Compteur à rebours",
    _post_type_survey: "Sondage",
    
    _input_youtube_link_label: "Lien de la vidéo YouTube",
    _no_movie_selected: "Aucune vidéo sélectionnée.",
    _input_page_url_label: "URL de la page",
    _input_countdown_enddate: "Date de fin",
    _input_countdown_endtime: "Heure de fin",
    _input_survey_question_label: "Question du sondage",
    _input_survey_question_placeholder: "Question",
    _input_survey_answers_label: "Réponses",
    _input_survey_answers_hint: "Saisissez vos réponses une par une. Appuyer sur entrée après avoir saisi une réponse pour la confirmer.",

    _err_drag_image_post: "Veuillez ne pas glisser d'images dans les messages !",
    form_post_err_invalid_message: "Le message saisi est invalide !",
    form_post_err_no_image_selected: "Veuillez s&eacute;lectionner une image !",
    form_post_err_invalid_youtube_link: "Le lien YouTube sp&eacute;cifi&eacute; semble invalide !",
    form_post_err_no_movie_selected: "Veuillez choisir une vid&eacute;o !",
    form_post_err_no_pdf_selected: "Veuillez s&eacute;lectionner un PDF !",
    form_post_err_invalid_url: "L'URL saisie semble invalide !",
    form_post_err_no_end_date_selected: "Veuillez choisir une date pour le compteur à rebours !",
    form_post_err_selected_end_date_invalid: "La date choisie pour le compteur à rebours est invalide !",
    form_post_err_no_question_for_survey: "Veuillez donner une question au sondage !",
    form_post_err_not_enough_survey_options: "Veuillez sp&eacute;cifier au moins deux réponses au sondage !",
    form_post_err_no_post_type_selected: "Veuillez v&eacute;rifier que vous avez choisi un type de post !",
    form_post_err_send_new_post: "Une erreur a survenue lors de la tentative de cr&eacute;ation de post!",
    form_post_success_create_post: "Le post a bien &eacute;t&eacute; cr&eacute;&eacute; !",

    //Friends - bar
    friends_bar_no_friends_notice: "Vous n'avez pas encore d'ami ! Nous ne pouvons rien vous afficher ici pour le moment... :(",
    friends_bar_accepted: "Accept&eacute;",
    friends_bar_rejected: "Refus&eacute;",

    //Like - Button
    like_btn_one_like: "1 personne aime",
    like_btn_x_likes: "%p personnes aiment",
    like_btn_liking: "<i>J'aime</i>",
    like_btn_like: "J'aime",

    //Conversations - unread dropdown
    conversations_dropdown_header: "Conversations non lues",
    conversations_dropdown_err_get_list: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration des conversations non lues !",
    conversations_dropdown_err_get_user_info: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration d'informations de certains utilisateurs !",
    conversations_dropdown_no_unread_notice: "Vous n'avez aucun message non lu dans les conversations que vous suivez...",

    //Notifications - dropdown
    notifications_dropdown_title: "Notifications",
    notifications_dropdown_delete_all_link: "Effacer tout",
    notifications_dropdown_confirm_delete_all: "Voulez-vous vraiment supprimer toutes les notifications ? L'op&eacute;ration est irr&eacute;versible !",
    notifications_dropdown_err_delete_all_notifications: "Une erreur a survenue lors de la suppression de toute les notifications !",
    notifications_dropdown_delete_all_success: "L'enti&egrave;re liste des notifications a &eacute;t&eacute; supprim&eacute;e.",
    notifications_dropdown_err_get_notifs_list: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration de la liste des notifications !",
    notifications_dropdown_err_get_related_users_info: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration d'information au sujet d'utilisateurs li&eacute;s aux notifications!",
    notifications_dropdown_err_get_related_groups_info: "Impossible de r&eacute;cup&eacute;rer des informations au sujet de groupes li&eacute;s aux notifications!",
    notifications_dropdown_no_notif_notice: "Vous n'avez pas encore de notification.",

    //Comments - Actions
    comments_actions_err_get_info_single: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration d'informations au sujet d'un commentaire !",

    //Comments - Editor
    comments_editor_err_update: "Une errreur a survenue lors de la tentative de mise &agrave; jour du commentaire !",
    comments_editor_title: "Mettre &agrave; jour le commentaire",
    comments_editor_notice: "Veuillez sp&eacute;cifier le nouveau contenu du commentaire: ",

    //Comments - UI
    comments_ui_err_get_users_info: "Impossible de r&eacute;cup&eacute; des informations au sujet de certains utilisateurs pour afficher leur commentaires!",
    comments_ui_err_get_user_info: "Impossible de récupérer des informations au sujet d'un utilisateur !",
    comments_ui_confirm_delete: "Voulez-vous vraiment supprimer ce commentaire ? L'op&eacute;ration est irr&eacute;versible!",
    comments_ui_err_delete_comment: "Une erreur a survenue lors de la tentative de suppression du commentaire !",

    //Comments - Form
    comments_form_input_placeholder: "Nouveau commentaire...",
    comments_form_send: "Envoyer",
    comments_form_err_invalid_comment: "Veuillez saisir un commentaire valid (au moins 5 caract&egrave;res)",
    comments_form_err_create_comment: "Une erreur a survenue lors de l'envoi du commentaire ! (Veuillez v&eacute;rifier son contenu)",


    /**
     * Pages
     */

    //Landing page
    _landing_main_caption: "Réseau social libre respectueux de votre vie priv&eacute;e.",
    _landing_signup_link: "Inscription",
    _landing_signin_link: "Connexion",
    landing_page_learn_more: "En savoir plus",

    //Login form
    _login_page_top_msg: "Connectez-vous à votre compte Comunic.",
    _login_page_remember_me: "Se souvenir de moi",
    _login_page_email_placeholder: "Email",
    _login_page_password_placeholder: "Mot de passe",
    _login_page_submit: "Connexion",
    _login_page_error_head: "La connexion a échouée",
    _login_page_error_message: "Veuillez vérifier votre identifiant et votre mot de passe !",
    _login_page_bad_input: "Veuillez vérifier votre saisie...",
    _login_page_create_account_lnk: "Cr&eacute;er un compte",
    login_page_forgot_password: "Mot de passe oubli&eacute;",

    //Create account page
    form_create_account_title: "Cr&eacute;er un compte",
    form_create_account_intro: "Utilisez le formulaire ci-dessous pour vous cr&eacute;er un compte et rejoindre le r&eacute;seau : ",
    form_create_account_first_name_label: "Pr&eacute;nom",
    form_create_account_first_name_placeholder: "Votre prénom",
    form_create_account_last_name_label: "Nom",
    form_create_account_last_name_placeholder: "Votre nom",
    form_create_account_email_address_label: "Adresse mail <small><i class='fa fa-warning'></i> Attention ! Vous ne pourrez pas changer cette valeur plus tard !</small>",
    form_create_account_email_address_placeholder: "Votre adresse mail",
    form_create_account_password_label: "Mot de passe",
    form_create_account_password_placeholder: "Votre mot de passe",
    form_create_account_confirm_password_label: "Confirmez votre mot de passe",
    form_create_account_confirm_password_placeholder: "Votre mot de passe",
    form_create_account_terms_label: "J'ai lu et accept&eacute; les <a href='%p' target='_blank'>conditions d'utilisation du r&eacute;seau</a>",
    form_create_account_submit: "Cr&eacute;er le compte",
    form_create_account_login_with_existing: "Connexion avec un compte existant",
    form_create_account_err_need_accept_terms: "Veuillez lire et accepter les conditions d'utilisation du site !",
    form_create_account_err_need_first_name: "Veuillez v&eacute;rifier votre pr&eacute;nom !",
    form_create_account_err_check_last_name: "Veuillez v&eacute;rifier votre nom !",
    form_create_account_err_check_email_address: "Veuillez v&eacute;rifier votre adresse mail !",
    form_create_account_err_check_password: "Veuillez v&eacute;rifier votre mot de passe !",
    form_create_account_err_passwd_differents: "Les deux mots de passe ne sont pas identiques !",
    form_create_account_err_create_account_message: "Une erreur a survenue lors de la tentative de cr&eacute;ation de compte. Ceci se produit g&eacute;n&eacute;ralement lorsque un compte associ&eacute; &agrave; cette adresse mail existe d&eacute;j&agrave;...",
    form_create_account_err_create_account_title: "La cr&eacute;ation de compte a &eacute;chou&eacute;e",

    //Account created page
    account_created_message_title: "F&eacute;liciations!",
    account_created_message_body: "Votre compte a bien &eacute;t&eacute; cr&eacute;&eacute; ! <br /> Connectez-vous maintenant pour utiliser toute les fonctionnalit&eacute;s du r&eacute;seau !",
    account_created_message_login: "Connexion",

    //Latest posts page
    page_latest_posts_err_get_list_title: "Erreur",
    page_latest_posts_err_get_list_message: "Une erreur a survenue lors de la r&eacute;cup&eacute;ration de la liste des deniers posts !",
    page_latest_posts_notice_no_post_title: "Aucun post &agrave; afficher",
    page_latest_posts_notice_no_posts_message: "Les posts venant de vous ou de vos amis appara&icirc;tront ici...",

    //User page - Profile information
    user_page_profile_info_friends_link: "Amis",
    user_page_profile_info_loading: "Chargement...",
    user_page_profile_info_conversation_button: "Conversation",
    user_page_profile_info_about_box_title: "A propos de %p",
    user_page_profile_info_website: "Site web",
    user_page_profile_info_note: "Note",
    user_page_profile_info_membership: "Inscription au site",
    user_page_profile_info_member_for: "Membre depuis %p",

    //User page - posts section
    user_page_posts_loading: "Chargement des posts de l'utilisateur...",
    user_page_posts_err_get_posts: "Impossible de r&eacute;cup&eacute;rer les posts de l'utilisateur!",
    user_page_posts_notice_no_posts_title: "Pas de post pour le moment !",
    user_page_posts_notice_no_posts_message: "Personne n'a cr&eacute;&eacute; de post sur la page de cet utilisateur pour le moment.",

    //User page - access forbidden page
    user_page_forbidden_err_sign_in_title: "Connexion requise",
    user_page_forbidden_err_sign_in_message: "Veuillez vous connecter pour acc&eacute;der &agrave; cette page...",
    user_page_forbidden_err_access_denied_title: "Acc&egrave;s refus&eacute;",
    user_page_forbidden_access_denied_message: "Vous n'avez pas le droit d'acc&eacute;der &agrave; cette page.",
    user_page_forbidden_private_account_notice: "Ce compte est priv&eacute;.",
    user_page_forbidden_loading: "Chargement...",

    //User page - friendship status section
    user_page_friendship_section_err_load_title: "Erreur",
    user_page_friendship_section_err_load_message: "Impossible de r&eacute;cup&eaucte; des informations !",
    user_page_friendship_section_reject_request: "Rejeter la demande",
    user_page_friendship_section_accept_request: "Accepter la demande",
    user_page_friendship_section_err_update_request_status: "Impossible de mettre &agrave; jour la demande !",
    user_page_friendship_section_cancel_request: "Annuler la demande",
    user_page_friendship_section_err_remove_request: "Une erreur a survenue lors de la tentative d'annulation de demande!",
    user_page_friendship_section_send_request: "Demander en ami",
    user_page_friendship_section_err_send_request: "Une erreur a survenue lors de l'envoi de la demande d'ami !",
    user_page_friendship_section_following: "Ne plus suivre",
    user_page_friendship_section_follow: "Suivre",
    user_page_friendship_section_err_update_following_status: "Une erreur a survenue lors de la mise &agrave; jour du status de suivi de cet ami !",

}