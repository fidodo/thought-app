"use client";
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, value }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 shadow rounded-lg mb-2 cursor-pointer"
    >
      {value}
    </div>
  );
};

const IdeasSection = () => {
  const [ideas, setIdeas] = useState([]);
  const [done, setDone] = useState([]);
  const [newIdea, setNewIdea] = useState("");

  const addIdea = () => {
    if (newIdea.trim()) {
      setIdeas([...ideas, newIdea]);
      setNewIdea("");
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = ideas.findIndex((idea) => idea === active.id);
      const newIndex = ideas.findIndex((idea) => idea === over.id);
      setIdeas(arrayMove(ideas, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Ideas</h2>
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className="border p-2 rounded-lg w-full mb-2"
          placeholder="Add a new idea"
        />
        <button
          onClick={addIdea}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Add Idea
        </button>

        {/* Drag & Drop Context */}
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ideas} strategy={verticalListSortingStrategy}>
            {ideas.map((idea, index) => (
              <SortableItem key={index} id={idea} value={idea} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Done</h2>
        {done.map((idea, index) => (
          <div key={index} className="bg-gray-100 p-4 shadow rounded-lg mb-2">
            {idea}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasSection;
