(function ($) {
  $.fn.previewImage = function (options) {
    // Настройки по умолчанию
    const settings = $.extend(
      {
        label: "Загрузите изображение",
        buttonText: "Выберите файл",
        maxSizeMB: 5,
        defaultImage: "icon_empty-img.svg",
        accept: "image/*",
        previewStyle: {
          width: "100%",
          height: "100%",
          "object-fit": "cover",
          "object-position": "center",
        },
        defaultStyle: {
          width: "auto",
          height: "auto",
          "object-fit": "contain",
          "object-position": "center",
        },
        onSelect: null, // function(file) {}
        onError: null, // function(message) {}
      },
      options
    );

    return this.each(function () {
      const $container = $(this);
      const inputId = `img_input_${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`; // Уникальный ID

      // HTML структура формы
      const html = `
                <div class="block_previewImage">
                    <div class="previewImage_label_up">${settings.label}</div>
                    <div class="previewImage_wrapper">
                        <label class="previewImage_input_img" for="${inputId}">
                            <img class="previewImage_input_img-img" src="${settings.defaultImage}" alt="загрузить изображение">
                            <input 
                                accept="${settings.accept}" 
                                type="file" 
                                class="previewImage_input_img_file" 
                                name="previewImage_file" 
                                id="${inputId}">
                        </label>
                        <button type="button" class="previewImage_input_img-remove" title="Удалить изображение">&times;</button>
                    </div>
                    <label for="${inputId}" class="previewImage_input_img-text">${settings.buttonText}</label>
                </div>
            `;

      // Вставляем HTML
      $container.html(html);

      // Находим элементы
      const $input = $container.find('input[type="file"]');
      const $img = $container.find(".previewImage_input_img-img");
      const $removeBtn = $container.find(".previewImage_input_img-remove");

      // Скрыть кнопку "×", если изображение по умолчанию
      $removeBtn.hide();

      const resetImage = () => {
        $img.attr("src", settings.defaultImage);
        $input.val("");
        $removeBtn.hide();

        $img.css(settings.defaultStyle);
      };

      // Удаление изображения по клику
      $removeBtn.on("click", function () {
        resetImage();
      });

      // Обработчик изменения файла
      $input.on("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;

        // Валидация: тип файла
        if (!file.type.match("image.*")) {
          const errorMsg =
            "Пожалуйста, выберите изображение (JPEG, PNG, GIF и т.д.)";
          if (settings.onError) settings.onError(errorMsg);
          alert(errorMsg);
          resetImage();
          return;
        }

        // Валидация: размер
        const maxSizeBytes = settings.maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          const errorMsg = `Файл слишком большой. Максимум: ${settings.maxSizeMB} МБ`;
          if (settings.onError) settings.onError(errorMsg);
          alert(errorMsg);
          resetImage();
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          $img.attr("src", e.target.result);
          $img.css(settings.previewStyle);
          $removeBtn.show();

          // Вызов callback
          if (settings.onSelect) settings.onSelect(file);
        };
        reader.readAsDataURL(file);
      });
    });
  };
})(jQuery);

// Пример использования:

// $('#my_lib').previewImage({
//     label: 'Фото новости (872×600px)',
//     buttonText: 'Загрузить фото123',
//     defaultImage: '/assets/img/icon_empty-img.svg',
//     maxSizeMB: 3,
//     onSelect: function(file) {
//         console.log('Выбран файл:', file.name, file.size);
//     },
// });
