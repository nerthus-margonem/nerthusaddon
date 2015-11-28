

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
    var obj = PARSER.parse(localStorage[key])
    this.run(obj)
    return obj
}

LOADER.run = function(obj)
{
    for(i in obj)
    {
        if(typeof obj[i] === 'object' && typeof obj[i].start === 'function')
            obj[i].start()
    }
    return obj
}

