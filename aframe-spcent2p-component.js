AFRAME.registerComponent('spcent2p', {
  schema: {
    propertyAssignedToSpectralCentroid: {
      type: 'string',
      default: 'radius'
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
    var self = this;
  },

  update: function() {

  },
  tick: function() {
    let features = document.querySelectorAll('[meyda]')[0].components.meyda.features || {};
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    this.el.setAttribute(this.data.propertyAssignedToSpectralCentroid, features.spectralCentroid / 20)
    console.log(this.data)
    //console.log(features)

  }
});
