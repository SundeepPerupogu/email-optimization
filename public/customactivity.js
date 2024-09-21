define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        { label: 'Configure Activity', key: 'step1' }
    ];
    var currentStep = steps[0].key;

    console.log(`Starting app.js`);

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
        console.log(`Initializing the initActivity`);
        if (data) {
            payload = data;
        }

        var inArguments = payload['arguments'] && payload['arguments'].execute && payload['arguments'].execute.inArguments || [];
        console.log(JSON.stringify(payload));

        $.each(inArguments, function (index, inArgument) {
            if (inArgument.targetDate) {
                $('#targetDate').val(inArgument.targetDate);
                console.log(`Loaded targetDate: ${inArgument.targetDate}`);
            }
        });

        connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
        console.log(`Initialization complete`);
    }

    function onGetTokens(tokens) {
        console.log(`Handles tokens`);
    }

    function onGetEndpoints(endpoints) {
        console.log(`Handles endpoints`);
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
        var targetDate = $('#targetDate').val();
        console.log(`Saving targetDate: ${targetDate}`);

        payload['arguments'].inArguments = [{
            "targetDate": targetDate
        }];

        payload['metaData'].isConfigured = true;
        console.log(`Configuration saved`);

        connection.trigger('updateActivity', payload);
    }

    return {
        // Optionally expose methods or properties if needed
    };
});
