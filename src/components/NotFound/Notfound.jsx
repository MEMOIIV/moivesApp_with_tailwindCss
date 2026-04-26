import React from "react";
import { WarningCircleIcon } from "../../utils/icons";
function Notfound() {
  return (
    <div className="bg-indigo-500 h-screen flex justify-center items-center capitalize">
      <div className="animate-bounce text-red-700">
        <WarningCircleIcon size={32} />
      </div>
      <h1 className="mx-2 text-3xl">4 0 4 not found</h1>
    </div>
  );
}

export default Notfound;
