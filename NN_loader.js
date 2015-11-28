

var PARSER = {}
PARSER.stringify = function(obj)
{
    return JSON.stringify(obj, this.stringifyFunction)
}

PARSER.stringifyFunction = function(key,val)
{
    if(typeof val === "function")
        return "("+ val.toString() +")"
    return val
}

PARSER.parse = function(obj)
{
    return JSON.parse(obj, this.parseFunction)
}

PARSER.parseFunction = function(key,val)
{
    if(typeof val === "string" && val.indexOf("function") === 1)
        return eval(val)
    return val
}

var LOADER = {}
LOADER.store = function(key,obj)
{
    localStorage[key] = PARSER.stringify(obj)
}

LOADER.load = function(key)
{
    return PARSER.parse(localStorage[key])
}

LOADER.run = function(obj)
{
    for(i in obj)
    {
        try
        {
            if(typeof obj[i] === 'object' && typeof obj[i].start === 'function')
                obj[i].start()
        }
        catch(e){console.log("error:" + i + " : " + e.message)}
    }
    return obj
}

