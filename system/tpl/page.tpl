<!--
    Comunic web app client
    Main HTML file

    (c) Pierre HUBERT 2017-2018
-->
<!DOCTYPE html>
<html>
    <head>
        <!-- Page title, should be automaticaly modified next -->
        <title>Comunic</title>

        <!-- Make the website responsive -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

        <!-- UTF-8 support -->
        <meta charset="utf-8">

        <!-- Favicons -->
        <link rel="icon" type="image/vnd.microsoft.icon" href="{ASSETS_URL}img/favicon.png" />
        <link rel="shortcut icon" type="image/x-icon" href="{ASSETS_URL}img/favicon.png" />

        <!-- Open Graph content -->
        <meta property="og:title" content="Comunic"/>
        <meta property ="og:description" content="A free social network that respect your privacy."/>
        <meta property="og:image" content="{ASSETS_URL}img/favicon.png"/>

        <!--3rdPary Stylesheet requirements -->
        {THIRD_PARTY_CSS}

        <!--App Stylesheet requirements -->
        {APP_CSS}

        <!-- Javascript config -->
        {js_config}
        
    </head>
    <body>
        <!-- Welcome message -->
        <style type="text/css">
            body {
                background-color: #001F3F;
                color: white;
            }

            .notice {
                text-align: center;
                font-size: 150%;
                padding-top: 10%;
                max-width: 300px;
                margin: auto;
            }
        </style>
        <div class="notice">
            Welcome !<br />
            Bienvenue !<br /><br />

            Please wait while Comunic is starting...<br />
            Veuillez patienter pendant le d&eacute;marrage de Comunic...<br /><br />
        
        
            <p><small>If this screen doesn't disappear after a while, please check javascript is enabled in your browser...</small></p>
        </div>
    
        <!-- 3rdparty Javascript files inclusion -->
        {THIRD_PARTY_JS}

        <!-- Application Javascript files inclusion -->
        {APP_JS}

    </body>
</html>