export type Lobby = {
  id?: string;
  name: string;
  level: number;
  mapId: string;
  player1?: string;
  player2?: string;
};

export type Map = {
  id?: string;
  name: string;
  map: string;
};

export type Client = {
  id?: string;
  name?: string;
  lobbyId?: string;
  created?: string;
};

export type GameObject = {
  name?: string;
  lobbyId?: string;
  x?: number;
  y?: number;
  parameters?: string; // used as additional info in extra data slots after name, x and y data. If multiple values are required - separate them with splaces
  //example of using multiple parameters =>  set parameters to "value1 value2 value3". To get values use data[3] data[4] data[5] accordingly.
};
