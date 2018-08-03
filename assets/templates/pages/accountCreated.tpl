<!-- 
	Account created template

	@author Pierre HUBERT
-->

<!-- Page style updated -->
<style>
	.content-wrapper {
		background-image: url({background_img_url});
		background-position: 10% 50%;
	}

	.page_account_created {
		display: table;
		padding-top: 20px;
		width: 100%;
	}

	.message_container {
		display: table-cell;
		vertical-align: middle;
	}

	.message {
		background-color: #fff9;
		max-width: 500px;
		margin: auto;
		text-align: center;
		padding: 20px;
	}
</style>

<!-- Page content -->
<div class="page_account_created">
	<div class="message_container">

		<div class="message">
			<h1>[[account_created_message_title]]</h1>
			<br />
			<h4>[[account_created_message_body]]</h4>
			<br />
			<a target="login" class="btn btn-primary btn-lg">[[account_created_message_login]]</a>
		</div>

	</div>
</div>