// "use client";
// import { useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   SortableContext,
//   arrayMove,
//   verticalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Trash2 } from "lucide-react";

// const SortableItem = ({ id, value, onDoubleClick, timestamp, section }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   const backgroundColor = section === "ideas" ? "bg-slate-200" : "bg-lime-100";

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       onDoubleClick={onDoubleClick}
//       className={`${backgroundColor} p-4 shadow rounded-lg mb-2 cursor-pointer flex justify-between items-center`}
//     >
//       <div>
//         <p className="text-sm text-gray-900 dark:text-gray-400">{timestamp}</p>
//         <span>{value}</span>
//       </div>
//     </div>
//   );
// };

// const IdeasSection = () => {
//   const [ideas, setIdeas] = useState([]);
//   const [done, setDone] = useState([]);
//   const [newIdea, setNewIdea] = useState("");

//   const addIdea = () => {
//     if (newIdea.trim()) {
//       const capitalizedIdea = capitalizeFirstLetter(newIdea);
//       const timestamp = new Date().toLocaleString();
//       setIdeas([...ideas, { text: capitalizedIdea, timestamp }]);
//       setNewIdea("");
//     }
//   };

//   const moveToDone = (idea) => {
//     setIdeas(ideas.filter((item) => item !== idea));
//     setDone([...done, idea]);
//   };

//   const moveToIdeas = (idea) => {
//     setDone(done.filter((item) => item !== idea));
//     setIdeas([...ideas, idea]);
//   };

//   const deleteIdea = (ideaToDelete) => {
//     setIdeas(ideas.filter((idea) => idea.text !== ideaToDelete.text));
//   };

//   const deleteDone = (ideaToDelete) => {
//     setDone(done.filter((item) => item.text !== ideaToDelete.text));
//   };

//   function capitalizeFirstLetter(sentence) {
//     if (!sentence) return "";
//     return sentence.charAt(0).toUpperCase() + sentence.slice(1);
//   }

//   const onDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over) return;

//     const activeContainer = active.data.current?.sortable.containerId;
//     const overContainer = over.data.current?.sortable.containerId;

//     if (activeContainer === overContainer) {
//       if (active.id !== over.id) {
//         if (activeContainer === "ideas") {
//           const oldIndex = ideas.findIndex((idea) => idea === active.id);
//           const newIndex = ideas.findIndex((idea) => idea === over.id);
//           setIdeas(arrayMove(ideas, oldIndex, newIndex));
//         } else if (activeContainer === "done") {
//           const oldIndex = done.findIndex((idea) => idea === active.id);
//           const newIndex = done.findIndex((idea) => idea === over.id);
//           setDone(arrayMove(done, oldIndex, newIndex));
//         }
//       }
//     } else {
//       if (activeContainer === "ideas" && overContainer === "done") {
//         setIdeas(ideas.filter((idea) => idea !== active.id));
//         setDone([...done, active.id]);
//       } else if (activeContainer === "done" && overContainer === "ideas") {
//         setDone(done.filter((idea) => idea !== active.id));
//         setIdeas([...ideas, active.id]);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <input
//           type="text"
//           value={newIdea}
//           onChange={(e) => setNewIdea(e.target.value)}
//           className="border p-2 rounded-lg w-full mb-2 text-gray-900"
//           placeholder="Add a new idea"
//         />
//         <button
//           onClick={addIdea}
//           className="bg-green-500 text-gray-900 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors"
//         >
//           Add Idea
//         </button>
//       </div>
//       <div className="text-gray-900">
//         <h2 className="inline-block bg-red-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2">
//           Ideas
//         </h2>
//         <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//           <SortableContext
//             items={ideas.map((idea) => idea.text)} 
//             strategy={verticalListSortingStrategy}
//             id="ideas"
//           >
//             {ideas.map((idea, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <SortableItem
//                   id={idea.text}
//                   value={idea.text}
//                   timestamp={idea.timestamp}
//                   onDoubleClick={() => moveToDone(idea)}
//                   section="ideas"
//                 />
//                 <button
//                   onClick={() => deleteIdea(idea)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </div>
//             ))}
//           </SortableContext>
//         </DndContext>
//       </div>
//       <div className="text-gray-900">
//         <div>
//           <h2 className="inline-block bg-lime-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2">
//             Done
//           </h2>
//         </div>
//         <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//           <SortableContext
//             items={done.map((item) => item.text)}
//             strategy={verticalListSortingStrategy}
//             id="done"
//           >
//             {done.map((idea, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <SortableItem
//                   id={idea.text}
//                   value={idea.text}
//                   timestamp={idea.timestamp}
//                   onDoubleClick={() => moveToIdeas(idea)}
//                   section="done"
//                 />
//                 <button
//                   onClick={() => deleteDone(idea)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </div>
//             ))}
//           </SortableContext>
//         </DndContext>
//       </div>
//     </div>
//   );
// };

// export default IdeasSection;


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
import { Trash2 } from "lucide-react";

const SortableItem = ({ id, value, onDoubleClick, timestamp, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const backgroundColor = section === "ideas" ? "bg-slate-200" : "bg-lime-100";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={onDoubleClick}
      className={`${backgroundColor} p-4 shadow rounded-lg mb-2 cursor-pointer flex justify-between items-center w-full`}
    >
      <div>
        <p className="text-sm text-gray-900 dark:text-gray-400">{timestamp}</p>
        <span>{value}</span>
      </div>
    </div>
  );
};

const IdeasSection = () => {
  const [ideas, setIdeas] = useState([]);
  const [done, setDone] = useState([]);
  const [newIdea, setNewIdea] = useState("");

  const addIdea = () => {
    if (newIdea.trim()) {
      const capitalizedIdea = capitalizeFirstLetter(newIdea);
      const timestamp = new Date().toLocaleString();
      setIdeas([...ideas, { text: capitalizedIdea, timestamp }]);
      setNewIdea("");
    }
  };

  const moveToDone = (idea) => {
    setIdeas(ideas.filter((item) => item !== idea));
    setDone([...done, idea]);
  };

  const moveToIdeas = (idea) => {
    setDone(done.filter((item) => item !== idea));
    setIdeas([...ideas, idea]);
  };

  const deleteIdea = (ideaToDelete) => {
    setIdeas(ideas.filter((idea) => idea.text !== ideaToDelete.text));
  };

  const deleteDone = (ideaToDelete) => {
    setDone(done.filter((item) => item.text !== ideaToDelete.text));
  };

  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (activeContainer === overContainer) {
      if (active.id !== over.id) {
        if (activeContainer === "ideas") {
          const oldIndex = ideas.findIndex((idea) => idea === active.id);
          const newIndex = ideas.findIndex((idea) => idea === over.id);
          setIdeas(arrayMove(ideas, oldIndex, newIndex));
        } else if (activeContainer === "done") {
          const oldIndex = done.findIndex((idea) => idea === active.id);
          const newIndex = done.findIndex((idea) => idea === over.id);
          setDone(arrayMove(done, oldIndex, newIndex));
        }
      }
    } else {
      if (activeContainer === "ideas" && overContainer === "done") {
        setIdeas(ideas.filter((idea) => idea !== active.id));
        setDone([...done, active.id]);
      } else if (activeContainer === "done" && overContainer === "ideas") {
        setDone(done.filter((idea) => idea !== active.id));
        setIdeas([...ideas, active.id]);
      }
    }
  };

  return (
    <div className="w-[80%] mx-auto space-y-4">
      <div>
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className="border p-2 rounded-lg w-full mb-2 text-gray-900"
          placeholder="Add a new idea"
        />
        <button
          onClick={addIdea}
          className="bg-green-500 text-gray-900 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors"
        >
          Add Idea
        </button>
      </div>
      <div className="text-gray-900">
        <h2 className="inline-block bg-red-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2">
          Ideas
        </h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={ideas.map((idea) => idea.text)}
            strategy={verticalListSortingStrategy}
            id="ideas"
          >
            {ideas.map((idea, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <SortableItem
                  id={idea.text}
                  value={idea.text}
                  timestamp={idea.timestamp}
                  onDoubleClick={() => moveToDone(idea)}
                  section="ideas"
                />
                <button
                  onClick={() => deleteIdea(idea)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="text-gray-900">
        <div>
          <h2 className="inline-block bg-lime-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2">
            Done
          </h2>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={done.map((item) => item.text)}
            strategy={verticalListSortingStrategy}
            id="done"
          >
            {done.map((idea, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <SortableItem
                  id={idea.text}
                  value={idea.text}
                  timestamp={idea.timestamp}
                  onDoubleClick={() => moveToIdeas(idea)}
                  section="done"
                />
                <button
                  onClick={() => deleteDone(idea)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default IdeasSection;