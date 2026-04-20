// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { createSocketConnection } from "../utils/socket";
// import { useSelector } from "react-redux";

// const Chat = () => {
//   const { targetUserId } = useParams();
//   const [messages, setMessages] = useState([{ text: "Hello" }]);
//   const [newMessage, setNewMessage] = useState("");
//   const user = useSelector(store=> store.user);
//   const userId = user?._id;
//   const senderName = user?.name;
//   const socket = createSocketConnection();



//   useEffect(()=>{
//     if(!userId){
//       return;
//     }
//     const socket = createSocketConnection();

//     //As soon as the page loaded, the socket connection is made and joinChat event is emiited.
//     socket.emit("joinChat",{senderName,userId,targetUserId});
//     //return is called whenever my component unloads

//     socket.on("messageReceived",({senderName,text})=>{
//       console.log(senderName+" : "+text);
//     });


//     return () =>{
//       socket.disconnect();
//     }
//   },[userId,targetUserId]);

//   // socket.on("messageReceived",({senderName,text})=>{
//   //   console.log(senderName +" : "+ text );
//   //   })
  
//   //send message handler function

//   const sendMessage = () =>{
//     const socket = createSocketConnection();
//     socket.emit("sendMessage",{
//       senderName,
//       userId,
//       targetUserId,
//       text:newMessage,
//     })
//     console.log(senderName+" : "+text);
//   }



//   return (
//     <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
//       <h1 className="p-5 border-b border-gray-600">Chat</h1>
//       <div className="flex-1 overflow-scroll p-5">
//         {/* display messages */}
//         {messages.map((msg, index) => {
//           return (
//             <div key={index}>
//               <div className="chat chat-start">
//                 <div className="chat-image avatar">
//                   <div className="w-10 rounded-full">
//                     <img
//                       alt="Tailwind CSS chat bubble component"
//                       src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
//                     />
//                   </div>
//                 </div>
//                 <div className="chat-header">
//                   Obi-Wan Kenobi
//                   <time className="text-xs opacity-50">12:45</time>
//                 </div>
//                 <div className="chat-bubble">You were the Chosen One!</div>
//                 <div className="chat-footer opacity-50">Delivered</div>
//               </div>
//               <div className="chat chat-end">
//                 <div className="chat-image avatar">
//                   <div className="w-10 rounded-full">
//                     <img
//                       alt="Tailwind CSS chat bubble component"
//                       src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
//                     />
//                   </div>
//                 </div>
//                 <div className="chat-header">
//                   Anakin
//                   <time className="text-xs opacity-50">12:46</time>
//                 </div>
//                 <div className="chat-bubble">I hate you!</div>
//                 <div className="chat-footer opacity-50">Seen at 12:46</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div className="p-5 border-t border-gray-600 flex items-center gap-2">
//         <input value = {newMessage} onChange={(e)=> setNewMessage(e.target.value)} className="flex-1 border border-gray-500 text-white-rounded p-2"></input>
//         <button onClick={sendMessage} className="btn btn-secondary">Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;



import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const senderName = user?.name;
  const photoUrl = user?.photoUrl;

  const socket = createSocketConnection();
  const bottomRef = useRef(null);

  // format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinChat", { senderName, userId, targetUserId });

    socket.off("messageReceived");
    socket.off("messagesSeen");

    // ✅ RECEIVE MESSAGE
    socket.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });

      // ✅ If I am receiver → mark seen instantly
      if (msg.userId !== userId) {
        socket.emit("markSeen", {
          userId,
          targetUserId,
          messageId: msg.id,
        });
      }
    });

    // ✅ SEEN UPDATE
    socket.on("messagesSeen", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "seen" }
            : msg
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      senderName,
      userId,
      targetUserId,
      text: newMessage,
      createdAt: new Date(),
      status: "sent",
      photoUrl,
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-700 m-5 h-[75vh] flex flex-col bg-[#0f172a] text-white">
      <h1 className="p-4 border-b border-gray-700 font-semibold">Chat</h1>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.userId === userId;

          return (
            <div key={msg.id}>
              {/* Header */}
              <div className={`text-xs text-gray-400 mb-1 ${isMe ? "text-right" : "text-left"}`}>
                <span className="font-semibold">{msg.senderName}</span>{" "}
                {formatTime(msg.createdAt)}
              </div>

              {/* Message */}
              <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                
                {!isMe && (
                  <img
                    src={msg.photoUrl || "https://i.pravatar.cc/40?img=3"}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                )}

                <div className="bg-gray-700 px-4 py-2 rounded-xl max-w-xs">
                  {msg.text}
                </div>

                {isMe && (
                  <img
                    src={msg.photoUrl || "https://i.pravatar.cc/40?img=5"}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                )}
              </div>

              {/* Status */}
              <div className={`text-xs mt-1 ${isMe ? "text-right text-gray-400" : ""}`}>
                {isMe && msg.status === "seen" && "Seen"}
                {isMe && msg.status === "delivered" && "Delivered"}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        />
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
