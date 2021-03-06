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

/**
 * @files js for collapsible tree view with some helper functions for updating tree structure
 */

(function ($) {

Drupal.behaviors.TaxonomyManagerTree = {
  attach: function(context, settings) {
    var treeSettings = settings.taxonomytree || [];
    if (treeSettings instanceof Array) {
      for (var i=0; i<treeSettings.length; i++) {
        if (!$('#'+ treeSettings[i].id +'.tm-processed').length) {
          new Drupal.TaxonomyManagerTree(treeSettings[i].id, treeSettings[i].vid, treeSettings[i].parents);
        }
      }
    }
    //only add throbber for TM sites
    var throbberSettings = settings.TMAjaxThrobber || [];
    if (throbberSettings['add']) {
      if (!$('#taxonomy-manager-toolbar-throbber.tm-processed').length) {
        $('#taxonomy-manager-toolbar-throbber').addClass('tm-processed');
        Drupal.attachThrobber();
        Drupal.attachResizeableTreeDiv();
        Drupal.attachGlobalSelectAll();
      }
    }
    Drupal.attachMsgCloseLink(context);

  }
}


Drupal.TaxonomyManagerTree = function(id, vid, parents) {
  this.div = $("#"+ id);
  this.ul = $(this.div).children();

  this.form = $(this.div).parents('form');
  this.form_build_id = $(this.form).children().children(':input[name="form_build_id"]').val();
  this.form_id = $(this.form).children().children(' :input[name="form_id"]').val();
  this.form_token = $(this.form).children().children(' :input[name="form_token"]').val();
  this.language = this.getLanguage();
  this.treeId = id;
  this.vocId = vid;
  this.formParents = parents;
  this.childFormUrl = Drupal.settings.childForm['url'];
  this.siblingsFormUrl = Drupal.settings.siblingsForm['url'];

  this.attachTreeview(this.ul);
  this.attachSiblingsForm(this.ul);
  this.attachSelectAllChildren(this.ul);
  this.attachLanguageSelector();

  //attach term data js, if enabled
  var term_data_settings = Drupal.settings.termData || [];
  if (term_data_settings['url']) {
    Drupal.attachTermData(this.ul);
  }
  $(this.div).addClass("tm-processed");
}

/**
 * adds collapsible treeview to a given list
 */
Drupal.TaxonomyManagerTree.prototype.attachTreeview = function(ul, currentIndex) {
  var tree = this;
  if (currentIndex) {
    ul = $(ul).slice(currentIndex);
  }
  var expandableParent = $(ul).find("div.hitArea");
  $(expandableParent).click(function() {
    var li = $(this).parent();
    tree.loadChildForm(li);
    tree.toggleTree(li);
  });
  $(expandableParent).parent("li.expandable, li.lastExpandable").children("ul").hide();
}

/**
 * toggles a collapsible/expandable tree element by swaping classes
 */
Drupal.TaxonomyManagerTree.prototype.toggleTree = function(node) {
  $(node).children("ul").toggle();
  this.swapClasses(node, "expandable", "collapsable");
  this.swapClasses(node, "lastExpandable", "lastCollapsable");
}

/**
 * helper function for swapping two classes
 */
Drupal.TaxonomyManagerTree.prototype.swapClasses = function(node, c1, c2) {
  if ($(node).hasClass(c1)) {
    $(node).removeClass(c1).addClass(c2);
  }
  else if ($(node).hasClass(c2)) {
    $(node).removeClass(c2).addClass(c1);
  }
}


/**
 * loads child terms and appends html to list
 * adds treeview, weighting etc. js to inserted child list
 */
Drupal.TaxonomyManagerTree.prototype.loadChildForm = function(li, update, callback) {
  var tree = this;
  if ($(li).is(".has-children") || update == true) {
    $(li).removeClass("has-children");
    if (update) {
      $(li).children("ul").remove();
    }
    var parentId = Drupal.getTermId(li);
    var url = tree.childFormUrl +'/'+ this.treeId +'/'+ this.vocId +'/'+ parentId;
    var param = new Object();
    param['form_build_id'] = this.form_build_id;
    param['form_id'] = this.form_id;
    param['tree_id'] = this.treeId;
    param['form_parents'] = this.formParents;
    param['language'] = this.language;

    $.ajax({
      data: param,
      type: "GET",
      url: url,
      dataType: 'json',
      success: function(response, status) {
         $(li).append(response.data);
        var ul = $(li).children("ul");
        tree.attachTreeview(ul);
        tree.attachSiblingsForm(ul);
        tree.attachSelectAllChildren(ul);

        //only attach other features if enabled!
        var weight_settings = Drupal.settings.updateWeight || [];
        if (weight_settings['up']) {
          Drupal.attachUpdateWeightTerms(li);
        }
        var term_data_settings = Drupal.settings.termData || [];
        if (term_data_settings['url']) {
          Drupal.attachTermDataLinks(ul);
        }
        if (typeof(callback) == "function") {
          callback(li, tree);
        }
      }
    });
  }
}

/**
 * function for reloading root tree elements
 */
Drupal.TaxonomyManagerTree.prototype.loadRootForm = function(tids) {
  var tree = this;
  var url = this.childFormUrl +'/'+ this.treeId +'/'+ this.vocId +'/0/';

  var param = new Object();
  param['form_build_id'] = this.form_build_id;
  param['form_id'] = this.form_id;
  param['tree_id'] = this.treeId;
  param['form_parents'] = this.formParents;
  param['language'] = this.language;
  param['terms_to_expand'] = tids; // can either be a single term id or concatinated ids

   $.ajax({
      data: param,
      type: "GET",
      url: url,
      dataType: 'json',
      success: function(response, status) {
        $('#'+ tree.treeId).html(response.data);
        var ul = $('#'+ tree.treeId).children("ul");
        tree.attachTreeview(ul);
        tree.attachSiblingsForm(ul);
        tree.attachSelectAllChildren(ul);
        Drupal.attachUpdateWeightTerms(ul);
        Drupal.attachTermDataLinks(ul);

        var lang = $('#edit-'+ tree.treeId +'-language').val();
        if (lang != "" && lang != tree.langauge) {
          $(tree.div).parent().siblings("div.taxonomy-manager-tree-top").find("select.language-selector option[value="+ lang +"]").attr("selected", "selected");
        }
      }
  });
}


/**
 * adds link for loading next siblings terms, when click terms get loaded through ahah
 * adds all needed js like treeview, weightning, etc.. to new added terms
 */
Drupal.TaxonomyManagerTree.prototype.attachSiblingsForm = function(ul) {
  var tree = this;
  var url = this.siblingsFormUrl;

  var list = "li.has-more-siblings div.term-has-more-siblings";
  if (ul) {
    list = $(ul).find(list);
  }

  $(list).bind('click', function() {
    $(this).unbind("click");
    var li = this.parentNode;
    var all = $('li', li.parentNode);
    var currentIndex = all.index(li);

    var page = Drupal.getPage(li);
    var prev_id = Drupal.getTermId(li);
    var parentId = Drupal.getParentId(li);

    url += '/'+ tree.treeId +'/'+ page +'/'+ prev_id +'/'+ parentId;

    var param = new Object();
    param['form_build_id'] = tree.form_build_id;
    param['form_id'] = tree.form_id;
    param['tree_id'] = tree.treeId;
    param['form_parents'] = tree.formParents;
    param['language'] = tree.language;

    $.ajax({
      data: param,
      type: "GET",
      url: url,
      dataType: 'json',
      success: function(response, status) {
        $(list).remove();
        $(li).after(response.data);
        tree.attachTreeview($('li', li.parentNode), currentIndex);
        tree.attachSelectAllChildren($('li', li.parentNode), currentIndex);

        //only attach other features if enabled!
        var weight_settings = Drupal.settings.updateWeight || [];
        if (weight_settings['up']) {
          Drupal.attachUpdateWeightTerms($('li', li.parentNode), currentIndex);
        }
        var term_data_settings = Drupal.settings.termData || [];
        if (term_data_settings['url']) {
          Drupal.attachTermDataToSiblings($('li', li.parentNode), currentIndex);
        }

        $(li).removeClass("last").removeClass("has-more-siblings");
        $(li).children().children('.term-operations').hide();
        tree.swapClasses(li, "lastExpandable", "expandable");
        tree.attachSiblingsForm($(li).parent());
      }
    });
  });
}


/**
 * helper function for getting out the current page
 */
Drupal.getPage = function(li) {
  return $(li).find("input:hidden[class=page]").attr("value");
}


/**
 * returns terms id of a given list element
 */
Drupal.getTermId = function(li) {
  return $(li).children().children("input:hidden[class=term-id]").attr("value");
}

/**
 * return term id of a prent of a given list element
 * if no parent exists (root level), returns 0
 */
Drupal.getParentId = function(li) {
  var parentId;
  try {
    var parentLi = $(li).parent("ul").parent("li");
    parentId = Drupal.getTermId(parentLi);
  } catch(e) {
    return 0;
  }
  return parentId;
}

/**
 * update classes for tree view, if list elements get swaped
 */
Drupal.updateTree = function(upTerm, downTerm) {
  if ($(upTerm).is(".last")) {
    $(upTerm).removeClass("last");
    Drupal.updateTreeDownTerm(downTerm);
  }
  else if ($(upTerm).is(".lastExpandable")) {
    $(upTerm).removeClass("lastExpandable").addClass("expandable");
    Drupal.updateTreeDownTerm(downTerm);
  }
  else if ($(upTerm).is(".lastCollapsable")) {
    $(upTerm).removeClass("lastCollapsable").addClass("collapsable");
    Drupal.updateTreeDownTerm(downTerm);
  }
}

/**
 * update classes for tree view for a list element moved downwards
 */
Drupal.updateTreeDownTerm = function(downTerm) {
  if ($(downTerm).is(".expandable")) {
    $(downTerm).removeClass("expandable").addClass("lastExpandable");
  }
  else if ($(downTerm).is(".collapsable")) {
    $(downTerm).removeClass("collapsable").addClass("lastCollapsable");
  }
  else {
    $(downTerm).addClass("last");
  }
}

/**
 * Adds button next to parent term to select all available child checkboxes
 */
Drupal.TaxonomyManagerTree.prototype.attachSelectAllChildren = function(parent, currentIndex) {
  var tree = this;
  if (currentIndex) {
    parent = $(parent).slice(currentIndex);
  }
  $(parent).find('span.select-all-children').click(function() {
    tree.SelectAllChildrenToggle(this);
  });
}

/**
 * (un-)selects nested checkboxes
 */
Drupal.TaxonomyManagerTree.prototype.SelectAllChildrenToggle = function(span) {
  var tree = this;
  if ($(span).hasClass("select-all-children")) {
    var li = $(span).parents("li:first");
    if ($(li).hasClass("has-children")) {
      this.loadChildForm(li, true, function(li, tree) {
        tree.swapClasses(li, "expandable", "collapsable");
        tree.swapClasses(li, "lastExpandable", "lastCollapsable");
        var this_span = $(li).find('span.select-all-children:first');
        tree.SelectAllChildrenToggle(this_span);
        return;
      });
    }
    else {
      $(span).removeClass("select-all-children").addClass("deselect-all-children");
      $(span).attr("title", Drupal.t("Deselect all children"));
      $(span).parents("li:first").find('ul:first').each(function() {
        var first_element = $(this).find('.term-line:first');
        $(first_element).parent().siblings("li").find('div.term-line:first :checkbox').attr('checked', true);
        $(first_element).find(' :checkbox').attr('checked', true);
      });
    }
  }
  else {
    $(span).removeClass("deselect-all-children").addClass("select-all-children");
    $(span).parents(".term-line").siblings("ul").find(':checkbox').attr("checked", false);
    $(span).attr("title", Drupal.t("Select all children"));
  }
}

/**
 * language selector
 */
Drupal.TaxonomyManagerTree.prototype.attachLanguageSelector = function() {
  var tree = this;
  var selector = $(tree.div).parent().siblings("div.taxonomy-manager-tree-top").find("select.language-selector");
  $(selector).not(".selector-processed").change(function() {
    tree.language = $(this).val();
    tree.loadRootForm();
  });
  $(selector).addClass("selector-processed");

}
Drupal.TaxonomyManagerTree.prototype.getLanguage = function() {
  var lang = $('#edit-taxonomy-manager-top-language').val();
  if (typeof(lang) == "undefined") {
    return "";
  }
  return lang;
}

/**
 * return array of selected terms
 */
Drupal.TaxonomyManagerTree.prototype.getSelectedTerms = function() {
  var terms = new Array();
  $(this.div).find("input[type=checkbox][checked]").each(function() {
    var term = $(this).parents("li").eq(0);
    terms.push(term);
  });
  return terms;
}

/**
 * returns li node for a given term id, if it exists in the tree
 */
Drupal.TaxonomyManagerTree.prototype.getLi = function(termId) {
  return $(this.div).find("input:hidden[class=term-id][value="+ termId +"]").parent().parent();
}

Drupal.attachMsgCloseLink = function(context) {
  $(context).find('div.messages').once(function() {
    $('<span class="taxonomy-manager-message-close"><a href="" title="'+ Drupal.t('Close') +'">x</a></span>').appendTo(this).click(function() {
      $(this).parent().fadeOut('fast', function() {
        $(this).remove();
      });
      return false;
    });
  });
}

/**
 * attaches a throbber element to the taxonomy manager
 */
Drupal.attachThrobber = function() {
  var div = $('#taxonomy-manager');
  var throbber = $('<img src="'+ Drupal.settings.taxonomy_manager['modulePath'] +'images/ajax-loader.gif" alt="" height="25">');
  throbber.appendTo("#taxonomy-manager-toolbar-throbber").hide();

  throbber.ajaxStart(function() {
    $(this).show();
  });
  throbber.ajaxStop(function() {
    $(this).hide();
  });
  throbber.ajaxError(function() {
    alert("An AJAX error occurred. Reload the page and check your logs.");
    $(this).hide();
  });
}

/**
* makes the div resizeable
*/
Drupal.attachResizeableTreeDiv = function() {
  $('img.div-grippie').each(function() {
    var staticOffset = null;
    var div = $(this).parents("fieldset").parent();
    $(this).mousedown(startDrag);

    function startDrag(e) {
      staticOffset = div.width() - e.pageX;
      div.css('opacity', 0.5);
      $(document).mousemove(performDrag).mouseup(endDrag);
      return false;
    }

    function performDrag(e) {
      div.width(Math.max(200, staticOffset + e.pageX) + 'px');
      return false;
    }

    function endDrag(e) {
      $(document).unbind("mousemove", performDrag).unbind("mouseup", endDrag);
      div.css('opacity', 1);
    }
  });
}

/**
 * Adds select all / remove selection functionality.
 */
Drupal.attachGlobalSelectAll = function() {
  $('span.taxonomy-manager-select-helpers').once(function() {
    var form = $(this).parents('.form-wrapper:first');
    $(this).find('span.select-all-children').click(function() {
      // Only select those that are visible to the end user.
      $(form).parent().find(' :checkbox:visible').attr('checked', true);
    });
    $(this).find('span.deselect-all-children').click(function() {
      $(form).parent().find(':checkbox').attr("checked", false);
    });
  });
}


})(jQuery);

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
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.input.value = $(this.selected).data('autocompleteValue');
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.select(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway.
  searchString = searchString.replace(/^\s+|\s+$/, '');
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;

/**
 * @file shows / hides form elements
 */

(function ($) {

Drupal.behaviors.TaxonomyManagerHideForm = {
  attach: function(context, settings) {
    $('#edit-toolbar', context).once('hideForm', function() {
      for (var key in settings.hideForm) {
        Drupal.attachHideForm(settings.hideForm[key].div, settings.hideForm[key].show_button, settings.hideForm[key].hide_button);
      }
    });
  }
}

/**
 * adds click events to show / hide button
 */
Drupal.attachHideForm = function(div, show_button, hide_button) {
  var hide = true;
  var div = $("#"+ div);
  var show_button = $("#"+ show_button);
  var hide_button = $("#"+ hide_button);

  // don't hide if there is an error in the form
  $(div).find("input").each(function() {
    if ($(this).hasClass("error")) {
      hide = false;
    }
  });

  if (!hide) {
    $(div).show();
  }
  $(show_button).click(function() {
    Drupal.hideOtherForms(div);
    $(div).toggle();
    return false;
  });

  $(hide_button).click(function() {
    $(div).hide();
    return false;
  });
}

/**
 * Helper function that hides all forms, except the current one.
*/
Drupal.hideOtherForms = function(currentFormDiv) {
  var currentFormDivId = $(currentFormDiv).attr('id');
  var settings = Drupal.settings.hideForm || [];
  for (var key in settings) {
    var div = settings[key].div;
    if (div != currentFormDivId) {
      $('#' + div).hide();
    }
  }
}

})(jQuery);
;

/**
 * @file js for changing weights of terms with Up and Down arrows
 */

(function ($) {

//object to store weights (tid => weight)
var termWeightsData = new Object();

Drupal.behaviors.TaxonomyManagerWeights = {
  attach: function(context, settings) {
    var weightSettings = settings.updateWeight || [];
    if (!$('#edit-toolbar.tm-weights-processed').length) {
      $('#edit-toolbar').addClass('tm-weights-processed');
      termWeightsData['form_token'] = $('input[name=form_token]').val();
      termWeightsData['form_id'] = $('input[name=form_id]').val();
      termWeightsData['weights'] = new Object();
      Drupal.attachUpdateWeightToolbar(weightSettings['up'], weightSettings['down']);
      Drupal.attachUpdateWeightTerms();
    }
  }
}

/**
 * adds click events for Up and Down buttons in the toolbar, which
 * allow the moving of selected (can be more) terms
 */
Drupal.attachUpdateWeightToolbar = function(upButton, downButton) {
  var selected;
  var url = Drupal.settings.updateWeight['url'];

  $('#'+ upButton).click(function() {
    selected = Drupal.getSelectedTerms();
    for (var i=0; i < selected.length; i++) {
      var upTerm = selected[i];
      var downTerm = $(upTerm).prev();

      Drupal.orderTerms(upTerm, downTerm);
    }
    if (selected.length > 0) {
      $.post(url, termWeightsData);
    }
  });


  $('#'+ downButton).click(function() {
    selected = Drupal.getSelectedTerms();
    for (var i=selected.length-1; i >= 0; i--) {
      var downTerm = selected[i];
      var upTerm = $(downTerm).next();

      Drupal.orderTerms(upTerm, downTerm);
    }
    if (selected.length > 0) {
      $.post(url, termWeightsData);
    }
  });
}

/**
 * adds small up and down arrows to each term
 * arrows get displayed on mouseover
 */
Drupal.attachUpdateWeightTerms = function(parent, currentIndex) {
  var settings = Drupal.settings.updateWeight || [];
  var disable = settings['disable_mouseover'];

  if (!disable) {
    var url = Drupal.settings.updateWeight['url'];

    var termLineClass = 'div.term-line';
    var termUpClass = 'img.term-up';
    var termDownClass = 'img.term-down';

    if (parent && currentIndex) {
      parent = $(parent).slice(currentIndex);
    }
    if (parent) {
      termLineClass = $(parent).find(termLineClass);
      termUpClass = $(parent).find(termUpClass);
      termDownClass = $(parent).find(termDownClass);
    }

    $(termLineClass).mouseover(function() {
      $(this).find('div.term-operations').show();
    });

    $(termLineClass).mouseout(function() {
      $(this).find('div.term-operations').hide();
    });

    $(termUpClass).click(function() {
      var upTerm = $(this).parents("li").eq(0);
      var downTerm = $(upTerm).prev();

      Drupal.orderTerms(upTerm, downTerm);
      $.post(url, termWeightsData);

      $(downTerm).find(termLineClass).unbind('mouseover');
      setTimeout(function() {
        $(upTerm).find('div.term-operations').hide();
        $(downTerm).find(termLineClass).mouseover(function() {
          $(this).find('div.term-operations').show();
        });
      }, 1500);

    });


    $(termDownClass).click(function() {
      var downTerm = $(this).parents("li").eq(0);
      var upTerm = $(downTerm).next();

      Drupal.orderTerms(upTerm, downTerm);
      $.post(url, termWeightsData);

      $(upTerm).find(termLineClass).unbind('mouseover');
      setTimeout(function() {
        $(downTerm).find('div.term-operations').hide();
        $(upTerm).find(termLineClass).mouseover(function() {
          $(this).find('div.term-operations').show();
        });
      }, 1500);

    });
  }

}

/**
 * return array of selected terms
 */
Drupal.getSelectedTerms = function() {
  var terms = new Array();
  $('.treeview').find("input:checked").each(function() {
    var term = $(this).parents("li").eq(0);
    terms.push(term);
  });

  return terms;
}

/**
 * reorders terms
 *   - swap list elements in DOM
 *   - post updated weights to callback in php
 *   - update classes of tree view
 */
Drupal.orderTerms = function(upTerm, downTerm) {
  try {
    Drupal.getTermId(upTerm);
    Drupal.swapTerms(upTerm, downTerm);
    Drupal.swapWeights(upTerm, downTerm);
    Drupal.updateTree(upTerm, downTerm);
  } catch(e) {
    //no next item, because term to update is last child, continue
  }
}

/**
 * simple swap of two elements
 */
Drupal.swapTerms = function(upTerm, downTerm) {
  $(upTerm).after(downTerm);
  $(downTerm).before(upTerm);
}

/**
 * updating weights of swaped terms
 * if two terms have different weights, then weights are being swapped
 * else, if both have same weights, upTerm gets decreased
 *
 * if prev/next siblings of up/down terms have same weights as current
 * swapped, they have to be updated by de/increasing weight (by 1) to ensure
 * unique position of swapped terms
 */
Drupal.swapWeights = function(upTerm, downTerm) {
  var upWeight = Drupal.getWeight(upTerm);
  var downWeight = Drupal.getWeight(downTerm);
  var downTid = Drupal.getTermId(downTerm);
  var upTid = Drupal.getTermId(upTerm);

  //same weight, decrease upTerm
  if (upWeight == downWeight) {
    termWeightsData['weights'][upTid] = --upWeight;
  }
  //different weights, swap
  else {
    termWeightsData['weights'][upTid] = downWeight;
    termWeightsData['weights'][downTid] = upWeight;
  }

  //update prev siblings if necessary
  try {
    if (Drupal.getWeight($(upTerm).prev()) >= upWeight) {
      $(upTerm).prevAll().each(function() {
        var id = Drupal.getTermId(this);
        var weight = Drupal.getWeight(this);
        termWeightsData['weights'][id] = --weight;
      });
    }
  } catch(e) {
    //no prev
  }

  //update next siblings if necessary
  try {
    if (Drupal.getWeight($(downTerm).next()) <= downWeight) {
      $(downTerm).nextAll().each(function() {
        var id = Drupal.getTermId(this);
        var weight = Drupal.getWeight(this);
        termWeightsData['weights'][id] = ++weight;
      });
    }
  } catch(e) {
    //no next
  }

}

/**
 * helper to return weight of a term
 */
Drupal.getWeight = function(li) {
  var id = Drupal.getTermId(li);
  var weight;

  if (termWeightsData['weights'][id] != null) {
    weight = termWeightsData['weights'][id];
  }
  else {
    weight = $(li).find("input:hidden[class=weight-form]").attr("value");
  }

  return weight;
}

})(jQuery);
;

/**
 * @file js support for term editing form for ajax saving and tree updating
 */


(function ($) {
  
//global var that holds the current term link object
var active_term = new Object();

/** 
 * attaches term data form, used after 'Saves changes' submit
 */
Drupal.behaviors.TaxonomyManagerTermData = {
  attach: function(context) {
    if (!$('#taxonomy-term-data-replace').hasClass('processed')) {
      $('#taxonomy-term-data-replace').addClass('processed');
      Drupal.attachTermDataForm();
    }
  }
}

/**
 * attaches Term Data functionality, called by tree.js
 */
Drupal.attachTermData = function(ul) {
  Drupal.attachTermDataLinks(ul);
}

/**
 * adds click events to the term links in the tree structure
 */
Drupal.attachTermDataLinks = function(ul) {
  $(ul).find('a.term-data-link').click(function() {
    Drupal.activeTermSwapHighlight(this);
    var li = $(this).parents("li:first");
    Drupal.loadTermDataForm(Drupal.getTermId(li), false);
    return false;
  });
}

/**
 * attaches click events to next siblings
 */
Drupal.attachTermDataToSiblings = function(all, currentIndex) {
  var nextSiblings = $(all).slice(currentIndex);
  $(nextSiblings).find('a.term-data-link').click(function() {
    var li = $(this).parents("li:first");
    Drupal.loadTermDataForm(Drupal.getTermId(li), false);
    return false;
  });
}

/**
 * adds click events to term data form, which is already open, when page gets loaded
 */
Drupal.attachTermDataForm = function() {
  active_term = $('div.highlightActiveTerm').find('a');
  var tid = $('#taxonomy-term-data').find('input:hidden[name="tid"]').val();
  if (tid) {
    new Drupal.TermData(tid).form();
  }
}

/**
 * loads term data form
 */
Drupal.loadTermDataForm = function(tid, refreshTree) {
  // Triggers an AJAX button
  $('#edit-load-tid').val(tid);
  if (refreshTree) {
    $('#edit-load-tid-refresh-tree').attr("checked", "checked");
  }
  else {
    $('#edit-load-tid-refresh-tree').attr("checked", "");
  }
  $('#edit-load-tid-submit').click();
}

/**
 * TermData Object
 */
Drupal.TermData = function(tid) {
  this.tid = tid;
  this.div = $('#taxonomy-term-data');
}

/**
 * adds events to possible operations
 */
Drupal.TermData.prototype.form = function() {
  var termdata = this;
  
  $(this.div).find('#term-data-close span').click(function() {
    termdata.div.children().hide();
  });
  
  $(this.div).find('a.taxonomy-term-data-name-link').click(function() {
    var tid = this.href.split("/").pop();
    Drupal.loadTermDataForm(tid, true);
    return false;
  });
  
  $(this.div).find("legend").each(function() {
    var staticOffsetX, staticOffsetY = null;
    var left, top = 0;
    var div = termdata.div; 
    var pos = $(div).position();
    $(this).mousedown(startDrag);  
  
    function startDrag(e) {
      if (staticOffsetX == null && staticOffsetY == null) {
        staticOffsetX = e.pageX;
        staticOffsetY = e.pageY;
      }
      $(document).mousemove(performDrag).mouseup(endDrag);
      return false;
    }
 
    function performDrag(e) {
      left = e.pageX - staticOffsetX;
      top = e.pageY - staticOffsetY;
      $(div).css({position: "absolute", "left": pos.left + left +"px", "top": pos.top + top +"px"});
      return false;
    }
 
    function endDrag(e) {
      $(document).unbind("mousemove", performDrag).unbind("mouseup", endDrag);
    }
  });
}

/**
* hightlights current term
*/
Drupal.activeTermSwapHighlight = function(link) {
  try {
    $(active_term).parents('div.term-line').removeClass('highlightActiveTerm');
  } catch(e) {}
  active_term = link;
  $(active_term).parents('div.term-line:first').addClass('highlightActiveTerm');
}

})(jQuery);
;

(function($) {
  Drupal.behaviors.CToolsJumpMenu = {
    attach: function(context) {
      $('.ctools-jump-menu-hide')
        .once('ctools-jump-menu')
        .hide();

      $('.ctools-jump-menu-change')
        .once('ctools-jump-menu')
        .change(function() {
          var loc = $(this).val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });

      $('.ctools-jump-menu-button')
        .once('ctools-jump-menu')
        .click(function() {
          // Instead of submitting the form, just perform the redirect.

          // Find our sibling value.
          var $select = $(this).parents('form').find('.ctools-jump-menu-select');
          var loc = $select.val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });
    }
  }
})(jQuery);
;
