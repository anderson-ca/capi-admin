// components/floorplan/TableShape.jsx
import React from "react";
import { Rect, Circle, Text, Group } from "react-konva";

const TableShape = ({ table, onDragEnd }) => {
  return (
    <Group
      draggable
      x={table.x}
      y={table.y}
      rotation={table.rotation || 0}
      onDragEnd={onDragEnd}
    >
      {table.type === "rect" ? (
        <Rect
          width={table.width}
          height={table.height}
          fill="#e0e0e0"
          stroke="#444"
          strokeWidth={2}
          cornerRadius={4}
        />
      ) : (
        <Circle
          radius={table.radius || 40}
          fill="#e0e0e0"
          stroke="#444"
          strokeWidth={2}
        />
      )}
      <Text text={table.label} fontSize={14} fill="#000" x={10} y={10} />
    </Group>
  );
};

export default TableShape;
