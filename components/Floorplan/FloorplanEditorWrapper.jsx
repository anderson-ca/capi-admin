import dynamic from "next/dynamic";

const FloorPlanEditor = dynamic(() => import("./FloorplanEditor"), {
  ssr: false,
});

export default FloorPlanEditor;