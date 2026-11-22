import { AddNpcData } from "./add-npc-data.js";
import { ChangeNpcData } from "./change-npc-data.js";
import { DeleteNpcData } from "./delete-npc-data.js";

export type NpcConfig = AddNpcData | DeleteNpcData | ChangeNpcData;
