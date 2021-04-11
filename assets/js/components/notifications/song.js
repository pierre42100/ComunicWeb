/**
 * Notification song
 * 
 * @author Pierre HUBERT
 */

const NotificationsSong = {

	/**
	 * Song element : null by default
	 */
	songElem: null,

	/**
	 * Play notification song once
	 */
	play: function(){
		
		//Create song element if required
		if(this.songElem == null){
			this.songElem = new SongPlayer([
				ComunicWeb.__config.assetsURL + "audio/notif_song.mp3",
				ComunicWeb.__config.assetsURL + "audio/notif_song.ogg"
			]);
		}

		//Play song
		this.songElem.playOnce();
	}
}