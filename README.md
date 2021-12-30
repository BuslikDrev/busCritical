# busCritical (v0.2) - сборка критических стилей для страницы на чистом JavaScript
Должно работать даже на IE9, но это неточно.

# Установка
Подключите скрипт, установив в ```<head></head>```:
```
<script src="bus_critical.js" type="text/javascript"></script>
```

# Пример работы:
```
window.addEventListener('busCritical', function() {
	busCritical.setting['html_all'] = true;
	busCritical.setting['html_elements'] = ['font-face', 'keyframes', '*', '::after, ::before', ']'];

	var critical = busCritical.critical('body');

	if (critical) {
		busCritical.ajax(window.location.href, {
			metod: 'post',
			data: {bus_critical:critical},
			success: function(data){
				//console.log(data);
			}
		});
	}
});

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
