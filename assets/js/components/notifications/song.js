/**
 * Notification song
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.song = {

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
			this.songElem = createElem2({
				type: "audio"
			});

			createElem2({
				type: "source",
				appendTo: this.songElem,
				src: ComunicWeb.__config.assetsURL + "audio/notif_song.mp3"
			});

			createElem2({
				type: "source",
				appendTo: this.songElem,
				src: ComunicWeb.__config.assetsURL + "audio/notif_song.ogg"
			});
		}

		//Play song
		this.songElem.play();
	}
}