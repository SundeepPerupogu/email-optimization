'use strict';

requirejs.config({
    paths: {
        postmonger: 'postmonger',
        jquery: 'jquery.min', // Add jquery here if it's a separate file
        app: 'app', // Define path for your app logic
        customactivity: '../customactivity' // Define path for custom activity
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'customactivity': {
            deps: ['jquery', 'postmonger']
        },
        'app': {
            deps: ['jquery', 'postmonger']
        }
        
    }
});

// Load the necessary modules
requirejs(['jquery', 'postmonger', 'customactivity', 'app'], function ($, Postmonger, app) {
    // Initialize your application here, e.g., setting up Postmonger event listeners
    var connection = new Postmonger.Session();

    // Your initialization code for customActivity
    connection.on('initActivity', function (data) {
        // Handle initialization
        console.log('Activity initialized:', data);
    });

    // Add more Postmonger event listeners as needed
});

// Handle errors
requirejs.onError = function (err) {
    if (err.requireType === 'timeout') {
        console.log('Modules timed out: ' + err.requireModules);
    }
    throw err;
};
