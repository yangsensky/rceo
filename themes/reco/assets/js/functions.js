
(function($){
    "use strict";

    // Preload compatible with W3 total cache
    // $('link[rel="preload"]').attr('rel', 'stylesheet');


    /* All Images Loaded */

	$(window).load(function(){ 

        // Last submenu fix
        $('#header nav ul.menu > li.menu-item-has-children:last').addClass('last-menu-item');

        // Sticky elements

        epcl_add_sticky_header();

        function epcl_add_sticky_header(){
            var header_height = $('#header div.menu-wrapper').outerHeight();
            $('#header').height( header_height );

            if( !$('#header').hasClass('enable-sticky') && !$('#header').hasClass('enable-sticky-mobile') ){
                return;
            }
   
            $(window).scroll(function(){
                var document_width = $(document).width();
                if( document_width > 1200 && $('#header').hasClass('enable-sticky') ){
                    if ($(window).scrollTop() >= 300) {
                        $('#header').addClass('is-sticky');    
                        $('#back-to-top').addClass('visible');                    
                    } else {
                        $('#header').removeClass('is-sticky');
                        $('#back-to-top').removeClass('visible');    
                    }
                }else if( document_width < 1200 && $('#header').hasClass('enable-sticky-mobile') ){
                    if ($(window).scrollTop() >= 300) {
                        $('#header').addClass('is-sticky');   
                        $('#back-to-top').addClass('visible');                        
                    } else {
                        $('#header').removeClass('is-sticky');
                        $('#back-to-top').removeClass('visible');   
                    }
                }else{
                    $('#header').removeClass('is-sticky');
                    $('#back-to-top').removeClass('visible');   
                }
            });

            $(window).resize(function() {
                var document_width = $(document).width();
                var header_height = $('#header div.menu-wrapper').outerHeight();
                $('#header').height( header_height );
                if( document_width < 1200 && !$('#header').hasClass('enable-sticky-mobile') ){
                    $('#header').removeClass('is-sticky');
                }
            });
           
        }
		if($(document).width() > 767){
			$('div.epcl-share-container').stickySidebar({
				topSpacing: 80,
				bottomSpacing: 0
            });
			// if( $('#sidebar').hasClass('sticky-enabled') && ( $('#sidebar').outerHeight() < $('div.left-content').outerHeight() ) ){
            if( $('#sidebar').hasClass('sticky-enabled') ){
                $('#sidebar.sticky-enabled').theiaStickySidebar({
                    additionalMarginTop: 60,
                    additionalMarginBottom: 60
                });
            }
		}

        AOS.init({
            offset: 220,
            duration: 700,
            disable: window.innerWidth < 1024,
            easing: 'ease',
            once: true
        });

    });
    
    /* Dom Loaded */

	$(document).ready(function($){ 

        // Safari mobile fix
        $('#header nav ul.menu li.menu-item-has-children').attr('onClick', '');

        // Enable HTML5 form validation
        $('#commentform').removeAttr('novalidate');

        /* Load more posts */
		if($('.epcl-load-more').length > 0){

			$('.epcl-load-more').not('.disabled').on('click', function(){      
                var elem = $(this);            
                var page_number = parseInt( elem.data('page') ) + 1;
                var limit = parseInt( elem.data('limit') );
                var perpage = parseInt( elem.data('perpage') );
                var nonce = elem.data('nonce');            
                var elems;
                var text_default = elem.data('text-default');
                var text_loading = elem.data('text-loading');
                var text_disabled = elem.data('text-disabled');
                var container_id = elem.data('container-id');         
                var $articles = $('#'+container_id);
                // alert(page_number);
				if(page_number <= limit) {
					$.ajax({
						type: 'post',
						url: ajax_var.url,
                        data: { action: 'epcl_loadmore', nonce: nonce, page_number: page_number, perpage: perpage, layout: elem.data('layout'), columns: elem.data('columns'), filters: elem.data('filters') },
						beforeSend: function(){
							elem.text( text_loading ).addClass('loading');	
						},
						success: function(data){
							if(data){
							   elems = $(data);							  
                                $($articles).append(data);
                                $(".lazy, img[data-src], iframe[data-src]").Lazy({
                                    placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
                                    enableThrottle: true,
                                    throttle: 500,
                                    afterLoad: function(element){
                                        element.addClass('loaded');
                                    }
                                });
                                if( elems.find('.post-format-gallery .slick-slider').length > 0 ){
                                    $articles.find('.post-format-gallery .slick-slider').each(function(){
                                        var rtl = false;
                                        if( parseInt( $(this).data('rtl') ) > 0 ){
                                            rtl = true;
                                        }
                                        $(this).slick({
                                            cssEase: 'ease',
                                            fade: true,
                                            arrows: true,
                                            infinite: true,
                                            dots: false,
                                            autoplay: false,
                                            speed: 600,
                                            slidesToShow: 1,
                                            slidesToScroll: 1,
                                            rtl: rtl,
                                        });
                                    });
                                }

                                // $home.isotope('appended', elems).isotope('layout');
                                // page_number++;
                                elem.data('page', page_number);
                                if( page_number >= limit ){
                                    elem.text( text_disabled ).addClass('disabled');
                                }else{
                                    elem.text( text_default ).removeClass('loading');	
                                }                              
													
							}
						}
					});
				}else{
					elem.text(elem.data('no-posts')).addClass('loading');
				}
				return false;
			});
		}

        // Submenu on Mobile

        if( $(document).width() < 768){
			$('#header li.menu-item-has-children > a').on('click', function(e){
                $(this).parent().toggleClass('menu-open');
                e.preventDefault();
            });
		}

        // Lazy load for images and iframes

        $(".lazy, img[data-src], iframe[data-src]").Lazy({
            defaultImage: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            threshold: 0,
            enableThrottle: true,
            throttle: 50,
            afterLoad: function(element){
                element.addClass('loaded');
            }
        });

        // Lazy load for Adsense
        
        if( $('body').hasClass('enable-lazy-adsense') ){
            $('ins[data-ad-slot]').adsenseLoader();
        }
        

		// Counter animation

		$('.count').each(function () {
			$(this).prop('Counter',0).animate({
				Counter: $(this).data('total')
			}, {
				duration: 1500,
				easing: 'swing',
				step: function (now) {
					$(this).text(Math.ceil(now));
				}
			});
        });

        // Ajax Download

        $('div.epcl-download a').on('click', function(){
			var elem = $(this);
			var post_id = elem.data('post-id');
			$.ajax({
				type: 'post',
				url: ajax_var.url,
				data: { action: 'epcl_download', nonce: ajax_var.nonce, post_id: post_id },
				success: function(count){

				}
			});
        })

        // Custom Select and filters

        $('select.custom-select, aside select, #footer select').niceSelect();

		$('#header div.menu-mobile').on('click', function(){
			$('#header').toggleClass('menu-open');
		});

		$('.filters select').change(function(){
			var url = $(this).val();
			if(url)
				document.location = url;
        });

        // Back to top button

		$('#back-to-top').on('click', function(event) {
			event.preventDefault();
			$('html, body').animate({scrollTop: 0}, 500);
			return false;
        });

        // Single Post copy button

        $(".permalink .copy").on('click', function(){
            $("#copy-link").select();
            document.execCommand('copy');
        });

		// Gallery Post Format

        $('.post-format-gallery .slick-slider').each(function(){
            var rtl = false;
            if( parseInt( $(this).data('rtl') ) > 0 ){
                rtl = true;
            }
            $(this).slick({
                cssEase: 'ease',
                fade: true,
                arrows: true,
                infinite: true,
                dots: false,
                autoplay: false,
                speed: 600,
                slidesToShow: 1,
                slidesToScroll: 1,
                rtl: rtl,
            });
        });


        // Module: carousel

		$('.epcl-carousel').each(function(index, el) {
            var slides_to_show = parseInt( $(this).data('show') );
            var rtl = false;
            if( parseInt( $(this).data('rtl') ) > 0 ){
                rtl = true;
            }
			$(this).slick({
				cssEase: 'ease',
				fade: false,
				arrows: true,
				infinite: true,
				dots: false,
				autoplay: false,
                speed: 600,
                rtl: rtl,
				slidesToShow: slides_to_show,
				slidesToScroll: slides_to_show,
                responsive: [,
                    {
                        breakpoint: 1700,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                ]
			});
		});

		// Flickr feed

		if( $('.widget_epcl_flickr').length > 0 ){
			$('.widget_epcl_flickr').each(function(index, el) {
				var elem = $(this);
				var flickr_limit = elem.find('.epcl-flickr-gallery').data('limit');
				var flickr_id = elem.find('.epcl-flickr-gallery').data('flickr-id');
				elem.find('ul').jflickrfeed({
					limit: parseInt(flickr_limit),
					qstrings: {
						id: flickr_id
					},
					useTemplate: false,
					itemCallback: function(item){
						$(this).append('<li class="grid-50 tablet-grid-33 mobile-grid-33"><div class="wrapper"><a href="'+item.image_b+'" title="'+item.title+'" class="hover-effect"><span class="cover" style="background-image: url('+item.image_m+');"></span></a></div></li>');
					}
				}, function(data) {
					elem.addClass('loaded');
					elem.find('ul').magnificPopup({
						type: 'image',
						gallery:{
							enabled: true,
                            arrowMarkup: '<i class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>',
                            tCounter: '%curr% / %total%'
						},
						delegate: 'a',
						mainClass: 'my-mfp-zoom-in',
						removalDelay: 300,
						closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>'
					});
				});

			});
		}

		// Global: lightbox

		$('.lightbox').magnificPopup({
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			closeMarkup: '<i title="%title%" class="mfp-close fa fa-times"></i>',
			fixedContentPos: true
        });

        $('.main-nav .lightbox, .epcl-search-button').magnificPopup({
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			closeMarkup: '<i title="%title%" class="mfp-close fa fa-times"></i>',
            fixedContentPos: true,
            callbacks: {
                beforeOpen: function(item) {
                    setTimeout(function() { $('#search-lightbox form #s').focus() }, 500);
                },
            }
        });

        // Global: related galleries

        $('.epcl-gallery').each(function() {
            var elem = $(this);
            elem.find('ul').magnificPopup({
                type: 'image',
                gallery:{
                    enabled: true,
                    arrowMarkup: '<i class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>',
                    tCounter: '%curr% / %total%'
                },
                delegate: 'a',
                mainClass: 'my-mfp-zoom-in',
                removalDelay: 300,
                closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>'
            });
        });

        // Gutenberg Gallery with lightbox
        $('.wp-block-gallery, .woocommerce-product-gallery').each(function() {
            var elem = $(this);
            elem.magnificPopup({
                type: 'image',
                gallery:{
                    enabled: true,
                    arrowMarkup: '<i class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>',
                    tCounter: '%curr% / %total%'
                },
                delegate: "a[href$='.jpg'],a[href$='.png'],a[href$='.gif']",
                mainClass: 'my-mfp-zoom-in',
                removalDelay: 300,
                closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>'
            });
        });
        
        // Gutenberg Single Image with lightbox
        $(".wp-block-image").magnificPopup({
            type: 'image',
            delegate: "a[href$='.jpg'],a[href$='.png'],a[href$='.gif']",
            mainClass: 'my-mfp-zoom-in',
            removalDelay: 300,
            closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>'
        });

        $("div.text a[rel^='attachment']").magnificPopup({
            type: 'image',
            mainClass: 'my-mfp-zoom-in',
            removalDelay: 300,
            closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>'
        });

	});

})(jQuery);