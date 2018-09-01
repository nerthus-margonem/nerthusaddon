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

nerthus.npc.deploy = function(npc)
{
    var tip = npc.tip ? npc.tip : "<b>" + npc.name + "</b>"
    var click = this.dialog.open.bind(this.dialog, npc, 0)
    var $npc = $("<img>")
    .attr("tip", tip)
    .attr("ctip", "t_npc")
    .attr("src", npc.url)
    .css("position", "absolute")
    .css("z-index", npc.y * 2 + 9)
    .addClass("nerthus_npc")
    .click(click)
    .appendTo('#base')
    .load(function()
    {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
        var x = 32 * npc.x + 16 - Math.floor($(this).width() / 2)
        var y = 32 * npc.y + 32 - $(this).height()
        $(this).css({top:"" + y + "px", left: "" + x + "px"})
    })
}

nerthus.npc.load_npcs = function()
{
    $.getJSON(nerthus.addon.fileUrl("/npcs/map_" + map.id + ".json"),
              function(npcs){npcs.forEach(nerthus.npc.deploy.bind(nerthus.npc))})
}

nerthus.npc.start = function()
{
    nerthus.defer(this.load_npcs.bind(this))
}

nerthus.npc.start()

}catch(e) {log('nerthus npc: ' + e.message, 1);}
