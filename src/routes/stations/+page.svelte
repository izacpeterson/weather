<script>
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  import { db } from "../../lib/firebase";

  const q = query(collection(db, "weather"));
  let stations = [];

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    stations = data;
    console.log(data);
  });
</script>

<h2>Weather Stations</h2>
<!-- <pre>
    {JSON.stringify(stations, null, 2)}
</pre> -->

<div class="flex justify-evenly">
  {#each stations as station}
    <div class="flex flex-col items-center">
      <h3 class="text-3xl">{station.location}</h3>
      <span>Temperature: {station.temp}&deg;</span>
      <span>Humidity: {station.humidity}%</span>
    </div>
  {/each}
</div>

<p class="text-xs fixed bottom-0">
  API URL: http://127.0.0.1:5173/api/set?temp=?&humidity=?&location=?
</p>
