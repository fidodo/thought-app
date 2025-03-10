'use client';
import { useState, useCallback,useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import SortableItem from './SortableItem';
import { auth } from '../lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';


const IdeasSection = ({user}) => {
  const [ideas, setIdeas] = useState([]);
  const [done, setDone] = useState([]);
  const [newIdea, setNewIdea] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const ThoughtUrl = '/api/thoughts'; 

 

  const loadThoughtData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error('User not authenticated');
      }
console.log('idToken:', idToken);
      const response = await fetch(ThoughtUrl, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      setIdeas(data.thoughts);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(`Error fetching data from ${ThoughtUrl}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, load thoughts
        loadThoughtData();
      } else {
        // User is signed out, clear thoughts
        setIdeas([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [loadThoughtData]);


  const addIdea = () => {
    if (newIdea.trim()) {
      const capitalizedIdea = capitalizeFirstLetter(newIdea);
      const timestamp = new Date().toLocaleString();
      setIdeas([...ideas, { text: capitalizedIdea, timestamp }]);
      setNewIdea('');
    }
  };

  const moveToDone = idea => {
    setIdeas(ideas.filter(item => item !== idea));
    setDone([...done, idea]);
  };

  const moveToIdeas = idea => {
    setDone(done.filter(item => item !== idea));
    setIdeas([...ideas, idea]);
  };

  const deleteIdea = ideaToDelete => {
    setIdeas(ideas.filter(idea => idea.text !== ideaToDelete.text));
  };

  const deleteDone = ideaToDelete => {
    setDone(done.filter(item => item.text !== ideaToDelete.text));
  };

  function capitalizeFirstLetter(sentence) {
    if (!sentence) return '';
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  const onDragEnd = event => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (activeContainer === overContainer) {
      if (active.id !== over.id) {
        if (activeContainer === 'ideas') {
          const oldIndex = ideas.findIndex(idea => idea === active.id);
          const newIndex = ideas.findIndex(idea => idea === over.id);
          setIdeas(arrayMove(ideas, oldIndex, newIndex));
        } else if (activeContainer === 'done') {
          const oldIndex = done.findIndex(idea => idea === active.id);
          const newIndex = done.findIndex(idea => idea === over.id);
          setDone(arrayMove(done, oldIndex, newIndex));
        }
      }
    } else {
      if (activeContainer === 'ideas' && overContainer === 'done') {
        setIdeas(ideas.filter(idea => idea !== active.id));
        setDone([...done, active.id]);
      } else if (activeContainer === 'done' && overContainer === 'ideas') {
        setDone(done.filter(idea => idea !== active.id));
        setIdeas([...ideas, active.id]);
      }
    }
  };

  const handleEditClick = idea => {
    setEditingId(idea.text);
    setEditedText(idea.text);
    setMenuOpenId(null);
  };

  const handleSaveEdit = (idea, section) => {
    console.log('Saved:', editedText);
    setEditingId(null);
  };

  return (
    <div className="w-[80%] mx-auto space-y-4">
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div className="text-gray-900">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={done.map(item => item.text)}
            strategy={verticalListSortingStrategy}
            id="done"
          >
            {done.map((idea, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                {editingId === idea.text ? (
                  <input
                    type="text"
                    value={editedText}
                    onChange={e => setEditedText(e.target.value)}
                    onBlur={() => handleSaveEdit(idea, 'done')}
                    className="border p-1 rounded w-full"
                    autoFocus
                  />
                ) : (
                  <SortableItem
                    id={idea.text}
                    value={idea.text}
                    timestamp={idea.timestamp}
                    onDoubleClick={() => moveToIdeas(idea)}
                    section="done"
                  />
                )}
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === idea.text ? null : idea.text)
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                  </button>
                  {menuOpenId === idea.text && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg">
                      <button
                        onClick={() => handleEditClick(idea)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="h-4 w-4 mr-2"
                        />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDone(idea)}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="h-4 w-4 mr-2"
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </SortableContext>
        </DndContext>
        <div>
          <h2 className="inline-block bg-green-300 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mt-2">
            Done
          </h2>
        </div>
      </div>
      <hr className="border-t border-gray-600" />
      <div className="text-gray-900">
        <h2 className="inline-block bg-blue-300 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2">
          Ideas
        </h2>

        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={ideas.map(idea => idea.text)}
            strategy={verticalListSortingStrategy}
            id="ideas"
          >
            {ideas.map((idea, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                {editingId === idea.text ? (
                  <input
                    type="text"
                    value={editedText}
                    onChange={e => setEditedText(e.target.value)}
                    onBlur={() => handleSaveEdit(idea, 'ideas')} // Save on blur
                    className="border p-1 rounded w-full"
                    autoFocus
                  />
                ) : (
                  <SortableItem
                    id={idea.text}
                    value={idea.text}
                    timestamp={idea.timestamp}
                    onDoubleClick={() => moveToDone(idea)}
                    section="ideas"
                  />
                )}
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === idea.text ? null : idea.text)
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                  </button>
                  {menuOpenId === idea.text && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg">
                      <button
                        onClick={() => handleEditClick(idea)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="h-4 w-4 mr-2"
                        />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteIdea(idea)}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="h-4 w-4 mr-2"
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div>
        <label
          htmlFor="idea"
          className=" bg-green-100 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold mb-2"
        >
          Add new idea:
        </label>
        <input
          type="text"
          value={newIdea}
          onChange={e => setNewIdea(e.target.value)}
          className="border p-2 rounded-lg w-full mb-2 text-gray-900 h-[250px]"
        />
        <button
          onClick={addIdea}
          className="bg-green-500 text-gray-900 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors"
        >
          Add Idea
        </button>
      </div>
    </div>
  );
};

export default IdeasSection;


