class Character {
    constructor(name, hp, mp, attack, defense, speed) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
    }

    isAlive() {
        return this.hp > 0;
    }
}

let hero = new Character('Guerrier', 100, 30, 20, 10, 5);
let monster = new Character('Gobelin', 30, 10, 10, 5, 7);

function updateStatus() {
    document.getElementById('heroStatus').textContent = `${hero.name} PV: ${hero.hp} | MP: ${hero.mp}`;
    document.getElementById('monsterStatus').textContent = `${monster.name} PV: ${monster.hp} | MP: ${monster.mp}`;
}

function logAction(message) {
    document.getElementById('logArea').textContent = message;
}

function performAction(action) {
    switch (action) {
        case 'attack':
            hero.hp -= (monster.attack - hero.defense);
            monster.hp -= (hero.attack - monster.defense);
            logAction(`${hero.name} et ${monster.name} s'attaquent mutuellement!`);
            break;
        case 'defend':
            hero.defense += 5;
            logAction(`${hero.name} augmente sa défense!`);
            break;
        case 'heal':
            hero.hp += 15;
            hero.mp -= 10;
            logAction(`${hero.name} se soigne!`);
            break;
    }
    updateStatus();
    if (!monster.isAlive()) {
        logAction(`${monster.name} est vaincu!`);
    }
}

updateStatus();
