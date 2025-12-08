<?php

/**
 * @param array $metadata {
 *     Metadata for the HTML document.
 *
 *     @type string $lang The language of the document.
 *     @type string $title The title of the document.
 *     @type string $description The description of the document.
 *     @type string $thumbnail The thumbnail URL for the document.
 *     @type number $thumbnailWidth The width of the thumbnail.
 *     @type number $thumbnailHeight The height of the thumbnail.
 *     @type string $url The canonical URL of the document.
 *     @type string $ogType The Open Graph type.
 *     @type array $jsonLd The JSON-LD structured data.
 * }
 */
function getIndexHTML(array $metadata = []): string {
    $htmlFile = __DIR__ . '/../index.html';
    $htmlContent = '';

    if (is_readable($htmlFile)) {
        $htmlContent = file_get_contents($htmlFile);
        if ($htmlContent === false) {
            return '';
        }
    }

    $dom = Dom\HTMLDocument::createFromString($htmlContent);

    $metaTags = $dom->getElementsByTagName('meta');
    foreach ($metaTags as $meta) {
        $name = $meta->getAttribute('name');
        $property = $meta->getAttribute('property');
        $prop = $name ?: $property;

        switch ($prop) {
            case 'description':
            case 'og:description':
            case 'twitter:description':
            case 'og:image:alt':
            case 'twitter:image:alt':
                if (isset($metadata['description'])) {
                    $meta->setAttribute('content', $metadata['description']);
                }
                break;
            case 'og:type':
                if (isset($metadata['ogType'])) {
                    $meta->setAttribute('content', $metadata['ogType']);
                }
                break;
            case 'og:url':
            case 'twitter:url':
                if (isset($metadata['url'])) {
                    $meta->setAttribute('content', $metadata['url']);
                }
                break;
            case 'og:title':
            case 'twitter:title':
                if (isset($metadata['title'])) {
                    $meta->setAttribute('content', $metadata['title']);
                }
                break;
            case 'og:image':
            case 'twitter:image':
                if (isset($metadata['thumbnail'])) {
                    $meta->setAttribute('content', $metadata['thumbnail']);
                }
                break;
            case 'og:image:width':
                if (isset($metadata['thumbnailWidth'])) {
                    $meta->setAttribute('content', (string) $metadata['thumbnailWidth']);
                }
                break;
            case 'og:image:height':
                if (isset($metadata['thumbnailHeight'])) {
                    $meta->setAttribute('content', (string) $metadata['thumbnailHeight']);
                }
                break;

            case 'og:locale':
                if (isset($metadata['lang'])) {
                    $localeMap = [
                        'en' => 'en_US',
                        'fr' => 'fr_FR',
                    ];
                    $locale = $localeMap[$metadata['lang']] ?? $metadata['lang'];
                    $meta->setAttribute('content', $locale);
                }
                break;

            case 'og:locale:alternate':
                if (isset($metadata['lang'])) {
                    $localeMap = [
                        'en' => 'fr_FR',
                        'fr' => 'en_US',
                    ];
                    $locale = $localeMap[$metadata['lang']] ?? null;
                    if ($locale) {
                        $meta->setAttribute('content', $locale);
                    }
                }
                break;
        }
    }

    $titleTags = $dom->getElementsByTagName('title');
    if ($titleTags->length > 0 && isset($metadata['title'])) {
        $titleNode = $titleTags->item(0);
        if ($titleNode !== null) {
            $titleText = $metadata['title'];
            try {
                $titleNode->nodeValue = $titleText;
            } catch (Throwable $e) {
                $newText = $dom->createTextNode($titleText);
                while ($titleNode->firstChild) {
                    $titleNode->removeChild($titleNode->firstChild);
                }
                $titleNode->appendChild($newText);
              
            }
        }
    }

    $htmlTags = $dom->getElementsByTagName('html');
    if ($htmlTags->length > 0 && isset($metadata['lang'])) {
        $htmlTags->item(0)->setAttribute('lang', $metadata['lang']);
    }

    if (isset($metadata['jsonLd']) && is_array($metadata['jsonLd'])) {
        $json = json_encode($metadata['jsonLd'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if ($json === false) {
            $copy = $metadata['jsonLd'];
            if (is_array($copy) || is_object($copy)) {
                array_walk_recursive($copy, function (&$v) {
                    if (is_string($v) && !mb_detect_encoding($v, 'UTF-8', true)) {
                        $v = utf8_encode($v);
                    }
                });
                $json = json_encode($copy, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            }

            if ($json === false) {
                $json = '{}';
            }
        }

        $jsonLdScript = $dom->createElement('script');
        $jsonLdScript->setAttribute('type', 'application/ld+json');
        $jsonLdScript->appendChild($dom->createTextNode($json));

        $headTags = $dom->getElementsByTagName('head');
        if ($headTags->length > 0) {
            $headTag = $headTags->item(0);
            $headTag->appendChild($jsonLdScript);
        }
    }

    return $dom->saveHTML();
}