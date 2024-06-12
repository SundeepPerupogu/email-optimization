define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        { label: 'Configure Activity', key: 'step1' }
    ];
    var currentStep = steps[0].key;

	console.log(`Starting customactivity.js`);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

	$(window).ready(onRender);
	console.log(`postmonger is ready on render`);

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
            if (inArgument.timezoneOffset) {
                $('#timezoneOffset').val(inArgument.timezoneOffset);
		console.log(JSON.stringify(inArgument.timezoneOffset));
            }
		
            if (inArgument.triggerTime) {
                $('#triggerTime').val(inArgument.triggerTime);
		console.log(JSON.stringify(inArgument.triggerTime));
            }

            if (inArgument.daytype) {
                $('#daytype').val(inArgument.daytype);
		console.log(JSON.stringify(inArgument.daytype));
            }
        });

        connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
	console.log(`Initializing is done`);
    }

    function onGetTokens(tokens) {
        // Handle tokens
	console.log(`Handles token`);
    }

    function onGetEndpoints(endpoints) {
        // Handle endpoints
	console.log(`Handles endpoints`);
    }

    function onClickedNext() {
        save();
        connection.trigger('nextStep');
	console.log(`Clicked on save`);
    }

    function onClickedBack() {
        connection.trigger('prevStep');
	console.log(`Clicked on prevStep`);
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
	console.log(`Clicked on step`);
    }

    function showStep(step) {
        currentStep = step;

        $('.step').hide();
        $('#' + step).show();
	console.log(`View step`);
    }

    function save() {
        var timezoneOffset = $('#timezoneOffset').val();
        var triggerTime = $('#triggerTime').val();
        var daytype = $('#daytype').val();
	console.log(`Start save function`);

        payload['arguments'].execute.inArguments = [{
            "timezoneOffset": timezoneOffset,
            "triggerTime": triggerTime,
            "daytype": daytype
        }];

        payload['metaData'].isConfigured = true;
	console.log(`metaData configured`);

        connection.trigger('updateActivity', payload);
    }

    return {
	console.log('Returning..');
	console.log(JSON.stringify(payload));
        // Optionally expose methods or properties if needed
    };
});
