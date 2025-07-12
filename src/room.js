// функция для генирации случайного числа в заданном диапазоне
function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRooms(map) {
    const roomCount = randomNumber(5, 10);
    for (let i = 0; i < roomCount; i++) {
        const w = randomNumber(3, 8);
        const h = randomNumber(3, 8);
        const x = randomNumber(1, map_width - w - 1);
        const y = randomNumber(1, map_height - h - 1);
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                map[y + dy][x + dx] = floor;
            }
        }
    }
}