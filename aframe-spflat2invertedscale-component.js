AFRAME.registerComponent('spflat2invertedscale', {
  schema: {
    propertyAssigned: {
      type: 'string',
      default: 'scale'
    },
    ScaleFactor: {
      type: 'int',
      default: 100
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
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    // this.el.setAttribute("maxAge",features.spectralFlatness * 10)
    // this.el.setAttribute("maxParticleCount",features.spectralFlatness * 10)
    var myValue=(1-features.spectralFlatness) * this.data.ScaleFactor
    var myScale=`${myValue} ${myValue} ${myValue}`
    this.el.setAttribute(this.data.propertyAssigned, myScale)
    // this.el.setAttribute(this.data.propertyAssigned, ${features.spectralFlatness * this.data.ScaleFactor} ${features.spectralFlatness * this.data.ScaleFactor} ${features.spectralFlatness * this.data.ScaleFactor})
    // console.log(this.data)
    // console.log(features)

  }
});
