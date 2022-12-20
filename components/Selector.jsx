import React from "react";
import Link from "next/link";

const Selector = () => {
  return (
    <div className="flex justify-center">
      <div className="p-3 m-2 bg-gray-900 text-slate-50 rounded-xl">
        <Link href="/buyer">Go to Buyer Page</Link>
      </div>
    </div>
  );
};

export default Selector;
