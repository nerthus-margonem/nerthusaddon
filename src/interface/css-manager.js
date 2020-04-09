export function addBasicStyles()
{
    console.log('styles added!')
    $('<link rel="stylesheet" href="' + FILE_PREFIX + 'css/style.css' + '">').appendTo('head')
}
