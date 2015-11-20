try
{

nerthus.night_lights.make_testable = function(light)
{
    light
    .css({pointerEvents : "auto",
          border : "1px solid yellow"})
    .dblclick(function(){light.remove();})
    .draggable();
}

nerthus.night_lights.add_testable = function(light)
{
    this.make_testable(this.add([light]));          
}

nerthus.night_lights.dump = function()
{
    str = []
    str.push("//"+map.name+" id: "+map.id)
    str.push("[")
    str.push(this.get_lights())
    str.push("]")
    log(str.join("\n"))
    message("dumping done");
}

nerthus.night_lights.get_lights = function()
{
    str = []
    $("#base .nightLight").each(function()
    {
            var pos = $(this).position()
            str.push("{'x' : '" + parseInt(pos.left) + "', 'y' : '" + parseInt(pos.top) + "', 'type' : '" + $(this).attr("type") + "'}")
    });
    return str.join(",\n")
}

nerthus.night_lights.give_me_the_light = function()
{
    $("#base .nightLight").css({pointerEvents : "auto"}).each(function(){nightLights.makeLightTestable($(this))});
    var dumpLight = $("<span>dump lights</span>").click(function(){nightLights.dumpLights()});
    var addBorder = $("<span>add border</span>").click(function(){$("#base .nightLight").css("border","1px solid yellow")});
    var delBorder = $("<span>del border</span>").click(function(){$("#base .nightLight").css("border","")});
    var togglemouseMove = $("<span>toggle move</span>").click(function(){hero.opt ^= 64; message("blocked: " + Boolean(hero.opt & 64))});
    $.getScript("http://addons2.margonem.pl/get/1/1689public.js",function()
    {
        for(i in nightLights.nightLightsTypes)
             aldiMenu.add($("<span>light "+i+"</span>").attr("type",i).click(function()
                 {
                     var light = {'type' : $(this).attr("type"), 'x' : hero.x*32, 'y' : hero.y*32}
                     nerthus.night_lights.add_testable(light)
                 }));                 
        aldiMenu.add(dumpLight);
        aldiMenu.add(addBorder);
        aldiMenu.add(delBorder);
        aldiMenu.add(togglemouseMove);
    });
}

nerthus.night_lights.give_me_the_light()

}catch
{
log('night lights mgr error: '+ err.message ,1)
}
