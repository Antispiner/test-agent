/**
 * Room visual definitions — background colors, furniture shapes, and object visuals.
 * Each room is drawn procedurally on canvas.
 */

export interface RoomObject {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  shape: 'rect' | 'circle' | 'roundRect';
}

export interface RoomDef {
  wallColor: string;
  floorColor: string;
  floorY: number;
  furniture: RoomObject[];
  objectMap: Record<string, RoomObject>;
}

function buildRoom(
  wallColor: string, floorColor: string, floorY: number,
  furniture: RoomObject[]
): RoomDef {
  const objectMap: Record<string, RoomObject> = {};
  for (const f of furniture) objectMap[f.name] = f;
  return { wallColor, floorColor, floorY, furniture, objectMap };
}

export const ROOMS: Record<string, RoomDef> = {
  Kitchen: buildRoom('#e8d5b7', '#b08968', 420, [
    { name: 'fridge', x: 60, y: 180, w: 80, h: 230, color: '#d4d4d4', label: 'Fridge', shape: 'roundRect' },
    { name: 'sugar_bowl', x: 290, y: 260, w: 50, h: 35, color: '#f5f5dc', label: 'Sugar Bowl', shape: 'roundRect' },
    { name: 'oil_bottle', x: 170, y: 330, w: 30, h: 60, color: '#c4a35a', label: 'Oil', shape: 'roundRect' },
    { name: 'faucet', x: 440, y: 170, w: 60, h: 50, color: '#a8a8a8', label: 'Faucet', shape: 'roundRect' },
    { name: 'toaster', x: 530, y: 260, w: 55, h: 40, color: '#888', label: 'Toaster', shape: 'roundRect' },
    // counter
    { name: '_counter', x: 240, y: 290, w: 380, h: 20, color: '#8b7355', label: '', shape: 'rect' },
    // cabinets
    { name: '_cabinet1', x: 240, y: 160, w: 120, h: 80, color: '#a0522d', label: '', shape: 'rect' },
    { name: '_cabinet2', x: 380, y: 160, w: 120, h: 80, color: '#8b4513', label: '', shape: 'rect' },
    { name: '_cabinet3', x: 520, y: 160, w: 100, h: 80, color: '#a0522d', label: '', shape: 'rect' },
  ]),
  Bathroom: buildRoom('#c4dfe6', '#a8c4cc', 420, [
    { name: 'shampoo', x: 320, y: 160, w: 30, h: 50, color: '#ff69b4', label: 'Shampoo', shape: 'roundRect' },
    { name: 'drain', x: 280, y: 370, w: 50, h: 30, color: '#666', label: 'Drain', shape: 'circle' },
    { name: 'soap', x: 400, y: 285, w: 40, h: 25, color: '#ffe4c4', label: 'Soap', shape: 'roundRect' },
    { name: 'tp_holder', x: 120, y: 300, w: 40, h: 50, color: '#fff', label: 'TP', shape: 'roundRect' },
    { name: 'mirror', x: 250, y: 100, w: 120, h: 80, color: '#b0e0e6', label: 'Mirror', shape: 'roundRect' },
    // bathtub
    { name: '_bathtub', x: 220, y: 300, w: 200, h: 110, color: '#f0f0f0', label: '', shape: 'roundRect' },
    // toilet
    { name: '_toilet', x: 100, y: 330, w: 60, h: 80, color: '#f5f5f5', label: '', shape: 'roundRect' },
    // sink
    { name: '_sink', x: 500, y: 280, w: 80, h: 60, color: '#e8e8e8', label: '', shape: 'roundRect' },
  ]),
  'Living Room': buildRoom('#f0e6d3', '#c19a6b', 420, [
    { name: 'remote', x: 475, y: 335, w: 40, h: 15, color: '#333', label: 'Remote', shape: 'roundRect' },
    { name: 'armchair', x: 320, y: 280, w: 90, h: 100, color: '#8b6914', label: 'Armchair', shape: 'roundRect' },
    { name: 'couch', x: 250, y: 300, w: 180, h: 90, color: '#6b4226', label: 'Couch', shape: 'roundRect' },
    { name: 'bookshelf', x: 60, y: 160, w: 80, h: 240, color: '#5c3317', label: 'Bookshelf', shape: 'rect' },
    { name: 'book', x: 120, y: 340, w: 30, h: 40, color: '#8b0000', label: 'Book', shape: 'roundRect' },
    // TV
    { name: '_tv', x: 450, y: 170, w: 140, h: 100, color: '#222', label: '', shape: 'roundRect' },
    // TV stand
    { name: '_tvstand', x: 440, y: 275, w: 160, h: 30, color: '#4a3728', label: '', shape: 'rect' },
    // rug
    { name: '_rug', x: 200, y: 430, w: 300, h: 60, color: '#800020', label: '', shape: 'roundRect' },
  ]),
};
