function Game() {
    // основные параметры игры
    this.map = null;    
    // позиция игрока {x, y}        
    this.playerPos = null;  
    // здоровье игрока
    this.playerHealth = 100;  
    // базовый урон игрока        
    this.playerAttack = 25; 
    // бонус к атаке 0-100%  
    this.attackBoost = 0; 
    // здоровье врагов по координатам
    this.enemiesHealth = {};          

    // создание игрового мира
    this.createWorld = function() {
        this.map = createMap();
        createRooms(this.map);
        createCorridors(this.map);
    };

    // размещение предметов на карте
    this.placeItems = function() {
        placeObjects(this.map, 'sword', 2);   
        placeObjects(this.map, 'health', 10);
        this.playerPos = placePlayer(this.map);
    };

    // размещение и инициализация врагов
    this.initEnemies = function() {
        const enemies = placeObjects(this.map, 'enemy', 10);
        if (enemies && enemies.length > 0) {
            enemies.forEach(enemy => {
                this.enemiesHealth[`${enemy.x},${enemy.y}`] = 100;
            });
        }
    };

    // инициализация игры
    this.init = function() {
        this.createWorld();
        this.placeItems();
        this.initEnemies();
        this.render();
        this.listenKeys();
    };

    // отрисовка игры
    this.render = function() {
        renderMap(this.map);
        renderStats(this.playerHealth, this.attackBoost);
    };

    // обработка атаки игрока
    this.handlePlayerAttack = function(nx, ny) {
        const enemyKey = `${nx},${ny}`;
        const damage = this.attackBoost > 0 ? 50 : 25;
        this.enemiesHealth[enemyKey] -= damage;

        if (this.enemiesHealth[enemyKey] <= 0) {
            this.removeEnemy(nx, ny, enemyKey);
        }
        return true;
    };

    // удаление врага с карты
    this.removeEnemy = function(x, y, enemyKey) {
        this.map[y][x] = floor;
        delete this.enemiesHealth[enemyKey];

        // провекра победы
        this.checkVictory();
    };

    // победа есл убить всех врагов
    this.checkVictory = function() {
        if (Object.keys(this.enemiesHealth).length === 0) {
            alert('Поздравляем! Вы победили всех врагов!');
            location.reload();
        }
    };

    // проверка и атака врагов вокруг игрока
    this.attackEnemies = function() {
        const dirs = this.getDirections();
        let hasEnemies = false;

        for (const dir of dirs) {
            const nx = this.playerPos.x + dir.dx;
            const ny = this.playerPos.y + dir.dy;
            
            if (this.canAttackEnemy(nx, ny)) {
                hasEnemies = this.handlePlayerAttack(nx, ny);
            }
        }

        this.updateAttackBoost(hasEnemies);
        this.render();
    };

    // проверка возможности атаки врага
    this.canAttackEnemy = function(x, y) {
        return this.map[y] && this.map[y][x] === 'enemy';
    };

    // обновление бонуса атаки
    this.updateAttackBoost = function(hasEnemies) {
        if (hasEnemies && this.attackBoost > 0) {
            this.attackBoost = Math.max(0, this.attackBoost - 25);
        }
    };

    // получение направлений для движения/атаки
    this.getDirections = function() {
        return [
            {dx: 0, dy: -1},  
            {dx: 0, dy: 1},   
            {dx: -1, dy: 0}, 
            {dx: 1, dy: 0}   
        ];
    };

    // движение врагов
    this.moveEnemies = function() {
        const enemies = this.findEnemies();
        const dirs = this.getDirections();
        
        for (const enemy of enemies) {
            if (!this.tryEnemyAttack(enemy, dirs)) {
                this.tryEnemyMove(enemy, dirs);
            }
        }
    };

    // поиск всех врагов на карте
    this.findEnemies = function() {
        const enemies = [];
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                if (this.map[y][x] === 'enemy') {
                    enemies.push({x, y});
                }
            }
        }
        return enemies;
    };

    // попытка атаки врагом игрока
    this.tryEnemyAttack = function(enemy, dirs) {
        for (const dir of dirs) {
            const nx = enemy.x + dir.dx;
            const ny = enemy.y + dir.dy;
            
            if (this.isPlayerAt(nx, ny)) {
                return this.performEnemyAttack();
            }
        }
        return false;
    };

    // проверка наличия игрока в указанной позиции
    this.isPlayerAt = function(x, y) {
        return this.map[y] && this.map[y][x] === 'player';
    };

    // выполнение атаки врага
    this.performEnemyAttack = function() {
        this.playerHealth = Math.max(0, this.playerHealth - 10);
        this.render();
        
        if (this.playerHealth <= 0) {
            this.gameOver();
            return true;
        }
        return true;
    };

    // завершение игры
    this.gameOver = function() {
        alert('Игра окончена!');
        location.reload();
    };

    // попытка движения врага
    this.tryEnemyMove = function(enemy, dirs) {
        const dir = dirs[randomNumber(0, dirs.length - 1)];
        const nx = enemy.x + dir.dx;
        const ny = enemy.y + dir.dy;
        
        if (this.canEnemyMove(nx, ny)) {
            this.moveEnemy(enemy, nx, ny);
        }
    };

    // проверка возможности движения врага
    this.canEnemyMove = function(x, y) {
        return this.map[y] && this.map[y][x] === floor;
    };

    // перемещение врага
    this.moveEnemy = function(enemy, nx, ny) {
        this.map[enemy.y][enemy.x] = floor;
        this.map[ny][nx] = 'enemy';
        this.enemiesHealth[`${nx},${ny}`] = this.enemiesHealth[`${enemy.x},${enemy.y}`];
        delete this.enemiesHealth[`${enemy.x},${enemy.y}`];
    };

    // обработка движения игрока
    this.handlePlayerMove = function(dx, dy) {
        const nx = this.playerPos.x + dx;
        const ny = this.playerPos.y + dy;
        
        if (this.canPlayerMove(nx, ny)) {
            this.collectItems(nx, ny);
            this.movePlayer(nx, ny);
            this.render();
            this.moveEnemies();
        }
    };

    // проверка возможности движения игрока
    this.canPlayerMove = function(x, y) {
        return this.map[y] && this.map[y][x] && this.map[y][x] !== wall && this.map[y][x] !== 'enemy';
    };

    // подбор предметов
    this.collectItems = function(x, y) {
        if (this.map[y][x] === 'health') {
            this.playerHealth = Math.min(100, this.playerHealth + 25);
        }
        if (this.map[y][x] === 'sword') {
            this.attackBoost = 100;
        }
    };

    // перемещение игрока
    this.movePlayer = function(nx, ny) {
        this.map[this.playerPos.y][this.playerPos.x] = floor;
        this.playerPos.x = nx;
        this.playerPos.y = ny;
        this.map[ny][nx] = 'player';
    };

    // нажатие клавиш
    this.listenKeys = function() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            let dx = 0, dy = 0;

            // движенеи
            if (key === 'w' || key === 'ц') dy = -1; 
            if (key === 's' || key === 'ы') dy = 1;   
            if (key === 'a' || key === 'ф') dx = -1;  
            if (key === 'd' || key === 'в') dx = 1;   

            // движение игрока
            if (dx !== 0 || dy !== 0) {
                this.handlePlayerMove(dx, dy);
            }

            // атака по пробелу
            if (e.key === ' ') {
                this.attackEnemies();
            }
        });
    };
}