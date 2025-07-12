function createCorridors(map) {
    // вертикальные проходы
    for (let i = 0; i < randomNumber(3, 5); i++) {
        const x = randomNumber(1, map_width - 2);
        for (let y = 1; y < map_height - 1; y++) {
            map[y][x] = floor;
        }
    }
    // горизонтальные проходы
    for (let i = 0; i < randomNumber(3, 5); i++) {
        const y = randomNumber(1, map_height - 2);
        for (let x = 1; x < map_width - 1; x++) {
            map[y][x] = floor;
        }
    }
}