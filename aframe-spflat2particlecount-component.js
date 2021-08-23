AFRAME.registerComponent('spflat2particlecount', {
  schema: {
    propertyAssignedToSpectralCentroid: {
      type: 'string',
      default: 'particleCount'
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
    // this.features = document.querySelectorAll('[meyda]')[0].components.meyda.features || {};
  },

  update: function() {

  },
  tick: function() {
    let features = document.querySelectorAll('[meyda]')[0].components.meyda.features || {};

      // console.log(features.spectralFlatness);
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    // this.el.setAttribute("radius",features.spectralCentroid/20)
    // this.el.setAttribute("maxAge",features.spectralFlatness * 10)
    // this.el.setAttribute("maxParticleCount",features.spectralFlatness * 10)
    // this.el.setAttribute(this.data.propertyAssignedToSpectralCentroid, features.spectralFlatness * 10000)
    if (Math.random() > .9) {
      // console.log(features.spectralFlatness);
      // console.log(this.features.spectralFlatness);
      this.el.setAttribute('particle-system', {
        particleCount: features.spectralFlatness * 100000
        // preset: snow;
        // particleCount: this.features.spectralFlatness * 100000
      });
    }


  }
});


// console.log(this.data)
// console.log(features)
//
//   }
// });
