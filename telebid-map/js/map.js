jQuery(document).ready(function($) {
    var data = {
        'action': 'get_markers',
    };
    jQuery.post(MyAjax.ajax_url, data, function(response) {
        console.log(response);
    });
});