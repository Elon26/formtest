"use strict"

// 1-я строка - проверка, что документ уже загружен
// 2-я строка - перехват отправки формы по нажатию кнопки "Отправить". Для этого мы объявляем переменную form, куда присваиваем весь объект формы, согласно объявленному в html id="form"
// 3-я строка - вешаем событие 'submit' на созданную переменную form, т.е. мы задали, что при отправке формы мы должны перейти в функцию formSend
// 5-я строка - создаем функцию formSend
// 6-я строка - внутри функции formSend запрещаем стандартную отправку формы
// Далее мы настраиваем валидацию формы, т.е. проверку того, что заполнены все поля со *, что email написан правильно и т.д.
// 8-я строка - внутри функции formSend задаем переменную error, которой присваиваем результат работы другой функции - formValidate, куда передаем сам объект формы
// ХХХ строка - Создаем функцию formValidate
// ХХХ строка - внутри функции formValidate создаем свою переменную error, которая изначально равна 0
// ХХХ строка - внутри функции formValidate создаем переменную formReq, которой присваиваем все объекты с классом ._req. И этот класс добавляем в input в html ко все классам, которые должны обязательно проверяться на непустое значение (со *)
// ХХХ строка - далее создаем цикл, который получает в константу input каждый объект с классом ._req
// Далее создаем две вспомогательные функции formAddError и formRemoveError, которые добавляют/убирают самому объекту и его родителю класс _error
// В цикле для каждой константы input с классом ._req, задаем, чтобы первым делом выполнялась функция formRemoveError, убирающая класс _error
// Далее в цикле создаем условие, которое будет проверять, есть ли у объекта класс _email (его нужно добавить в html в input для класса с email) и если да, то создаем для такого класса уникальную дополнительную проверку
// Для проведения этой проверки создаем уникальную функцию emailTest, которая проверяет на наличие собак, точек, на количество символов и др.
// Пишем дополнительную проверку для объекта с классом _email. Для этого создаем условие, которое выполняет функцию emailTest. Если функция возврачает значение true, то выполняем функци formAddError, которая добавляет объекту с классом _email, дополнительный класс _error, а также увеличиваем переменную error на 1
// Далее через else if создаем новое проверку для нашего объекта с классом _req, которая проверяет объект на наличие у класса типа checkbox (type="checkbox") и выполняется в случае, если данный чекбокс не нажат (не стоит галочка Я согласен на обработку персональных данных). Если галочка не нажата выполняем функци formAddError, которая добавляет объекту дополнительный класс _error, а также увеличиваем переменную error на 1
// Далее через else, т.е. для тех случаев, когда ни одно из описанных ранее условий не выполняется, создаем проверку, заполнено ли поле вообще. Если не заполнено, то традиционно добавляем класс _error и увеличиваем переменную error на 1
// Далее в css создаем уникальный стиль для класса error
// Возвращаем значение error (return error), которое будет либо 0 либо нет
// Внутри функции formSend создаем проверку, которое проверяет равна ли error нулю и, если не равна, то выводит сообщение Заполните обязательные поля
// Далее создаем возможность видеть превью фото, которое было прикреплено
// Для этого сначала получаем в константу прикрепленный пользователем файл по id="formImage"
// Далее создаем константу formPreview по id="formPreview", которая будет хранить файл, который будет в дальнейшем отображаться пользователю
// Создаем событие change, которое будет срабатывать при выборе какого-либо файла и запускать функцию uploadFile, которая будет передавать выбранный пользователем файл.
// Внутри функции осуществляем 2 проверки - на соответствие расширению и размеру. Если функции выполняются, выводим сообщения с ошибками
// Далее создаем конструкцию, которая будет при помощи FileReader помещать загруженный файл внутрь div с id="formPreview"
// Далее настраиваем отправку формы внутри функции formSend
// Для этого при помощи функции FormData собираем в переменную formData все данные полей и добавляем в нее загруженное изображение
// Далее, внутри проверки равен ли error нулю, если равен, задаем конструкцию для отправки собранного файла sendmail.php методом POST
// Далее задаем проверку прошла ли отправка if (response.ok)
// Если отправка прошла, то настраиваем вывод результата и очистку формы
// Если отправка не прошла, то выводим ошибку
// Далее, создаем условия для того, чтобы в процессе отправки пользователь не делал лишних движений
// Для этого сразу после прохождения валидации (когда error = 0) присваиваем объекту дополнительный класс _sending и настраиваем его в css через клас form__body и настраивают удаление этого класса по завершении отправки формы либо при возникновении ошибки
// Далее делаем php. Помимо файла sendmail.php должна быть скачана папка с плагином phpmailer и создана попка files для хранения файлов



document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);
		formData.append('image', formImage.files[0]);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля')
		}
	}


	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req')

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				error++;
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	const formImage = document.getElementById('formImage');
	const formPreview = document.getElementById('formPreview');
	formImage.addEventListener('change', () => {
		uploadFile(formImage.files[0]);
	});

	function uploadFile(file) {
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Разрешены только изображения.');
			formImage.value = '';
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			alert('Файл должен быть не более 2 МБ.');
			return;
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
		};
		reader.onerror = function (e) {
			alert('Ошибка');
		};
		reader.readAsDataURL(file);
	}
});
