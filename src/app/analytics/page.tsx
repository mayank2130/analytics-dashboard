import { analytics } from "@/utils/analytics";
import React from "react";

type Props = {};

const Page = async (props: Props) => {

  const pageview = await analytics.retrieve("pageview", "28/09/2024");

  return <p>{JSON.stringify(pageview)}</p>;
};

export default Page;
