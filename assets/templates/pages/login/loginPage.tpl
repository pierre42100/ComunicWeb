<!-- Login form -->
<div class="login-box">
	<div class="login-logo">
		<a target="home"><b>Comunic</b></a>
	</div>
	<div class="login-box-body">

		<!-- Login message -->
		<p class="login-box-msg">{login_top_msg}</p>

		<!-- Optionnal messages target -->
		<div id="loginMessagesTarget"></div>

		<form id="loginForm" action="javascript:(function(){})();">
			<div class="form-group has-feedback">
				<input type="email" class="form-control" placeholder="{email}" id="usermail" />
				<span class="glyphicon glyphicon-envelope form-control-feedback"></span>
			</div>
			<div class="form-group has-feedback">
				<input type="password" class="form-control" placeholder="{password}" id="userpassword" />
				<span class="glyphicon glyphicon-lock form-control-feedback"></span>
			</div>
			<div class="row">
				<div class="col-xs-8">
					<div class="checkbox icheck">
						<label>
							<input type="checkbox" id="rememberLogin" checked /> {_login_page_remember_me}
						</label>
					</div>
				</div>
				<!-- /.col -->

				<!-- Submit button -->
				<div class="col-xs-4">
					<button type="submit" class="btn btn-primary btn-block btn-flat btn-login">{sign_in}</button>
				</div>

				<!-- /.col -->
			</div>
		</form>

		<!-- Password forgotten -->
		<a target="forgot_password">Forgot password</a><br />

		<!-- Create an account -->
		<a target="create_account">{create_account}</a>
		
	</div>
	<!-- /.login-box-body -->
</div>
