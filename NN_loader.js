

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

