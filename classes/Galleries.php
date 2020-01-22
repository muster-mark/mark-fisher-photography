<?php

declare(strict_types=1);

namespace Mustermark;

class Galleries
{
    public const SLUGS_TO_NAMES = [
        'highlands' => 'Highlands',
        'landscapes' => 'Landscapes',
        'animals' => 'Animals',
        'dusk-to-dawn' => 'Dusk to Dawn',
        'plants' => 'Plants',
        'city' => 'City',
        'people' => 'People',
        'black-and-white' => 'Black and White',
    ];

    public const SLUGS_TO_META_DESCRIPTIONS = [
        'highlands' => 'Photographs of the Scottish highlands, including Skye, St. Kilda and Arran',
        'landscapes' => 'Landscape photographs by Mark Fisher,',
        'animals' => 'Photographs of animals by Mark Fisher',
        'dusk-to-dawn' => 'A collection of photos taken after the sun has set, or when it is not yet risen. More of the former, as Mark is an expert sleeper.',
        'plants' => 'From lilies to lime trees, and birch to bracken - photographs of plants and trees by Mark Fisher',
        'city' => 'Urban photographs by Mark Fisher',
        'people' => 'On rare occasions, I pluck up the courage to point my camera at other people. Here are the results.',
        'black-and-white' => 'Stripping away colour and letting form, geometry, texture, and moment do the talking, here is a collection of black and white photographs by London-based photographer Mark Fisher.',
    ];

    public function __construct()
    {

    }

    public function get_url_to_name_mapping()
    {
        $urls_to_names = [];

        foreach (self::SLUGS_TO_NAMES as $key => $value) {
        $urls_to_names['/' . $key . '/'] = $value;
    }

        return $urls_to_names;
    }


}
