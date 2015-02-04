(function ($) {
  Drupal.behaviors.pdf_forms = {
    attach: function (context, settings) {
      $('#edit-pdf-forms-handler input').change(function () {
        if (this.value === 'remote') {
          $('#edit-remote').removeClass('collapsed');
        }
        else {
          $('#edit-remote').addClass('collapsed');
        }
      });
    }
  };
}(jQuery));
