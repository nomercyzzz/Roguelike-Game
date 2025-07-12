const map_width = 40;
const map_height = 24;

const wall = 'wall';
const floor = 'floor';

// создание двухмерного массива заполненного стенами
function createMap() {
    const map = [];
    for (i = 0; i < map_height; i++){
        const row = [];
        for (j = 0; j < map_width; j++){
            row.push(wall);
        }
        map.push(row);
    }
    return map;
}