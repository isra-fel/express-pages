/* global radarData */
/* global Chart */

//Get the context of the canvas element we want to select
var ctx = document.getElementById('chart').getContext("2d");
var myNewChart;
var rootUrl = window.location.origin + '/characteristics/';

var ip = document.getElementById('input');
ip.addEventListener('keyup', function(event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == 13) {
        if (ip.value != '') {
			ip.blur();
			
			var xhr = new XMLHttpRequest();
			if (xhr != null) {
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status == 200 || xhr.status == 304) {
							if (myNewChart) myNewChart.destroy();
							myNewChart = new Chart(ctx).Radar(JSON.parse(xhr.responseText));
						} else {
							if (xhr.status == 0) {
								alert('逗，把fwq搞崩了吧，人家不理你了');
							} else {
								alert('逗，服务器给了你个' + xhr.status);
							}
						}
					} else {
					}
				}
				xhr.timeout = 5000;
				xhr.open('GET', rootUrl + 'getData/' + ip.value, true);
				xhr.send();
			}
		}
    }
	if (keycode == 27) {
		ip.value = '';
	}
});