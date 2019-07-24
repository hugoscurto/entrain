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
    const protocol = 'NORMAL'

    // if (this.AIMeasure === 0) {
    //   for (let inst = 0; inst < instrumentSequences.length; inst++) {
    //     experience.broadcast('player', null, 'setFillColor', inst, false);
    //   }
    // }

    /// compute descriptors (after each measure)
    if (beat === 15) { // if (beat === 0) {
      console.log("---- measure ", measure);
      const instrumentPrevSequences = this.instrumentPrevSequences;
      const instrumentFeatures = this.instrumentFeatures;

      if (this.AIMeasure >= 0){
        experience.broadcast('barrel', null, 'setFillColor', Array());
        experience.broadcast('barrel', null, 'setRendererMode', 0);
        let highlighedInstruments = new Array();

        for (let inst in experience.enteredClients) {
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
            protocol = 'HIGHLIGHT'
            experience.broadcast('player', null, 'setHighlightedMeasure', inst, measure + 1);
            experience.broadcast('barrel', null, 'setHighlightedMeasure', inst, measure + 1);
            // experience.broadcast('player', null, 'setHighlightedMeasure', inst, measure);
            this.updateNumInAIFeedback();
            console.log(inst, ' in BIG feedback!');
            experience.broadcast('player', null, 'setFillColor', inst, true);

            highlighedInstruments.push(inst);
          } else {
            // console.log('no');
          }

          this.setInstrumentPrevSequence(inst, sequence);
        }

        console.log('highlighedInstruments', highlighedInstruments);
        experience.broadcast('barrel', null, 'setFillColor', highlighedInstruments);
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
        protocol = 'SOLO'
        let highlighedInst = this.BIG.computeClosestInstrument(instrumentFeatures, experience.enteredClients);
        console.log("highlighedInst: ", highlighedInst)
        experience.broadcast('player', null, 'automaticSwitchNote', -1);
        experience.broadcast('barrel', null, 'setFillColor', [highlighedInst]);
        experience.broadcast('barrel', null, 'setRendererMode', 2);

        experience.broadcast('player', null, 'setSoloMeasures', highlighedInst, measure + 1);
        experience.broadcast('barrel', null, 'setSoloMeasures', highlighedInst, measure + 1);

        experience.broadcast('player', null, 'setIsActivated', highlighedInst, true);
        experience.broadcast('barrel', null, 'setIsActivated', highlighedInst, true);
        console.log('true')

        for (let i in experience.enteredClients) {
          console.log('i', i)
          console.log('experience.enteredClients', experience.enteredClients)
          console.log('highlighedInst', highlighedInst)
          if (i != highlighedInst) {
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

    // compute specific indexes for neoPixelDisplay
    if (protocol == 'HIGHLIGHT') {
      const args = [];
      for (let inst in experience.enteredClients) {
        if (inst in highlighedInstruments) {
          let sequence = instrumentSequences[inst];
          if (sequence[beat] != 0) {
            args.push(2);
          } else {
            args.push(1);
          }
        } else {
          args.push(0);
        }
      }
    } else if (protocol == 'SOLO') {
      const isPlaying = 0; // 1 if current beat is on, 0 if off
      let sequence = instrumentSequences[highlighedInst];
      if (sequence[beat] != 0) {
        isPlaying = 1;
      } else {
        isPlaying = 0;
      }
    }

    setTimeout(() => {
      if (protocol == 'NORMAL') {
        if (beat % 4 === 0) {
          neoPixelDisplay.send(protocol);
        }
      } else if (protocol == 'HIGHLIGHT') {
        neoPixelDisplay.send(protocol, ...args);
      } else if (protocol == 'SOLO') {
        neoPixelDisplay.send(protocol, clientIndex, isPlaying);
      }
      
      // Mini-CoLoop
      // example of normal beat (no highlight, no solo)
      // if (beat % 4 === 0) {
      //  const protocol = 'NORMAL';
      //  neoPixelDisplay.send(protocol);
      // }

      // example of highlight protocol
      const protocol = 'HIGHLIGHT';
      const players = [1, 3, 5];
      const playingPlayers = [];

      players.forEach((playerIndex) => {
        const sequence = this.instrumentSequences[playerIndex];

        if (sequence[beat] !== 0) {
          playingPlayers.push(playerIndex);
        }
      });

      // const args = [0, 1, 4]; // list of highlighted clients that have a beat on
      neoPixelDisplay.send(protocol, ...playingPlayers);

      // example of solo protocol
      // const protocol = 'SOLO';
      // const clientIndex = 4;
      // const isPlaying = 1; // 1 if current beat is on, 0 if off
      // neoPixelDisplay.send(protocol, clientIndex, isPlaying);

    }, ledDelay);


    /* Big Coloop
    /// clear screen
    experience.ledDisplay.clearPixels();

    let simpleGrid = true;
    for (let inst = 4; inst < instrumentSequences.length; inst++) {
      let sequence = instrumentSequences[inst];
      for (let i = 0; i < sequence.length; i++) {
        if ((sequence[i] === 1) || (sequence[i] === 2)) {
          simpleGrid = false;
          break;
        }
      }
    }

    //console.log(displaySelector);
    /// Display grid
    if (simpleGrid) {
      for (let i = 0; i < 16; i++) {
        let ds = Math.round((32.0 / 16.0) * i);
        experience.ledDisplay.line(ds, "0x808080");
      }
    } else { // grid for more than 4 players
      for (let i = 0; i < 32; i++) {
        experience.ledDisplay.line(i, "0x808080");
      }
    }
    ///

    /// show instruments
    for (let inst = 0; inst < instrumentSequences.length; inst++) {
      let sequence = instrumentSequences[inst];
      for (let i = 0; i < sequence.length; i++) {
        if ((sequence[i] === 1) || (sequence[i] === 2)) {
          const colorCode = '0x' + playerColors[inst];
          let ds = Math.round((32.0 / 16.0) * i);

          if (inst <= 3) {
            experience.ledDisplay.ledOnLine(ds, inst % 4, colorCode);
          } else {
            if (ds <= 31)
              experience.ledDisplay.ledOnLine(ds + 1, inst % 4, colorCode);
            else
              experience.ledDisplay.ledOnLine(0, inst % 4, colorCode);
          }
        }
      }
    }
    ///

    ///current beat line
    if (simpleGrid) {
      experience.ledDisplay.line(displaySelector, "0xFFFBCB");
    } else {
      /// double line
      if (displaySelector < 31) {
        experience.ledDisplay.line(displaySelector, "0xFFFBCB");
        experience.ledDisplay.line(displaySelector + 1, "0xFFFBCB");
      } else {
        experience.ledDisplay.line(displaySelector, "0xFFFBCB");
        experience.ledDisplay.line(0, "0xFFFBCB");
      }
    }

    // if (beat === 0)
    //   console.log("BD SD HH MT PC HT LT CY -", measure);

    // let str = "";
    // for (let i = 0; i < instrumentSequences.length; i++) {
    //   const isPlacing = this.isPlacing[i];
    //   const sequence = instrumentSequences[i];
    //   const state = sequence[beat];
    //   let char = '.  ';

    //   if (isPlacing) {
    //     char = '|  ';
    //     if (beat <= numBeats / 2) {
    //       experience.ledDisplay.segment(i, '0x' + playerColors[i]);
    //     }
    //   }

    //   if (state === 1)
    //     char = String.fromCharCode(0x25EF) + '  ';
    //   else if (state === 2)
    //     char = String.fromCharCode(0x25C9) + '  ';
    //   str += char;
    // }

    /// draw screen
    experience.ledDisplay.redraw();
    // console.log(str, beat);
    */
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
