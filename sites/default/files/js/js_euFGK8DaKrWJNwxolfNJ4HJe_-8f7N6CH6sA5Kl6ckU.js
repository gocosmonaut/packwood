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
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
/**
 * @file
 * Provides JavaScript additions to the managed file field type.
 *
 * This file provides progress bar support (if available), popup windows for
 * file previews, and disabling of other file fields during Ajax uploads (which
 * prevents separate file fields from accidentally uploading files).
 */

(function ($) {

/**
 * Attach behaviors to managed file element upload fields.
 */
Drupal.behaviors.fileValidateAutoAttach = {
  attach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        var extensions = settings.file.elements[selector];
        $(selector, context).bind('change', {extensions: extensions}, Drupal.file.validateExtension);
      });
    }
  },
  detach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        $(selector, context).unbind('change', Drupal.file.validateExtension);
      });
    }
  }
};

/**
 * Attach behaviors to the file upload and remove buttons.
 */
Drupal.behaviors.fileButtons = {
  attach: function (context) {
    $('input.form-submit', context).bind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).bind('mousedown', Drupal.file.progressBar);
  },
  detach: function (context) {
    $('input.form-submit', context).unbind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).unbind('mousedown', Drupal.file.progressBar);
  }
};

/**
 * Attach behaviors to links within managed file elements.
 */
Drupal.behaviors.filePreviewLinks = {
  attach: function (context) {
    $('div.form-managed-file .file a, .file-widget .file a', context).bind('click',Drupal.file.openInNewWindow);
  },
  detach: function (context){
    $('div.form-managed-file .file a, .file-widget .file a', context).unbind('click', Drupal.file.openInNewWindow);
  }
};

/**
 * File upload utility functions.
 */
Drupal.file = Drupal.file || {
  /**
   * Client-side file input validation of file extensions.
   */
  validateExtension: function (event) {
    // Remove any previous errors.
    $('.file-upload-js-error').remove();

    // Add client side validation for the input[type=file].
    var extensionPattern = event.data.extensions.replace(/,\s*/g, '|');
    if (extensionPattern.length > 1 && this.value.length > 0) {
      var acceptableMatch = new RegExp('\\.(' + extensionPattern + ')$', 'gi');
      if (!acceptableMatch.test(this.value)) {
        var error = Drupal.t("The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.", {
          // According to the specifications of HTML5, a file upload control
          // should not reveal the real local path to the file that a user
          // has selected. Some web browsers implement this restriction by
          // replacing the local path with "C:\fakepath\", which can cause
          // confusion by leaving the user thinking perhaps Drupal could not
          // find the file because it messed up the file path. To avoid this
          // confusion, therefore, we strip out the bogus fakepath string.
          '%filename': this.value.replace('C:\\fakepath\\', ''),
          '%extensions': extensionPattern.replace(/\|/g, ', ')
        });
        $(this).closest('div.form-managed-file').prepend('<div class="messages error file-upload-js-error" aria-live="polite">' + error + '</div>');
        this.value = '';
        return false;
      }
    }
  },
  /**
   * Prevent file uploads when using buttons not intended to upload.
   */
  disableFields: function (event){
    var clickedButton = this;

    // Only disable upload fields for Ajax buttons.
    if (!$(clickedButton).hasClass('ajax-processed')) {
      return;
    }

    // Check if we're working with an "Upload" button.
    var $enabledFields = [];
    if ($(this).closest('div.form-managed-file').length > 0) {
      $enabledFields = $(this).closest('div.form-managed-file').find('input.form-file');
    }

    // Temporarily disable upload fields other than the one we're currently
    // working with. Filter out fields that are already disabled so that they
    // do not get enabled when we re-enable these fields at the end of behavior
    // processing. Re-enable in a setTimeout set to a relatively short amount
    // of time (1 second). All the other mousedown handlers (like Drupal's Ajax
    // behaviors) are excuted before any timeout functions are called, so we
    // don't have to worry about the fields being re-enabled too soon.
    // @todo If the previous sentence is true, why not set the timeout to 0?
    var $fieldsToTemporarilyDisable = $('div.form-managed-file input.form-file').not($enabledFields).not(':disabled');
    $fieldsToTemporarilyDisable.attr('disabled', 'disabled');
    setTimeout(function (){
      $fieldsToTemporarilyDisable.attr('disabled', false);
    }, 1000);
  },
  /**
   * Add progress bar support if possible.
   */
  progressBar: function (event) {
    var clickedButton = this;
    var $progressId = $(clickedButton).closest('div.form-managed-file').find('input.file-progress');
    if ($progressId.length) {
      var originalName = $progressId.attr('name');

      // Replace the name with the required identifier.
      $progressId.attr('name', originalName.match(/APC_UPLOAD_PROGRESS|UPLOAD_IDENTIFIER/)[0]);

      // Restore the original name after the upload begins.
      setTimeout(function () {
        $progressId.attr('name', originalName);
      }, 1000);
    }
    // Show the progress bar if the upload takes longer than half a second.
    setTimeout(function () {
      $(clickedButton).closest('div.form-managed-file').find('div.ajax-progress-bar').slideDown();
    }, 500);
  },
  /**
   * Open links to files within forms in a new window.
   */
  openInNewWindow: function (event) {
    $(this).attr('target', '_blank');
    window.open(this.href, 'filePreview', 'toolbar=0,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=500,height=550');
    return false;
  }
};

})(jQuery);
;
