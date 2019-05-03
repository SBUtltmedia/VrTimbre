AFRAME.registerComponent('spcent2c', {
  schema: {
    propertyAssignedToSpectralCentroid: {
      type: 'string',
      default: 'color'
    },
    BaseValue: {
      type: 'int',
      default: 0
    },
    ScaleFactor: {
      type: 'int',
      default: 20
    }

  },
  init: function() {
    // Closure to access fresh `this.data` from event handler context.

  },

  update: function() {

  },
  tick: function() {
    let features = document.querySelectorAll('[meyda]')[0].components.meyda.features || {};
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    var self = this;
    function toColor(num) {
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }
    this.el.setAttribute(this.data.propertyAssignedToSpectralCentroid, toColor(features.spectralCentroid*20))
    // console.log(this.data)
    //console.log(features)

  }



});
