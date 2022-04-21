import create from 'zustand'

const websocket_url = import.meta.env.VITE_WEBSOCKET_URL

export interface IStore {
  messages: string[]
  addMessage: (message: string) => void

  connect: boolean
  setConnect: (connect: boolean) => void

  lobby: string
  setLobby: (lobby: string) => void
}

const useStore = create<IStore>(set => ({
  messages: [],
  addMessage: (message: string) => set(state => ({
    messages: [...state.messages, message]
  })),

  connect: false,
  setConnect: (connect: boolean) => set(() => ({ connect: connect })),

  lobby: websocket_url,
  setLobby: (lobby: string) => set(() => ({ lobby: websocket_url + lobby })),
}))

export default useStore