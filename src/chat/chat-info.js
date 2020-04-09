export function displayChatInfo(infoToSet)
{
    g.chat.txt[0] = '<div class="sys_red">' + infoToSet + '</div>' + g.chat.txt[0]
    if ($('#chb0').hasClass('choosen'))
        $('#chattxt').html(g.chat.txt[0])
    chatScroll(-1)
}
