import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { store } from "../store/store";
import {
  addComment,
  editComment,
  deleteComment,
  likeComment,
} from "../features/comments/commentsSlice";

const hubUrl = `${import.meta.env.VITE_API_URL}hubs/comments`;

export let connection: HubConnection | null = null;

export async function startConnection() {
  if (connection) {
    if (connection.state === HubConnectionState.Connected) {
      // Already connected, no need to start again
      return;
    }
    try {
      await connection.stop();
    } catch {}
  }

  connection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => localStorage.getItem("accessToken") || "",
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  connection.onclose(() => console.log("!!!!!!SignalR connection closed"));
  connection.onreconnecting(() => console.log("!!!!!SignalR reconnecting..."));
  connection.onreconnected(() => console.log("!!!!!SignalR reconnected"));

  connection.on("CommentAdded", (comment) => {
    console.log("!!!!!Received CommentAdded via SignalR:", comment);
    store.dispatch(addComment(comment));
  });

  connection.on("CommentEdited", (comment) => {
    store.dispatch(editComment(comment));
  });
  connection.on("CommentDeleted", (id) => {
    store.dispatch(deleteComment(id));
  });
  connection.on("CommentLiked", (like) => {
    store.dispatch(likeComment(like));
  });

  try {
    await connection.start();
    console.log("SignalR started");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
  }
}
