import 'source-map-support/register'; // enable sourcemaps in node
import path from 'path';
import { server, ControllerExperience } from 'soundworks/server';
import neoPixelDisplay from './neoPixelDisplay';
import BarrelExperience from './BarrelExperience';
import PlayerExperience from './PlayerExperience';

const configName = process.env.ENV || 'default';
const configPath = path.join(__dirname, 'config', configName);
let config = null;

try {
  config = require(configPath).default;
} catch(err) {
  console.error(`Invalid ENV "${configName}", file "${configPath}.js" not found`);
  process.exit(1);
}

process.env.NODE_ENV = config.env;

server.init(config);

server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    env: config.env,
    socketIO: config.socketIO,
    appName: config.appName,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});

const sharedParams = server.require('shared-params');
sharedParams.addText('numPlayers', 'num players', 0, ['controller']);
sharedParams.addText('temperature', 'temperature', 0, ['controller']);
sharedParams.addEnum('scene', 'scene', ['off', 'co-909', 'collective-loops', 'co-mix', 'wwry-r'], 'co-909');
sharedParams.addNumber('outputGain0', 'output 0 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain1', 'output 1 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain2', 'output 2 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain3', 'output 3 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain4', 'output 4 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain5', 'output 5 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain6', 'output 6 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('outputGain7', 'output 7 gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('wooferGain', 'woofer gain', -40, 20, 1, 0, ['controller', 'barrel']);
sharedParams.addNumber('wooferCutoff', 'woofer cutoff', 50, 500, 5, 250, ['controller', 'barrel']);
sharedParams.addNumber('barrelDelay', 'barrel delay', 0, 0.1, 0.02, 0.001, ['controller', 'barrel']);
sharedParams.addNumber('tempo', 'tempo', 60, 240, 5, 120, ['player', 'controller']);
sharedParams.addTrigger('clear', 'clear players');
sharedParams.addTrigger('reload', 'reload players');

sharedParams.addTrigger('reload-barrel', 'reload barrel', ['barrel']);
sharedParams.addTrigger('reset-big', 'reset BIG', ['barrel']);

sharedParams.addNumber('ui-delay-players', 'UI delay players (ms)', 0, 1000, 1, 0, ['player']);
sharedParams.addNumber('led-delay', 'LED delay (ms)', 0, 1000, 1, 0, ['barrel']);
sharedParams.addNumber('led-brightness', 'LED brightness', 0, 9, 1, 9, ['barrel']);


const serialPath = '/dev/tty.wchusbserial1420'; // test mac
// const serialPath = '/dev/ttyUSB0'; // RPi USB
// const serialPath = '/dev/ttyS0';   // RPi Tx/Rx
const baudRate = 9600;

neoPixelDisplay.init(serialPath, baudRate).then(() => {
  const playerExperience = new PlayerExperience('player', neoPixelDisplay);
  const controllerExperience = new ControllerExperience('controller');
  const barrelExperience = new BarrelExperience('barrel', playerExperience);

  sharedParams.addParamListener('led-brightness', value => {
    neoPixelDisplay.send('BRIGHTNESS', value);
  });

  console.log('server, start');
  server.start();
}).catch(err => {
  console.log(err.message);
  if (err === 'no arduino') {
    console.log('>> not connected to arduino or wrong serial path - mocking ardiuno');
    console.log('>> mocking neoPixelDisplay');
    const neoPixelDisplayStub = {
      send(...args) {
        // console.log(...args);
      },
    };

    const playerExperience = new PlayerExperience('player', neoPixelDisplayStub);
    const controllerExperience = new ControllerExperience('controller');
    const barrelExperience = new BarrelExperience('barrel', playerExperience);

    server.start();
  }
});
