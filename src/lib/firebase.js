// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9EWT9afELqwPCoTe39doIEtm5Rd6wyBk",
  authDomain: "izac-af500.firebaseapp.com",
  databaseURL: "https://izac-af500-default-rtdb.firebaseio.com",
  projectId: "izac-af500",
  storageBucket: "izac-af500.appspot.com",
  messagingSenderId: "915191750863",
  appId: "1:915191750863:web:b64d1318b30f9b128517ba",
  measurementId: "G-Z593ZVBX0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function setWeather(weather) {
  await setDoc(doc(db, "weather", weather.location), {
    temp: weather.temp,
    humidity: weather.humidity,
    location: weather.location,
  });
}
