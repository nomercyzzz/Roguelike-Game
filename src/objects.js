// нахождение пустых клеток на карте
function getEmptyCells(map) {
    const empty = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === floor) empty.push({x, y});
        }
    }
    return empty;
}

// ствит мечи и зелье на карте
function placeObjects(map, type, count) {
    const empty = getEmptyCells(map);
    const placed = [];  // массив для хранения координат размещенных объектов
    
    for (let i = 0; i < count && empty.length > 0; i++) {
        const idx = randomNumber(0, empty.length - 1);
        const cell = empty.splice(idx, 1)[0];
        map[cell.y][cell.x] = type;
        
        // cохраняем координаты врагов
        if (type === 'enemy') {
            placed.push({x: cell.x, y: cell.y});
        }
    }
    // возвращаем координаты только для врагов
    return type === 'enemy' ? placed : []; 
}

// ставит игрока в рандомное место на карте 
function placePlayer(map) {
    const empty = getEmptyCells(map);
    const idx = randomNumber(0, empty.length - 1);
    const cell = empty[idx];
    map[cell.y][cell.x] = 'player';
    return {x: cell.x, y: cell.y};
}