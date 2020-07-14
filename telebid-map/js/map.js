jQuery(document).ready(function($) {
    var gmarkers = [];
    var filterOptions = {
        'geonumber' : 'Geonumber',
        'elevation' : 'Elevation',
        'prov'      : 'Province',
        'region'    : 'Region',
        'state'     : 'State'};
    $.ajax(
    {
        type: "post",
        dataType: "json",
        url: MyAjax.ajax_url,
        data: {'action': 'get_markers'},
        success: function(markers){
            var infoWindow = new google.maps.InfoWindow;
            var opt = document.getElementById('filterOptions');
            $.each(filterOptions, function(key, value){
                opt.options[opt.options.length]= new Option(value, key);
            });
            Array.prototype.forEach.call(markers, function(markerElem) {
                var point = new google.maps.LatLng(
                    parseFloat(markerElem.lat),
                    parseFloat(markerElem.lng));  
                var infowincontent = document.createElement('div');
                var title = document.createElement('strong');
                title.setAttribute("id", "title");
                title.textContent = markerElem.city;
                infowincontent.appendChild(title);
                add_text(infowincontent, "Geonumber: ", markerElem.geonumber);
                add_text(infowincontent, "Elevation: ", markerElem.elevation); 
                add_text(infowincontent, "Province: ", markerElem.prov); 
                add_text(infowincontent, "Region: ", markerElem.region); 
                add_text(infowincontent, "State: ", markerElem.state);  
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                });
                $.each(filterOptions, function(key, _){ 
                    marker[key] = markerElem[key]
                });
                marker.addListener('click', function() {
                    infoWindow.setContent(infowincontent);
                    infoWindow.open(map, marker);
                });
                gmarkers.push(marker);
            
            });
        }
    });
    $('#filter').on('change input', filter);
    $('#filterOptions').on('change', filter);
    function filter() {
        var option = $('#filterOptions').val()
        var filter = $('#filter').val();
        for (i = 0; i < gmarkers.length; i++) {
            var marker = gmarkers[i];
            if (marker[option] == filter || filter.length === 0) {
                marker.setVisible(true);
            }
            else {
                marker.setVisible(false);
            }
        }
    }
    function add_text(parent, strongtext, text){
        parent.appendChild(document.createElement('br'));
        var strong = document.createElement('strong');
        strong.textContent = strongtext;
        parent.appendChild(strong);
        var content = document.createElement('text');
        content.textContent = text;
        parent.appendChild(content);
    }
});