AFRAME.registerComponent('audiocontext', {
  schema: {
    source: {
      type: 'string',
      default: 'song'
    }

  },
  init: function() {

	if (window.AudioContext !== undefined) {
		this.context = new AudioContext();
		else{
		if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
			window.AudioContext = webkitAudioContext;
		}

		if (navigator.hasOwnProperty('webkitGetUserMedia') && !navigator.hasOwnProperty('getUserMedia')) {
			navigator.getUserMedia = webkitGetUserMedia;
			if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
				AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
			}
		}



		var song = document.getElementById(this.data.source);
		var stream = this.context.createMediaElementSource(song);
		stream.connect(this.context.destination);
		emit("contextReady")
  }
},

  update: function() {

  },
  tick: function() {

    //console.log(features)

  }
});
