import { useEffect, useRef, useState, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

function App() {

  const chatRef = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<string[]>([])
  const [reconnect, setReconnect] = useState<boolean>(false)

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket('ws://localhost:4000/ws/chat', {
    shouldReconnect: () => {
      if (reconnect === true)
        return true
      else
        return false
    },
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages(prevMessages => [...prevMessages, lastMessage.data]);
    }
  }, [lastMessage, setMessages]);

  const onEnter = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const value: string = e.currentTarget.value
      if (value) {
        sendMessage(JSON.stringify(
          {
            data: {
              message: value
            }
          }
        ))
        e.currentTarget.value = ''
      }
    }
  }, [sendMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="flex flex-col justify-around">
      <h1 className="text-4xl text-slate-400 text-center mb-2">cat-chat</h1>
      <div className="flex flex-row justify-around">
        <h2>Status: {connectionStatus}</h2>
        <button onClick={() => setReconnect(true)}>Reconnect</button>
      </div>
      <hr />
      <div className="mx-20">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="text-slate-400">{message}</span>
          </div> 
        ))}
      </div>
      <div className="flex flex-row justify-center">
        <textarea placeholder="Enter message here" className="bg-slate-200 rounded-lg w-4/6 p-2" ref={chatRef} onKeyDown={onEnter} />
      </div>
    </div>
  )
}

export default App
