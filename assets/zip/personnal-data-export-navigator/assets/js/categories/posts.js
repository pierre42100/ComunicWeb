/**
 * Posts category
 * 
 * @author Pierre HUBERT
 */

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
			innerHTML: removeHtmlTags(post.content)
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

		//Post with weblink
		if(post.kind == "weblink"){

			let linkCard = createElem2({
				appendTo: cardContent,
				type: "div",
				class: "card blue-text"
			});

			let linkCardImage = createElem2({
				appendTo: linkCard,
				type: "div",
				class: "card-image"
			});

			//Image
			createElem2({
				appendTo: linkCardImage,
				type: "img",
				src: post.link_image
			});

			//Title
			createElem2({
				appendTo: linkCardImage,
				type: "span",
				class: "card-title",
				innerHTML: post.link_title
			});

			createElem2({
				appendTo: linkCard,
				type: "div",
				class: "card-content",
				innerHTML: "<p>"+post.link_description+"</p>"
			});

			let linkCardActions = createElem2({
				appendTo: linkCard,
				type: "div",
				class: "card-action"
			});

			createElem2({
				appendTo: linkCardActions,
				type: "a",
				href: post.link_url,
				innerHTML: post.link_url
			})
		}


		//Post with PDF
		if(post.kind == "pdf"){

			createElem2({
				appendTo: cardContent,
				type: "a",
				class: "waves-effect waves-light btn-large post-btn-pdf",
				innerHTML: '<i class="material-icons left">picture_as_pdf</i> PDF',
				href: getFilePathFromURL(post.file_path_url)
			});

		}


		//Post with countdown timer
		if(post.kind == "countdown"){

			createElem2({
				appendTo: cardContent,
				type: "p",
				class: "post-end-countdown",
				innerHTML: "Countdown terminates on: " + timeToStr(post.time_end)
			});

		}

		//Post with survey
		if(post.kind == "survey"){

			let infoSurvey = post.data_survey;

			let surveyContainer = createElem2({
				appendTo: cardContent,
				type: "div",
				class: "post-survey card blue"
			});

			//Survey content
			let surveyContent = createElem2({
				appendTo: surveyContainer,
				type: "div",
				class: "card-content"
			});

			//Survey title
			createElem2({
				appendTo: surveyContent,
				type: "h2",
				class: "survey-title",
				innerHTML: infoSurvey.question
			});

			//User choice (if any)
			if(infoSurvey.user_choice > 0){

				createElem2({
					appendTo: surveyContent,
					type: "p",
					innerHTML: "Your choice : " + infoSurvey.choices[infoSurvey.user_choice].name
				});

			}

			//Survey choices
			let surveyChoicesTable = createElem2({
				appendTo: surveyContainer,
				type: "table",
				class: "survey-choices-table"
			});

			//Table header
			createElem2({
				appendTo: surveyChoicesTable,
				type: "thead",
				innerHTML: "<tr><th>Choice</th><th>Responses</th></tr>"
			});

			//Table body
			let surveyTableBody = createElem2({
				appendTo: surveyChoicesTable,
				type: "tbody"
			});

			for (const key in infoSurvey.choices) {
				if (!infoSurvey.choices.hasOwnProperty(key))
					continue;
				const choice = infoSurvey.choices[key];

				//Add choice
				createElem2({
					appendTo: surveyTableBody,
					type: "tr",
					innerHTML: "<td>" + choice.name + "</td><td>" + choice.responses + "</td>"
				});
			}
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