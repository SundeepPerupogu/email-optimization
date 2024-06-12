
    var activity = {};

    activity.initialize = function() {
        connection.trigger('ready');
        $('#custom-activity-form').on('submit', activity.calculateNextSendTime);
        console.log(`Started Initialize in activity.js`);
    };

    activity.calculateNextSendTime = function(event) {
        event.preventDefault();

        console.log(`Started executing function: calculateNextSendTime`);
        var timeZone = $('#time_zone').val();
        var startWindow = $('#start_window').val();
        var endWindow = $('#end_window').val();

        // Validation
        if (!validateTimeFormat(startWindow) || !validateTimeFormat(endWindow) || startWindow === endWindow) {
            alert('Invalid input. Please check the time format and ensure start and end windows are different.');
            return;
        }

        var nextSendTime = getNextSendTime(timeZone, startWindow, endWindow);
        $('#result').text('Next Send Time: ' + nextSendTime);
    };

    function validateTimeFormat(timeStr) {
        // Validate time format as ISO8601 UTC time string
        var regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$/;
        console.log(`Validating input params in activity.js`);
        return regex.test(timeStr);
    }

    function getNextSendTime(timeZone, startWindow, endWindow) {
        var now = new Date();
        var utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        console.log(`Started main function getNextSendTime`);
        
        var [startHour, startMinute, startSecond] = startWindow.split(':').map(Number);
        var [endHour, endMinute, endSecond] = endWindow.split(':').map(Number);
        
        var offset = parseTimeZoneOffset(timeZone);
        var userStartWindow = new Date(utcNow);
        var userEndWindow = new Date(utcNow);

        userStartWindow.setUTCHours(startHour, startMinute - offset, startSecond, 0);
        userEndWindow.setUTCHours(endHour, endMinute - offset, endSecond, 0);

        var todayStart = new Date(userStartWindow);
        var todayEnd = new Date(userEndWindow);
        var tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        var tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

        console.log(`Var declared`);
        if (startWindow < endWindow) {
            if (utcNow >= todayStart && utcNow <= new Date(todayEnd.getTime() - 5 * 60 * 1000)) {
                return todayStart.toISOString();
            } else {
                return tomorrowStart.toISOString();
            }
        } else {
            if (utcNow >= todayStart && utcNow <= new Date(tomorrowEnd.getTime() - 5 * 60 * 1000)) {
                return todayStart.toISOString();
            } else {
                return tomorrowStart.toISOString();
            }
        }
    }

    function parseTimeZoneOffset(offset) {
        var [hours, minutes] = offset.split(':').map(Number);
        return hours * 60 + minutes;
        console.log(`Executed parseTimeZoneOffset function`);
    }

    return activity;
