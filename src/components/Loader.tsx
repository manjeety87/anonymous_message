import React from "react";
import loading from "../loading.json";
import Lottie from "lottie-react";

const Loader = () => {
  return (
    <div className="flex justify-center max-h-10 items-center">
      <Lottie height={400} width={400} animationData={loading} loop={true} />
    </div>
  );
};

export default Loader;
