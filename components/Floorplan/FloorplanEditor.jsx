// components/floorplan/FloorPlanEditor.jsx
import React from "react";
import { Stage, Layer } from "react-konva";
import TableShape from "./Table";

const FloorplanEditor = ({ tables, setTables }) => {
  const handleDragEnd = (e, id) => {
    const newTables = tables.map((table) =>
      table.id === id ? { ...table, x: e.target.x(), y: e.target.y() } : table
    );
    setTables(newTables);
  };

  return (
    <div className="border rounded shadow">
      <Stage width={800} height={600} className="bg-white border">
        <Layer>
          {tables.map((table) => (
            <TableShape
              key={table.id}
              table={table}
              onDragEnd={(e) => handleDragEnd(e, table.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default FloorplanEditor;
