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

/**
 * Attach handlers to evaluate the strength of any password fields and to check
 * that its confirmation is correct.
 */
Drupal.behaviors.password = {
  attach: function (context, settings) {
    var translate = settings.password;
    $('input.password-field', context).once('password', function () {
      var passwordInput = $(this);
      var innerWrapper = $(this).parent();
      var outerWrapper = $(this).parent().parent();

      // Add identifying class to password element parent.
      innerWrapper.addClass('password-parent');

      // Add the password confirmation layer.
      $('input.password-confirm', outerWrapper).parent().prepend('<div class="password-confirm">' + translate['confirmTitle'] + ' <span></span></div>').addClass('confirm-parent');
      var confirmInput = $('input.password-confirm', outerWrapper);
      var confirmResult = $('div.password-confirm', outerWrapper);
      var confirmChild = $('span', confirmResult);

      // Add the description box.
      var passwordMeter = '<div class="password-strength"><div class="password-strength-text" aria-live="assertive"></div><div class="password-strength-title">' + translate['strengthTitle'] + '</div><div class="password-indicator"><div class="indicator"></div></div></div>';
      $(confirmInput).parent().after('<div class="password-suggestions description"></div>');
      $(innerWrapper).prepend(passwordMeter);
      var passwordDescription = $('div.password-suggestions', outerWrapper).hide();

      // Check the password strength.
      var passwordCheck = function () {

        // Evaluate the password strength.
        var result = Drupal.evaluatePasswordStrength(passwordInput.val(), settings.password);

        // Update the suggestions for how to improve the password.
        if (passwordDescription.html() != result.message) {
          passwordDescription.html(result.message);
        }

        // Only show the description box if there is a weakness in the password.
        if (result.strength == 100) {
          passwordDescription.hide();
        }
        else {
          passwordDescription.show();
        }

        // Adjust the length of the strength indicator.
        $(innerWrapper).find('.indicator').css('width', result.strength + '%');

        // Update the strength indication text.
        $(innerWrapper).find('.password-strength-text').html(result.indicatorText);

        passwordCheckMatch();
      };

      // Check that password and confirmation inputs match.
      var passwordCheckMatch = function () {

        if (confirmInput.val()) {
          var success = passwordInput.val() === confirmInput.val();

          // Show the confirm result.
          confirmResult.css({ visibility: 'visible' });

          // Remove the previous styling if any exists.
          if (this.confirmClass) {
            confirmChild.removeClass(this.confirmClass);
          }

          // Fill in the success message and set the class accordingly.
          var confirmClass = success ? 'ok' : 'error';
          confirmChild.html(translate['confirm' + (success ? 'Success' : 'Failure')]).addClass(confirmClass);
          this.confirmClass = confirmClass;
        }
        else {
          confirmResult.css({ visibility: 'hidden' });
        }
      };

      // Monitor keyup and blur events.
      // Blur must be used because a mouse paste does not trigger keyup.
      passwordInput.keyup(passwordCheck).focus(passwordCheck).blur(passwordCheck);
      confirmInput.keyup(passwordCheckMatch).blur(passwordCheckMatch);
    });
  }
};

/**
 * Evaluate the strength of a user's password.
 *
 * Returns the estimated strength and the relevant output message.
 */
Drupal.evaluatePasswordStrength = function (password, translate) {
  var weaknesses = 0, strength = 100, msg = [];

  var hasLowercase = /[a-z]+/.test(password);
  var hasUppercase = /[A-Z]+/.test(password);
  var hasNumbers = /[0-9]+/.test(password);
  var hasPunctuation = /[^a-zA-Z0-9]+/.test(password);

  // If there is a username edit box on the page, compare password to that, otherwise
  // use value from the database.
  var usernameBox = $('input.username');
  var username = (usernameBox.length > 0) ? usernameBox.val() : translate.username;

  // Lose 5 points for every character less than 6, plus a 30 point penalty.
  if (password.length < 6) {
    msg.push(translate.tooShort);
    strength -= ((6 - password.length) * 5) + 30;
  }

  // Count weaknesses.
  if (!hasLowercase) {
    msg.push(translate.addLowerCase);
    weaknesses++;
  }
  if (!hasUppercase) {
    msg.push(translate.addUpperCase);
    weaknesses++;
  }
  if (!hasNumbers) {
    msg.push(translate.addNumbers);
    weaknesses++;
  }
  if (!hasPunctuation) {
    msg.push(translate.addPunctuation);
    weaknesses++;
  }

  // Apply penalty for each weakness (balanced against length penalty).
  switch (weaknesses) {
    case 1:
      strength -= 12.5;
      break;

    case 2:
      strength -= 25;
      break;

    case 3:
      strength -= 40;
      break;

    case 4:
      strength -= 40;
      break;
  }

  // Check if password is the same as the username.
  if (password !== '' && password.toLowerCase() === username.toLowerCase()) {
    msg.push(translate.sameAsUsername);
    // Passwords the same as username are always very weak.
    strength = 5;
  }

  // Based on the strength, work out what text should be shown by the password strength meter.
  if (strength < 60) {
    indicatorText = translate.weak;
  } else if (strength < 70) {
    indicatorText = translate.fair;
  } else if (strength < 80) {
    indicatorText = translate.good;
  } else if (strength <= 100) {
    indicatorText = translate.strong;
  }

  // Assemble the final message.
  msg = translate.hasWeaknesses + '<ul><li>' + msg.join('</li><li>') + '</li></ul>';
  return { strength: strength, message: msg, indicatorText: indicatorText };

};

/**
 * Field instance settings screen: force the 'Display on registration form'
 * checkbox checked whenever 'Required' is checked.
 */
Drupal.behaviors.fieldUserRegistration = {
  attach: function (context, settings) {
    var $checkbox = $('form#field-ui-field-edit-form input#edit-instance-settings-user-register-form');

    if ($checkbox.length) {
      $('input#edit-instance-required', context).once('user-register-form-checkbox', function () {
        $(this).bind('change', function (e) {
          if ($(this).attr('checked')) {
            $checkbox.attr('checked', true);
          }
        });
      });

    }
  }
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
