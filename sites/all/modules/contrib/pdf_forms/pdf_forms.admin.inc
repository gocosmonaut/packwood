<?php
/**
 * @file pdf_forms.admin.inc
 * Contains administrative screens and functions used internally by those.
 */

function pdf_forms_admin_settings() {
  return drupal_get_form('pdf_forms_admin_settings_form');
}

/**
 * Settings form for user to place API Key
 */
function pdf_forms_admin_settings_form($form, &$form_state) {
  $pdf_forms_handler = variable_get('pdf_forms_handler');

  // Assemble service options. Warning messages will be added next as needed.
  // TODO: Fix documentation links.
  $options = array(
    'pdftk' => t('Use locally-installed pdftk: You will need a VPS or a dedicated server so you can install pdftk (') . l(t('see documentation'),  'admin/help/pdf_forms') . t(').'),
    'javabridge' => t('Use locally-installed PHP/JavaBridge: You will need a VPS or dedicated server so you can deploy PHP/JavaBridge on Apache Tomcat (') . l(t('see documentation'),  'admin/help/pdf_forms') . t(').'),
    'fps' => t('Use Fill PDF Service: Sign up for <a href="https://fillpdf-service.com">Fill PDF Service</a>.'),
  );

  // Check for JavaBridge.
  // TODO: Use sites/all/libraries for this, not a directory underneath the
  // module.
  if (!(file_exists(drupal_get_path('module', 'pdf_forms') . '/lib/JavaBridge/java/Java.inc'))) {
    $options['javabridge'] .= '<div class="messages warning">' . t('JavaBridge is not installed locally.') . '</div>';
  }

  // Check for pdftk.
  $status = pdf_forms_pdftk_check(variable_get('pdf_forms_pdftk_path', 'pdftk'));
  if ($status === FALSE) {
    $options['pdftk'] .= '<div class="messages warning">' . t('pdftk is not properly installed.') . '</div>';
  }

  $form['pdf_forms_handler'] = array(
    '#type' => 'radios',
    '#title' => t('PDF-filling service'),
    '#description' => t('This module requires the use of one of several external PDF manipulation tools. Choose the service you would like to use.'),
    '#default_value' => $pdf_forms_handler,
    '#options' => $options,
  );
  $form['fps'] = array(
    '#type' => 'fieldset',
    '#title' => t('Configure Fill PDF Service'),
    '#collapsible' => TRUE,
    '#collapsed' => $pdf_forms_handler !== 'fps',
  );
  $form['fps']['pdf_forms_fps_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('API Key'),
    '#default_value' => variable_get('pdf_forms_fps_api_key', ''),
    '#description' => t('You need to sign up for an API key at <a href="https://fillpdf-service.com">Fill PDF Service</a>'),
  );
  $form['fps']['pdf_forms_fps_protocol'] = array(
    '#type' => 'radios',
    '#title' => t('Use HTTPS?'),
    '#description' => t('It is recommended to select <em>Use HTTPS</em> for this
      option. Doing so will help prevent sensitive information in your PDFs from
      being intercepted in transit between your server and Fill PDF
      Service.'),
    '#default_value' => variable_get('pdf_forms_fps_protocol', 'https'),
    '#options' => array(
      'https' => t('Use HTTPS'),
      'http' => t('Do not use HTTPS'),
      ),
  );
  $form['pdf_forms_pdftk_path'] = array(
    '#type' => 'textfield',
    '#title' => t('Configure path to pdftk'),
    '#description' => t("If Fill PDF is not detecting your pdftk installation,
      you can specify the full path to the program here. Include the program name
      as well. For example, <em>/usr/bin/pdftk</em> is a valid value. You can
      almost always leave this field blank. If you should set it, you'll probably
      know."),
    '#default_value' => variable_get('pdf_forms_pdftk_path'),
  );

  drupal_add_js(drupal_get_path('module', 'pdf_forms') . '/pdf_forms.js');

  return system_settings_form($form);
}

function pdf_forms_admin_settings_form_validate($form, &$form_state) {
  if ($form_state['values']['pdf_forms_pdftk_path']) {
    $status = pdf_forms_pdftk_check($form_state['values']['pdf_forms_pdftk_path']);
    if ($status === FALSE) {
      form_set_error('pdf_forms_pdftk_path', t('The path you have entered for
      <em>pdftk</em> is invalid. Please enter a valid path.'));
    }
  }
}

