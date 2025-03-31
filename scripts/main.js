(function($) {

	'use strict';

	var isAnimating = false,
		defaultInAnimation = 'flipIn',
		defaultOutAnimation = 'flipOut',
		sectionInAnimation = '',
		sectionOutAnimation = '',
		nextSectionId = '',
		animationEnd;

	function animationEndEventName() {
		var i,
			el = document.createElement('div'),
			animations = {
				'animation': 'animationend',
				'oAnimation': 'oAnimationEnd',
				'MSAnimation': 'MSAnimationEnd',
				'mozAnimation': 'mozAnimationEnd',
				'WebkitAnimation': 'webkitAnimationEnd'
			};
		for (i in animations) {
			if (animations.hasOwnProperty(i) && el.style[i] !== undefined) {
				return animations[i];
			}
		}
	}

	function animateSections() {

		$('.section-in').removeClass('section-in').addClass('section-out');

		var $sectionOut = $('.section-out'),
			$sectionOutBlocks = $sectionOut.find('.section-main-block, .section-secondary-block');
		sectionOutAnimation = $('body').data('animation-out') || defaultOutAnimation;
		$sectionOutBlocks.addClass(sectionOutAnimation).removeClass(sectionInAnimation);

		if ($(nextSectionId).length) {
			$(nextSectionId).addClass('section-in');
		} else {
			$('.section').eq(0).addClass('section-in');
		}

		var $sectionIn = $('.section-in'),
			$sectionInBlocks = $sectionIn.find('.section-main-block, .section-secondary-block');
		sectionInAnimation = $('body').data('animation-in') || defaultInAnimation;
		$sectionInBlocks.removeClass(sectionOutAnimation).addClass(sectionInAnimation);

		$('.nav-main a[href="' + nextSectionId + '"]').parent().addClass('active').siblings().removeClass('active');

	}

	function changeSections(e) {
		var sectionId = $(e.target).attr('href');
		if (isAnimating || sectionId === location.hash) {
			return false;
		} else {
			isAnimating = true;
			nextSectionId = sectionId;
			location.hash = sectionId;
			animateSections();
		}
	}

	function checkUrlHash() {
		var hash = location.hash;
		if (hash.length && $('section' + hash).length) {
			nextSectionId = hash;
			animateSections();
		}
	}

	$(document).ready(function() {

		var $navLinks = $('.nav-main a').not('.external');
			animationEnd = animationEndEventName();

		$('.btn-site-loader-close').on('click', function() {
			$('.site-loader').fadeOut('slow');
		});

		/*=============================================>>>>>
		= показать\скрыть главную страницу =
		===============================================>>>>>*/
		$('.hamburger').on('click', function() {
			$(this).toggleClass('is-active');
			$('.nav-main').toggleClass('active');
		});

		/*=============================================>>>>>
		= анимация перемещения =
		===============================================>>>>>*/
		$('.owl-carousel').each(function () {
			var	$slider = $(this),
				sliderOptions = $slider.data('slideshow-options'),
				defaultOptions = {
					items: 1,
					loop: true,
					mouseDrag: false,
					autoplay: true,
					autoplayTimeout: 10000,
					autoplayHoverPause: true,
					nav: true,
					navText: ['<i class="fa fa-caret-left">', '<i class="fa fa-caret-right">']
				};
			$slider.owlCarousel($.extend(defaultOptions, sliderOptions));
		});

		/*=============================================>>>>>
		= прогресс бар =
		===============================================>>>>>*/
		$('.progress').each(function() {
			var el = $(this),
				progressVal = el.data('progress');
			el.append('<div class="progress-bar"><div class="progress-bar-inner"></div></div>');
			el.find('.progress-bar').css('width', progressVal + '%');
		});

		/*=============================================>>>>>
		= фильтрация =
		===============================================>>>>>*/
		$('.projects').shuffle({
			itemSelector: '.projects-item',
			sizer: '.projects-sizer'
		});

		$('.filter').on('click', 'li', function() {
			var self = $(this);
			$(this).addClass('active').siblings().removeClass('active').parents('.filter').next('.projects').shuffle('shuffle', self.data('group'));
		});

		/*=============================================>>>>>
		= Карта =
		===============================================>>>>>*/
 /*       var mapEl = document.getElementById('map');
		if (mapEl) {
			var lat = mapEl.getAttribute('data-latitude'),
				lng = mapEl.getAttribute('data-longitude'),
				styles = [
					{
						'featureType': 'all',
						'elementType': 'all',
						'stylers': [
							{
								'saturation': -100
							},
							{
								'gamma': 1
							}
						]
					}
				];
			var map = new GMaps({
				el: mapEl,
				lat: lat,
				lng: lng,
				streetViewControl: false,
				mapTypeControl: false,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_BOTTOM
				}
			});

			map.addMarker({
				lat: lat,
				lng: lng,
				icon: 'images/map-marker.png'
			});
			map.addStyle({
				styledMapName: 'Styled Map',
				styles: styles,
				mapTypeId: 'map_style'
			});
			map.setStyle('map_style');
			map.panBy(0, -22);
		}
*/
		/*=============================================>>>>>
		= всплывающие окна =
		===============================================>>>>>*/
		$('.projects-item-thumb').magnificPopup({
			type: 'inline',
			gallery: {
				enabled: true
			},
			mainClass: 'rose',
			removalDelay: 800
		});

		$('.btn-popup').magnificPopup({
			mainClass: 'rose',
			removalDelay: 800
		});

		$('.btn-lightbox').magnificPopup({
			type: 'image',
			mainClass: 'rose',
			removalDelay: 800
		});

		$('.gallery').each(function() {
			$(this).magnificPopup({
				delegate: 'a',
				type: 'image',
				gallery: {
					enabled: true
				},
				mainClass: 'rose',
				removalDelay: 800
			});
		});

		/*=============================================>>>>>
		= форма проверки валидации =
		===============================================>>>>>*/
		$('form').each( function() {
			$(this).validate();
		});

		/*=============================================>>>>>
		= сообщения о неправильно заполненных строках =
		===============================================>>>>>*/
		$('.form-contact').submit(function(e){
			e.preventDefault();
			var $form = $(this),
				$submit = $form.find('[type="submit"]');
			if( $form.valid() ){
				var dataString = $form.serialize();
				$submit.after('<div class="loader"></div>');
				$.ajax({
					type: $form.attr('method'),
					url: $form.attr('action'),
					data: dataString,
					success: function() {
						$submit.after('<div class="message message-success">Твоё сообщение отправляется!</div>');
					},
					error: function() {
						$submit.after('<div class="message message-error">Твоё сообщение не отправилось, попробуй ещё раз.</div>');
					},
					complete: function() {
						$form.find('.loader').remove();
						$form.find('.message').fadeIn();
						setTimeout(function() {
							$form.find('.message').fadeOut(function() {
								$(this).remove();
							});
						}, 5000);
					}
				});
			}
		});

		/*=============================================>>>>>
		= медиа =
		===============================================>>>>>*/
		function handleWidthChange(mqlVal) {
			if (mqlVal.matches) {

				$navLinks.off('click');
				$('.btn-section').off('click');

				$navLinks.on('click', function(e) {
					e.preventDefault();
					var target = $(this).attr('href'),
						targetOffset = $(target).offset();
					$(this).parent().addClass('active').siblings().removeClass('active');
					$('html,body').animate({scrollTop: (targetOffset.top)}, 500);
					$('.nav-main').removeClass('active');
					$('.hamburger').removeClass('is-active');
				});

				/*=============================================>>>>>
				= уберание скролл бара =
				===============================================>>>>>*/
				$('.section-block-content').mCustomScrollbar('destroy');

			} else {

				$navLinks.off('click');

				checkUrlHash();

                $('.section-main-block, .section-secondary-block').addClass('animated');

				$('.section-secondary-block-right').on(animationEnd, function(e) {
					if ($(e.target).parent().hasClass('section-out') && $(e.target).hasClass('section-secondary-block-right')) {
						console.log('Section "' + $(e.target).parent().attr('id') + '" out.' );
						$(e.target).parents('.section').removeClass('section-out');
						$(e.target).removeClass(sectionOutAnimation).siblings('.section-secondary-b').removeClass(sectionOutAnimation);
					} else if ($(e.target).parent().hasClass('section-in') && $(e.target).hasClass('section-secondary-block-right')) {
						console.log('Section "' + $(e.target).parent().attr('id') + '" in.' );
						isAnimating = false;
					}
				});

				$navLinks.on('click', function(e) {
					e.preventDefault();
					changeSections(e);
				});
				$('.btn-section').on('click', function(e) {
					e.preventDefault();
					changeSections(e);
				});

				/*=============================================>>>>>
				= элимент кастомного скроллбара =
				===============================================>>>>>*/
				$('.section-block-content').mCustomScrollbar({
					theme: 'rose',
					scrollInertia: 3000
					
				});

			}
		}

		if (window.matchMedia) {
			var mql = window.matchMedia('(max-width: 1279px)');
			mql.addListener(handleWidthChange);
			handleWidthChange(mql);
		}

	});

	$(window).on('load', function() {

		$('.site-loader').delay(1000).fadeOut('slow');

	});

})(jQuery);



/*        
function initMap() {

            
    const gfg_office = {
    lat: 28.50231,
    lng: 77.40548
    };

            
const map = new google.maps.Map(
document.getElementById("map"), {

                
    zoom: 17.56,
    center: gfg_office,
    });
}
*/

/* 
$(document).ready(function(){
    let currentIndex = 0;
    const images = $(".image-slider figure");
    const totalImages = images.length;

    
    function showImage(index) {
        images.removeClass('active').hide();
        images.eq(index).addClass('active').show();
    }

    $(".next").click(function() {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    });

    $(".prev").click(function() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    });

    
    showImage(currentIndex);
});

*/



$(document).ready(function() {
    $('.projects-item').each(function() {
        let currentIndex = 0;
        const images = $(this).find('.image-slider figure');
        const totalImages = images.length;

        function showImage(index) {
            images.removeClass('active').hide();
            images.eq(index).addClass('active').show();
            // Обновляем ссылку на полное изображение
            const currentImageSrc = images.eq(index).find('img').attr('src');
            $(this).find('.open-fullscreen').attr('href', currentImageSrc);
        }

        $(this).find('.next').click(() => {
            currentIndex = (currentIndex + 1) % totalImages;
            showImage(currentIndex);
        });

        $(this).find('.prev').click(() => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            showImage(currentIndex);
        });

        // Инициализируем первое изображение
        showImage(currentIndex);
    });
});








$(document).ready(function() {
    // Функция для инициализации каждого слайдера
    function initSlider($popup) {
        var currentIndex = 0; // Индекс текущего изображения
        
        // Получить все фигуры в слайдере
        var figures = $popup.find('.image-slider figure');
        
        // Найти активное изображение
        figures.each(function(index) {
            if ($(this).hasClass('active')) {
                currentIndex = index;
            }
        });

        // Обработчик кнопки "Вперед"
        $popup.find('.btn.next').on('click', function() {
            $(figures[currentIndex]).removeClass('active'); // Удаление активного класса
            currentIndex = (currentIndex + 1) % figures.length; // Переход к следующему
            $(figures[currentIndex]).addClass('active'); // Устанавливаем активный класс
        });

        // Обработчик кнопки "Назад"
        $popup.find('.btn.prev').on('click', function() {
            $(figures[currentIndex]).removeClass('active'); // Удаляем активный класс
            currentIndex = (currentIndex - 1 + figures.length) % figures.length; // Переход к предыдущему
            $(figures[currentIndex]).addClass('active'); // Устанавливаем активный класс
        });

        // Обработчик кнопки "Открыть на весь экран"
        $popup.find('.open-fullscreen').on('click', function() {
            const activeFigure = $popup.find('.image-slider figure.active img'); // Текущее активное изображение
            const src = activeFigure.attr('src'); // Получаем путь к изображению
            window.open(src, '_blank'); // Открываем в новом окне
        });
    }

    // Инициализируем все попапы на странице
    $('.popup').each(function() {
        initSlider($(this)); // Передаем текущий popup
    });
});


(function(){
           emailjs.init("RnWipVRvlMmGYSLcZ"); // YOUR_USER_ID находится на вкладке аккаунт EmailJS User ID
       })();

       const form = document.getElementById('contact-form');
       const result = document.getElementById('result');

       form.addEventListener('submit', function(event) {
           event.preventDefault(); // предотвращаем отправку формы по умолчанию

           emailjs.sendForm('service_sl1v4r8', 'template_m8b9dfh', this)
               .then(() => {
                   result.textContent = "";
                   form.reset(); // сбросить форму после отправки
               }, (error) => {
                   result.textContent = "Ошибка при отправке: " + JSON.stringify(error);
               });
});


$(window).resize(function() {
    $('.projects').isotope('layout');
});



document.addEventListener('wheel', function (event) {
	Event.preventDefault();
	const scrollAmount = event.deltaY = 0.1;
	window.scrollBy({
		top: scrollAmount,
		behavior: 'smooth'
	});
}, { passive: false });


// Печать текста на главной страницу
document.addEventListener("DOMContentLoaded", function () {
    const titleElement = document.getElementById("animatedTitle");
    const cursorElement = document.getElementById("cursor");
    const text = "Маруся Кошкина";
    let index = 0;

    function type() {
        if (index < text.length) {
            titleElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 200); // Задержка между символами
        } else {
            cursorElement.style.display = "none"; // Скрыть курсор после печати
        }
    }

    // Задержка перед началом печати
    setTimeout(type, 2000); // 10000 миллисекунд = 10 секунд
});

