<?php

declare(strict_types=1);

require_once(__DIR__ . '/../vendor/autoload.php');


use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Symfony\Component\Filesystem\Filesystem;
use Mustermark\Galleries;


define('METADATA_DIR', realpath(__DIR__ . '/../source/metadata_json/'));
define('PUBLIC_DIR', realpath(__DIR__ . '/../public'));


$loader = new FilesystemLoader([
    __DIR__ . '/../templates/'
]);

$twig = new Environment($loader, [
    'cache' => __DIR__ . '/../cache/twig/',
    'auto_reload' => true,
]);

$twig->addGlobal('header_nav_links', (new Galleries())->get_url_to_name_mapping());

//Get all galleries

//For each gallery, load all json files and render single photo page to /public/<gallery>/<instructions>

$fs = new Filesystem();

$galleries = glob(METADATA_DIR . '/*');

$galleries = array_map(function ($gallery) {
    return basename($gallery);
}, $galleries);


foreach ($galleries as $gallery_slug) {

    $metadata = [];

    $json_files = glob(METADATA_DIR . '/' . $gallery_slug . '/*.json');

    $gallery_metadata = array_map(function ($item) {
        return json_decode(file_get_contents($item), true);
    }, $json_files);

    foreach($gallery_metadata as &$image_metadata) {
        $image_metadata['css_grid_row_span'] = round(200 * ( $image_metadata['ImageHeight'] / $image_metadata['ImageWidth']) + 15); //Dealt with in css for predefined aspect ratios
        unset($image_metadata);
    }

    $output = $twig->render('_pages/gallery.html.twig', [
        'page' => [
            'meta_title' => Galleries::SLUGS_TO_NAMES[$gallery_slug],
            'url' => '/' . $gallery_slug . '/',
        ],
        'gallery' => $gallery_slug,
        'gallery_meta_description' => Galleries::SLUGS_TO_META_DESCRIPTIONS[$gallery_slug],
        'photos' => $gallery_metadata,
    ]);

    $file_name = PUBLIC_DIR . '/' . $gallery_slug . '/index';

    echo "Writing HTML to $file_name". PHP_EOL;

    $fs->dumpFile($file_name, $output);

    for ($i = 0; $i < count($gallery_metadata); $i++) {

        $previous_index = $i - 1;
        $next_index = $i + 1;

        if ($i === 0) {
            $previous_index = count($gallery_metadata) -1;
        } else if ($i + 1 === count($gallery_metadata)) {
            $next_index = 0;
        }

        $output = $twig->render('_pages/photo.html.twig', [
            'page' => [
                'meta_title' => $gallery_metadata[$i]['Title'],
                'url' => '/' . $gallery_slug . '/' . $gallery_metadata[$i]['SpecialInstructions'],
                //'title' => 'TITLE IS THIS USED',
            ],
            'gallery' => $gallery_slug,
            'gallery_name' => Galleries::SLUGS_TO_NAMES[$gallery_slug],
            'photo' => $gallery_metadata[$i],
            'previous_photo' => $gallery_metadata[$previous_index],
            'next_photo' => $gallery_metadata[$next_index]
        ]);

        $file_name = PUBLIC_DIR . '/' . $gallery_slug . '/' . $gallery_metadata[$i]['SpecialInstructions'];


        echo "Writing HTML to $file_name". PHP_EOL;

        $fs->dumpFile($file_name, $output);

    }


}

