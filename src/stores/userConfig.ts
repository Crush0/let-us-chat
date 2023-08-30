import { defineStore } from "pinia";
import type { CMessage, CUser } from "@/types/CMessage";
export const useUserStore = defineStore("userStore", {
    state: () => {
        const myUser: CUser = {
            uuid: "",
            name: "",
            type: 'user'
        };
        const userList: CUser[] = [{
            uuid: '-1',
            name: '大家的聊天室',
            messages: [] as CMessage[],
            type: 'group'
        } as CUser];
        return {
            myUser,
            userList,
        };
    },
    getters: {
        getMyUser: (state) => state.myUser,
        getAllUser: (state):CUser[] => state.userList,
        getUserMsg: (state) => {
            return (user: CUser) => state.userList.find((u) => u.uuid === user.uuid)?.messages || []
        },
        getUserByUUID: (state) => (uuid: string) => state.userList.find((u) => u.uuid === uuid),
    },
    actions: {
        setMyUser(user: CUser) {
            this.myUser = user;
        },
        updateMyUser(user: CUser){
            this.myUser = {
                ...this.myUser,
                ...user
            }
        },
        updateUser(user:CUser) {
            const index = this.userList.findIndex((u) => u.uuid === user.uuid);
            if(index !== -1){
                const findUser = this.userList[index]
                this.userList[index] = {
                    ...findUser,
                    ...user
                };
            }
        },
        userOffline(offlineUser:CUser){
            // 用户下线
            const index = this.userList.findIndex((u) => u.uuid === offlineUser.uuid);
            if(index !== -1){
                const user = this.userList[index]
                if(user.online){
                    user.online = false;
                }
                this.addMessage({
                    mtype: { name: 'info' },
                    content: '对方已下线',
                    receiver: this.getMyUser,
                    sender: offlineUser,
                    time: new Date()
                } as CMessage)
            }
        },
        addUser(newUser: CUser | CUser[]){
            if(newUser instanceof Array){
                // 批量添加
                newUser.forEach((user) => {                    
                    // 如果已经存在 直接返回
                    if(this.userList.some((u) => u.uuid === user.uuid)) return;
                    if(this.myUser.uuid === user.uuid) return;
                    this.userList.unshift({
                        ...user,
                        online: true,
                        messages: []
                    });
                })
            } else {
                // 单个添加
                if(this.myUser.uuid === newUser.uuid) return;
                if(this.userList.some((u) => u.uuid === newUser.uuid)) return;
                this.userList.unshift({
                    ...newUser,
                    online: true,
                    messages: []
                });
            }
        },
        removeUser(delUser: CUser | CUser[]){
            if(delUser instanceof Array){
                // 批量删除
                delUser.forEach((user_) => {
                    const index = this.userList.findIndex((user) => user_.uuid === user.uuid);
                    if(index === -1) return;
                    this.userList.splice(index, 1);
                })
            } else {
                // 单个删除
                const index = this.userList.findIndex((user) => user.uuid === delUser.uuid);
                if(index === -1) return;
                this.userList.splice(index, 1);
            }
        },
        addMessage(message: CMessage) {
            const { sender, receiver } = message;
            if(receiver?.type === 'group'){
                const group = this.userList.find((user) => user.uuid === receiver.uuid)
                group?.messages?.push(message);
            } else {
                if(sender.uuid === this.myUser.uuid){
                    const index = this.userList.findIndex((user) => user.uuid === receiver?.uuid)
                    const user = this.userList[index];
                    user?.messages?.push(message);
                    
                } else {
                    const index = this.userList.findIndex((user) => user.uuid === sender?.uuid)
                    const user = this.userList[index];
                    user?.messages?.push(message);
                }
                
            }
        },
    },
});
