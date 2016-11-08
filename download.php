<?php
/**
 * Created by PhpStorm.
 * User: Scientist
 * Date: 11/7/16
 * Time: 8:46 AM
 */

$name = $_GET['name'];

$buttonIsFlat = $_GET['buttonIsFlat'];

$colorNormal = '#' . $_GET['colorNormal'];
$colorPressed = '#' . $_GET['colorPressed'];

$startColor = '#' . $_GET['startColor'];
$centerColor = '#' . $_GET['centerColor'];
$endColor = '#' . $_GET['endColor'];

$startColorPressed = '#' . $_GET['startColorPressed'];
$centerColorPressed = '#' . $_GET['centerColorPressed'];
$endColorPressed = '#' . $_GET['endColorPressed'];

$bottomLeftRadius = $_GET['bottomLeftRadius'] . "dp";
$bottomRightRadius = $_GET['bottomRightRadius'] . "dp";
$topLeftRadius = $_GET['topLeftRadius'] . "dp";
$topRightRadius = $_GET['topRightRadius'] . "dp";


$xmlParent = '<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/selector_' . $name . '_button_pressed" android:state_enabled="true" android:state_pressed="true" />
    <item android:drawable="@drawable/selector_' . $name . '_button_pressed" android:state_activated="true" android:state_enabled="true" />
    <item android:drawable="@drawable/selector_' . $name . '_button_pressed" android:state_enabled="true" android:state_selected="true" />
    <item android:drawable="@drawable/selector_' . $name . '_button_normal" />
</selector>';

$xmlPressed = '';
$xmlNormal = '';

if ($buttonIsFlat == "true") {

    $xmlPressed = '<?xml version="1.0" encoding="utf-8"?>
        <shape xmlns:android="http://schemas.android.com/apk/res/android">
            <solid android:color="' . $colorPressed . '" />
            <corners
            android:bottomLeftRadius="' . $bottomLeftRadius . '"
            android:bottomRightRadius="' . $bottomRightRadius . '"
            android:topLeftRadius="' . $topLeftRadius . '"
            android:topRightRadius="' . $topRightRadius . '" />
        </shape>';

    $xmlNormal = '<?xml version="1.0" encoding="utf-8"?>
        <shape xmlns:android="http://schemas.android.com/apk/res/android">
            <solid android:color="' . $colorNormal . '" />
            <corners
            android:bottomLeftRadius="' . $bottomLeftRadius . '"
            android:bottomRightRadius="' . $bottomRightRadius . '"
            android:topLeftRadius="' . $topLeftRadius . '"
            android:topRightRadius="' . $topRightRadius . '" />
        </shape>';

} else {
    $xmlPressed = '<?xml version="1.0" encoding="utf-8"?>
        <shape xmlns:android="http://schemas.android.com/apk/res/android">
            <corners
            android:bottomLeftRadius="' . $bottomLeftRadius . '"
            android:bottomRightRadius="' . $bottomRightRadius . '"
            android:topLeftRadius="' . $topLeftRadius . '"
            android:topRightRadius="' . $topRightRadius . '" />
            <gradient
            android:angle="-90"
            android:centerColor="' . $centerColorPressed . '"
            android:endColor="' . $endColorPressed . '"
            android:startColor="' . $startColorPressed . '" />
        </shape>';

    $xmlNormal = '<?xml version="1.0" encoding="utf-8"?>
        <shape xmlns:android="http://schemas.android.com/apk/res/android">
            <corners
            android:bottomLeftRadius="' . $bottomLeftRadius . '"
            android:bottomRightRadius="' . $bottomRightRadius . '"
            android:topLeftRadius="' . $topLeftRadius . '"
            android:topRightRadius="' . $topRightRadius . '" />
            <gradient
            android:angle="-90"
            android:centerColor="' . $centerColor . '"
            android:endColor="' . $endColor . '"
            android:startColor="' . $startColor . '" />
        </shape>';
}


$characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
$string = '';
$max = strlen($characters) - 1;

for ($i = 0; $i < 15; $i++) {
    $string .= $characters[mt_rand(0, $max)];
}
$old = umask(0);
$tempFolder = '' . $name . '_' . $string;
mkdir($tempFolder, 0777);
umask($old);

$normalFile = '' . $tempFolder . '/selector_' . $name . '_button_normal.xml';
file_put_contents($normalFile, $xmlNormal);

$pressedFile = '' . $tempFolder . '/selector_' . $name . '_button_pressed.xml';
file_put_contents($pressedFile, $xmlPressed);

$parentFile = '' . $tempFolder . '/selector_' . $name . '_button.xml';
file_put_contents($parentFile, $xmlParent);

$zip_file = $name . '.zip';
$rootPath = realpath($tempFolder);
$zip = new ZipArchive();
$zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootPath),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $name => $file) {
    if (!$file->isDir()) {
        $filePath = $file->getRealPath();
        $relativePath = substr($filePath, strlen($rootPath) + 1);
        $zip->addFile($filePath, $relativePath);
    }
}
$zip->close();


header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $zip_file . '"');
header('Content-Length: ' . filesize($zip_file));
readfile($zip_file);


delete_dir($tempFolder);
@unlink($zip_file);

function delete_dir($src)
{
    $dir = opendir($src);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                delete_dir($src . '/' . $file);
            } else {
                unlink($src . '/' . $file);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}


?>