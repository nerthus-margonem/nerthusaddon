export interface AddNpcData {
  type?: undefined;
  name: string;
  tip?: string;
  dialog?: unknown;
  x: number;
  y: number;
  url: string;
  collision?: boolean;
  npcType?: NpcType;
}
