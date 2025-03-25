const Homey = require('homey');
const ping = require('ping');

class PingWatcherApp extends Homey.App {
  async onInit() {
    this.log('Ping Watcher app is running...');

    this.failureCount = 0;
    this.failureThreshold = 2;
    this.ip = '192.168.0.98'; // <-- Het IP-adres dat jij wilt checken

    this.startPinging();
  }

  startPinging() {
    setInterval(async () => {
      const res = await ping.promise.probe(this.ip, { timeout: 2 });
      if (!res.alive) {
        this.failureCount++;
        this.log(`${this.ip} is offline (${this.failureCount}x)`);

        if (this.failureCount >= this.failureThreshold) {
          this.failureCount = 0;
          this.log('Triggering flow: IP unreachable');
          this.homey.flow.trigger('ip_unreachable').catch(this.error);
        }
      } else {
        this.failureCount = 0;
        this.log(`${this.ip} is online`);
      }
    }, 60000); // elke 60 seconden
  }
}

module.exports = PingWatcherApp;
