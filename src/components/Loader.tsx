import React from "react";
import loading from "../loading.json";
import Lottie from "lottie-react";

const Loader = () => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <Lottie animationData={loading} loop={true} />
    </div>
  );
};

export default Loader;
