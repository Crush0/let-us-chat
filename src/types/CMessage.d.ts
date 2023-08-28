// 消息类型
export interface Mtype {
    name: string;
    color?: string;
    icon?: string;
}

// 消息实体
export interface CMessage {
    sender: CUser;
    receiver?: CUser;
    time: Date;
    content?: string | Blob;
    mtype: Mtype
}

// 用户实体
export interface CUser {
    uuid?: string;
    name: string;
    avatar?: string;
    type: string
    messages?: CMessage[];
    online?: boolean;
    unread?: number
}

export type ICUser = Omit<CUser, 'messages'>;

export interface SMessage {
    type: string,
    data: any,
    extra?:any
}