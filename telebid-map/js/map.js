jQuery(document).ready(function($) {
    jQuery.ajax(
    {
        type: "post",
        dataType: "json",
        url: MyAjax.ajax_url,
        data: {'action': 'get_markers'},
        success: function(markers){
            Array.prototype.forEach.call(markers, function(markerElem) {
                var point = new google.maps.LatLng(
                    parseFloat(markerElem.lat),
                    parseFloat(markerElem.lng));            
                var marker = new google.maps.Marker({
                    map: map,
                    position: point
                });
            
            });
        }
    });
});