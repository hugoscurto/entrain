import Metronome from '../Metronome';
import BIG from '../BIG';
import Placer from './Placer';
import colorConfig from '../../shared/color-config';

const playerColors = colorConfig.players;

export default class SceneCo909 {
  constructor(experience, config) {
    this.experience = experience;
    this.config = config;

    this.placer = new Placer(experience);

    const numSteps = config.numSteps;
    const numInstruments = config.instruments.length;
    const numFeatures = 2;

    this.instrumentSequences = new Array(numInstruments);
    this.instrumentPrevSequences = new Array(numInstruments);
    this.instrumentFeatures = new Array(numInstruments);

    this.instrumentBIGFeatures = new Array(numInstruments);
    this.instrumentMetaFeatures = new Array(numInstruments);

    this.isPlacing = new Array(numInstruments);

    for (let i = 0; i < numInstruments; i++) {
      this.instrumentSequences[i] = new Array(numSteps);
      this.resetInstrumentSequence(i);
      this.instrumentPrevSequences[i] = new Array(numSteps);
      this.resetInstrumentPrevSequence(i);
      this.instrumentFeatures[i] = new Array(numFeatures);

      this.instrumentBIGFeatures[i] = new Array(numFeatures);
      this.resetInstrumentBIGFeatures(i);
      this.instrumentMetaFeatures[i] = new Array(numFeatures);
    }

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);

    // display
    this.onButtonTurned = this.onButtonTurned.bind(this);

    this.metronome = new Metronome(experience.scheduler, experience.metricScheduler, numSteps, numSteps, this.onMetroBeat);

    this.AIUpdateMeasure = 16;
    this.AIMeasure = 0;
    this.highlightedMeasure = 0;

    this.BIG = new BIG(8, [2, 5], 5);
    this.numInAIFeedback = 0;

    experience.sharedParams.addParamListener('reset-big', () => this.BIG.reset());


    this.protocol = 'NORMAL';
    this.soloInst = null;
    this.highlighedInstruments = [];
  }

  clientEnter(client) {
    const experience = this.experience;
    const clientIndex = client.index;

    experience.receive(client, 'switchNote', this.onSwitchNote);
    // reinit if barrel is reset while clients running

    this.isPlacing[clientIndex] = true;
    this.placer.start(client, () => {
      this.isPlacing[clientIndex] = false;
    });
  }

  clientExit(client) {
    const experience = this.experience;
    const clientIndex = client.index;

    // reset sequence of exiting client
    this.resetInstrumentSequence(client.index);

    experience.stopReceiving(client, 'switchNote', this.onSwitchNote);

    if (this.isPlacing[clientIndex]) {
      this.placer.stop(client);
      this.isPlacing[clientIndex] = false;
    }
  }

  enter() {
    const experience = this.experience;
    // experience.ledDisplay.addListener('buttonTurned', this.onButtonTurned);
    // experience.ledDisplay.screenOff();

    this.metronome.start();
  }

  exit() {
    const experience = this.experience;
    // experience.ledDisplay.removeListener('buttonTurned', this.onButtonTurned);

    this.metronome.stop();
  }

  resetInstrumentSequence(instrument) {
    const sequence = this.instrumentSequences[instrument];

    for (let i = 0; i < sequence.length; i++) {
      sequence[i] = 0;
    }
  }

  resetInstrumentPrevSequence(instrument) {
    const sequence = this.instrumentPrevSequences[instrument];

    for (let i = 0; i < sequence.length; i++) {
      sequence[i] = 0;
    }
  }

  resetInstrumentBIGFeatures(instrument) {
    const instrumentBIGFeatures = this.instrumentBIGFeatures[instrument];

    instrumentBIGFeatures[0] = 0;

    instrumentBIGFeatures[0] = 1;

    for (let i = 0; i < instrumentBIGFeatures.length; i++) {
      instrumentBIGFeatures[i] = 0;
    }
  }

  setInstrumentPrevSequence(instrument, sequence) {
    const prevSequence = this.instrumentPrevSequences[instrument];

    for (let i = 0;i < sequence.length; i++) {
      prevSequence[i] = sequence[i];
    }
  }

  setInstrumentFeature(instrument, index, feature) {
    const instrumentFeature = this.instrumentFeatures[instrument];
    instrumentFeature[index] = feature;
  }

  setInstrumentBIGFeature(instrument, feature) {
    const BIGFeature = this.instrumentBIGFeatures[instrument];

    for (let i = 0;i < BIGFeature.length; i++) {
      BIGFeature[i] = feature[i];
    }
  }

  setNoteState(instrument, beat, state) {
    const sequence = this.instrumentSequences[instrument];
    sequence[beat] = state;
    console.log(instrument, sequence);
  }

  setTempo(tempo) {
    setTimeout(() => this.metronome.sync(), 0);
  }

  clear() {
    for (let i = 0; i < this.instrumentSequences.length; i++)
      this.resetInstrumentSequence(i);
  }

  computeFeature(sequence, prevSequence, index) {
    let feature = 0;

    if (index === 0) {
      let numDifferentBeats = 0; // cumulated sequence changes ("activity")
      for (let i = 0; i < sequence.length; i++) {
        let temp = sequence[i] - prevSequence[i];
        if (temp != 0) {numDifferentBeats += 1}
      }

      feature = numDifferentBeats;
      // // "normalization" over 4 different states (for BIG)
      // if (numDifferentBeats === 0) {feature = 0}
      // else if (numDifferentBeats >= 1 && numDifferentBeats < 4) {feature = 1}
      // else if (numDifferentBeats >= 4 && numDifferentBeats < 7) {feature = 2}
      // else if (numDifferentBeats >= 7) {feature = 3}
    } else if (index === 1) {
      let autoCorr = new Array(sequence.length); // sequence autocorrelation ("groove")
      let normSequence = new Array(sequence.length);
      for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] != 0) {normSequence[i] = 1} else {normSequence[i] = 0}
      }
      for (let i = 0; i < normSequence.length; i++) {
        autoCorr[i] = 0;
        for (let j = 0; j < normSequence.length - i - 1; j++) {
          autoCorr[i] += normSequence[j] * normSequence[j+i];
        }
      }
      let temp = autoCorr.slice(1)
      let temp2 = temp.indexOf(Math.max(...temp)) + 1;
      feature = temp2;
      // // "normalization" over 4 different states (for BIG)
      // if (temp2 === 1) {feature = 0}
      // else if (temp2 >= 2 && temp2 < 4) {feature = 1}
      // else if (temp2 >= 4 && temp2 < 7) {feature = 2}
      // else if (temp2 >= 7) {feature = 3}
    }
    return feature
  }

  computeMetaFeatures(features, BIGFeatures, index) {
    return features[index] - BIGFeatures[index];
  }

  computeUserMove(featureA, featureB) {
    if (featureA === 0 && featureB === 0) {
      return 0;
    } else if (Math.abs(featureA) >= Math.abs(featureB)) {
      if (featureA > 0) {
        return 4
      } else {
        return 2
      }
    } else if (Math.abs(featureA) < Math.abs(featureB)) {
      if (featureB > 0) {
        return 3
      } else {
        return 1
      }
    }
  }

  updateAIMeasure() {
    this.AIMeasure += 1;
  }

  resetAIMeasure() {
    this.AIMeasure = 0;
  }

  updateHighlightedMeasure() {
    this.highlightedMeasure += 1;
  }

  resetHighlightedMeasure() {
    this.highlightedMeasure = 0;
  }

  updateNumInAIFeedback() {
    this.numInAIFeedback += 1;
  }

  resetNumInAIFeedback() {
    this.numInAIFeedback = 0;
  }

  onMetroBeat(measure, beat) {
    const experience = this.experience;
    const instrumentSequences = this.instrumentSequences;
    let displaySelector = Math.round((32.0 / 16.0) * beat);
    const numBeats = this.config.numSteps;

    /// compute descriptors (after each measure)
    if (beat === 15) { // if (beat === 0) {
      console.log("---- measure ", measure);
      const instrumentPrevSequences = this.instrumentPrevSequences;
      const instrumentFeatures = this.instrumentFeatures;

      if (this.AIMeasure >= 0){
        this.protocol = 'NORMAL'
        experience.broadcast('barrel', null, 'setFillColor', Array());
        experience.broadcast('barrel', null, 'setRendererMode', 0);

        this.highlighedInstruments = [];

        experience.enteredClients.forEach((inst) => {
        // for (let inst = 0; inst < instrumentSequences.length; inst++) {
          // experience.broadcast('player', null, 'setFillColor', inst, false);

          if (this.AIMeasure >= 0) {
            experience.broadcast('player', null, 'setIsActivated', inst, true);
            experience.broadcast('barrel', null, 'setIsActivated', inst, true);
          }

          let sequence = instrumentSequences[inst];
          let prevSequence = instrumentPrevSequences[inst];

          let numDifferentBeats = this.computeFeature(sequence, prevSequence, 0);
          let autoCorr = this.computeFeature(sequence, prevSequence, 1);

          this.setInstrumentFeature(inst, 0, numDifferentBeats);
          this.setInstrumentFeature(inst, 1, autoCorr);

          console.log('instrumentFeatures', inst, instrumentFeatures[inst]);

          // check if instrument in AI feedback
          let inAIFeedback = this.BIG.isInAIFeedback(instrumentFeatures[inst]);
          if (inAIFeedback) {
            this.protocol = 'HIGHLIGHT'
            experience.broadcast('player', null, 'setHighlightedMeasure', inst, measure + 1);
            experience.broadcast('barrel', null, 'setHighlightedMeasure', inst, measure + 1);
            // experience.broadcast('player', null, 'setHighlightedMeasure', inst, measure);
            this.updateNumInAIFeedback();
            console.log(inst, ' in BIG feedback!');
            experience.broadcast('player', null, 'setFillColor', inst, true);

            this.highlighedInstruments.push(inst);
          } else {
            // console.log('no');
          }

          this.setInstrumentPrevSequence(inst, sequence);
        });

        console.log('this.highlighedInstruments', this.highlighedInstruments);
        experience.broadcast('barrel', null, 'setFillColor', this.highlighedInstruments);
      }

      console.log(this.AIMeasure)
      this.updateAIMeasure();
    }

    /// Update BIG (after this.AIUpdateMeasure measures)
    if (this.AIMeasure > this.AIUpdateMeasure) {
      console.log("------------------------------------ MODEL UPDATE");
      const instrumentFeatures = this.instrumentFeatures;
      const instrumentBIGFeatures = this.instrumentBIGFeatures;
      const instrumentMetaFeatures = this.instrumentMetaFeatures;

      if (this.numInAIFeedback === 0) {
        this.protocol = 'SOLO'
        this.soloInst = this.BIG.computeClosestInstrument(instrumentFeatures, experience.enteredClients);
        console.log("this.soloInst: ", this.soloInst)
        experience.broadcast('player', null, 'automaticSwitchNote', -1);
        experience.broadcast('barrel', null, 'setFillColor', [this.soloInst]);
        experience.broadcast('barrel', null, 'setRendererMode', 2);

        experience.broadcast('player', null, 'setSoloMeasures', this.soloInst, measure + 1);
        experience.broadcast('barrel', null, 'setSoloMeasures', this.soloInst, measure + 1);

        experience.broadcast('player', null, 'setIsActivated', this.soloInst, true);
        experience.broadcast('barrel', null, 'setIsActivated', this.soloInst, true);
        console.log('true')

        for (let i in experience.enteredClients) {
          console.log('i', i)
          console.log('experience.enteredClients', experience.enteredClients)
          console.log('this.soloInst', this.soloInst)
          if (i != this.soloInst) {
            experience.broadcast('player', null, 'setIsActivated', i, false);
            experience.broadcast('barrel', null, 'setIsActivated', i, false);
            console.log('false')
          }
        }
        // experience.broadcast('player', null, 'setFillColor', true);
        this.AIMeasure = -3;

        for (let inst in experience.enteredClients) {
        // for (let inst = 0; inst < instrumentFeatures.length; inst++) {
        // for (let inst = 0; inst < 1; inst++) {
          let features = instrumentFeatures[inst];
          let BIGFeatures = instrumentBIGFeatures[inst];

          let metaNumDifferentBeats = this.computeMetaFeatures(features, BIGFeatures, 0);
          let metaAutoCorr = this.computeMetaFeatures(features, BIGFeatures, 1);

          let user_move = this.computeUserMove(metaNumDifferentBeats, metaAutoCorr);

          this.BIG.Update(user_move, BIGFeatures);
          this.BIG.Max_E_IG();

          this.setInstrumentBIGFeature(inst, features);
        }

        this.resetNumInAIFeedback();
        // this.resetAIMeasure();
      } else {
        for (let inst in experience.enteredClients) {
        // for (let inst = 0; inst < instrumentFeatures.length; inst++) {
        // for (let inst = 0; inst < 1; inst++) {
          let features = instrumentFeatures[inst];
          let BIGFeatures = instrumentBIGFeatures[inst];

          let metaNumDifferentBeats = this.computeMetaFeatures(features, BIGFeatures, 0);
          let metaAutoCorr = this.computeMetaFeatures(features, BIGFeatures, 1);

          let user_move = this.computeUserMove(metaNumDifferentBeats, metaAutoCorr);

          this.BIG.Update(user_move, BIGFeatures);
          this.BIG.Max_E_IG();

          this.setInstrumentBIGFeature(inst, features);
        }

        this.resetNumInAIFeedback();
        this.resetAIMeasure();
      }
    }

    const neoPixelDisplay = this.experience.neoPixelDisplay;
    const ledDelay = this.experience.sharedParams.params['led-delay'].data.value;
    // console.log('led delay', ledDelay);

    let highlightArgs = [];
    let soloIsPlaying = 0; // 1 if current beat is on, 0 if off

    if (this.protocol == 'SOLO' && (this.soloInst === null || this.soloInst === undefined)) {
      console.log('override this.protocol, no clients connected');
      this.protocol = 'NORMAL';
    }

    // compute specific indexes for neoPixelDisplay
    if (this.protocol == 'HIGHLIGHT') {
      for (let clientIndex = 0; clientIndex < 8; clientIndex++) {
        if (this.highlighedInstruments.indexOf(clientIndex) !== -1) {
          let sequence = instrumentSequences[clientIndex];

          if (sequence[beat] != 0) {
            highlightArgs[clientIndex] = 2;
          } else {
            highlightArgs[clientIndex] = 1;
          }
        } else {
          highlightArgs[clientIndex] = 0;
        }
      }
    } else if (this.protocol == 'SOLO') {
      let sequence = instrumentSequences[this.soloInst];

      if (sequence[beat] != 0) {
        soloIsPlaying = 1;
      } else {
        soloIsPlaying = 0;
      }
    }

    const protocol = this.protocol;
    const soloInst = this.soloInst;

    setTimeout(() => {
      // // stress test for the LEDs
      // const list = [];
      // for (let i = 0; i < 8; i++) {
      //   list[i] = Math.floor(Math.random() * 3);
      // }
      // neoPixelDisplay.send('HIGHLIGHT', ...list);

      if (this.protocol == 'NORMAL') {
        if (beat % 16 === 0) {
          neoPixelDisplay.send(protocol);
        }
      } else if (this.protocol == 'HIGHLIGHT') {
        neoPixelDisplay.send(protocol, ...highlightArgs);
      } else if (this.protocol == 'SOLO') {
        neoPixelDisplay.send(protocol, soloInst, soloIsPlaying);
      }
    }, ledDelay);
  }

  onSwitchNote(instrument, beat, state) {
    const experience = this.experience;
    experience.broadcast('barrel', null, 'switchNote', instrument, beat, state);
    this.setNoteState(instrument, beat, state);
  }

  onButtonTurned(data) {
    console.log("button turned:", data);
  }
}
