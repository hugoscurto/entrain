import * as soundworks from 'soundworks/client';
import { decibelToLinear, centToLinear } from 'soundworks/utils/math';
import Placer from './Placer';
import colorConfig from '../../../shared/color-config';
import aColorConfig from '../../../shared/acolor-config';
import tuna from 'tunajs';
const client = soundworks.client;
const audioContext = soundworks.audioContext;
const audioScheduler = soundworks.audio.getScheduler();
const playerColors = aColorConfig.players;

function radToDegrees(radians) {
  return radians * 180 / Math.PI;
}

class Renderer extends soundworks.Canvas2dRenderer {
  constructor(states, circleRadius, buttonRadius, color) {
    super(0);

    this.states = states;
    this.circleRadius = circleRadius;
    this.buttonRadius = buttonRadius;
    this.highlight = undefined;
    this.color = 'rgb(' + color + ')';
    this.acolor = 'rgba(' + color + ', .5)';

    this.AICanvas = 0;
  }

  init() {
    const circleRadius = this.circleRadius;

    this.positionXArr = [];
    this.positionYArr = [];

    for (let i = 0; i < this.states.length; i++) {
      const x = circleRadius * Math.cos(Math.PI / 2 - (i * (Math.PI / 8)));
      const y = circleRadius * Math.sin(Math.PI / 2 - (i * (Math.PI / 8)));
      this.positionXArr.push(x);
      this.positionYArr.push(y);
    }
  }

  update(dt) {

  }

  render(ctx) {
    ctx.save();

    const buttonRadius = this.buttonRadius;
    const states = this.states;
    const numSteps = states.length;
    const x0 = this.canvasWidth / 2;
    const y0 = this.canvasHeight / 2;

    if (this.AICanvas === 1) {
      ctx.fillStyle = this.acolor;
      ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < numSteps; i++) {
      const state = states[i];
      let internalCircle = buttonRadius;

      switch (state) {
        case 0:
          if (i === this.highlight) {
            ctx.fillStyle = '#606060';
          } else {
            ctx.fillStyle = '#000000';
          }
          break;

        case 1:
          if (i === this.highlight) {
            ctx.fillStyle = '#FFFFFF';
          } else {
            ctx.fillStyle = this.color;
            internalCircle = buttonRadius / 2;
          }
          break;

        case 2:
          if (i === this.highlight) {
            ctx.fillStyle = '#FFFFFF';
          } else {
            ctx.fillStyle = this.color;
          }
          break;
      }

      ctx.beginPath();
      ctx.ellipse(x0 + this.positionXArr[i], y0 - this.positionYArr[i], internalCircle, internalCircle, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ffffff";

      ctx.beginPath();
      ctx.ellipse(x0 + this.positionXArr[i], y0 - this.positionYArr[i], buttonRadius, buttonRadius, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (this.AICanvas === 2) {
      ctx.fillStyle = this.color;
      ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fill();
      ctx.restore();
    }
    if (this.AICanvas === -2) {
      ctx.fillStyle = '#000000';
      ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  setHighlight(index) {
    this.highlight = index;
  }

  setAICanvas(index) {
    this.AICanvas = index;
  }
}

const template = `
  <canvas class="background flex-middle"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-middle">
    <p class="instrument-name"><%= instrumentName %></p>
    </div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

export default class SceneCo909 {
  constructor(experience, config) {

    this.experience = experience;
    this.config = config;
    this.placer = new Placer(experience);

    this.$viewElem = null;
    this.instrument = null;

    const clientIndex = soundworks.client.index;
    this.clientIndex = clientIndex;
    this.playerColor = playerColors[this.clientIndex]
    this.numSteps = config.numSteps;
    this.sequence = new Array(this.numSteps);
    this.clear();

    const canvasMin = Math.min(window.innerWidth, window.innerHeight);
    this.buttonRadius = canvasMin / 15;
    this.circleRadius = canvasMin / 2 - this.buttonRadius - 10;
    this.renderer = new Renderer(this.sequence, this.circleRadius, this.buttonRadius, playerColors[clientIndex]);

    this.audioOutput = experience.audioOutput;
    this.convolver = audioContext.createConvolver();
    this.noise = null;

    this.tuna = new tuna(audioContext);
    this.delay = new this.tuna.Delay({
            feedback: 0.8,// 0.5,    //0 to 1+
            delayTime: 1000.*3./8,    //1 to 10000 milliseconds
            wetLevel: 0.25,    //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 20000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
            bypass: 0
          });

    this.highlightedMeasure = -1;
    this.soloMeasure = -1;
    this.isActivated = true;

    this.onSetHighlightedMeasure = this.onSetHighlightedMeasure.bind(this);
    this.onSetSoloMeasures = this.onSetSoloMeasures.bind(this);
    this.onSetFillColor = this.onSetFillColor.bind(this);
    this.onSetIsActivated = this.onSetIsActivated.bind(this);
    this.onAutomaticSwitchNote = this.onAutomaticSwitchNote.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMetroBeat = this.onMetroBeat.bind(this);
  }

  startPlacer() {
    this.placer.start(() => this.startScene());
  }

  startScene() {
    const experience = this.experience;

    this.$viewElem = experience.view.$el;

    experience.view.model = { instrumentName: this.instrument.name.toUpperCase() };
    experience.view.template = template;
    experience.view.render();
    experience.view.addRenderer(this.renderer);
    experience.view.setPreRender(function (ctx, dt, canvasWidth, canvasHeight) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000000' // this.playerColor;
      ctx.rect(0, 0, canvasWidth, canvasHeight);
      ctx.fill();
      ctx.restore();
    });

    experience.surface.addListener('touchstart', this.onTouchStart);
    experience.metricScheduler.addMetronome(this.onMetroBeat, this.numSteps, this.numSteps, 1, 0, true);

    experience.receive('setHighlightedMeasure', this.onSetHighlightedMeasure);
    experience.receive('setSoloMeasures', this.onSetSoloMeasures);
    experience.receive('setIsActivated', this.onSetIsActivated);
    experience.receive('setFillColor', this.onSetFillColor);
    experience.receive('automaticSwitchNote', this.onAutomaticSwitchNote);

  }

  enter() {
    if (this.instrument) {
      this.startPlacer();
    } else {
      const experience = this.experience;
      const instrumentConfig = this.config.instruments[soundworks.client.index];
      const irConfig = this.config.ir[0];
      const noiseConfig = this.config.ir[3];

      experience.audioBufferManager
        .loadFiles([instrumentConfig, irConfig, noiseConfig])
        .then(([instrument, ir, noise]) => {
          this.instrument = instrument;
          this.convolver.buffer = ir.buffer;
          this.noise = noise;
          this.convolver.normalize = true;
          this.startPlacer();
        });
    }
  }

  exit() {
    this.clear();
    this.placer.stop();

    if(this.$viewElem !== null) {
      this.$viewElem = null;

      const experience = this.experience;
      experience.view.removeRenderer(this.renderer);
      experience.metricScheduler.removeMetronome(this.onMetroBeat);
      experience.surface.removeListener('touchstart', this.onTouchStart);

      experience.stopReceiving('setHighlightedMeasure', this.onSetHighlightedMeasure);
      experience.stopReceiving('setSoloMeasures', this.onSetSoloMeasures);
      experience.stopReceiving('setIsActivated', this.onSetIsActivated);
      experience.stopReceiving('setFillColor', this.onSetFillColor);
      experience.stopReceiving('automaticSwitchNote', this.onAutomaticSwitchNote);
    }
  }

  clear() {
    for (let i = 0; i < this.sequence.length; i++)
      this.sequence[i] = 0;
  }

  onSetFillColor(inst, isHighlighted) {
    // if (inst == this.clientIndex) {
    //   this.renderer.setHighlighted(isHighlighted);
    // } else {
    //   this.renderer.setHighlighted(!isHighlighted);
    // }

    // console.log('onSetFillColor');
    // if (inst == this.clientIndex) {
    //   console.log('instrument', inst)
    //   if (isHighlighted) {
    //     this.playerColor = '#' + playerColors[this.clientIndex];
    //   } else {
    //     console.log('no')
    //     this.playerColor = '#000000';
    //   }
    // }
    // const experience = this.experience;
    // experience.view.setPreRender(function (ctx, dt, canvasWidth, canvasHeight) {
    //   ctx.save();
    //   ctx.globalAlpha = 1;
    //   ctx.fillStyle = this.playerColor;
    //   ctx.rect(0, 0, canvasWidth, canvasHeight);
    //   ctx.fill();
    //   ctx.restore();
    // });

    // if (inst == this.clientIndex) {
    //   console.log('inst OK');
    //   console.log(isHighlighted);
    //   this.placer.setFillColor(isHighlighted);
    // }
  }

  onSetHighlightedMeasure(inst, measure) {
    if (inst == this.clientIndex) {
      this.highlightedMeasure = measure;
    }
  }

  onSetSoloMeasures(inst, measure) {
    if (measure > this.soloMeasure + 4) {
      this.soloMeasure = measure;
    }
  }

  onSetIsActivated(inst, isActivated) {
    if (inst == this.clientIndex) {
      this.isActivated = isActivated;
      console.log('this.isActivated =', isActivated);
    }
  }

  onAutomaticSwitchNote(arg) {
    const experience = this.experience;

    let tempSequence = new Array(this.numSteps);
    let tempIndex = 0;
    let numBeats = 0;

    for (let i = 0; i < this.numSteps; i++) {
      if (this.sequence[i] !=0) {
        numBeats += 1;
        tempSequence[i] = 1;
      }
    }

    let numSwitches = Math.floor(numBeats / 2.);

    // Remove random beats
    if (numBeats > 4) {
      while (tempIndex < numSwitches) {
        let index = Math.floor(Math.random() * this.numSteps) + 1
        if (this.sequence[index] != 0) {
          // console.log(index);
          this.sequence[index] = 0;
          experience.send('switchNote', this.clientIndex, index, 0);
          tempIndex += 1;
        }
      }
    }
  }

  onTouchStart(id, x, y) {
    const experience = this.experience;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x0 = width / 2;
    const y0 = height / 2;
    const relX = x - x0;
    const relY = y - y0;
    const radius = Math.sqrt(relX * relX + relY * relY);
    const minRadius = this.circleRadius - 2 * this.buttonRadius;
    const maxRadius = this.circleRadius + 2 * this.buttonRadius;
    const angle = Math.floor(radToDegrees(Math.atan2(-relY, relX)));

    if (radius > minRadius && radius < maxRadius) {
      const beat = Math.floor((this.numSteps * (450 - angle) / 360) + 0.5) % this.numSteps;
      let state = (this.sequence[beat] + 1) % 3;
      this.sequence[beat] = state;

      experience.send('switchNote', this.clientIndex, beat, state);
    }
  }

  onMetroBeat(measure, beat) {
    const state = this.sequence[beat];
    const highlightedMeasure = this.highlightedMeasure;
    const soloMeasure = this.soloMeasure;

    // @note - we don't want the player to make noise, its just a controller
    // if (state > 0) {
    //   const beatTime = audioScheduler.currentTime;
    //   const layer = this.instrument.layers[state - 1];

    //   const src = audioContext.createBufferSource();
    //   const gain = audioContext.createGain();
    //   gain.gain.value = decibelToLinear(layer.gain);

    //   const playbackCoeff = this.instrument.playbackCoeff;

    //   if (this.isActivated) {
    //     if (measure === highlightedMeasure) {
    //       let endBeat = 1 * 16;
    //       let startBeat = (measure - highlightedMeasure) * 16;
    //       let fracBeat = (startBeat + beat) / endBeat;

    //       src.playbackRate.value = Math.pow(.5 * playbackCoeff, 2) + 1.;

    //       src.connect(gain);
    //       gain.connect(this.delay);
    //       this.delay.connect(this.audioOutput);

    //     } else if (measure < soloMeasure + 4) {
    //       let endBeat = 4 * 16;
    //       let startBeat = (measure - soloMeasure) * 16;
    //       let fracBeat = (startBeat + beat) / endBeat;

    //       src.playbackRate.value = Math.pow(fracBeat * playbackCoeff, 2) + 1.;

    //       src.connect(gain);
    //       gain.connect(this.delay);
    //       this.delay.connect(this.audioOutput);

    //     } else {
    //       src.connect(gain);
    //       gain.connect(this.audioOutput);
    //     }

    //     src.buffer = layer.buffer;
    //     src.start(beatTime);
    //   }
    // }


    const uiDelay = this.experience.sharedParams.params['ui-delay-players'].value;

    setTimeout(() => {
      if (this.isActivated) {
        if (measure < soloMeasure + 4) {
          this.renderer.setAICanvas(2);
        } else if (measure === highlightedMeasure) {
          this.renderer.setAICanvas(1);
        } else if (beat === 1) {
          this.renderer.setAICanvas(0);
        }
      } else if (this.isActivated === false) {
        if (measure === soloMeasure + 4) {
          this.renderer.setAICanvas(0);
        } else {
          this.renderer.setAICanvas(-2);
        }
      }

      this.renderer.setHighlight(beat);
    }, uiDelay);
  }
}
