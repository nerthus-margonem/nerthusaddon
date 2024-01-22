This directory contains the main configs of the addon.
This file will list what each file or directory represents and how to edit it.

# Directories

#### night-lights

Contains files used to determine where to place the night lights on the map.
Files are in the \[map id\].json format.

Each file contains an array of objects that have three properties:
 - `x`: number of pixels from the left border of the map to the left border of light
 - `y`: number of pixels from the top border of the map to the top border of light
 - `type`: type of light, currently it's size. It can be: `S`, `M`, `L`, or `XL`.
 
#### npcs

Contains files used to determine npc modifications on the map.
Files are in the \[map id\].json format.

Each file contains an array of objects that can be of three types:
 - adding new npc - object without property `type`
 - hiding existing npc - `type` set to `delete`
 - changing existing npc - `type` set to `change`

# Files

#### climates

Contains characteristics of climates on the world map.

It's structured as an object with properties:
 - `maps`: where for each climate name key there is an array with map ids on which this climate is present.
 - `characteristics`: containing three objects each having climate names with an array
  of \[spring, summer, autumn, winter\] season's changes to defaults. Changes between seasons are gradual.
   - `cloudines`: defaults are multiplied by season's value
   - `humidity`: defaults are multiplied by season's value
   - `temperature`: season's value is added to defaults
 - `seeds`: seeds for pseudo random calculations for a particular season.  

#### lvl-names

Contains an array of names that are given to players below their nick, in place of their lvl. 
To edit it, change one of the names of existing elements.

Adding more elements would give names to lvls after 300 (soft lvl cap).
Removing elements would make high lvls have the same name - last element.

#### map-exceptions

Contains ids of maps that are wrongly categorized by the game's code.

indoor contains map ids that will be parsed as indoor maps regardless of their config.
outdoor contains map ids that will be parsed as outdoor maps regardless of their config.

#### maps

Contains information of which custom map to use in place (or rather, on top of) normal one.

If there is a key in the current season equal to maps id, its value is the new map url used.
If not, `default` is checked in similar fashion.
 
#### panel-links

Contains information about links to resources found in an addon's panel.

#### permissions

Contains information about account ids of users with special roles on the server.

#### vips

Contains a list of character ids with special description under their game tip.
