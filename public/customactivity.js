define(['postmonger'], function (Postmonger) {
    'use strict';

    var connection = new Postmonger.Session();
    var eventDefinitionKey;
    var eventDefinitionId;
    var payload = {};
    var steps = [
        { label: 'Configure Activity', key: 'step1' }
    ];
    var currentStep = steps[0].key;

    console.log(`Starting customactivity.js`);

    connection.on('initActivity', initialize);
    connection.on('ready', function() {
        console.log('Postmonger is ready');
    });
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    connection.trigger('requestInteraction');

    connection.on('requestedInteraction', function(settings){
        console.log("settings", settings);
        eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
        eventDefinitionId = settings.triggers[0].metaData.eventDefinitionId;    
    });

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
            if (inArgument.start_window) {
                const startWindowParts = inArgument.start_window.split(':');
                $('#start-hour').val(startWindowParts[0]);
                $('#start-am-pm').val(startWindowParts[2] === '00' ? 'AM' : 'PM'); // Example logic for AM/PM
                console.log(JSON.stringify(inArgument.start_window));
            }

            if (inArgument.daytype) {
                $('#day-type').val(inArgument.daytype);
                console.log(JSON.stringify(inArgument.daytype));
            }
        });

        connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
        console.log(`Initializing is done`);
    }

    function onGetTokens(tokens) {
        console.log(`Handles token`);
    }

    function onGetEndpoints(endpoints) {
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
        var startHour = $('#start-hour').val();
        var amPm = $('#start-am-pm').val();
        var daytype = $('#day-type').val();

        console.log(`Payload before saving: ${JSON.stringify(payload)}`);
        console.log(`Start save function`);

        // Format start_window correctly for saving
        const formattedHour = amPm === 'PM' && startHour !== '12' ? 
            String(Number(startHour) + 12).padStart(2, '0') : 
            (amPm === 'AM' && startHour === '12' ? '00' : startHour);
        const start_window = `${formattedHour}:00:00Z`;

        payload['arguments'].execute.inArguments = [{
            "timezoneOffset": "{{Event." + eventDefinitionKey + '."timezoneOffset"}}',
            "start_window": start_window,
            "daytype": daytype,
            "eventDefinitionId": eventDefinitionId,
            "eventDefinitionKey": eventDefinitionKey,
            "contactKey": "{{Context.ContactKey}}",    
            "executionMode": "{{Context.ExecutionMode}}",
            "definitionId": "{{Context.DefinitionId}}",
            "activityId": "{{Activity.Id}}",
            "startActivityKey": "{{Context.StartActivityKey}}",
            "definitionInstanceId": "{{Context.DefinitionInstanceId}}",
            "requestObjectId": "{{Context.RequestObjectId}}"
        }];

        payload['metaData'].isConfigured = true;
        console.log('metaData configured', payload);

        connection.trigger('updateActivity', payload);
    }

    return {
        save: save
    };
});
