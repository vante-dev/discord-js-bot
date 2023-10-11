const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs().format();
dayjs.extend(duration);

/**
 * Converts a string in 24-hour time format (HH:mm:ss) to milliseconds.
 * 
 * @param {string} text - The input time string in 24-hour format.
 * @returns {number} The equivalent time in milliseconds.
 * @throws {TypeError} Throws an error if the final value exceeds the limit of a Number.
 */
module.exports.read24hrFormat = (text) => {
    let j, k, ms;
    j = k = ms = 0;

    if (!text) return 0;
    const result = text.split(/:/);

    if (result.length === 3) result.push('00');

    for (let i = result.length - 1; i >= 0; i--) {
        k = Math.abs(parseInt(result[i]) * 1000 * Math.pow(60, j < 3 ? j : 2));
        j++;
        ms += k;
    }

    if (isFinite(ms)) {
        return ms;
    } else {
        throw new TypeError('Final value is greater than Number can hold.');
    }
};

/**
 * Converts a total number of milliseconds into a human-readable time format.
 * 
 * @param {number} ms - The total number of milliseconds to be converted.
 * @returns {string} The human-readable time format.
 * @throws {TypeError} Throws an error if the input is not a valid finite number of milliseconds.
 */
module.exports.getReadableTime = (ms) => {
	if (!ms || ms && !isFinite(ms)) {throw new TypeError('You need to pass a total number of milliseconds! (That number cannot be greater than Number limits)');}
	if (typeof ms !== 'number') {throw new TypeError(`You need to pass a number! Instead received: ${typeof ms}`);}
	const t = this.getTimeObject(ms);
	const reply = [];
	if (t.years) 	reply.push(`${t.years} yrs`);
	if (t.months) reply.push(`${t.months} mo`);
	if (t.days) reply.push(`${t.days} d`);
	if (t.hours) reply.push(`${t.hours} hrs`);
	if (t.minutes) reply.push(`${t.minutes} min`);
	if (t.seconds) reply.push(`${t.seconds} sec`);
	return reply.length > 0 ? reply.join(', ') : '0sec';
};

/**
 * Converts a total number of milliseconds into a time object representing years, months, days, hours, minutes, and seconds.
 * 
 * @param {number} ms - The total number of milliseconds to be converted.
 * @returns {Object} The time object representing the breakdown of milliseconds into various time units.
 * @throws {TypeError} Throws an error if the input is not a valid finite number of milliseconds.
 */
module.exports.getTimeObject = (ms) => {
	if (!ms || typeof ms !== 'number' || !isFinite(ms)) throw new TypeError('Final value is greater than Number can hold or you provided invalid argument.');
	const result = {
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: Math.floor(ms),
	};
		// Calculate time in rough way
	while (result.milliseconds >= 1000) {
		if (result.milliseconds >= 3.154e+10) {
			result.years++;
			result.milliseconds -= 3.154e+10;
		}
		if (result.milliseconds >= 2.592e+9) {
			result.months++;
			result.milliseconds -= 2.592e+9;
		}
		if (result.milliseconds >= 8.64e+7) {
			result.days++;
			result.milliseconds -= 8.64e+7;
		}
		if (result.milliseconds >= 3.6e+6) {
			result.hours++;
			result.milliseconds -= 3.6e+6;
		}
		if (result.milliseconds >= 60000) {
			result.minutes++;
			result.milliseconds -= 60000;
		}
		if (result.milliseconds >= 1000) {
			result.seconds++;
			result.milliseconds -= 1000;
		}
	}
	// Make it smooth, aka sort
	if (result.seconds >= 60) {
		result.minutes += Math.floor(result.seconds / 60);
		result.seconds = result.seconds - (Math.floor(result.seconds / 60) * 60);
	}
	if (result.minutes >= 60) {
		result.hours += Math.floor(result.minutes / 60);
		result.minutes = result.minutes - (Math.floor(result.minutes / 60) * 60);
	}
	if (result.hours >= 24) {
		result.days += Math.floor(result.hours / 24);
		result.hours = result.hours - (Math.floor(result.hours / 24) * 24);
	}
	if (result.days >= 30) {
		result.months += Math.floor(result.days / 30);
		result.days = result.days - (Math.floor(result.days / 30) * 30);
	}
	if (result.months >= 12) {
		result.years += Math.floor(result.months / 12);
		result.months = result.months - (Math.floor(result.months / 12) * 12);
	}
	return result;
};

/**
 * Converts a time format (e.g., "1m") into milliseconds for timed commands.
 * 
 * @param {string} timeFormat - The time format to be converted, ending with a valid time delimiter (d, h, m, s).
 * @returns {Object} An object containing either an error or the success with the converted time in milliseconds.
 */
module.exports.getTotalTime = (timeFormat) => {
    // Make sure it ends with the correct time delimiter
    if (!timeFormat.endsWith('d') && !timeFormat.endsWith('h') && !timeFormat.endsWith('m') && !timeFormat.endsWith('s')) {
        return { error: 'time:INCORRECT_DELIMITERS' };
    }
    
    // Make sure it's a number in front of the time delimiter
    if (isNaN(timeFormat.slice(0, -1))) {
        return { error: 'time:INVALID_TIME' };
    }

    // Convert timeFormat to milliseconds
    const time = require('ms')(timeFormat);

    // Make sure time isn't over 10 days
    if (time >= 864000000) {
        return { error: 'time:MAX_TIME' };
    }

    // Return the converted time to the requesting command
    return { success: time };
};

/**
 * Adds commas to a string representation of a number to improve readability.
 * 
 * @param {string} nStr - The input string representing a number.
 * @returns {string} The input string with commas added for improved readability.
 */
module.exports.addCommasToString = (nStr) => {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

/**
 * Converts a number to its ordinal representation.
 * @param {number} number - The input number.
 * @returns {string} The ordinal representation of the input number.
 */
module.exports.ordinalize = (number) => {
    // Convert the number to a string.
    number += '';
    
    // Check if the input is not a number.
    if (isNaN(number)) return number;

    // Extract the last digit and the second-to-last digit.
    const lastDigit = number % 10;
    const secondLastDigit = Math.floor((number % 100) / 10);

    // Determine the ordinal suffix based on the extracted digits.
    if (secondLastDigit === 1) {
        return number + "th";
    } else if (lastDigit === 1) {
        return number + "st";
    } else if (lastDigit === 2) {
        return number + "nd";
    } else if (lastDigit === 3) {
        return number + "rd";
    } else {
        return number + "th";
    }
};

/**
 * Converts a time duration in milliseconds to a formatted string representation.
 * @param {number} millisec - The time duration in milliseconds.
 * @returns {string} The formatted string representation of the time duration.
 */
module.exports.convertTime = function (millisec) {
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = "";

    // If the duration is greater than 59 minutes, calculate hours.
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;

    if (hours !== "") {
        return hours + "h:" + minutes + "m:" + seconds + "s";
    }

    return minutes + "m:" + seconds + "s";
};


/**
 * Truncates a given string to a specified length and adds an optional ending.
 * @param {string} str - The input string to be truncated.
 * @param {number} length - The maximum length of the truncated string.
 * @param {string} [ending='...'] - Optional ending to add to the truncated string.
 * @returns {string} The truncated string with an optional ending.
 */
module.exports.textTrunctuate = function (str, length, ending) {
    // Set default values for length and ending if they are not provided.
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }

    // Truncate the string if its length exceeds the specified length.
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};


/**
 * Converts a given date string into a formatted date and time representation.
 * @param {string} data - The input date string.
 * @returns {string} The formatted date and time representation.
 */
module.exports.timeZoneConvert = function (data) {
    var months = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Create a Date object from the input date string.
    const date1 = new Date(data);
    
    // Extract relevant components of the date.
    const date = date1.getDate();
    const year = date1.getFullYear();
    const month = months[date1.getMonth() + 1];
    let h = date1.getHours();
    let m = date1.getMinutes();
    let ampm = "AM";
    
    // Add leading zero to minutes if needed.
    if (m < 10) {
        m = "0" + m;
    }
    
    // Convert hours to 12-hour clock and adjust AM/PM accordingly.
    if (h >= 12) {
        ampm = "PM";
        if (h > 12) {
            h -= 12;
        }
    }
    
    // Construct the formatted date and time representation.
    return month + " " + date + ", " + year + " " + h + ":" + m + " " + ampm;
};

/**
 * Adds comma separators to a numerical string for thousands.
 * @param {string|number} nStr - The numerical string or number.
 * @returns {string} The numerical string with added comma separators.
 */
module.exports.commatize = function (nStr) {
    nStr += '';

    // Split the input into integer and decimal parts.
    const x = nStr.split('.');
    var x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';

    // Use regular expression to add comma separators to the integer part.
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    // Combine the integer and decimal parts and return the result.
    return x1 + x2;
};

/**
* Formats time
* @param {number} time
* @returns {string}
*/
module.exports.format_time = function (time) {
    if (!time) return "00:00";
    const format = dayjs.duration(time).format("DD:HH:mm:ss");
    const chunks = format.split(":").filter(c => c !== "00");

    if (chunks.length < 2) chunks.unshift("00");

    return chunks.join(":");
  }