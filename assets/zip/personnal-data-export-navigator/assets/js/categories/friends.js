/**
 * Friends category
 * 
 * @author Pierre HUBERT
 */

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