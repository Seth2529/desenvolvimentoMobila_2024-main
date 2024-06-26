export interface NewUser {
  username: string;
  password: string;
  email:string;
  photo: string;
};


export interface User {
    userId: number;
    username: string;
    password: string;
    email:string;
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