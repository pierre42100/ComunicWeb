/**
 * Data export visualization navigator
 *
 * @author Pierre HUBERT
 */

/**
 * This object will contains all the exported data
 * once it will have been decoded by the JSON parser
 * of the browser
 */
var data;

/**
 * Refresh tabs visibility accordingly to the hash of
 * the current URL
 */
function RefreshTabsVisibility(){

	var hash = location.href.toString().split("#")[1];

	if(!hash)
		return;

	document.querySelectorAll(".category").forEach(el => {

		el.style.display = el.id === hash ? "block" : "none";

	});

	document.querySelectorAll(".sidenav .bold").forEach(el => {

		let isActive = el.querySelector("a").href.includes("#" + hash);

		if(isActive && !el.className.includes(" active"))
			el.className += " active";

		if(!isActive && el.className.includes(" active"))
			el.className = el.className.replace(" active", "");

	});

}

/**
 * Apply user information
 */
function ApplyUserInfo() {

	let userInfo = data.advanced_info;
	setInnerHTMLById("u-uid", userInfo.userID);
	setInnerHTMLById("u-firstname", userInfo.firstName);
	setInnerHTMLById("u-lastname", userInfo.lastName);
	setBoolInnerHTMLById("u-pagepublic", userInfo.publicPage);
	setBoolInnerHTMLById("u-pageopen", userInfo.openPage);
	setInnerHTMLById("u-virtualdirectory", userInfo.virtualDirectory);
	applyUserAccountImage(byId("u-accountimage"), userInfo);
	setBoolInnerHTMLById("u-publicfriendslist", userInfo.friend_list_public);
	setInnerHTMLById("u-personnalwebsite", userInfo.personnalWebsite);
	setInnerHTMLById("u-publicnote", userInfo.publicNote);
	setBoolInnerHTMLById("u-commentsforbidden", userInfo.noCommentOnHisPage);
	setBoolInnerHTMLById("u-allowpostsfromfriends", userInfo.allowPostFromFriendOnHisPage);
	setInnerHTMLById("u-accountcreationtime", timeToStr(userInfo.account_creation_time));
	applyURLToImage(byId("u-bgimage"), userInfo.backgroundImage);
	setInnerHTMLById("u-pagelikes", timeToStr(userInfo.pageLikes));
}


/**
 * Apply friends list
 */
function ApplyFriendsList(){

	let target = document.querySelector("#friends-list-table tbody");

	data.friends_list.forEach(friend => {

		let friendInfo = getUserInfo(friend.ID_friend);

		let friendTR = createElem2({
			appendTo: target,
			type: "tr"
		});

		let friendName = createElem2({
			appendTo: friendTR,
			type: "td"
		});

		let friendAccoutImage = createElem2({
			appendTo: friendName,
			type: "img"
		});
		applyUserAccountImage(friendAccoutImage, friendInfo)

		friendName.innerHTML += friendInfo.full_name;

		let friendAccepted = createElem2({
			appendTo: friendTR,
			type: "td",
			innerHTML: friend.accepted ? "Yes" : "Not yet"
		});

		let friendLastActive = createElem2({
			appendTo: friendTR,
			type: "td",
			innerHTML: timeToStr(friend.time_last_activity)
		});
	});
}

/**
 * Apply the list of posts
 */
function ApplyPosts(){

	let target = byId("posts-target");

	data.posts.forEach(post => {

		let userInfo = getUserInfo(post.userID);

		let card = createElem2({
			appendTo: target,
			type: "div",
			class: "post card blue-grey darken-1"
		});

		let cardContent = createElem2({
			appendTo: card,
			type: "div",
			class: "card-content white-text"
		});

		let userInfoEl = createElem2({
			appendTo: cardContent,
			type: "div",
			class: "user-info-container"
		});

		let userImage = createElem2({
			appendTo: userInfoEl,
			type: "img"
		});
		applyUserAccountImage(userImage, userInfo);

		userInfoEl.innerHTML += userInfo.full_name;


		//Check if the post was target another page than the user page
		if(post.user_page_id != 0 && post.user_page_id != post.userID){

			userInfoEl.innerHTML += " &gt; ";
			let targetUserInfo = getUserInfo(post.user_page_id);

			let targetUserImage = createElem2({
				appendTo: userInfoEl,
				type: "img"
			});

			applyUserAccountImage(targetUserImage, targetUserInfo);

			userInfoEl.innerHTML += targetUserInfo.full_name;
		}

		//Check if the post was targeting a group
		if(post.group_id > 0){
			userInfoEl.innerHTML += " &gt; ";

			userInfoEl.innerHTML += "Group " + post.group_id;
		}

		//Post metadata
		let postMetadata = createElem2({
			appendTo: cardContent,
			type: "div",
			class: "post-metadata"
		});

		let addMetadata = function(content){
			createElem2({
				appendTo: postMetadata,
				type: "p",
				class: "post-date",
				innerHTML: content
			});
		}

		//Post time
		addMetadata(timeToStr(post.post_time));

		//Post visibility
		addMetadata("Visibility: " + post.visibility_level);

		//Post type
		addMetadata("Kind of post: " + post.kind);

		//Likes
		addMetadata("Number of likes: " + post.likes);
		addMetadata("Does user like this post: " + (post.userlike ? "Yes" : "No"));

		//Files info
		if(post.file_size != null) addMetadata("File size: " + post.file_size);
		if(post.file_type != null) addMetadata("File type: " + post.file_type);
		if(post.file_path != null) addMetadata("File path: " + post.file_path);
		if(post.file_path_url != null) addMetadata("File path as URL: " + post.file_path_url);


		//Post content
		createElem2({
			appendTo: cardContent,
			type: "div",
			class: "post-content",
			innerHTML: post.content
		});


		//Process different kind of posts
		//Post with image
		if(post.kind == "image") {

			var image = createElem2({
				appendTo: cardContent,
				type: "img"
			});

			applyURLToImage(image, post.file_path_url);

		}

		//Post with YouTube video
		if(post.kind == "youtube"){

			let youtube_link = "https://www.youtube.com/watch?v=" + post.file_path;

			createElem2({
				appendTo: cardContent,
				type: "p",
				innerHTML: "Target Video : <a href='" + youtube_link + "' target='_blank'>" + youtube_link + "</a>"
			});

		}


		//Display the list of comments
		let postComments = createElem2({
			appendTo: cardContent,
			type: "div",
			class: "post-comments",
			innerHTML: "Comments"
		});
		post.comments.forEach(comment => {

			//Create comment container
			let commentContainer = createElem2({
				appendTo: postComments,
				type: "div",
				class: "comment"
			});

			let commentCreator = createElem2({
				appendTo: commentContainer,
				type: "div",
				class: "comment-author"
			});

			fillElWithUserInfo(commentCreator, comment.userID);

			let commentContent = createElem2({
				appendTo: commentContainer,
				type: "div",
				innerHTML: comment.content
			});


			//Add comment image (if any)
			if(comment.img_url != null){

				let img = createElem2({
					appendTo: commentContainer,
					type: "img",
					class: "comment-image"
				});

				applyURLToImage(img, comment.img_url);

			}


			let commentMetadata = createElem2({
				appendTo: commentContainer,
				type: "div",
				class: "comment-metadata"
			});

			let addCommentMetadata = function(content){
				createElem2({
					appendTo: commentMetadata,
					type: "div",
					innerHTML: content
				});
			};

			addCommentMetadata(timeToStr(comment.time_sent));
			addCommentMetadata("Likes: " + comment.likes);
			addCommentMetadata("User like: " + (comment.userlike ? "Yes" : "No"));
		})
	});

}


/**
 * Automatically switch the tab when it
 * is required by the user
 */
window.addEventListener("hashchange", RefreshTabsVisibility);


//Page initialization
RefreshTabsVisibility();

/**
 * Get the content of the source file
 */
let xhr = new XMLHttpRequest();
xhr.open("GET", SOURCE_URL);

xhr.onload = function(){

	if(xhr.status != 200)
		return error("Could not access " + SOURCE_URL + " !");

	//Parse data
	try {
		data = JSON.parse(xhr.response);
	}
	catch(e){
		return error("Could not parse " + SOURCE_URL + " !");
	}

	//Now we can apply specific process for each data block
	ApplyUserInfo();
	ApplyFriendsList();
	ApplyPosts();
}

xhr.send(null);