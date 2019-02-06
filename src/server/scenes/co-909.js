import Metronome from '../Metronome';
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
    this.isPlacing = new Array(numInstruments);

    for (let i = 0; i < numInstruments; i++) {
      this.instrumentSequences[i] = new Array(numSteps);
      this.resetInstrumentSequence(i);
      this.instrumentPrevSequences[i] = new Array(numSteps);
      this.resetInstrumentPrevSequence(i);
      this.instrumentFeatures[i] = new Array(numFeatures);
    }

    this.onMetroBeat = this.onMetroBeat.bind(this);
    this.onSwitchNote = this.onSwitchNote.bind(this);

    // display
    this.onButtonTurned = this.onButtonTurned.bind(this);

    this.metronome = new Metronome(experience.scheduler, experience.metricScheduler, numSteps, numSteps, this.onMetroBeat);
  }

  clientEnter(client) {
    const experience = this.experience;
    const clientIndex = client.index;

    experience.receive(client, 'switchNote', this.onSwitchNote);

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
    experience.ledDisplay.addListener('buttonTurned', this.onButtonTurned);
    experience.ledDisplay.screenOff();

    this.metronome.start();
  }

  exit() {
    const experience = this.experience;
    experience.ledDisplay.removeListener('buttonTurned', this.onButtonTurned);

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

  setNoteState(instrument, beat, state) {
    const sequence = this.instrumentSequences[instrument];
    sequence[beat] = state;

  }

  setTempo(tempo) {
    setTimeout(() => this.metronome.sync(), 0);
  }

  clear() {
    for (let i = 0; i < this.instrumentSequences.length; i++)
      this.resetInstrumentSequence(i);
  }

  onMetroBeat(measure, beat) {
    const experience = this.experience;
    const instrumentSequences = this.instrumentSequences;
    const instrumentPrevSequences = this.instrumentPrevSequences;
    const instrumentFeatures = this.instrumentFeatures;
    let displaySelector = Math.round((32.0 / 16.0) * beat);
    const numBeats = this.config.numSteps;

    /// compute descriptors (at end of each measure)
    if (beat === 0) {
      for (let inst = 0; inst < instrumentSequences.length; inst++) {   
        let sequence = instrumentSequences[inst];
        let prevSequence = instrumentPrevSequences[inst];
        let numDifferentBeats = 0; // cumulated sequence changes ("activity")
        let autoCorr = new Array(sequence.length); // sequence autocorrelation ("groove")
        let normSequence = new Array(sequence.length);

        for (let i = 0; i < sequence.length; i++) {
          let temp = sequence[i] - prevSequence[i];
          if (temp != 0) {numDifferentBeats += 1}

          if (sequence[i] != 0) {normSequence[i] = 1} else {normSequence[i] = 0}
        }

        for (let i = 0; i < normSequence.length; i++) {
          autoCorr[i] = 0;
          for (let j = 0; j < normSequence.length - i - 1; j++) {
            autoCorr[i] += normSequence[j] * normSequence[j+i];
          }
        }
        autoCorr = autoCorr.slice(1);

        this.setInstrumentFeature(inst, 0, numDifferentBeats);
        this.setInstrumentFeature(inst, 1, autoCorr.indexOf(Math.max(...autoCorr))+1);
        console.log(instrumentFeatures[inst])
        // TODO if (instrumentFeatures[inst] === X) {} 
        
        this.setInstrumentPrevSequence(inst, sequence);
      }
    }

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

    if (beat === 0)
      console.log("BD SD HH MT PC HT LT CY -", measure);

    let str = "";
    for (let i = 0; i < instrumentSequences.length; i++) {
      const isPlacing = this.isPlacing[i];
      const sequence = instrumentSequences[i];
      const state = sequence[beat];
      let char = '.  ';

      if (isPlacing) {
        char = '|  ';
        if (beat <= numBeats / 2) {
          experience.ledDisplay.segment(i, '0x' + playerColors[i]);
        }
      }

      if (state === 1)
        char = String.fromCharCode(0x25EF) + '  ';
      else if (state === 2)
        char = String.fromCharCode(0x25C9) + '  ';
      str += char;
    }

    /// draw screen
    experience.ledDisplay.redraw();
    console.log(str, beat);
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
