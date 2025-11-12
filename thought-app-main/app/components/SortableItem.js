import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, value, onDoubleClick, timestamp, section }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const backgroundColor = section === "ideas" ? "bg-blue-100" : "bg-green-100";

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

export default SortableItem;
