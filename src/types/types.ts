export interface User {
    userId: number;
    username: string;
    password: string;
    email:string;
    photo: string;
  };

export interface Group {
    groupID: number;
    groupName: string;
    participantCount?: string;
    value: number;
    dateDiscover: string;
    description: string;
    photo: string;
  };
  export interface Invite {
    inviteId: number;
    email: string;
    status: string;
    invitationDate: string;
    responseDate: string;
    groupId: number;
    userID: number;
    group: Group | null; 
    user: User | null;
  };