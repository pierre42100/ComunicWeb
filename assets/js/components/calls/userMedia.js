/**
 * User media getter
 *
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.userMedia = {

	/**
	 * Get user media
	 * 
	 * @return {Promise} A promise to get user media
	 */
	get: function(){
		
		//Use latest API
		return navigator.mediaDevices

			//Request user media
			.getUserMedia({
				audio: true,
				video: true
			})

			//Save stream
			.then(function(stream){
				ComunicWeb.components.calls.userMedia._currMedia = stream;
				return stream;
			});
	}

}