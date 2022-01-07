# busCritical (v0.5) - сборка критических стилей для страницы на чистом JavaScript
Должно работать даже на IE9, но это неточно.

# Пример работы:
```
<script>
var s = document.createElement('script');
s.async = true;
s.type = 'text/javascript';
//https://github.com/BuslikDrev/busAjax
s.src = 'bus_ajax.js';
var ss = document.getElementsByTagName('script')[0];
ss.parentNode.insertBefore(s, ss);

var s = document.createElement('script');
s.async = true;
s.type = 'text/javascript';
s.src = 'bus_critical.js';
var ss = document.getElementsByTagName('script')[0];
ss.parentNode.insertBefore(s, ss);

window.addEventListener('busCritical', function() {
	window.busCritical.setting['html_all'] = true;
	window.busCritical.setting['html_elements'] = ['font-face', 'keyframes', '*', '::after, ::before', ']'];

	setTimeout(function() {
		var start = new Date().getTime();
		var critical = window.busCritical.critical('body');

		if (critical) {
			var myAjax = function() {
				window.busAjax(window.location.href, {
					metod: 'post',
					data: {bus_cache_critical:critical},
					success: function(data) {
						//console.log(data);
					}
				});
			}

			if ('busAjax' in window) {
				myAjax();
			} else {
				window.addEventListener('busAjax', myAjax);
			}
		}

		var end = new Date().getTime();
		console.log('Обработка ' + (end - start)/1000 + ' сек. или ' + (end - start) + ' мс.', critical);
	}, 1);
});
</script>

/*
В php мы получим:
$_POST['bus_critical'] = 'text css';
*/
```

# Обозначения параметров настроек:
	busCritical.setting['html_all'] - брать в обработку все элементы страницы, если false, то будет брать элементы попадающие в поле зрения экрана;
	busCritical.setting['html_elements'] - указывается массив элементов, если нужно взять из стилей;


# Внимание!
Стили собирать должен только администратор сайта, не делайте генерацию критических стилей любым пользователем в целях безопасности.
