try
{

nerthus.npc = {}
nerthus.npc.dialog = function()
{
    var UNPACK_QUERY = function(query)
    {
        return query[0].outerHTML
    }
    var dialog = {}
    dialog.decorator = {}
    dialog.decorator.classes = {}
    dialog.decorator.classes.LINE = "LINE_OPTION"
    dialog.decorator.classes.EXIT = "LINE_EXIT"
    dialog.decorator.classes.ICON = "icon"
    dialog.decorator.icon = function(type)
    {
        return $("<div>").addClass(type)
    }
    dialog.decorator.header = function(text)
    {
        return $("<h4>").html(text)[0].outerHTML
    }
    dialog.decorator.point = function(text)
    {
        return $("<li>").html(text)
    }
    dialog.open = function(npc, index)
    {
        var message = this.message(npc, index)
        var replies = this.replies(npc, index)
        this.display(message, replies)
    }
    dialog.message = function(npc, index)
    {
        return this.decorator.header(npc.name) + npc.dialog[index][0]
    }
    dialog.replies = function(npc, index)
    {
        var replies = []
        for(var i = 1; i < npc.dialog[index].length; i++)
            replies.push(UNPACK_QUERY(this.reply(npc.dialog[index][i])))
        return replies
    }
    dialog.reply = function(reply)
    {
        var parsed = this.parse_reply(reply)
        var $replay = this.decorator.point(parsed[0])
        if(parsed.length === 2)
        {
            $replay.addClass(this.decorator.classes.ICON)
            if(parsed[1] == "END")
                $replay.addClass(this.decorator.classes.EXIT)
            else
                $replay.addClass(this.decorator.classes.LINE)
        }
        return $replay
    }
    dialog.parse_reply = function(replay)
    {
        return replay.split('->')
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
