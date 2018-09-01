try
{

nerthus.npc = {}
nerthus.npc.dialog = function()
{
    var dialog = {}
    dialog.decorator = {}
    dialog.decorator.classes = {}
    dialog.decorator.classes.LINE = "icon LINE_OPTION"
    dialog.decorator.classes.EXIT = "icon LINE_EXIT"

    dialog.parse = {}
    dialog.parse.message = function(npc, index)
    {
        return npc.dialog[index][0]
    }.bind(dialog)
    dialog.parse.replies = function(npc, index)
    {
        var replies = []
        for(var i = 1; i < npc.dialog[index].length; i++)
            replies.push(this.parse.reply(npc.dialog[index][i], npc))
        return replies
    }.bind(dialog)
    dialog.parse.reply = function(row_reply, npc)
    {
        var reply = this.parse.row_reply(row_reply)
        if(reply.to == "END")
        {
            reply.click = this.close.bind(this)
            reply.icon = this.decorator.classes.EXIT
        }
        else if(reply.to)
        {
            reply.click = this.open.bind(this, npc, parseInt(reply.to))
            reply.icon = this.decorator.classes.LINE
        }
        return reply
    }.bind(dialog)
    dialog.parse.row_reply = function(reply)
    {
        var reply = reply.split('->')
        return {text : reply[0], to : reply[1]}

    }.bind(dialog)


    dialog.open = function(npc, index)
    {
        var message = this.parse.message(npc, index)
        var replies = this.parse.replies(npc, index)
        this.display(message, replies, npc)
    }
    dialog.display = function(message, replies, npc)
    {
        $("#dlgin .message").empty().append(this.compose.message(message, npc))
        var $replies = $("#dlgin .replies").empty()
        $replies.append.apply($replies, replies.map(this.compose.reply))
        $("#dialog").show()
    }
    dialog.close = function()
    {
        $("#dialog").hide()
    }

    dialog.compose = {}
    dialog.compose.icon = function(type)
    {
        return $("<div>").addClass(type)
    }
    dialog.compose.reply = function(reply)
    {
        return $("<li>").addClass(reply.icon)
                        .append(this.icon(reply.icon))
                        .append(reply.text)
                        .click(reply.click)
    }.bind(dialog.compose)
    dialog.compose.message = function(message, npc)
    {
        return "<h4><b>" + npc.name + "</b></h4>" + message
    }
    return dialog
}()

}catch(e) {log('nerthus npc: ' + e.message, 1);}
