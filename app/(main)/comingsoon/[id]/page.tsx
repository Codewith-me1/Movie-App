"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const Page = ({ params }) => {
  const id = params.id;
  return <div>Page {id}</div>;
};

export default Page;
