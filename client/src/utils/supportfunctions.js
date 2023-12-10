import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 3, name: "Pop", value: "pop" },
  { id: 3, name: "Blues", value: "blues" },
  { id: 4, name: "Indie", value: "indie" },
  { id: 5, name: "Jazz", value: "jazz" },
];

export const filterByLanguage = [
  { id: 1, name: "English", value: "english" },
  { id: 2, name: "Tagalog", value: "tagalog" },
  { id: 3, name: "Japanese", value: "japanese" },
  { id: 3, name: "Korean", value: "korean" },
];


export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};