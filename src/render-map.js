function renderMap(map) {
    const field = document.querySelector('.field');
    field.innerHTML = '';
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            const tile = document.createElement('div');
            let cls = 'tile';
            if (map[y][x] === wall) cls += ' tileW';
            if (map[y][x] === 'sword') cls += ' tileSW';
            if (map[y][x] === 'health') cls += ' tileHP';

            // для игрока
            if (map[y][x] === 'player') {
                cls += ' tileP';
                const healthBar = document.createElement('div');
                healthBar.className = 'health';
                const attackBar = document.createElement('div');
                attackBar.className = 'attack';
                tile.appendChild(healthBar);
                tile.appendChild(attackBar);
            }
            
            // для врага
            if (map[y][x] === 'enemy') {
                cls += ' tileE';
                const healthBar = document.createElement('div');
                healthBar.className = 'health';
                if (game.enemiesHealth[`${x},${y}`]) {
                    healthBar.style.width = game.enemiesHealth[`${x},${y}`] + '%';
                }
                tile.appendChild(healthBar);
            }

            tile.className = cls;
            tile.style.left = (x * 25.5) + 'px';
            tile.style.top = (y * 26.5) + 'px';
            tile.style.width = '26px';
            tile.style.height = '26px';
            field.appendChild(tile);
        }
    }
}
