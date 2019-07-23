import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';

const protocols = {
  NORMAL: 0,
  HIGHLIGHT: 1,
  SOLO: 2,
};

// players: ["FF0000", "00FF55", "023EFF", "FFFF00", "D802FF", "00FFF5", "FF0279", "FF9102"],

const neoPixelDisplay = {
  init(path, baudRate = 9600) {
    return new Promise((resolve, reject) => {
      console.log(`> opening serial port "${path}" (baudrate: ${baudRate})`)
      this.port = new SerialPort(path, { baudRate });

      this.port.on('open', () => {
        console.log('port opened');
        resolve();
      });

      this.port.on('error', (err) => {
        console.error(err);
        reject('no arduino');
      });

      // get feedback from arduino
      this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));
      this.parser.on('data', line => console.log('> serial: ' + line));
    });
  },

  send(protocol, ...args) {
    const msg = `${protocols[protocol]}${args.join('')}\n`;
    console.log(msg);

    this.port.write(msg, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }

      console.log('message written');
    });
  },
}

export default neoPixelDisplay;

