try
{

nerthus.night.lights.make_testable = function(light)
{
    light
    .css({pointerEvents : "auto",
          border : "1px solid yellow"})
    .dblclick(function(){light.remove();})
    .draggable()
}

nerthus.night.lights.add_testable = function(light)
{
    this.make_testable(this.display(light))
}

nerthus.night.lights.dump = function()
{
    log("//"+map.name+" : map_"+map.id+".json")
    log("[")
    this.log_lights()
    log("]")
    message("dumping done")
}

nerthus.night.lights.log_lights = function()
{
    var lights = []
    $("#base .nightLight").each(function()
    {
            var pos = $(this).position()
            var x = parseInt(pos.left)
            var y = parseInt(pos.top)
            var type = $(this).attr("type")
            lights.push('{"x" : "' +x+ '", "y" : "' +y+ '", "type" : "' +type+ '"}')
    });
    log(lights.join(",<br>"))
}

nerthus.night.lights.give_me_the_light = function()
{
    $("#base .nightLight").css({pointerEvents : "auto"}).each(function(){nerthus.night.lights.make_testable($(this))})
    var dumpLight = $("<span>dump lights</span>").click(function(){nerthus.night.lights.dump()})
    var addBorder = $("<span>add border</span>").click(function(){$("#base .nightLight").css("border","1px solid yellow")})
    var delBorder = $("<span>del border</span>").click(function(){$("#base .nightLight").css("border","")})
    var togglemouseMove = $("<span>toggle move</span>").click(function(){hero.opt ^= 64; message("blocked: " + Boolean(hero.opt & 64))})
    $.getScript("http://addons2.margonem.pl/get/1/1689public.js",function()
    {
        for(i in nerthus.night.lights.types)
            if(typeof nerthus.night.lights.types[i] === 'object')
                aldiMenu.add($("<span>light "+i+"</span>").attr("type",i).click(function()
                {
                    var light = {'type' : $(this).attr("type"), 'x' : hero.x*32, 'y' : hero.y*32}
                    nerthus.night.lights.add_testable(light)
                }))
        aldiMenu.add(dumpLight)
        aldiMenu.add(addBorder)
        aldiMenu.add(delBorder)
        aldiMenu.add(togglemouseMove)
    });
}

nerthus.defer(nerthus.night.lights.give_me_the_light)

}catch(err)
{
log('night lights mgr error: '+ err.message ,1)
}
