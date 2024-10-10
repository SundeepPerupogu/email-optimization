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
  //  connection.on('initActivity', function(data) {
        // Log all metadata settings
  //      console.log('Activity Metadata:', data);
    
        // Access specific fields
   //     if (data && data.settings) {
   //         const { settings } = data;
   //         console.log('Event Definition Key:', settings.triggers[0].metaData.eventDefinitionKey);
   //         console.log('Event Definition ID:', settings.triggers[0].metaData.eventDefinitionId);
   //         console.log('All Settings:', JSON.stringify(settings, null, 2)); // Pretty-print all settings
   //     }
   // });

    // Other Postmonger event handlers
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

async function fetchToken() {
    const tokenUrl = 'https://mczjnvsmqwr9kd91bfptvyhht3p1.auth.marketingcloudapis.com/v2/token'; // Replace with your actual Authentication Base URI 

    const tokenBody = {
        grant_type: 'client_credentials',
        client_id: 'wpfbokn7hdg18a6i5tymneyh', // Replace with your actual client Id
        client_secret: 'Ze25LZCAKYlEjuEuQaPMkCsA' // Replace with your actual client secret
    };

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenBody)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch token: ' + response.statusText);
        }

        const data = await response.json();
        accessToken = data.access_token;

        console.log('Access Token:', accessToken);
        return accessToken; // Optionally return the token for further use
    } catch (error) {
        console.error('Error at :', error.message);
    }
}
	
function initialize(data) {
    console.log(`Initializing the initActivity`);
    
    // If data is provided, set the payload
    if (data) {
        payload = data;
    }

    // Get inArguments from payload
    var inArguments = payload['arguments'] && payload['arguments'].execute && payload['arguments'].execute.inArguments || [];
    console.log(JSON.stringify(payload));

    // Iterate through each inArgument to populate the form
    $.each(inArguments, function (index, inArgument) {
       // if (inArgument.timezoneOffset) {
        //    $('#timezone-offset').val(inArgument.timezoneOffset); // Ensure the ID matches the input in index.html
        //    console.log(JSON.stringify(inArgument.timezoneOffset));
        //}

        if (inArgument.start_window) {
            const startWindowParts = inArgument.start_window.split(':');
            $('#start-hour').val(startWindowParts[0]);  // Assuming you have an input with ID start-hour
            $('#start-minute').val(startWindowParts[1]); // Assuming you have an input with ID start-minute
            console.log(JSON.stringify(inArgument.start_window));
        }

        if (inArgument.end_window) {
            const endWindowParts = inArgument.end_window.split(':');
            $('#end-hour').val(endWindowParts[0]);  // Assuming you have an input with ID end-hour
            $('#end-minute').val(endWindowParts[1]); // Assuming you have an input with ID end-minute
            console.log(JSON.stringify(inArgument.end_window));
        }

        if (inArgument.daytype) {
            $('#day-type').val(inArgument.daytype); // Ensure the ID matches the input in index.html
            console.log(JSON.stringify(inArgument.daytype));
        }

        // If there's a field named 'Name' in your payload
       // if (inArgument.Name) {
       //     $('#Name').val(inArgument.Name); // Ensure the ID matches the input in index.html
       //     console.log(JSON.stringify(inArgument.Name));
       // }
    });

    // Update the next button state
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
    // Fetch values from the user-filled form
  //  var timezoneOffset = $('#timezone-offset').val();
    var startHour = $('#start-hour').val();
    var startMinute = $('#start-minute').val();
    var endHour = $('#end-hour').val();
    var endMinute = $('#end-minute').val();
    var daytype = $('#day-type').val();

    console.log(`Payload before saving: ${JSON.stringify(payload)}`);
    console.log(`Start save function`);

    // Set the inArguments with the user input values
    payload['arguments'].execute.inArguments = [{
        "timezoneOffset": "{{Event." + eventDefinitionKey + '."timezoneOffset"}}',
        "start_window": `${startHour}:${startMinute}:00Z`,
        "end_window": `${endHour}:${endMinute}:00Z`,
        "daytype": daytype,
	"eventDefinitionId": eventDefinitionId,
	"eventDefinitionKey": eventDefinitionKey   
    }];

    // Mark the metaData as configured
    payload['metaData'].isConfigured = true;
    console.log(`metaData configured`,payload);
    console.log("eventDefKey :", eventDefinitionKey);
    console.log("eventDefinitionId", eventDefinitionId);    
	
    // Trigger the updateActivity event with the updated payload
    connection.trigger('updateActivity', payload);
    }

    // Ensure to return the necessary methods if required
    return {
        save: save
    };

});
