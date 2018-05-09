<!--
	Home landing page

	@author Pierre HUBERT
-->
<div id="homeLandingScreen">
	
	<div id="homeMessageContainer">

		<div id="homeMessage">
			<h1>Comunic</h1>

			<h3>Free social network that respect your privacy.</h3>
			<br />

			<a class="btn btn-lg btn-primary" target="create_account">Sign up</a>
			<a class="btn btn-lg btn-success" target="login">Sign in</a>
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

</style>