var au = document.getElementById('au');

var play = true;

document.onscroll = function () {
	if (!play) return;
	var t = document.documentElement.scrollTop || document.body.scrollTop,
		h = "innerHeight" in window 
               ? window.innerHeight
               : document.documentElement.offsetHeight;
	if (t + h > 3800) {
		au.play();
		play = false;
	}
}