<?php
function loadEnv($path) {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $count = count($lines);

    for ($i = 0; $i < $count; $i++) {
        $line = isset($lines[$i]) ? $lines[$i] : '';
        $trim = ltrim($line);
        if ($trim === '' || str_starts_with($trim, '#')) continue;

        if (strpos($line, '=') === false) continue;

        [$name, $rest] = explode('=', $line, 2);
        $name = trim($name);
        $value = ltrim($rest);

        if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
            $quote = $value[0];
            $len = strlen($value);

            $endsWithQuote = ($len > 1 && $value[$len - 1] === $quote && ($len < 2 || $value[$len - 2] !== '\\'));
            if ($endsWithQuote) {
                $value = substr($value, 1, -1);
            } else {
                $value = substr($value, 1);
                $i++;
                while ($i < $count) {
                    $nextLine = $lines[$i];
                    $nextLen = strlen($nextLine);
                    $nextEndsWithQuote = ($nextLen > 0 && $nextLine[$nextLen - 1] === $quote && ($nextLen < 2 || $nextLine[$nextLen - 2] !== '\\'));

                    if ($nextEndsWithQuote) {
                        $value .= "\n" . substr($nextLine, 0, -1);
                        break;
                    }

                    $value .= "\n" . $nextLine;
                    $i++;
                }
            }

            $value = str_replace('\\' . $quote, $quote, $value);
            $value = str_replace('\\n', "\n", $value);
        } else {
            $value = trim($value);
        }

        putenv("$name=$value");
        $_ENV[$name] = $value;
    }
}

loadEnv(__DIR__ . '/.env');