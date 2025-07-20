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

export const startConnection = async () => {
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

  connection.on("commentadded", (comment) => {
    store.dispatch(addComment(comment));
  });

  connection.on("commentedited", (comment) => {
    store.dispatch(editComment(comment));
  });
  connection.on("commentdeleted", (id) => {
    store.dispatch(deleteComment(id));
  });
  connection.on("commentliked", (like) => {
    store.dispatch(likeComment(like));
  });

  try {
    await connection.start();
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
  }
};
