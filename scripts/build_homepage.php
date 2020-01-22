<?php

declare(strict_types=1);

require_once(__DIR__ . '/../vendor/autoload.php');


use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Symfony\Component\Filesystem\Filesystem;
use Mustermark\Galleries;


define('METADATA_DIR', realpath(__DIR__ . '/../source/metadata_json'));
define('PUBLIC_DIR', realpath(__DIR__ . '/../public'));

$homepage_photos = [
    'after-brendan',
    'monoculture',
    'the-last-of-autumns-bounty',
    'zebra-ngorongoro-crater',
    'zebras-of-the-serengeti',
    'impala-in-the-grass',
    'swan-in-a-tree',
    'rain-over-bryce-canyon',
    'monet-pool',
    'cow-pooing-at-black-rock',
    'moonbolt',
    'deer-at-dusk',
    'loch-scavaig',
    'beneath-bla-bheinn',
    'neptunes-canvas',
    'cows-by-loch-brittle',
    'boreray',
    'barnacle-unconformity',
    'green-embrace',
];

$favourite_photos = [];

foreach($homepage_photos as $photo) {
    $favourite_photo = json_decode(file_get_contents(glob(METADATA_DIR . '/*/*_' . $photo . '.json')[0]), true);
    $favourite_photo['css_grid_row_span'] = round(200 * ( $favourite_photo['ImageHeight'] / $favourite_photo['ImageWidth']) + 15); //Dealt with in css for predefined aspect ratios
    $favourite_photos[] = $favourite_photo;
}

$loader = new FilesystemLoader([
    __DIR__ . '/../templates/'
]);

$twig = new Environment($loader, [
    'cache' => __DIR__ . '/../cache/twig/',
    'auto_reload' => true,
]);

$twig->addGlobal('header_nav_links', (new Galleries())->get_url_to_name_mapping());

$fs = new Filesystem();

$output = $twig->render('_pages/homepage.html.twig', [
    'page' => [
        'url' => '/',
    ],
    'favourite_photos' => $favourite_photos,
]);


$file_name = PUBLIC_DIR . '/index';

echo "Writing HTML to $file_name". PHP_EOL;

$fs->dumpFile($file_name, $output);
