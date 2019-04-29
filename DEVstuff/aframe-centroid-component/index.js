/* global AFRAME */
require("./src/meyda.min")
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Spectral Centroid A-Frame Component component for A-Frame.
 */
AFRAME.registerComponent('centroid', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
      var context = new AudioContext();

    function Audio(bufferSize){
        if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
          window.AudioContext = webkitAudioContext;
        }

        if (navigator.hasOwnProperty('webkitGetUserMedia') && !navigator.hasOwnProperty('getUserMedia')) {
          navigator.getUserMedia = webkitGetUserMedia;
          if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
            AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
          }
        }



        var song = document.getElementById('song');
        var stream = context.createMediaElementSource(song);
        stream.connect(context.destination);

        this.meyda = Meyda.createMeydaAnalyzer({
          audioContext: context,
          source: stream,
          bufferSize: bufferSize,
          windowingFunction: 'blackman'
        });

console.log(this.meyda)

       this.get =(features)=>{
          context.resume();

          return this.meyda.get(features);


        }

      //  this.initializeMicrophoneSampling();
      };


      var bufferSize = 1024;

       this.audioObject = new Audio(bufferSize);
       var initializeFFTs = function initializeFFTs(number, pointCount) {
           var ffts = [];
           for (var i = 0; i < number; i++) {
             ffts.push(Array.apply(null, Array(pointCount)).map(Number.prototype.valueOf, 0));
           }

           return ffts;
         };
         //
         // Audio.prototype.get = (features)=> {
         //   context.resume();
         //   console.log(this)
         //   return this.audioObject.meyda.get(features);
         // };

 this.ffts = initializeFFTs(20, bufferSize);


   },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {

   },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
setTimeout(()=>{
    features =    this.audioObject.get(['amplitudeSpectrum', 'spectralCentroid', 'spectralRolloff', 'loudness', 'rms', 'chroma']);
console.log(features)
this.ffts.pop();
 this.ffts.unshift(features.amplitudeSpectrum);
 var windowedSignalBuffer = this.audioObject.meyda._m.signal;
 console.log(features.spectralCentroid)
},1000);
   },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
