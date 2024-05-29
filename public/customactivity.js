'use strict';

define(['postmonger'], function (Postmonger) {
    const connection = new Postmonger.Session();

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('clickedNext', save);

    function onRender() {
        connection.trigger('ready');
    }

    function initialize(payload) {
        if (payload.arguments && payload.arguments.execute && payload.arguments.execute.inArguments) {
            const inArguments = payload.arguments.execute.inArguments;
            const startWindow = inArguments.find(arg => arg.start_window).start_window;
            const endWindow = inArguments.find(arg => arg.end_window).end_window;
            
            $('#start_window').val(startWindow);
            $('#end_window').val(endWindow);
        }
    }

    function save() {
        const startWindow = $('#start_window').val();
        const endWindow = $('#end_window').val();
        
        const payload = {
            arguments: {
                execute: {
                    inArguments: [
                        { start_window: startWindow },
                        { end_window: endWindow }
                    ]
                }
            }
        };

        connection.trigger('updateActivity', payload);
    }
});
