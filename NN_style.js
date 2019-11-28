nerthus.style = {}

nerthus.style.start = function ()
{
    $('<link rel="stylesheet" href="' + nerthus.addon.fileUrl("css/style.css") + '">').appendTo('head')
}
nerthus.style.start_ni = nerthus.style.start
