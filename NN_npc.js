try
{

nerthus.npc = {}
nerthus.npc.dialog = {}
nerthus.npc.dialog.decorator = {}
nerthus.npc.dialog.decorator.classes = {}
nerthus.npc.dialog.decorator.classes.LINE = "icon LINE_OPTION"
nerthus.npc.dialog.decorator.classes.EXIT = "icon LINE_EXIT"

nerthus.npc.dialog.parse = {}
nerthus.npc.dialog.parse.message = function(npc, index)
{
    return npc.dialog[index][0]
}
nerthus.npc.dialog.parse.replies = function(npc, index)
{
    var replies = []
    for(var i = 1; i < npc.dialog[index].length; i++)
        replies.push(nerthus.npc.dialog.parse.reply(npc.dialog[index][i], npc))
    return replies
}
nerthus.npc.dialog.parse.reply = function(row_reply, npc)
{
    var reply = nerthus.npc.dialog.parse.row_reply(row_reply)
    if(reply.to == "END")
    {
        reply.click = nerthus.npc.dialog.close.bind(nerthus.npc.dialog)
        reply.icon = nerthus.npc.dialog.decorator.classes.EXIT
    }
    else if(reply.to)
    {
        reply.click = nerthus.npc.dialog.open.bind(nerthus.npc.dialog, npc, parseInt(reply.to))
        reply.icon = nerthus.npc.dialog.decorator.classes.LINE
    }
    return reply
}
nerthus.npc.dialog.parse.row_reply = function(reply)
{
    var reply = reply.split('->')
    return {text : reply[0], to : reply[1]}

}

nerthus.npc.dialog.open = function(npc, index)
{
    var message = nerthus.npc.dialog.parse.message(npc, index)
    var replies = nerthus.npc.dialog.parse.replies(npc, index)
    this.display(message, replies, npc)
}
nerthus.npc.dialog.display = function(message, replies, npc)
{
    $("#dlgin .message").empty().append(nerthus.npc.dialog.compose.message(message, npc))
    var $replies = $("#dlgin .replies").empty()
    $replies.append.apply($replies, replies.map(nerthus.npc.dialog.compose.reply))
    $("#dialog").show()
}
nerthus.npc.dialog.close = function()
{
    $("#dialog").hide()
}

nerthus.npc.dialog.compose = {}
nerthus.npc.dialog.compose.icon = function(type)
{
    return $("<div>").addClass(type)
}
nerthus.npc.dialog.compose.reply = function(reply)
{
    var icon = nerthus.npc.dialog.compose.icon(reply.icon)
    return $("<li>").addClass(reply.icon)
                    .append(icon)
                    .append(reply.text)
                    .click(reply.click)
}
nerthus.npc.dialog.compose.message = function(message, npc)
{
    return "<h4><b>" + npc.name + "</b></h4>" + message
}

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
