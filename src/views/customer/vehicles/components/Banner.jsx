import { useParams } from "react-router-dom";
const Banner1 = () => {
  const { vehicle_uuid } = useParams();
  return <h1>{vehicle_uuid}</h1>;
};

export default Banner1;
