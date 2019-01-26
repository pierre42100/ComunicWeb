/**
 * Song player
 * 
 * @author Pierre HUBERT
 */

class SongPlayer {

	/**
	 * Initialize a new SongPlayer instance
	 * 
	 * @param {String[]} sources The list of sources to exploit for the song
	 */
	constructor(sources){

		this.songElem = document.createElement("audio");

		//Process the list of sources
		for (var index = 0; index < sources.length; index++) {
			var url = sources[index];
			
			var source = document.createElement("source");
			source.src = url;
			this.songElem.appendChild(source);
		}
	}

	/**
	 * Play audio just once
	 */
	playOnce(){
		this.songElem.loop = false;
		this.songElem.play();
	}

	/**
	 * Play song forever
	 */
	playForever(){
		this.songElem.loop = true;
		this.songElem.play();
	}

	/**
	 * Stop song
	 */
	stop(){
		this.songElem.pause();
		this.songElem.currentTime = 0;
	}
}