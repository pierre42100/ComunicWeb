/**
 * Differents pages listing
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.pagesList = {

    /**
     * Home page
     */
    home: {
        pageTitle: "Comunic",
        methodHandler: "ComunicWeb.pages.home.home.openHomePage",
        disableMenus: false,
    },

    /**
     * User profile page
     */
    user: {
        pageTitle: "User Page",
        methodHandler: "ComunicWeb.pages.userPage.main.open",
        disableMenus: false,
    },

    /**
     * Single post page
     */
    post: {
        pageTitle: "Post",
        methodHandler: "ComunicWeb.pages.postPage.main.open",
        disableMenus: false
    },

    /**
     * Latest post
     */
    latest: {
        pageTitle: "Latest",
        methodHandler: "ComunicWeb.pages.latestPosts.main.open",
        disableMenus: false
    },

    /**
     * Conversations page
     */
    conversations: {
        pageTitle: "Conversations",
        methodHandler: "ComunicWeb.pages.conversations.main.open",
        disableMenus: false,
        needLogin: true
    },

    /**
     * User settings page
     */
    settings: {
        pageTitle: "Settings",
        methodHandler: "ComunicWeb.pages.settings.main.open",
        disableMenus: false
    },

    /**
     * Login page
     */
    login: {
        pageTitle: "Login page",
        methodHandler: "ComunicWeb.pages.login.openLoginPage",
        disableMenus: true,
    },

    /**
     * Create account page
     */
    create_account: {
        pageTitle: "Create an account",
        methodHandler: "ComunicWeb.pages.createAccount.openPage",
        disableMenus: false
    },

    /**
     * Account created page
     */
    account_created: {
        pageTitle: "Account created",
        methodHandler: "ComunicWeb.pages.accountCreated.open",
        disableMenus: false,
    },

    /**
     * Logout page
     */
    logout: {
        pageTitle: "Logout",
        methodHandler: "ComunicWeb.pages.logout.openLogoutPage",
        disableMenus: true,
    },

    /**
     * Password forgotten page
     */
    forgot_password: {
        pageTitle: "Password forgotten",
        methodHandler: "ComunicWeb.pages.passwordForgotten.main.open",
        disableMenus: false,
    },

    /**
     * 404 Page not found
     */
    notFound: {
        pageTitle: "404 page not found",
        methodHandler: "ComunicWeb.common.error.pageNotFound",
    }

};