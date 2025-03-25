const { Device } = require('homey');

class PingDevice extends Device {
  async onInit() {
    this.log('Ping device initialized');
  }
}

module.exports = PingDevice;
