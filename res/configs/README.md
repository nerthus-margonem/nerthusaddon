This directory contains main configs of the addon. This file will list what each file or directory represents and how to edit it 

# Directories


# Files

#### lvl-names
------

This file contains array of names that are given to players below their nick, in place of their lvl. 
To edit it, change one of the names of existing elements.

Adding more elements would give names to lvls after 300 (soft lvl cap).
Removing elements would make high lvls have the same name - last element.

#### map-exceptions
------

This file contains ids of maps that are wrongly categorised by the game's code.

indoor contains map ids that will be parsed as indoor maps regardless of their config.
outdoor contains map ids that will be parsed as outdoor maps regardless of their config.

#### maps
------

This file contains information of which custom map to use in place (or rather, on top of) normal one.
Maps in 
 