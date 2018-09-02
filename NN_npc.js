try
{

nerthus.npc = {}
nerthus.npc.dialog = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"
nerthus.npc.dialog.parse_message = function(npc, index)
{
    return this.parse_placeholders(npc.dialog[index][0])
}
nerthus.npc.dialog.parse_replies = function(npc, index)
{
    var replies = []
    for(var i = 1; i < npc.dialog[index].length; i++)
        replies.push(this.parse_reply(npc.dialog[index][i], npc))
    return replies
}
nerthus.npc.dialog.parse_reply = function(row_reply, npc)
{
    var reply = this.parse_row_reply(row_reply)
    reply.text = this.parse_placeholders(reply.text)
    if(reply.to == "END")
    {
        reply.click = this.close.bind(this)
        reply.icon = this.decorator.classes.EXIT
    }
    else if(reply.to)
    {
        reply.click = this.open.bind(this, npc, reply.to)
        reply.icon = this.decorator.classes.LINE
    }
    return reply
}
nerthus.npc.dialog.parse_row_reply = function(reply)
{
    var reply = reply.split('->')
    return {text : reply[0], to : reply[1]}

}
nerthus.npc.dialog.parse_placeholders = function(text)
{
    return text.replace("#NAME", hero.nick)
}

nerthus.npc.dialog.open = function(npc, index)
{
    var message = this.parse_message(npc, index)
    var replies = this.parse_replies(npc, index)
    this.display(message, replies, npc)
    g.lock.add("nerthus_dialog")
}
nerthus.npc.dialog.display = function(message, replies, npc)
{
    $("#dlgin .message").empty().append(this.compose.message(message, npc))
    var $replies = $("#dlgin .replies").empty()
    $replies.append.apply($replies, replies.map(this.compose.reply.bind(this.compose)))
    $("#dialog").show()
}
nerthus.npc.dialog.close = function()
{
    $("#dialog").hide()
    g.lock.remove("nerthus_dialog")
}

nerthus.npc.dialog.compose = {}
nerthus.npc.dialog.compose.icon = function(type)
{
    return $("<div>").addClass(type)
}
nerthus.npc.dialog.compose.reply = function(reply)
{
    var icon = this.icon(reply.icon)
    return $("<li>").addClass(reply.icon)
                    .append(icon)
                    .append(reply.text)
                    .click(reply.click)
}
nerthus.npc.dialog.compose.message = function(message, npc)
{
    return "<h4><b>" + npc.name + "</b></h4>" + message
}

nerthus.npc.compose = function(npc)
{
    var tip = npc.tip ? npc.tip : "<b>" + npc.name + "</b>"
    var click = npc.dialog ? this.dialog.open.bind(this.dialog, npc, 0) : null
    var $npc = $("<img>")
    .attr("tip", tip)
    .attr("ctip", "t_npc")
    .attr("src", npc.url)
    .css("position", "absolute")
    .css("z-index", npc.y * 2 + 9)
    .addClass("nerthus_npc")
    .click(this.click_wrapper(npc, click))
    .appendTo('#base')
    .load(function()
    {  //wyśrodkowanie w osi x i wyrównanie do stóp w osi y
        var x = 32 * parseInt(npc.x) + 16 - Math.floor($(this).width() / 2)
        var y = 32 * parseInt(npc.y) + 32 - $(this).height()
        $(this).css({top:"" + y + "px", left: "" + x + "px"})
    })
    return $npc
}

nerthus.npc.click_wrapper = function(npc, click_handler)
{
    if(!click_handler)
        return
    return function(event)
    {
        if (Math.abs(npc.x - hero.x) > 1 || Math.abs(npc.y - hero.y) > 1)
            hero.mClick(event);
        else
            click_handler()
    }
}

nerthus.npc.deploy = function(npc)
{
    this.compose(npc)
    this.set_collision(npc)
}

nerthus.npc.set_collision = function(npc)
{
    if(npc.collision)
        g.npccol[parseInt(npc.x) + 256 * parseInt(npc.y)] = true
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
