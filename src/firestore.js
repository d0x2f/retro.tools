import { getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import * as jose from "jose";
import { get } from "svelte/store";

import { createAuthToken } from "./api.js";
import { firebaseToken, uid } from "./store.js";

function tokenIsValid(token) {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jose.decodeJwt(token);
    if (!decodedToken.exp) {
      return false;
    }

    const expiry = new Date(decodedToken.exp * 1000).getTime();
    const now = new Date().getTime();

    // 10 minute buffer
    if (expiry - now < 600_000) {
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function verifyToken() {
  if (tokenIsValid(get(firebaseToken))) {
    return;
  }

  const token = await createAuthToken();
  const decodedToken = jose.decodeJwt(token);
  firebaseToken.set(token);
  if (typeof decodedToken.uid !== "string") {
    console.error(
      "Received unexpected uid in firebase JWT token",
      decodedToken
    );
    throw new Error("Connection error"); // Displayed to the user
  }
  uid.set(decodedToken.uid);
}

export async function signIn() {
  const auth = getAuth();

  await verifyToken();

  if (auth.currentUser) {
    return;
  }

  await signInWithCustomToken(auth, get(firebaseToken));
}

function normaliseBoard(document) {
  const data = document.data();
  return {
    ...data,
    data: JSON.parse(data.data),
    id: document.id,
    owner: data.owner.id === get(uid),
  };
}

function normaliseRank(document) {
  const data = document.data();
  return {
    ...data,
    data: JSON.parse(data.data),
    id: document.id,
  };
}

function normaliseCard(document) {
  const data = document.data();
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
    created_at: new Date(
      data?.created_at?.seconds ?? // Added 16 Mar 2023
        document._document.createTime.timestamp.seconds * 1000 // Bit of a hack
    ),
  };
}

// returns a function to unsubscribe from updates
export async function subscribeToCards(
  boardId,
  newCallback,
  updateCallback,
  deleteCallback
) {
  await signIn();

  const firestore = getFirestore(getApp());
  const boardRef = doc(firestore, "boards", boardId);
  const cardsCollection = collection(boardRef, "cards");
  return onSnapshot(cardsCollection, (snapshot) =>
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newCallback(normaliseCard(change.doc));
      }
      if (change.type === "modified") {
        updateCallback(normaliseCard(change.doc));
      }
      if (change.type === "removed") {
        deleteCallback(change.doc.id);
      }
    })
  );
}

export async function subscribeToBoard(
  boardId,
  updateCallback,
  deleteCallback
) {
  await signIn();

  const firestore = getFirestore(getApp());
  const boardRef = query(
    collection(firestore, "boards"),
    where("__name__", "in", [boardId])
  );
  return onSnapshot(boardRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const board = change.doc;
      if (change.type === "modified") {
        updateCallback(normaliseBoard(board));
      }
      if (change.type === "removed") {
        deleteCallback();
      }
    });
  });
}

export async function subscribeToRanks(
  boardId,
  newCallback,
  updateCallback,
  deleteCallback
) {
  await signIn();

  const firestore = getFirestore(getApp());
  const boardRef = doc(firestore, "boards", boardId);
  const columnsCollection = collection(boardRef, "columns");
  return onSnapshot(columnsCollection, (snapshot) =>
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newCallback(normaliseRank(change.doc));
      }
      if (change.type === "modified") {
        updateCallback(normaliseRank(change.doc));
      }
      if (change.type === "removed") {
        deleteCallback(change.doc.id);
      }
    })
  );
}
