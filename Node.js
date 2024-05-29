const moment = require('moment-timezone');

class SendTimeCalculator {
    constructor(startWindow, endWindow) {
        this.startWindow = startWindow;
        this.endWindow = endWindow;
    }

    validate() {
        const isoTimeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$/;
        if (!isoTimeFormat.test(this.startWindow) || !isoTimeFormat.test(this.endWindow)) {
            throw new Error("Start window and end window must be in ISO8601 time format (HH:MM:SSZ).");
        }

        if (this.startWindow === this.endWindow) {
            throw new Error("Start window and end window must not be the same.");
        }
    }

    calculateNextSendTime(timeZone) {
        const startWindowUTC = moment.utc(this.startWindow, "HH:mm:ssZ");
        const endWindowUTC = moment.utc(this.endWindow, "HH:mm:ssZ");

        const currentDatetimeUTC = moment.utc();
        const currentDateUTC = currentDatetimeUTC.clone().startOf('day');

        const userStartWindow = startWindowUTC.clone().tz(timeZone);
        const userEndWindow = endWindowUTC.clone().tz(timeZone);

        if (userStartWindow.isBefore(userEndWindow)) {
            if (currentDatetimeUTC.isBetween(userStartWindow, userEndWindow.subtract(5, 'minutes'))) {
                return userStartWindow.toISOString();
            } else {
                return userStartWindow.add(1, 'day').toISOString();
            }
        } else {
            if (currentDatetimeUTC.isBetween(userStartWindow, userEndWindow.add(1, 'day').subtract(5, 'minutes'))) {
                return userStartWindow.toISOString();
            } else {
                return userStartWindow.add(1, 'day').toISOString();
            }
        }
    }
}

module.exports = SendTimeCalculator;
