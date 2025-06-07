import type { FC } from 'react';
import Chat from "@/components/Chat/Chat.tsx";
import {useUserStore} from "@/store/userStore.ts";
import AdminChatWrapper from "@/components/Chat/AdminChatWrapper.tsx";

const ChatPage: FC = () => {
    const user = useUserStore((state) => state.user)

    return (
        <div className="">
            {
                user?.role === 'admin' ? (
                    <AdminChatWrapper />
                ) : <Chat/>
            }
        </div>
    );
};

export default ChatPage; 