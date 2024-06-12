require.config({
    paths: {
        jquery: 'https://code.jquery.com/jquery-3.6.0.min',
        postmonger: 'https://cdnjs.cloudflare.com/ajax/libs/postmonger/1.0.16/postmonger'
    }
});

require(['jquery', 'postmonger', 'activity'], function($, Postmonger, activity) {
    $(document).ready(function() {
        activity.initialize();
    });
});
