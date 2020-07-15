jQuery(document).ready(function($) {
    $(window).load(function () {
        var gmarkers = [];
        var stateChanged = false;
        var filterOptions = ['prov', 'region'];
        var infoWindow = new google.maps.InfoWindow;
        $('#stateFilter').on('change input', function(){
            stateChanged = true
            $.each(filterOptions, function(_, key){
                var opt = document.getElementById(key + 'Filter');
                opt.options.length = 0;
                opt.options[0]= new Option("None", null);
            });
        });
        $('#filter').click(filter);
        function filter() {
            clearOverlays();
            var filter_data = {'state': $('#stateFilter').val()};
            $.each(filterOptions, function(_, value){
                var filterValue = $("#" + value + 'Filter' + ' :selected').val();
                if(filterValue.toLowerCase() == "null")
                    filter_data[value] = "";    
                else
                    filter_data[value] = filterValue;
            });
            console.log(filter_data);
            $.ajax(
            {
                type: "post",
                dataType: "json",
                url: MyAjax.ajax_url,
                data: {'action': 'get_markers', 'filter_data':  filter_data},
                success: function(data){
                    if(stateChanged) {
                        $.each(filterOptions, function(_, key){
                            var opt = document.getElementById(key + 'Filter');
                            opt.options.length = 0;
                            opt.options[0] = new Option("None", null);
                            $.each(data[key], function(_, value){
                                if(value[key] != null)
                                    opt.options[opt.options.length] = new Option(value[key], value[key]);
                            });
                            opt.selectedIndex = 0;
                        });
                        stateChanged = false;
                    }
                    console.log(data);
                    Array.prototype.forEach.call(data.markers, function(markerElem) {
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
        }
        function clearOverlays() {
            for (var i = 0; i < gmarkers.length; i++ ) {
              gmarkers[i].setMap(null);
            }
            gmarkers.length = 0;
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
});