import useStore, { IStore } from "@/lib/store";
import { useEffect, useRef, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import shallow from "zustand/shallow";

function App() {
  const chatRef = useRef<HTMLTextAreaElement>(null);
  const lobbyRef = useRef<HTMLInputElement>(null);

  const { messages, addMessage, connect, setConnect, lobby, setLobby } =
    useStore(
      (state: IStore) => ({
        messages: state.messages,
        addMessage: state.addMessage,
        connect: state.connect,
        setConnect: state.setConnect,
        lobby: state.lobby,
        setLobby: state.setLobby,
      }),
      shallow
    );

  const { sendMessage, lastMessage, readyState } = useWebSocket(lobby, {
    shouldReconnect: () => {
      if (connect === true) return true;
      else return false;
    },
  });

  useEffect(() => {
    if (lastMessage !== null) addMessage(lastMessage.data);
  }, [lastMessage, addMessage]);

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const value: string = e.currentTarget.value;
        if (value) {
          sendMessage(
            JSON.stringify({
              data: {
                message: value,
              },
            })
          );
          e.currentTarget.value = "";
        }
      }
    },
    [sendMessage]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Online",
    [ReadyState.CLOSING]: "Disconnecting",
    [ReadyState.CLOSED]: "Offline",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="flex flex-col justify-around">
      <h1 className="text-4xl text-slate-400 text-center mb-2">cat-chat</h1>
      <div className="flex flex-row justify-around">
        <h2>Status: {connectionStatus}</h2>
        <div className="flex flex-row m-0.5 space-x-1">
          <input
            ref={lobbyRef}
            placeholder="Enter a lobby..."
            className="px-1 py-0.5 rounded-lg bg-slate-200"
          />
          <button
            className="rounded-lg px-1 py-0.5 bg-blue-400 text-white"
            onClick={() => {
              setConnect(true);
              setLobby(lobbyRef.current!.value);
            }}
          >
            Connect
          </button>
        </div>
      </div>
      <hr />
      <div className="mx-20">
        {messages.map((message: string, index: number) => (
          <div key={index} className="mb-2">
            <span className="text-slate-500">{message}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center">
        <textarea
          placeholder="Enter message here"
          className="bg-slate-200 rounded-lg w-4/6 p-2"
          ref={chatRef}
          onKeyDown={onEnter}
        />
      </div>
    </div>
  );
}

export default App;
