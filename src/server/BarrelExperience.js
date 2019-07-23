import { Experience } from 'soundworks/server';

export default class BarrelExperience extends Experience {
  constructor(clientType, playerExperience) {
    super(clientType);

    this.sharedParams = this.require('shared-params');
    this.audioBufferManager = this.require('audio-buffer-manager');
    this.metricScheduler = this.require('metric-scheduler');

    this.playerExperience = playerExperience;
  }

  enter(client) {
    // @note - this only works with co-909
    this.receive(client, 'initSequences', () => {
      const sequences = this.playerExperience.currentScene.instrumentSequences;
      this.send(client, 'initSequences', sequences);
    });

  }
}
