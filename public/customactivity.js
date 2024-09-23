define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        { label: 'Configure Activity', key: 'step1' }
    ];
    var currentStep = steps[0].key;

    console.log(`Starting app.js`);

    // Event listeners for Postmonger
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    $(window).ready(onRender);
    console.log(`Postmonger is ready on render`);

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

    function initialize(data) {
        console.log(`Initializing activity`);
        if (data) {
            payload = data;
        }

        // Load inArguments into the form fields
        var inArguments = payload['arguments'] && payload['arguments'].execute && payload['arguments'].execute.inArguments || [];
        $.each(inArguments, function (index, inArgument) {
            if (inArgument.timezoneOffset) {
                $('#timezone-offset').val(inArgument.timezoneOffset);
            }
            if (inArgument.start_window) {
                $('#start-window').val(inArgument.start_window);
            }
            if (inArgument.end_window) {
                $('#end-window').val(inArgument.end_window);
            }
            if (inArgument.daytype) {
                $('#day-type').val(inArgument.daytype);
            }
        });

        connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
        console.log(`Initialization complete`);
    }

    function onGetTokens(tokens) {
        console.log(`Received tokens: ${JSON.stringify(tokens)}`);
    }

    function onGetEndpoints(endpoints) {
        console.log(`Received endpoints: ${JSON.stringify(endpoints)}`);
    }

    function onClickedNext() {
        save();
        connection.trigger('nextStep');
        console.log(`Clicked on next`);
    }

    function onClickedBack() {
        connection.trigger('prevStep');
        console.log(`Clicked on back`);
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
        console.log(`Navigated to step: ${step}`);
    }

    function showStep(step) {
        currentStep = step;
        $('.step').hide();
        $('#' + step).show();
        console.log(`Showing step: ${step}`);
    }

    function save() {
        // Gather form input values
        var timezoneOffset = $('#timezone-offset').val();
        var startWindow = $('#start-window').val();
        var endWindow = $('#end-window').val();
        var dayType = $('#day-type').val();

        payload['arguments'].inArguments = [{
            "timezoneOffset": timezoneOffset,
            "start_window": startWindow,
            "end_window": endWindow,
            "daytype": dayType
        }];

        payload['metaData'].isConfigured = true;
        console.log(`Configuration saved: ${JSON.stringify(payload)}`);

        connection.trigger('updateActivity', payload);
    }

    return {
        // Optionally expose methods or properties if needed
    };
});
