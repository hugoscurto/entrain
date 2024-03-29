import * as soundworks from 'soundworks/client';
import { decibelToLinear } from 'soundworks/utils/math';
import colorConfig from '../../../shared/color-config';
import aColorConfig from '../../../shared/acolor-config';

const audioContext = soundworks.audioContext;
const audioScheduler = soundworks.audio.getScheduler();
const playerColors = aColorConfig.players;

class Renderer extends soundworks.Canvas2dRenderer {
  constructor() {
    super(0);
    this.highlight = undefined;
    this.rendererMode = 0;
    this.AICanvasArray = new Array();
    this.beatCanvas = false;
    this.instrumentBeat = -1;

    // for (let i = 0; i < playerColors.length; i++) {
    //   this.instrument
    // }
  }

  init() {

  }

  update(dt) {

  }

  render(ctx) {
    ctx.save();


    if (this.rendererMode === 0) {
      if (this.AICanvasArray.length === 0) {
        ctx.fillStyle = '#000000';
        ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.fill();
      } else if (this.AICanvasArray.length > 0) {
        let sharedWidth = (this.canvasWidth * 1.) / playerColors.length;

        if (this.beatCanvas) {
          console.log('beatCanvas')
          let tempX = sharedWidth * this.instrumentBeat * 1.;

          // ctx.fillStyle = 'rgb(' + playerColors[this.instrumentBeat] + ')';
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(tempX, 0, sharedWidth, this.canvasHeight);
          // console.log('this.instrumentBeat', this.instrumentBeat)
          this.beatCanvas = false;
        } else {
          for (let i = 0; i < this.AICanvasArray.length; i++) {
            let tempX = sharedWidth * this.AICanvasArray[i] * 1.;

            ctx.fillStyle = 'rgb(' + playerColors[this.AICanvasArray[i]] + ')';
            // ctx.fillStyle = '#000000';
            ctx.fillRect(tempX, 0, sharedWidth, this.canvasHeight);
          }
        }

      }
    } else if (this.rendererMode === 2) {
      for (let i = 0; i < this.AICanvasArray.length; i++) {
        ctx.fillStyle = 'rgb(' + playerColors[this.AICanvasArray[i]] + ')';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        if (this.beatCanvas) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.beatCanvas = false;
        }
      }
    }

    ctx.restore();
  }

  setHighlight(index) {
    this.highlight = index;
  }

  setAICanvasArray(AICanvasArray) {
    this.AICanvasArray = AICanvasArray;
  }

  setBeatCanvas(inst, isBeat) {
    // Sets beats to flash light on.

    this.beatCanvas = isBeat;
    this.instrumentBeat = inst;
  }

  setRendererMode(index) {
    this.rendererMode = index;
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
    this.instruments = null;

    const numSteps = config.numSteps;
    const numInstruments = config.instruments.length;

    this.instrumentSequences = new Array(numInstruments);

    for (let i = 0; i < numInstruments; i++) {
      this.instrumentSequences[i] = new Array(numSteps);
      this.resetInstrumentSequence(i);
    }

    this.instrumentHighlightedMeasures = new Array(numInstruments);
    this.instrumentSoloMeasures = new Array(numInstruments);
    this.instrumentIsActivated = new Array(numInstruments);

    this.highlighedInstruments = new Array();

    for (let i = 0; i < numInstruments; i++) {
      this.instrumentHighlightedMeasures[i] = -1;
      this.instrumentSoloMeasures[i] = -1;
      this.instrumentIsActivated[i] = -1;
      // this.resetInstrumentSequence(i);
    }

    // outputBusses are not created yet..., so the array is empty
    this.outputBusses = experience.outputBusses;

    this.preDelayHighlight = audioContext.createGain();
    this.preDelayHighlight.gain.value = 0.12; // wet

    this.preDelaySolo = audioContext.createGain();
    this.preDelaySolo.gain.value = 0.25; // wet

    this.delay = audioContext.createDelay();
    this.delay.delayTime.value = 1 * 3 / 8;

    this.feedback = audioContext.createGain();
    this.feedback.gain.value = 0.8;

    this.preDelayHighlight.connect(this.delay);
    this.preDelaySolo.connect(this.delay);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);

    this.onSetHighlightedMeasure = this.onSetHighlightedMeasure.bind(this);
    this.onSetSoloMeasures = this.onSetSoloMeasures.bind(this);
    this.onSetIsActivated = this.onSetIsActivated.bind(this);
    this.onSetRendererMode = this.onSetRendererMode.bind(this);

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);
    this.onSetFillColor = this.onSetFillColor.bind(this);

    ////this.renderer = new Renderer();
  }

  clientEnter(index) {}

  clientExit(index) {
    this.resetInstrumentSequence(index);
  }

  enterScene() {
    const experience = this.experience;
    const numSteps = this.config.numSteps;

    experience.metricScheduler.addMetronome(this.onMetroBeat, numSteps, numSteps, 1, 0, true);
    experience.receive('setFillColor', this.onSetFillColor);
    experience.receive('switchNote', this.onSwitchNote);

    experience.receive('setHighlightedMeasure', this.onSetHighlightedMeasure);
    experience.receive('setSoloMeasures', this.onSetSoloMeasures);
    experience.receive('setIsActivated', this.onSetIsActivated);
    experience.receive('setRendererMode', this.onSetRendererMode);
    experience.receive('initSequences', instrumentSequences => {
      instrumentSequences.forEach((sequence, index) => {
        this.instrumentSequences[index] = sequence;
      });
    });

    experience.send('initSequences');

    //
    this.$viewElem = experience.view.$el;

    experience.view.model = { instrumentName: 'entrain' };
    experience.view.template = template;
    ////experience.view.render();
    ////experience.view.addRenderer(this.renderer);
    this.outputBusses.forEach(bus => {
      console.log(bus);
      this.delay.connect(bus);
    });

    experience.sharedParams.addParamListener('pre-delay-highlight', value => {
      console.log('pre-delay-highlight', value);
      this.preDelayHighlight.gain.value = value;
    });

    experience.sharedParams.addParamListener('pre-delay-solo', value => {
      console.log('pre-delay-solo', value);
      this.preDelaySolo.gain.value = value;
    });
  }

  enter() {
    const experience = this.experience;

    if (this.instruments) {
      this.enterScene();
    } else {
      const instrumentConfig = this.config.instruments;
      experience.audioBufferManager.loadFiles(instrumentConfig).then((instruments) => {
        this.instruments = instruments;
        this.enterScene();
      });
    }
  }

  exit() {
    const experience = this.experience;
    experience.metricScheduler.removeMetronome(this.onMetroBeat);
    experience.stopReceiving('switchNote', this.onSwitchNote);
    experience.stopReceiving('setFillColor', this.onSetFillColor);

    experience.stopReceiving('setHighlightedMeasure', this.onSetHighlightedMeasure);
    experience.stopReceiving('setSoloMeasures', this.onSetSoloMeasures);
    experience.stopReceiving('setIsActivated', this.onSetIsActivated);
    experience.stopReceiving('setRendererMode', this.onSetRendererMode);
  }

  resetInstrumentSequence(instrument) {
    const sequence = this.instrumentSequences[instrument];

    for (let i = 0; i < sequence.length; i++) {
      sequence[i] = 0;
    }
  }

  clear() {
    for (let i = 0; i < this.instrumentSequences.length; i++)
      this.resetInstrumentSequence(i);
  }

  onSetHighlightedMeasure(inst, measure) {
    const instrumentHighlightedMeasures = this.instrumentHighlightedMeasures;
    instrumentHighlightedMeasures[inst] = measure;
  }

  onSetIsActivated(inst, isActivated) {
    const instrumentIsActivated = this.instrumentIsActivated;
    instrumentIsActivated[inst] = isActivated;
  }

  onSetSoloMeasures(inst, measure) {
    const instrumentSoloMeasures = this.instrumentSoloMeasures;

    if (measure > instrumentSoloMeasures[inst] + 4) {
      instrumentSoloMeasures[inst] = measure;
    }
  }

  onSetRendererMode(index) {
    // Sets mode for renderer.
    // index: 0 for highlight mode, 2 for solo mode

    ////this.renderer.setRendererMode(index);
  }

  onSetFillColor(highlighedInstruments) {
    // Sets the n instruments to be rendered.
    // Works either during highlight mode (n >=0), or during solo mode (n=1).

    ////this.renderer.setAICanvasArray(highlighedInstruments);
  }

  onMetroBeat(measure, beat) {
    // const time = audioScheduler.currentTime;

    // for (let i = 0; i < this.instrumentSequences.length; i++) {
    //   const instrument = this.instruments[i];
    //   const sequence = this.instrumentSequences[i];
    //   const state = sequence[beat];

    //   if (state > 0) {
    //     const layer = instrument.layers[state - 1];

    //     const gain = audioContext.createGain();
    //     gain.connect(this.outputBusses[i]);
    //     gain.gain.value = decibelToLinear(layer.gain);

    //     const src = audioContext.createBufferSource();
    //     src.connect(gain);
    //     src.buffer = layer.buffer;
    //     src.start(time);
    //   }
    // }

    for (let i = 0; i < this.instrumentSequences.length; i++) {
      const instrument = this.instruments[i];
      const sequence = this.instrumentSequences[i];
      const state = sequence[beat];

      const highlightedMeasure = this.instrumentHighlightedMeasures[i];
      const soloMeasure = this.instrumentSoloMeasures[i];
      const isActivated = this.instrumentIsActivated[i];



      if (state > 0 && isActivated) {
        const beatTime = audioScheduler.currentTime;
        const layer = instrument.layers[state - 1];

        const gain = audioContext.createGain();
        gain.connect(this.outputBusses[i]);
        gain.gain.value = decibelToLinear(layer.gain);

        const src = audioContext.createBufferSource();
        src.connect(gain);
        src.buffer = layer.buffer;

        const playbackCoeff = instrument.playbackCoeff;

        if (measure === highlightedMeasure) {
          let endBeat = 1 * 16;
          let startBeat = (measure - highlightedMeasure) * 16;
          let fracBeat = (startBeat + beat) / endBeat;

          // src.playbackRate.value = Math.pow(fracBeat * playbackCoeff, 2) + 1.;
          src.playbackRate.value = Math.pow(.5 * playbackCoeff, 2) + 1.;

          gain.connect(this.preDelayHighlight);

        } else if (measure < soloMeasure + 4) {
          let endBeat = 4 * 16;
          let startBeat = (measure - soloMeasure) * 16;
          let fracBeat = (startBeat + beat) / endBeat;

          src.playbackRate.value = Math.pow(fracBeat * playbackCoeff, 2) + 1.;

          gain.connect(this.preDelaySolo);

          ////this.renderer.setBeatCanvas(i, true);
        }

        // gain.connect(this.preDelay);

        src.start(beatTime);
      }
      // this.renderer.setHighlight(beat);
      // if (isActivated) {
      //   if (measure < soloMeasure + 4) {
      //     this.renderer.setAIMode(2);
      //   } else if (measure === highlightedMeasure) {
      //     this.renderer.setAIMode(1);
      //   } else if (beat === 1) {
      //     this.renderer.setAIMode(0);
      //   }
      // } else if (this.isActivated === false) {
      //   if (measure === soloMeasure + 4) {
      //     this.renderer.setAIMode(0);
      //   } else {
      //     this.renderer.setAIMode(-2);
      //   }
      // }
    }
  }

  onSwitchNote(instrument, beat, state) {
    const sequence = this.instrumentSequences[instrument];
    sequence[beat] = state;
  }
}
