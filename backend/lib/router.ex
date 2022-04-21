defmodule CatChatBackend.Router do
  use Plug.Router

  plug(Plug.Static,
    at: "/",
    from: :cat_chat_backend
  )

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:dispatch)

  get "/" do
    send_resp(conn, 200, "200")
  end
end
