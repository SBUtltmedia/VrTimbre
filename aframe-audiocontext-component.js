AFRAME.registerComponent('audiocontext', {
  schema: {
    source: {
      type: 'string',
      default: 'song'
    }

  },
  init: function() {
console.log("init")
	if (window.AudioContext !== undefined) {
		this.context = new AudioContext();

  }else{
		if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
			window.AudioContext = webkitAudioContext;
		}

		if (navigator.hasOwnProperty('webkitGetUserMedia') && !navigator.hasOwnProperty('getUserMedia')) {
			navigator.getUserMedia = webkitGetUserMedia;
			if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
				AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
			}
		}




  }		this.source = document.getElementById(this.data.source);
  		this.stream = this.context.createMediaElementSource(this.source);
  		this.stream.connect(this.context.destination);
  		this.el.emit("contextReady")
      console.log("emit")
},

  update: function() {

  },
  tick: function() {

    //console.log(features)

  }
});
