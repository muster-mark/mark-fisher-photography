<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Symfony\Component\Filesystem\Filesystem;
use Mustermark\Galleries;


define('MANUAL_PAGES_DIR', realpath(__DIR__ . '/../manual_pages/'));
define('PUBLIC_DIR', realpath(__DIR__ . '/../public'));


$manual_page_templates = glob(__DIR__ . '/../manual_pages/**.html.twig');

require_once __DIR__ . '/../vendor/autoload.php';

$loader = new FilesystemLoader([
    __DIR__ . '/../templates/',
    __DIR__ . '/../manual_pages'
]);

$twig = new Environment($loader, [
    'cache' => __DIR__ . '/../cache/twig/',
    'auto_reload' => true,
]);

$twig->addGlobal('header_nav_links', (new Galleries())->get_url_to_name_mapping());

foreach ($manual_page_templates as $template) {
    $template_path = realpath($template);
    $template_name = str_replace(MANUAL_PAGES_DIR, '', $template_path);
    $output_file = PUBLIC_DIR . str_replace(MANUAL_PAGES_DIR, '', $template_path);
    $output_file = str_replace('.html.twig', '', $output_file); //Change extension

    $output = $twig->render($template_name);

    $filesystem = new Filesystem();
    echo "Created page $output_file" . PHP_EOL;
    $filesystem->dumpFile($output_file, $output);
}
