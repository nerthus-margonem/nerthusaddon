let $widgetsContainer

export function addWidget(name, imageUrl, description) // TODO NI
{
    return $(
        '<div id="' + name + '-widget" class="nerthus__widget">' +
        '<div class="nerthus__widget-image" style="background-image: url(' + imageUrl + ')"></div>' +
        '<div class="nerthus__widget-desc">' + description + '</div>' +
        '</div>'
    ).appendTo($widgetsContainer)
}


export function initWidgets()
{
    let $parentElement
    if (INTERFACE === 'NI')
    {
        $parentElement = $('.layer.interface-layer')
    }
    else
    {
        $parentElement = $('#centerbox2')
    }
    $widgetsContainer = $('<div id="nerthus-widgets-container"></div>').appendTo($parentElement)
}
