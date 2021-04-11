/**
 * Notification song
 * 
 * @author Pierre HUBERT
 */

const NotificationsSong = {

	/**
	 * Song element : null by default
	 * 
	 * @type {HTMLAudioElement}
	 */
	songElem: null,

	/**
	 * Check whether notifications song is enabled or not
	 */
	enableSong: false,

	/**
	 * Play notification song once
	 */
	play: function(){
		
		if (!NotificationsSong.enableSong)
			return;

		//Create song element if required
		if(NotificationsSong.songElem == null){
			NotificationsSong.songElem = new SongPlayer([
				ComunicWeb.__config.assetsURL + "audio/notif_song.mp3",
				ComunicWeb.__config.assetsURL + "audio/notif_song.ogg"
			]);
		}

		//Play song
		NotificationsSong.songElem.playOnce();
	}
}

// Get notification settings as soon as the page is loaded
document.addEventListener("wsOpen", async () => {
	try {
		const settings = await SettingsInterface.getNotifications();
		NotificationsSong.enableSong = settings.allow_notifications_sound;
	} catch(e) {
		console.error(e);
	}
})