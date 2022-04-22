defmodule CatChatBackend do
  use Application

  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: CatChatBackend.Router,
        options: [
          dispatch: dispatch(),
          port: (System.get_env("PORT") || "4000") |> String.to_integer()
        ]
      ),
      Registry.child_spec(
        keys: :duplicate,
        name: Registry.CatChatBackend
      )
    ]

    opts = [strategy: :one_for_one, name: CatChatBackend.Application]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/:lobby", CatChatBackend.SocketHandler, []}
       ]}
    ]
  end
end
