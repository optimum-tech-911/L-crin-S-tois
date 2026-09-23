import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

type GamePhase = 'CREATION' | 'PLAYING';

interface Character {
  name: string;
  gender: string;
  archetype: string;
}

interface GameState {
  phase: GamePhase;
  character: Character | null;
  inventory: string[];
  currentLocation: string;
  locations: Record<string, Location>;
  messages: string[];
}

interface Location {
  id: string;
  name: string;
  description: string;
  items: string[];
  exits: Record<string, string>;
}

const initialLocations: Record<string, Location> = {
  cell: {
    id: 'cell',
    name: 'Damp Cell',
    description: 'You awaken in a cold, damp stone cell. The air is stale. There is a heavy iron door to the north.',
    items: ['rusty_key'],
    exits: {},
  },
  hallway: {
    id: 'hallway',
    name: 'Dark Hallway',
    description: 'A long, dark hallway illuminated by flickering torches. It stretches to the south and east.',
    items: ['health_potion'],
    exits: { south: 'cell', east: 'armory' }
  },
  armory: {
    id: 'armory',
    name: 'Old Armory',
    description: 'A dusty room filled with broken weapons and cobwebs. The exit is to the west.',
    items: ['iron_sword'],
    exits: { west: 'hallway' }
  }
};

const itemDb: Record<string, { id: string; name: string; description: string; use: (state: GameState, setState: React.Dispatch<React.SetStateAction<GameState>>) => void }> = {
  rusty_key: {
    id: 'rusty_key',
    name: 'Rusty Key',
    description: 'An old, rusted iron key.',
    use: (state, setState) => {
      if (state.currentLocation === 'cell') {
        setState(prev => {
          const newLocs = { ...prev.locations };
          newLocs.cell = {
            ...newLocs.cell,
            description: 'You are in a cold, damp stone cell. The iron door to the north is unlocked and open.',
            exits: { ...newLocs.cell.exits, north: 'hallway' }
          };
          return {
            ...prev,
            locations: newLocs,
            messages: [...prev.messages, 'You insert the rusty key into the heavy iron door. With a loud grind, it unlocks and swings open to the north!'],
            inventory: prev.inventory.filter(i => i !== 'rusty_key')
          };
        });
      } else {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, 'There is no lock here to use the key on.']
        }));
      }
    }
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'A vial of glowing red liquid.',
    use: (state, setState) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, 'You drink the potion. A warm feeling spreads through your body. You feel refreshed!'],
        inventory: prev.inventory.filter(i => i !== 'health_potion')
      }));
    }
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A basic iron sword, slightly dulled but still dangerous.',
    use: (state, setState) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, 'You swing the iron sword through the air. Whoosh! You look very intimidating.']
      }));
    }
  }
};

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'CREATION',
    character: null,
    inventory: [],
    currentLocation: 'cell',
    locations: initialLocations,
    messages: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.messages]);

  // Character Creator State
  const [charName, setCharName] = useState('');
  const [charGender, setCharGender] = useState('Male');
  const [charArchetype, setCharArchetype] = useState('Warrior');

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    setGameState(prev => ({
      ...prev,
      phase: 'PLAYING',
      character: {
        name: charName || 'Hero',
        gender: charGender,
        archetype: charArchetype
      },
      messages: [
        `Welcome, ${charName || 'Hero'} the ${charArchetype}.`,
        initialLocations['cell'].description
      ]
    }));
  };

  const handleMove = (direction: string) => {
    const currentLoc = gameState.locations[gameState.currentLocation];
    const nextLocId = currentLoc.exits[direction];
    
    if (nextLocId) {
      const nextLoc = gameState.locations[nextLocId];
      setGameState(prev => ({
        ...prev,
        currentLocation: nextLocId,
        messages: [...prev.messages, `You go ${direction}.`, nextLoc.name, nextLoc.description]
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        messages: [...prev.messages, "You can't go that way."]
      }));
    }
  };

  const handleTake = (itemId: string) => {
    const item = itemDb[itemId];
    setGameState(prev => {
      const currentLoc = prev.locations[prev.currentLocation];
      const newLocs = { ...prev.locations };
      newLocs[prev.currentLocation] = {
        ...currentLoc,
        items: currentLoc.items.filter(i => i !== itemId)
      };
      return {
        ...prev,
        inventory: [...prev.inventory, itemId],
        locations: newLocs,
        messages: [...prev.messages, `You picked up the ${item.name}.`]
      };
    });
  };

  const handleUse = (itemId: string) => {
    const item = itemDb[itemId];
    item.use(gameState, setGameState);
  };

  if (gameState.phase === 'CREATION') {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-50 p-8 pt-32 md:pt-40 font-mono flex items-center justify-center">
        <Helmet><title>Text Adventure | Character Creation</title></Helmet>
        <div className="max-w-md w-full bg-stone-800 p-8 rounded-lg shadow-2xl border border-stone-700">
          <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">Create Your Hero</h1>
          <form onSubmit={handleCreateCharacter} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-stone-300">Name</label>
              <input 
                type="text" 
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-600 rounded p-3 text-stone-50 focus:border-amber-500 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-stone-300">Gender</label>
              <select 
                value={charGender}
                onChange={(e) => setCharGender(e.target.value)}
                className="w-full bg-stone-900 border border-stone-600 rounded p-3 text-stone-50 focus:border-amber-500 focus:outline-none"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-stone-300">Archetype</label>
              <div className="grid grid-cols-1 gap-3">
                {['Warrior', 'Mage', 'Rogue'].map(arch => (
                  <div 
                    key={arch}
                    onClick={() => setCharArchetype(arch)}
                    className={`p-4 border rounded cursor-pointer transition-colors ${charArchetype === arch ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-900 border-stone-600 text-stone-400 hover:border-amber-500'}`}
                  >
                    <div className="font-bold">{arch}</div>
                    <div className="text-xs mt-1">
                      {arch === 'Warrior' && 'Strong and resilient, relies on physical prowess.'}
                      {arch === 'Mage' && 'Attuned to the arcane, wields powerful spells.'}
                      {arch === 'Rogue' && 'Quick and stealthy, master of lockpicking and agility.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded transition-colors mt-4">
              Begin Adventure
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentLocation = gameState.locations[gameState.currentLocation];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-300 p-4 pt-24 md:p-8 md:pt-32 font-mono flex flex-col md:flex-row gap-6">
      <Helmet><title>Text Adventure | Playing</title></Helmet>
      
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col bg-black border border-stone-700 rounded-lg overflow-hidden shadow-2xl min-h-[60vh] md:min-h-0">
        {/* Messages Log */}
        <div className="flex-1 p-6 overflow-y-auto">
          {gameState.messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 leading-relaxed ${msg.startsWith('Welcome') || msg.includes('unlock') ? 'text-amber-400 font-bold' : ''}`}>
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="bg-stone-800 p-4 border-t border-stone-700">
          <h3 className="text-amber-500 font-bold mb-3 uppercase tracking-wider text-sm">Actions</h3>
          
          <div className="mb-4">
            <span className="text-stone-400 text-sm block mb-2">Move:</span>
            <div className="flex gap-2">
              {['north', 'south', 'east', 'west'].map(dir => (
                <button 
                  key={dir}
                  onClick={() => handleMove(dir)}
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 px-4 py-2 rounded text-sm capitalize min-w-[70px] transition-colors"
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {currentLocation.items.length > 0 && (
            <div>
              <span className="text-stone-400 text-sm block mb-2">Visible Items:</span>
              <div className="flex gap-2 flex-wrap">
                {currentLocation.items.map(itemId => (
                  <button 
                    key={itemId}
                    onClick={() => handleTake(itemId)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-emerald-50 px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors"
                  >
                    Take {itemDb[itemId].name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        {/* Character Info */}
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 shadow-xl">
          <h3 className="text-amber-500 font-bold text-lg mb-4 border-b border-stone-700 pb-2 uppercase tracking-wider">Character</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-stone-500 inline-block w-16">Name:</span> <span className="text-stone-100">{gameState.character?.name}</span></p>
            <p><span className="text-stone-500 inline-block w-16">Gender:</span> <span className="text-stone-100">{gameState.character?.gender}</span></p>
            <p><span className="text-stone-500 inline-block w-16">Class:</span> <span className="text-stone-100">{gameState.character?.archetype}</span></p>
          </div>
        </div>

        {/* Inventory System */}
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 shadow-xl flex-1 min-h-[300px]">
          <h3 className="text-amber-500 font-bold text-lg mb-4 border-b border-stone-700 pb-2 uppercase tracking-wider">Inventory</h3>
          {gameState.inventory.length === 0 ? (
            <p className="text-stone-500 text-sm italic">Your inventory is empty.</p>
          ) : (
            <div className="space-y-3">
              {gameState.inventory.map(itemId => {
                const item = itemDb[itemId];
                return (
                  <div key={itemId} className="bg-stone-900 p-3 rounded border border-stone-700">
                    <div className="font-bold text-stone-200">{item.name}</div>
                    <div className="text-xs text-stone-400 mt-1 mb-3">{item.description}</div>
                    <button 
                      onClick={() => handleUse(itemId)}
                      className="bg-blue-800 hover:bg-blue-700 text-blue-50 px-3 py-1.5 text-xs rounded w-full font-medium transition-colors uppercase tracking-wider"
                    >
                      Use Item
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
