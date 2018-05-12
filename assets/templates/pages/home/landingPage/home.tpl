<!--
	Home landing page

	@author Pierre HUBERT
-->
<div id="homeLandingScreen">
	
	<div id="homeMessageContainer">

		<div id="homeMessage">
			<h1>Comunic</h1>

			<h3>[[_landing_main_caption]]</h3>

			<a class="btn btn-lg btn-primary" target="create_account">[[_landing_signup_link]]</a>
			<a class="btn btn-lg btn-success" href="{about_url}">Learn more</a>

		</div>
	</div>

</div>

<!-- Page styles -->
<style type="text/css">

	#homeLandingScreen{
		background-image: url("{backgroundImage}");
		background-position: 0% 50%;
		width: 100%;
		height: 100%;
		position: fixed;
		text-align: center;
		padding: 10px;
		display: table;
		top: 0;
	}

	#homeMessageContainer {
		display: table-cell;
		vertical-align: middle;
	}

	#homeMessage {
		background-color: rgba(244, 244, 244, 0.38);
		max-width: 400px;
		padding: 30px;
		margin: auto;
		border-radius: 5px;
	}

	#homeMessage .learn_more a {
		color: black;
		font-size: 110%;
	}

</style>