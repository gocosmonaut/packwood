/**
 * @file
 * Views Slideshow Xtra Javascript.
 */
(function ($) {
  Drupal.viewsSlideshowXtra = Drupal.viewsSlideshowXtra || {};
  var pageX = 0, pageY = 0, timeout;
  Drupal.viewsSlideshowXtra.transitionBegin = function (options) {

    // Find our views slideshow xtra elements
    $('[id^="views-slideshow-xtra-"]:not(.views-slideshow-xtra-processed)').addClass('views-slideshow-xtra-processed').each(function() {

      // Get the slide box.
      var slideArea = $(this).parent().parent().find('.views_slideshow_main');

      // Remove the views slideshow xtra html from the dom
      var xtraHTML = $(this).detach();

      // Attach the views slideshow xtra html to below the main slide.
      $(xtraHTML).appendTo(slideArea);

      // Get the offsets of the slide and the views slideshow xtra elements
      var slideAreaOffset = slideArea.offset();
      var xtraOffset = $(this).offset();

      // Move the views slideshow xtra element over the top of the slide.
      var marginMove = slideAreaOffset.top - xtraOffset.top;
      $(this).css({'margin-top': marginMove + 'px'});

      // Move type=text slide elements into place.
      var slideData = Drupal.settings.viewsSlideshowXtra[options.slideshowID].slideInfo.text;
      var slideNum = 0;
      for (slide in slideData) {
        var items = slideData[slide];
        var itemNum = 0;
        for (item in items) {
          //alert('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-text-' + slideNum + '-' + itemNum);
          $('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-text-' + slideNum + '-' + itemNum).css({
            'width': slideArea.width()
          });
          itemNum++;
        }
        slideNum++;
      }

      // Move type=link slide elements into place.
      var slideData = Drupal.settings.viewsSlideshowXtra[options.slideshowID].slideInfo.link;
      var slideNum = 0;
      for (slide in slideData) {
        var items = slideData[slide];
        var itemNum = 0;
        for (item in items) {
          //alert('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-link-' + slideNum + '-' + itemNum);
        	$('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-link-' + slideNum + '-' + itemNum).css({
            'width': slideArea.width()
          });
          itemNum++;
        }
        slideNum++;
      }

      // Move type=image slide elements into place.
      var slideData = Drupal.settings.viewsSlideshowXtra[options.slideshowID].slideInfo.image;
      var slideNum = 0;
      for (slide in slideData) {
        var items = slideData[slide];
        var itemNum = 0;
        for (item in items) {
          //alert('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-image-' + slideNum + '-' + itemNum);
        	$('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-image-' + slideNum + '-' + itemNum).css({
            'width': slideArea.width()
          });
          itemNum++;
        }
        slideNum++;
      }

      var settings = Drupal.settings.viewsSlideshowXtra[options.slideshowID];
	    if (settings.pauseAfterMouseMove) {
	    //if(true) {
	    	slideArea.mousemove(function(e) {
      	  if (pageX - e.pageX > 5 || pageY - e.pageY > 5) {
      	  	Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": options.slideshowID });
      	    clearTimeout(timeout);
      	    timeout = setTimeout(function() {
      	    		Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": options.slideshowID });
      	    		}, 2000);
      	  }
      	  pageX = e.pageX;
      	  pageY = e.pageY;
	    	});
	    }

    });

    // TODO Find a better way to detect if xtra module is enabled but this is not
    // an xtra slideshow.  This seems to work but its probably not the right way.
    //if (Drupal.settings.viewsSlideshowXtra[options.slideshowID]) { THIS DOES NOT WORK!
    if ('viewsSlideshowXtra' in Drupal.settings) {
	    var settings = Drupal.settings.viewsSlideshowXtra[options.slideshowID];

	    // Hide elements either by fading or not
	    if (settings.displayDelayFade) {
	      $('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-row').fadeOut();
	    }
	    else {
	      $('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-row').hide();
	    }

      settings.currentTransitioningSlide = options.slideNum;

	    // Pause from showing the text and links however long the user decides.
	    setTimeout(function() {
        if (options.slideNum == settings.currentTransitioningSlide) {
          if (settings.displayDelayFade) {
            $('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-row-' + options.slideNum).fadeIn();
          }
          else {
            $('#views-slideshow-xtra-' + options.slideshowID + ' .views-slideshow-xtra-row-' + options.slideNum).show();
          }
        }
	    },
	    settings.displayDelay
	    );

    }
  };
})(jQuery);

/*
*/
;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      wrapper.accordion({
        autoHeight: false,
        active: '.field-group-accordion-active',
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {

        var $firstErrorItem = false;

        // Add required fields mark to any element containing required fields
        wrapper.find('div.field-group-accordion-item').each(function(i) {

          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header a').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            // Save first error item, for focussing it.
            if (!$firstErrorItem) {
              $firstErrorItem = $(this).parent().accordion("activate" , i);
            }
            $('h3.ui-accordion-header').eq(i).addClass('error');
          }
        });

        // Save first error item, for focussing it.
        if (!$firstErrorItem) {
          $('.ui-accordion-content-active', $firstErrorItem).css({height: 'auto', width: 'auto', display: 'block'});
        }

      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('verticalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    settings.field_group = settings.field_group || Drupal.settings.field_group;
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');


    // Add a new ID to each fieldset.
    $('.group-wrapper fieldset').each(function() {
      // Tats bad, but we have to keep the actual id to prevent layouts to break.
      var fieldgorupID = 'field_group-' + $(this).attr('id') + ' ' + $(this).attr('id');
      $(this).attr('id', fieldgorupID);
    })
    // Set the hash in url to remember last userselection.
    $('.group-wrapper ul li').each(function() {
      var fieldGroupNavigationListIndex = $(this).index();
      $(this).children('a').click(function() {
        var fieldset = $('.group-wrapper fieldset').get(fieldGroupNavigationListIndex);
        // Grab the first id, holding the wanted hashurl.
        var hashUrl = $(fieldset).attr('id').replace(/^field_group-/, '').split(' ')[0];
        window.location.hash = hashUrl;
      });
    });
  }
};

})(jQuery);;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

/**
 * @} End of "ingroup admin_behaviors".
 */

Drupal.admin.behaviors.shorcutcollapsed = function (context, settings, $adminMenu) {

  // Create the dropdown base 
  $("<li class=\"label\"><a>"+Drupal.t('Shortcuts')+"</a></li>").prependTo("body.menu-render-collapsed div.toolbar-shortcuts ul"); 

}

Drupal.admin.behaviors.shorcutselect = function (context, settings, $adminMenu) {

  // Create the dropdown base
  $("<select id='shortcut-menu'/>").appendTo("body.menu-render-dropdown div.toolbar-shortcuts");
    
  // Create default option "Select"
  $("<option />", {
    "selected"  :  "selected",
    "value"     :  "",
    "text"      :  Drupal.t('Shortcuts')
  }).appendTo("body.menu-render-dropdown div.toolbar-shortcuts select");
    
  // Populate dropdown with menu items
  $("body.menu-render-dropdown div.toolbar-shortcuts a").each(function() {
    var el = $(this);
    $("<option />", {
      "value"   :  el.attr("href"),
      "text"    :  el.text()
    }).appendTo("body.menu-render-dropdown div.toolbar-shortcuts select");
    });
    
  $("body.menu-render-dropdown div.toolbar-shortcuts select").change(function() {
    window.location = $(this).find("option:selected").val();
  });
  
  $('body.menu-render-dropdown div.toolbar-shortcuts ul').remove();

};

})(jQuery);
;
