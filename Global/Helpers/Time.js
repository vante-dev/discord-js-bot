const throwError = (message) => {
  throw new TypeError(message);
};

const getMilliseconds = (time, factor) => {
  const result = Math.floor(time / factor);
  time -= result * factor;
  return { result, time };
};

module.exports = {
  read24hrFormat: (text = '') => {
    if (!text) return 0;
    const result = text.split(':').concat('00');

    let ms = 0;
    for (let i = result.length - 1, j = 0; i >= 0; i--, j++) {
      const k = Math.abs(parseInt(result[i], 10) * 1000 * Math.pow(60, j < 3 ? j : 2));
      ms += k;
    }

    if (isFinite(ms)) {
      return ms;
    } else {
      throwError('Final value is greater than Number can hold.');
    }
  },

  getReadableTime: (ms = 0) => {
    if (!ms || isNaN(ms) || !isFinite(ms)) {
      throwError('You need to pass a total number of milliseconds!');
    }
    const t = module.exports.getTimeObject(ms);
    const reply = Object.entries(t)
      .map(([unit, value]) => (value ? `${value} ${unit}` : null))
      .filter(Boolean)
      .join(', ');

    return reply || '0 sec';
  },

  getTimeObject: (ms = 0) => {
    if (!ms || isNaN(ms) || !isFinite(ms)) {
      throwError('Final value is greater than Number can hold or you provided an invalid argument.');
    }

    const units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
    const result = { milliseconds: Math.floor(ms) };

    for (let i = 0; i < units.length; i++) {
      const factor = [3.154e10, 2.592e9, 8.64e7, 3.6e6, 60000, 1000][i];
      const { result: unitValue, time } = getMilliseconds(result.milliseconds, factor);

      if (unitValue >= 1) {
        result[units[i]] = unitValue;
        result.milliseconds = time;
      }
    }

    return result;
  },

  getTotalTime: (timeFormat) => {
    if (!/(d|h|m|s)$/.test(timeFormat) || isNaN(timeFormat.slice(0, -1))) {
      return { error: 'time:INCORRECT_DELIMITERS or time:INVALID_TIME' };
    }

    const time = require('ms')(timeFormat);

    if (time >= 864000000) {
      return { error: 'time:MAX_TIME' };
    }

    return { success: time };
  },

  addCommasToString: (nStr) => {
    nStr += '';
    const [integerPart, decimalPart = ''] = nStr.split('.');
    const rgx = /(\d+)(\d{3})/;

    const formattedIntegerPart = integerPart.replace(rgx, '$1' + ',' + '$2');

    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  },

  ordinalize: (number) => {
    const lastDigit = number % 10;
    const secondLastDigit = Math.floor((number % 100) / 10);

    if (secondLastDigit === 1 || lastDigit > 3 || lastDigit === 0) {
      return number + 'th';
    } else {
      const suffixes = ['st', 'nd', 'rd'];
      return number + suffixes[lastDigit - 1];
    }
  },

  convertTime: (millisec) => {
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = '';

    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = (hours >= 10) ? hours : '0' + hours;
      minutes = minutes - (hours * 60);
      minutes = (minutes >= 10) ? minutes : '0' + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : '0' + seconds;

    if (hours !== '') {
      return `${hours}h:${minutes}m:${seconds}s`;
    }

    return `${minutes}m:${seconds}s`;
  },

  textTrunctuate: function (str, length = 100, ending = '...') {
    return str.length > length ? str.substring(0, length - ending.length) + ending : str;
  },

  timeZoneConvert: function (data) {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date1 = new Date(data);
    const date = date1.getDate();
    const year = date1.getFullYear();
    const month = months[date1.getMonth() + 1];

    let h = date1.getHours();
    let m = date1.getMinutes();
    let ampm = 'AM';

    if (m < 10) {
      m = '0' + m;
    }

    if (h >= 12) {
      ampm = 'PM';
      h = (h > 12) ? h - 12 : h;
    }

    return `${month} ${date}, ${year} ${h}:${m} ${ampm}`;
  },

  commatize: function (nStr) {
    nStr += '';
    const [integerPart, decimalPart = ''] = nStr.split('.');
    const rgx = /(\d+)(\d{3})/;

    const formattedIntegerPart = integerPart.replace(rgx, '$1' + ',' + '$2');

    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  },

  formatTime: function (time) {
    if (!time) return '00:00';

    const duration = moment.duration(time);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const formattedTime = [days, hours, minutes, seconds]
        .map(unit => unit.toString().padStart(2, '0'))
        .join(':');

    return formattedTime;
}

};
