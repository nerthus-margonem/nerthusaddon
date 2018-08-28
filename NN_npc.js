/* FORMAT DIALOGU
{
    name : "Roan",
    graf : "url.gif",
    x : 8,
    y : 6,
    dialog :
    {
        0 :
        [
            "Hej wam!",
            "co tam? ->1",
            "cześć ci ->END"
        ],
        1 :
        [
            "A jakoś leci",
            "a to ok ->END"
        ]
    }
}
*/
try
{

nerthus.npc = {}
nerthus.npc.dialog = function()
{
    var dialog = {}
    dialog.open = function(npc, index)
    {
        var message = this.message(npc, index)
        var replies = this.replies(npc, index)
        this.display(message, replies)
    }
    dialog.message = function(npc, index)
    {
        return "<h4>" + npc.name + "</h4>" + npc.dialog[index][0]
    }
    dialog.replies = function(npc, index)
    {
        var replies = ""
        for(var i = 1; i < npc.dialog[index].length; i++)
            replies += this.reply(npc.dialog[index][i])
        return replies
    }
    dialog.reply = function(reply)
    {
        return "<li>" + reply + "</li>"
    }
    dialog.display = function(message, replies)
    {
        $("#dialog message").html(message)
        $("#dialog replies").html(replies)
        $("#dialog").show()
    }
    dialog.hide = function()
    {
        $("#dialog").hide()
    }
    return dialog
}()

}catch(e) {log('nerthus npc: ' + e.message, 1);}
