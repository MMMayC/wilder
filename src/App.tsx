import React, { useState, useEffect } from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { Cards } from "./Cards";

if ("geolocation" in navigator) {
  console.log("geolocation is available ");
} else {
  console.log("geolocation is not available ");
}
const pageSize = 3;
const App: React.FC = () => {
  const [animals, setAnimals] = useState(undefined);
  const [viewedAnimals, setViewedAnimals] = useState(0);
  const getAnimals = () => {
    navigator.geolocation.getCurrentPosition(position => {
      axios
        .get(
          `https://biocache-ws.ala.org.au/ws/occurrences/search.json?q=*%3A*&fq=class%3A%22Mammalia%22&fq=family%3A%22Macropodidae%22&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=100&fq=multimedia:Image&facet=false&pageSize=${pageSize}&start=${viewedAnimals}&sort=identification_qualifier_s&dir=asc`
        )
        .then(res => {
          setAnimals(res.data.occurrences);
          console.log("res.data.occurrences :", res.data.occurrences);
        });
    });
    setViewedAnimals(prev => prev + pageSize);
  };
  useEffect(() => {
    getAnimals();
  }, []);
  if (!animals) return <div>preparing to get you wilder</div>;
  if (isEmpty(animals)) return <div>nothing is wilder than you are</div>;
  return <Cards animals={animals} onFinished={getAnimals} />;
};

export default App;