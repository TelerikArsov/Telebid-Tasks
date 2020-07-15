jQuery(document).ready(function($) {
    $(window).load(function () {
        $('.js-example-basic-single').select2({
            theme: "classic"
        });
        var gmarkers = [];
        var stateChanged = false;
        var filterOptions = ['prov', 'region'];
        var filterInput = ['state', 'city']
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
            var filter_data = {};
            $.each(filterInput, function(_, value){
                filter_data[value] = $('#' + value + 'Filter').val();
            });
            var formattedName = filter_data['state'].toLowerCase();
            console.log(formattedName);
            if(isoCountries.hasOwnProperty(formattedName)) {
                filter_data['state'] = isoCountries[formattedName];
            }
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
                            data[key].sort(function(a, b) { 
                                if(!a[key] || !b[key])
                                    return 0;
                                return a[key].localeCompare(b[key]);
                            });
                            $.each(data[key], function(_, value){
                                if(value[key] != null)
                                    opt.options[opt.options.length] = new Option(value[key], value[key]);
                            });
                            opt.selectedIndex = 0;
                        });
                        stateChanged = false;
                    }
                    console.log(data);
                    $('#count').text("Makrker count: " + data.markers.length);
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
        var isoCountries = {
            afghanistan: "AF",
            "aland islands": "AX",
            albania: "AL",
            algeria: "DZ",
            "american samoa": "AS",
            andorra: "AD",
            angola: "AO",
            anguilla: "AI",
            antarctica: "AQ",
            "antigua and barbuda": "AG",
            argentina: "AR",
            armenia: "AM",
            aruba: "AW",
            australia: "AU",
            austria: "AT",
            azerbaijan: "AZ",
            bahamas: "BS",
            bahrain: "BH",
            bangladesh: "BD",
            barbados: "BB",
            belarus: "BY",
            belgium: "BE",
            belize: "BZ",
            benin: "BJ",
            bermuda: "BM",
            bhutan: "BT",
            bolivia: "BO",
            "bosnia and herzegovina": "BA",
            botswana: "BW",
            "bouvet island": "BV",
            brazil: "BR",
            "british indian ocean territory": "IO",
            "brunei darussalam": "BN",
            bulgaria: "BG",
            "burkina faso": "BF",
            burundi: "BI",
            cambodia: "KH",
            cameroon: "CM",
            canada: "CA",
            "cape verde": "CV",
            "cayman islands": "KY",
            "central african republic": "CF",
            chad: "TD",
            chile: "CL",
            china: "CN",
            "christmas island": "CX",
            "cocos (keeling) islands": "CC",
            colombia: "CO",
            comoros: "KM",
            congo: "CG",
            "congo, democratic republic": "CD",
            "cook islands": "CK",
            "costa rica": "CR",
            "cote d'ivoire": "CI",
            croatia: "HR",
            cuba: "CU",
            cyprus: "CY",
            "czech republic": "CZ",
            denmark: "DK",
            djibouti: "DJ",
            dominica: "DM",
            "dominican republic": "DO",
            ecuador: "EC",
            egypt: "EG",
            "el salvador": "SV",
            "equatorial guinea": "GQ",
            eritrea: "ER",
            estonia: "EE",
            ethiopia: "ET",
            "falkland islands": "FK",
            "faroe islands": "FO",
            fiji: "FJ",
            finland: "FI",
            france: "FR",
            "french guiana": "GF",
            "french polynesia": "PF",
            "french southern territories": "TF",
            gabon: "GA",
            gambia: "GM",
            georgia: "GE",
            germany: "DE",
            ghana: "GH",
            gibraltar: "GI",
            greece: "GR",
            greenland: "GL",
            grenada: "GD",
            guadeloupe: "GP",
            guam: "GU",
            guatemala: "GT",
            guernsey: "GG",
            guinea: "GN",
            "guinea-bissau": "GW",
            guyana: "GY",
            haiti: "HT",
            "heard island & mcdonald islands": "HM",
            "holy see (vatican city state)": "VA",
            honduras: "HN",
            "hong kong": "HK",
            hungary: "HU",
            iceland: "IS",
            india: "IN",
            indonesia: "ID",
            "iran, islamic republic of": "IR",
            iraq: "IQ",
            ireland: "IE",
            "isle of man": "IM",
            israel: "IL",
            italy: "IT",
            jamaica: "JM",
            japan: "JP",
            jersey: "JE",
            jordan: "JO",
            kazakhstan: "KZ",
            kenya: "KE",
            kiribati: "KI",
            "republic of korea": "KR",
            "south korea": "KR",
            "democratic people's republic of korea": "KP",
            "north korea": "KP",
            kuwait: "KW",
            kyrgyzstan: "KG",
            "lao people's democratic republic": "LA",
            latvia: "LV",
            lebanon: "LB",
            lesotho: "LS",
            liberia: "LR",
            "libyan arab jamahiriya": "LY",
            liechtenstein: "LI",
            lithuania: "LT",
            luxembourg: "LU",
            macao: "MO",
            macedonia: "MK",
            madagascar: "MG",
            malawi: "MW",
            malaysia: "MY",
            maldives: "MV",
            mali: "ML",
            malta: "MT",
            "marshall islands": "MH",
            martinique: "MQ",
            mauritania: "MR",
            mauritius: "MU",
            mayotte: "YT",
            mexico: "MX",
            "micronesia, federated states of": "FM",
            moldova: "MD",
            monaco: "MC",
            mongolia: "MN",
            montenegro: "ME",
            montserrat: "MS",
            morocco: "MA",
            mozambique: "MZ",
            myanmar: "MM",
            namibia: "NA",
            nauru: "NR",
            nepal: "NP",
            netherlands: "NL",
            "netherlands antilles": "AN",
            "new caledonia": "NC",
            "new zealand": "NZ",
            nicaragua: "NI",
            niger: "NE",
            nigeria: "NG",
            niue: "NU",
            "norfolk island": "NF",
            "northern mariana islands": "MP",
            norway: "NO",
            oman: "OM",
            pakistan: "PK",
            palau: "PW",
            "palestinian territory, occupied": "PS",
            panama: "PA",
            "papua new guinea": "PG",
            paraguay: "PY",
            peru: "PE",
            philippines: "PH",
            pitcairn: "PN",
            poland: "PL",
            portugal: "PT",
            "puerto rico": "PR",
            qatar: "QA",
            reunion: "RE",
            romania: "RO",
            "russian federation": "RU",
            rwanda: "RW",
            "saint barthelemy": "BL",
            "saint helena": "SH",
            "saint kitts and nevis": "KN",
            "saint lucia": "LC",
            "saint martin": "MF",
            "saint pierre and miquelon": "PM",
            "saint vincent and grenadines": "VC",
            samoa: "WS",
            "san marino": "SM",
            "sao tome and principe": "ST",
            "saudi arabia": "SA",
            senegal: "SN",
            serbia: "RS",
            seychelles: "SC",
            "sierra leone": "SL",
            singapore: "SG",
            slovakia: "SK",
            slovenia: "SI",
            "solomon islands": "SB",
            somalia: "SO",
            "south africa": "ZA",
            "south georgia and sandwich isl.": "GS",
            spain: "ES",
            "sri lanka": "LK",
            sudan: "SD",
            suriname: "SR",
            "svalbard and jan mayen": "SJ",
            swaziland: "SZ",
            sweden: "SE",
            switzerland: "CH",
            "syrian arab republic": "SY",
            taiwan: "TW",
            tajikistan: "TJ",
            tanzania: "TZ",
            thailand: "TH",
            "timor-leste": "TL",
            togo: "TG",
            tokelau: "TK",
            tonga: "TO",
            "trinidad and tobago": "TT",
            tunisia: "TN",
            turkey: "TR",
            turkmenistan: "TM",
            "turks and caicos islands": "TC",
            tuvalu: "TV",
            uganda: "UG",
            ukraine: "UA",
            "united arab emirates": "AE",
            "united kingdom": "GB",
            "united states": "US",
            "united states outlying islands": "UM",
            uruguay: "UY",
            uzbekistan: "UZ",
            vanuatu: "VU",
            venezuela: "VE",
            vietnam: "VN",
            "virgin islands, british": "VG",
            "virgin islands, u.s.": "VI",
            "wallis and futuna": "WF",
            "western sahara": "EH",
            yemen: "YE",
            zambia: "ZM",
            zimbabwe: "ZW"
          };
    });
});