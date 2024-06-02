export interface User {
    id: number;
    username: string;
    password: string;
    photo: string;
  };

export interface Group {
    id: number;
    groupName: string;
    participantsNumber: number;
    value: number;
    revelation: string;
    description: string;
  };