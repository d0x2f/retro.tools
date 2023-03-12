import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import * as jose from "jose";
import { get } from "svelte/store";

import { createAuthToken } from "./api.js";
import { firebaseToken, uid } from "./store.js";

const firebaseApp = initializeApp({
  // TODO: build args?
  projectId: "retrotools-dev",
  databaseURL: "https://retrotools-dev.europe-west2.firebasedatabase.app",
  apiKey: "AIzaSyADqwz3fHaFwayCBzu93M50d0-ABVxF0i0", // Safe to distribute
});
const firestore = getFirestore(firebaseApp);

export async function signIn() {
  const auth = getAuth();

  // If we're already signed in, the firebase sdk should handle refreshing it's
  // own internal token, it doesn't need a new custom token from us.
  if (auth.currentUser) {
    return;
  }

  const token = await createAuthToken();
  const decodedToken = jose.decodeJwt(token);
  firebaseToken.set(token);
  if (typeof decodedToken.uid !== "string") {
    throw new Error("Connection error");
  }
  uid.set(decodedToken.uid);
  await signInWithCustomToken(auth, token);
}

function normaliseCard(document) {
  const data = document.data();
  console.log("raw", data);
  let reacted = "";
  const reactions = Object.fromEntries(
    Object.entries(data?.reactions ?? {}).map(([reaction, reactors]) => {
      if (reactors.find((r) => r.id === get(uid))) {
        reacted = reaction;
      }
      return [reaction, reactors.length];
    })
  );
  return {
    ...data,
    id: document.id,
    votes: data?.votes?.length ?? 0,
    column: data.column.id,
    owner: data.owner.id === get(uid),
    voted:
      (data?.votes ?? []).find((voteDoc) => voteDoc.id === get(uid)) !==
      undefined,
    reactions,
    reacted,
  };
}

// returns a function to unsubscribe from updates
export async function subscribeToCards(
  boardId,
  newOrUpdateCallback,
  deleteCallback
) {
  await signIn();

  const boardRef = doc(firestore, "boards", boardId);
  const cardsCollection = collection(boardRef, "cards");
  return onSnapshot(cardsCollection, (snapshot) =>
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added" || change.type === "modified") {
        newOrUpdateCallback(normaliseCard(change.doc));
      }
      if (change.type === "removed") {
        deleteCallback(change.doc.id);
      }
    })
  );
}

// TODO: Subscribe to board
// export async function subscribeToBoard(
//   boardId,
//   updateCallback,
//   deleteCallback // cleanly navigate to the splash page
// ) {}

// TODO: Subscribe to columns
// export async function subscribeToColumns(
//   boardId,
//   newOrUpdateCallback,
//   deleteCallback
// ) {}

// // TODO: Connection monitoring
// const connectedRef = ref(db, ".info/connected");
// onValue(connectedRef, (snap) => {
//   if (snap.val() === true) {
//     console.log("connected");
//   } else {
//     console.log("not connected");
//   }
// });
