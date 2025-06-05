import { useState, useEffect } from "react";

function BusService({ busArrivalData }) {
  return (
    <ul>
      {busArrivalData.services.map((service) => {
        const busNumber = service.bus_no;
        const arrival = service.next_bus_mins;
        const result = arrival <= 0 ? `Arrived` : `${arrival} minutes`;

        return (
          <li key={busNumber}>Bus {busNumber}: {result}</li>
        )
      }
      )}
    </ul>
  )
}

// fetching data from API
async function fetchBusArrival(id) {
  const response = await fetch(`https://sg-bus-arrivals.vercel.app/?id=${id}`);
  const data = await response.json();
  return data;
}

export default function App() {
  const [busStopId, setBusStopId] = useState("");
  const [busArrivalData, setBusArrivalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const busStopOptions = [
    { id: "83139" },
    { id: "18141" },
    { id: "75009" },
  ];
  // list of available bus stop ID (dropdown options)

  //useEffect hook will only trigger if there's changes only on the stated value, for this case is [busStopId]
  useEffect(() => {
    console.log('Rendered')
    if (busStopId) {
      setLoading(true);
      fetchBusArrival(busStopId)
        .then(data => setBusArrivalData(data))
        .catch(error => console.error(error)) // to catch error 
        .finally(() => setLoading(false));
    }
  }, [busStopId]);

  // hanlder for dropdown change
  function handleSelectChange(event) {
    setBusStopId(event.target.value);
  }

  return (
    <div>
      <h1>Bus Arrival App</h1>
      <label htmlFor="busStopSelect">Select Bus Stop ID: </label>
      <select id="busStopSelect" value={busStopId} onChange={handleSelectChange}>
        <option value="">-- Choose a Bus Stop --</option>
        {busStopOptions.map((stop) => (
          <option key={stop.id} value={stop.id}>
            {stop.name} {stop.id}
          </option>
        ))}
      </select>
      {loading && <p>Loading...</p>}
      {busArrivalData && busArrivalData.services && (
        <>
          <h2>Bus Stop {busArrivalData.bus_stop_id}</h2>
          <BusService busArrivalData={busArrivalData} />
        </>
      )}
    </div>
  );
}

//onChange={handleInputChange} is same as onChange={(event) => setBusStopId(event.target.value)}

// keep track of bus Id, data from API