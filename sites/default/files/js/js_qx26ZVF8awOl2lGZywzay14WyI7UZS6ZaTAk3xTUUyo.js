/**
 * @file
 * SimpleAds JS Helper.
 */

(function ($) {
  Drupal.behaviors.simpleads = {
    attach: function(context) {
      var ad_type = $('#edit-field-ad-type select[id^=edit-field-ad-type]').val();
      var ad_text_format = $('#field-ad-text-add-more-wrapper select[id^=edit-field-ad-text]').val();
      _simpelads_switch_form(ad_type, ad_text_format);
      $('#edit-field-ad-type select[id^=edit-field-ad-type]').change(function(){
        ad_type = $(this).val();
        _simpelads_switch_form(ad_type, ad_text_format);
      });
      _simpelads_switch_form(ad_type, ad_text_format);
      $('#field-ad-text-add-more-wrapper select[id^=edit-field-ad-text]').change(function(){
        ad_text_format = $(this).val();
        _simpelads_switch_form(ad_type, ad_text_format);
      });
      var ad_block_limit = $('form#block-admin-configure #edit-ads-limit').val();
      var ad_block_rotation_type = $('form#block-admin-configure #edit-ads-rotation-type').val();
      _simpelads_switch_block_settings(ad_block_limit, false);
      $('form#block-admin-configure #edit-ads-limit').change(function(){
        _simpelads_switch_block_settings($(this).val(), false);
      });
      _simpelads_switch_block_settings(ad_block_rotation_type, 'delay');
      $('form#block-admin-configure #edit-ads-rotation-type').change(function(){
        _simpelads_switch_block_settings($(this).val(), 'delay');
      });
    }
  };
}(jQuery));

/**
 * Show/hide form elements.
 */
function _simpelads_switch_form(ad_type, p1) {
  (function ($) {
    el_image = $('form#simpleads-node-form #edit-field-ad-image');
    el_url = $('form#simpleads-node-form #edit-field-ad-url');
    el_url_target = $('form#simpleads-node-form #edit-field-ad-url-taget');
    el_flash = $('form#simpleads-node-form #edit-field-ad-flash');
    el_text = $('form#simpleads-node-form #edit-field-ad-text');
    if (ad_type == 'graphic') {
      el_image.show();
      el_url.show();
      el_url_target.show();
      el_flash.hide();
      el_text.hide();
    }
    else if (ad_type == 'text') {
      el_text.show();
      el_image.hide();
      el_url.hide();
      el_flash.hide();
      if (p1 == 'plain_text') {
        el_url.show();
        el_url_target.show();
      }
      else {
        el_url.hide();
        el_url_target.hide();
      }
    }
    else if (ad_type == 'flash') {
      el_url.show();
      el_url_target.show();
      el_flash.show();
      el_image.hide();
      el_text.hide();
    }
  }(jQuery));
}

/**
 * Show/hide block settings.
 */
function _simpelads_switch_block_settings(ad_setting_value, setting) {
  (function ($) {
    if (setting == false) {
      ad_rotation = $('form#block-admin-configure #ads_rotation_settings');
      if (ad_setting_value != 1)
        ad_rotation.show();
      else
        ad_rotation.hide();
    }
    else {
      if (setting == 'delay') {
        ad_rotation_delay = $('form#block-admin-configure #ads_rotation_settings .form-item-ads-rotation-delay');
        if (ad_setting_value == 0)
          ad_rotation_delay.hide();
        else
          ad_rotation_delay.show();
      }
    }
  }(jQuery));
}

/**
 * Ajax call for Ads.
 * elem - Ad container
 * tid  - term id
 * num - numer of ads to display
 * img_loader - image (ad load indicator), should be HTML tag <img src="loader.gif">
 */
function _simpelads_load(elem, tid, num, img_loader) {
  (function ($) {
    basepath = Drupal.settings.basePath;
    if (tid > 0 && num > 0) {
      if (img_loader != '')
        $(elem).html(img_loader);
      $.get(basepath + '?q=simpleads/load/' + tid + '/' + num, function (data) {
        $(elem).html(data);
      });
    }
  }(jQuery));
}

/**
 * jQuery Plugin.
 * SimpleAds rotator.
 */
(function ($) {
  $.simpleads_globals = {
    pos: []
  };
  $.simpleads_rotator = function(element, options) {
    this.options = {};
    element.data('simpleads_rotator', this);
    this.init = function (element, options) {
      this.options = $.extend({}, $.simpleads_rotator.defaultOptions, options);
      $.simpleads_globals.pos[options.delta] = 0;
      simpleads_start(element, this.options);
    };
    this.init(element, options);
  };

  $.fn.simpleads_rotator = function(options) {
    return this.each(function(){
      (new $.simpleads_rotator($(this), options));
    });
  }

  function run_rotation(element, options) {
    elem_id = element.attr('id');
    total_ads = $('#' + elem_id + " > div").size();
    if ($.simpleads_globals.pos[options.delta] == (total_ads - 1)) {
      $.simpleads_globals.pos[options.delta] = 0;
    }
    else {
      $.simpleads_globals.pos[options.delta]++;
    }

    $('#' + elem_id + " div").hide();
    var simpleads_elem = $('#' + elem_id + " > div:eq(" + $.simpleads_globals.pos[options.delta] + ")");
    
    if (options.rotation_type == 1) {
      simpleads_elem.show();
    }
    else if (options.rotation_type == 2) {
      simpleads_elem.fadeIn('fast');
    }
    else {
      simpleads_elem.show();
    }
    return false;
  }

  function simpleads_start(element, options) {
    run_rotation(element, options); 
    setInterval(function(){run_rotation(element, options);}, options.delay);
  }

  $.simpleads_rotator.defaultOptions = {
    rotation_type: 1,
    delay: 5,
    delta: 0
  };

}(jQuery));;
/**
 * @file
 * Views Slideshow Xtra Javascript.
 */
(function ($) {
  Drupal.behaviors.viewsSlideshowXtraOverlay = {
    attach: function (context) {

      // Return if there are no vsx elements on the page
      if ($('.views-slideshow-xtra-overlay').length == 0) {
        return;
      }

      // Hide all overlays for all slides.
      $('.views-slideshow-xtra-overlay-row').hide();

      var pageX = 0, pageY = 0, timeout;

      // Modify the slideshow(s) that have a vsx overlay.
      $('.views_slideshow_main').each(function() {
        var slideshowMain = $(this);

        // Get the view for this slideshow
        var view = slideshowMain.closest('.view');

        // Process the view if it has at least one overlay.
        if ($('.views-slideshow-xtra-overlay', view).length > 0) {

          // Get the View ID and Display ID so we can get the settings.
          var viewClasses = classList(view);

          $.each( viewClasses, function(index, item) {
            // We need this code because the id of the element selected will be something like:
            // "views_slideshow_cycle_main_views_slideshow_xtra_example-page"
            // We don't want to reference the string "cycle" in our code, and there is not a way to
            // get the "View ID - Display ID" substring from the id string, unless the string "cycle"
            // is referenced in a string manipulation function.

            // Get the View ID
            if((/^view-id-/).test(item)) {
              viewId = item.substring('view-id-'.length);
            }

            // Get the Display ID
            if((/^view-display-id-/).test(item)) {
              viewDisplayId = item.substring('view-display-id-'.length);
            }

          });

          if(typeof viewId != "undefined") {

            // Get the settings.
            var settings = Drupal.settings.viewsSlideshowXtraOverlay[viewId + '-' + viewDisplayId];

            // Set Pause after mouse movement setting.
            if (settings.hasOwnProperty('pauseAfterMouseMove')) {
              var pauseAfterMouseMove = settings.pauseAfterMouseMove;
              if (pauseAfterMouseMove > 0) {
                $(this).mousemove(function(e) {
                  if (pageX - e.pageX > 5 || pageY - e.pageY > 5) {
                    Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": viewId + '-' + viewDisplayId });
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": viewId + '-' + viewDisplayId });
                        }, 2000);
                  }
                  pageX = e.pageX;
                  pageY = e.pageY;
                });
              }
            }

          }

          // Process the overlay(s).
          $('.views-slideshow-xtra-overlay:not(.views-slideshow-xtra-overlay-processed)', view).addClass('views-slideshow-xtra-overlay-processed').each(function() {
              // Remove the overlay html from the dom
              var overlayHTML = $(this).detach();
              // Attach the overlay to the slideshow main div.
              $(overlayHTML).appendTo(slideshowMain);
          });

        }

      });
    }
  };

  Drupal.viewsSlideshowXtraOverlay = Drupal.viewsSlideshowXtraOverlay || {};

  Drupal.viewsSlideshowXtraOverlay.transitionBegin = function (options) {

    // Hide all overlays for all slides.
    $('#views_slideshow_cycle_main_' + options.slideshowID + ' .views-slideshow-xtra-overlay-row').hide();

    // Show the overlays for the current slide.
    $('#views_slideshow_cycle_main_' + options.slideshowID + ' [id^="views-slideshow-xtra-overlay-"]' + ' .views-slideshow-xtra-overlay-row-' + options.slideNum).each(function() {

      // Get the overlay settings.
      var overlay = $(this);
      var overlayContainerId = overlay.parent().attr('id');
      var settings = Drupal.settings.viewsSlideshowXtraOverlay[overlayContainerId];

      // Fade in or show overlay with optional delay.
      setTimeout(function() {
        if(settings.overlayFadeIn) {
          overlay.fadeIn(settings.overlayFadeIn);
        } else {
          overlay.show();
        }
      },
        settings.overlayDelay
      );

      // Fade out overlay with optional delay.
      if(settings.overlayFadeOut) {
        setTimeout(function() {
          overlay.fadeOut(settings.overlayFadeOut);
        },
        settings.overlayFadeOutDelay
        );
      }

    });
  };

  function classList(elem){
    var classList = elem.attr('class').split(/\s+/);
     var classes = new Array(classList.length);
     $.each( classList, function(index, item){
         classes[index] = item;
     });

     return classes;
  }

})(jQuery);
;
