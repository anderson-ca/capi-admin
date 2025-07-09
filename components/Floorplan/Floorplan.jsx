import { useState } from "react";
import FloorplanEditor from "../floorplan/FloorplanEditorWrapper";

const initialTables = [
  { id: 1, x: 50, y: 50 },
  { id: 2, x: 200, y: 150 },
];

export default function FloorPlanPage() {
  const [tables, setTables] = useState(initialTables);

  return (
    <div className="p-6">
      <FloorplanEditor tables={tables} setTables={setTables} />
    </div>
  );
}
