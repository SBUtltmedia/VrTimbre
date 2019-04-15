/*
An A-Frame component that uses an audio analyser component connected to an audio source to create audio-reactive elements arranged in a matrix that represent binned audio frequency levels over time (bins x time)
*/
AFRAME.registerComponent('spectrogram', {
    schema: {
      // The number of bins in which to divide the frequency spectrum (i.e., the number of rows of shapes)
      bins: {type: 'int', default: 8},
      // The number of times to draw a frequency spectrum sample (i.e., the number of columns of shapes)
      samples: {type: 'int', default: 8},
      // Three values representing the size scale factor in the x,y,z axes
      sizeScale: {type: 'vec3'},
      // Three values representing the position scale factor in the x,y,z axes
      positionScale: {type: 'vec3'},
      // The amount of space between bins (i.e., shapes along a row)
      binSpacing: {type: 'float', default: 0},
      // The amount of space between samples (i.e., shapes along a column)
      sampleSpacing: {type: 'float', default: 0},
      // The axis along which the bins are arranged
      binAlong: {type: 'string', default: 'x-axis'},
      // The axis along which the samples are arranged
      sampleAlong: {type: 'string', default: 'z-axis'},
      // Only affect x scaling in one direction
      offsetX: {type: 'boolean'},
      // Only affect y scaling in one direction
      offsetY: {type: 'boolean'},
      // Only affect z scaling in one direction
      offsetZ: {type: 'boolean'},
      // How the frequency values are scaled to determine average bin frequency
      frequencyScale: {type: 'string', default: 'log'},
      // The type of shape to draw
      shape: {type: 'string', default: 'box'},
      // The color of the shape
      color: {type: 'string', default: 'grey'}
    },
    init: function () {
      // Create empty array that will hold samples at time 'x'
      this.sampleT = []

      // Clone the initial values of the element's scale and position
      this.initialScale = this.el.object3D.scale.clone()
      this.initialPos = this.el.object3D.position.clone()
      this.childrenInitialPos = []

      // Set up the positioning scheme as a line along an axis using the
      // scale factor of the 'binAlong' axis
      const xMultiplier = this.data.binAlong === 'x-axis' ?
        this.initialScale.x + this.data.binSpacing : 0
      const yMultiplier = this.data.binAlong === 'y-axis' ?
        this.initialScale.y + this.data.binSpacing : 0
      const zMultiplier = this.data.binAlong === 'z-axis' ?
        this.initialScale.z + this.data.binSpacing : 0

      // Set up the positioning scheme as a line along an axis using the
      // scale factor of the 'sampleAlong' axis
      const xMultiplier2 = this.data.sampleAlong === 'x-axis' ?
        this.initialScale.x + this.data.sampleSpacing : 0
      const yMultiplier2 = this.data.sampleAlong === 'y-axis' ?
        this.initialScale.y + this.data.sampleSpacing : 0
      const zMultiplier2 = this.data.sampleAlong === 'z-axis' ?
        this.initialScale.z + this.data.sampleSpacing : 0

      // Function that returns a one object array containing the x, y, z
      // posiiton of each child element
      const setChildPosition = (band, sample) => [{
        x: this.initialPos.x + band * xMultiplier +
          sample * xMultiplier2,
        y: this.initialPos.y + band * yMultiplier +
          sample * yMultiplier2,
        z: this.initialPos.z + band * zMultiplier +
          sample * zMultiplier2
      }
      ]

      // Create a child entity for each band and set some parameters
      for (let j = 0; j < this.data.samples; j++) {
        for (let i = 0; i < this.data.bins; i++) {
          const childEntity = document.createElement('a-entity')
          this.el.appendChild(childEntity)
          childEntity.setAttribute('geometry', { primitive: this.data.shape })
          childEntity.setAttribute('material', { color: this.data.color })
          childEntity.setAttribute('position', ...setChildPosition(i, j))
          this.childrenInitialPos.push(...setChildPosition(i, j))
        }
      }
    },
    tick: function () {
      const audioAnalyser = this.el.components.audioanalyser
      if (!audioAnalyser) return console.error(`No audio analyser component connected to element with id=${this.el.id}`);

      // Get average levels of bins
      const levels = audioAnalyser.levels
      let levelsSum = 0;
      let numFrequencies = 0;
      let bandMax = 0;
      const bandedLevels = [];
      // Default to log scale if linear isn't explicitly declared
      if (this.data.frequencyScale === 'linear') {
        // Determine the bandwidth based on the levels sample size and number
        // of bins
        const bandWidth = Math.floor(levels.length / this.data.bins)
        calculateLinearAverageBins(bandWidth)
      } else {
        const logBandWidth = this.data.bins + 1 / Math.log10(levels.length)
        calculateLogAverageBins(logBandWidth)
      }
      // Add frequency bins to time sample array
      if (this.sampleT.length === this.data.samples) { this.sampleT.pop() }
      this.sampleT.unshift(bandedLevels)

      // Function that determines the average levels within a specified
      // bandwidth over a linear scale of frequency levels and pushes to an
      // array of length this.data.bins
      function calculateLinearAverageBins(bandWidth) {
        for (let i = 0; i < levels.length; i++) {
          levelsSum += levels[i]
          numFrequencies++

          if ((i + 1) % bandWidth === 0) {
            bandedLevels.push(levelsSum / numFrequencies / 255)
            levelsSum = 0
            numFrequencies = 0
          }
        }
      }

      // Function that determines the average levels within a specified
      // bandwidth over a log10 scale of frequency levels and pushes to an
      // array of length this.data.bins
      function calculateLogAverageBins(bandWidth) {
        for (let i = 0; i < levels.length; i++) {
          levelsSum += levels[i]
          numFrequencies++

          if (Math.floor(Math.log10(i + 1) * bandWidth) > bandMax) {
            bandedLevels.push(levelsSum / numFrequencies / 255)
            levelsSum = 0
            numFrequencies = 0
            bandMax = Math.floor(Math.log10(i + 1) * bandWidth)
          }
        }
      }

      // Set the scale values of each child based on the average volume of each
      // band and scale factor
      const children = this.el.children
      for (let j = 0; j < this.sampleT.length; j++) {
        for (let i = 0; i < this.data.bins; i++) {
          const child =  children[i + j * this.data.bins].object3D
          const k = i + j * this.data.bins

          child.scale.x = this.initialScale.x *
            (1 + this.data.sizeScale.x * this.sampleT[j][i])
          child.scale.y = this.initialScale.y *
            (1 + this.data.sizeScale.y * this.sampleT[j][i])
          child.scale.z = this.initialScale.z *
            (1 + this.data.sizeScale.z * this.sampleT[j][i])

          child.position.x = this.childrenInitialPos[k].x + (1 + this.data.positionScale.x * this.sampleT[j][i])
          child.position.y = this.childrenInitialPos[k].y + (1 + this.data.positionScale.y * this.sampleT[j][i])
          child.position.z = this.childrenInitialPos[k].z + (1 + this.data.positionScale.z * this.sampleT[j][i])

          // Set positive offset of element along axis if specified
          if (this.data.offsetX)
            { child.position.x = this.initialPos.x + child.scale.x / 2 }
          if (this.data.offsetY)
            { child.position.y = this.initialPos.y + child.scale.y / 2 }
          if (this.data.offsetZ)
            { child.position.z = this.initialPos.z + child.scale.z / 2 }
        }
      }
    }
})
