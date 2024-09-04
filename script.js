class Character {
    constructor(name, hp, attack, defense, speed, abilities) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.abilities = abilities;
    }

    isAlive() {
        return this.hp > 0;
    }

    takeDamage(amount) {
        this.hp = Math.max(this.hp - amount, 0);
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, 100);
    }
}

let hero = new Character('Guerrier', 100, 20, 10, 5, {
    "Charge": { minDamage: 4, maxDamage: 6, critDamage: 8, successRate: 0.50, critRate: 0.10 },
    "Renforcement": { successRate: 0.65 },
    "Premiers soins": { successRate: 0.40, critRate: 0.20, minHeal: 3, maxHeal: 8, critHeal: 12 },
    "Final sword": { minDamage: 17, maxDamage: 22, critDamage: 30, successRate: 0.10, critRate: 0.01, failDamage: {min: 3, max: 10}, failRate: 0.04 }
});
let monster = new Character('Gobelin', 30, 10, 5, 7, {
    "Coup vicieux": { minDamage: 3, maxDamage: 5, successRate: 0.70 },
    "Esquive rusée": { successRate: 0.50 },
    "Rugissement terrifiant": { successRate: 0.40 }
});

function updateStatus() {
    document.getElementById('heroStatus').textContent = `Guerrier PV: ${hero.hp}`;
    document.getElementById('monsterStatus').textContent = `Gobelin PV: ${monster.hp}`;
    updateActionButtons();
    checkEndGame();
}

function updateActionButtons() {
    document.querySelectorAll('#actionArea button').forEach(button => {
        button.disabled = !hero.isAlive();
    });
}

function logAction(message) {
    const logArea = document.getElementById('logArea');
    logArea.innerHTML += `<div>${message}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

function checkEndGame() {
    if (!hero.isAlive()) {
        logAction("Défaite! Le guerrier est tombé au combat.");
        endGame();
    } else if (!monster.isAlive()) {
        logAction("Victoire! Le gobelin a été vaincu.");
        endGame();
    }
}

function endGame() {
    document.querySelectorAll('#actionArea button').forEach(button => button.disabled = true);
}

function performAction(character, target, action) {
    if (!character.isAlive() || !target.isAlive()) return;

    let ability = character.abilities[action];
    if (abilitySuccess(ability.successRate)) {
        let actionResult = executeAction(character, target, ability, action);
        logAction(`${character.name} utilise ${action} et ${actionResult}`);
    } else {
        logAction(`${character.name} tente d'utiliser ${action} mais échoue.`);
    }

    // Tour du monstre si le héros vient de jouer et que le monstre est toujours vivant
    if (character === hero && monster.isAlive()) {
        setTimeout(() => monsterAction(monster, hero), 1000);
    }
    updateStatus();
}

function monsterAction(monster, hero) {
    let actions = Object.keys(monster.abilities);
    let action = actions[Math.floor(Math.random() * actions.length)];
    performAction(monster, hero, action);
}

function abilitySuccess(rate) {
    return Math.random() < rate;
}

function calculateDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function executeAction(character, target, ability, action) {
    if (['Charge', 'Final sword'].includes(action)) {
        let damage = calculateDamage(ability.minDamage, ability.maxDamage);
        if (abilitySuccess(ability.critRate)) {
            damage = ability.critDamage;
        }
        target.takeDamage(damage);
        return `inflige ${damage} dégâts à ${target.name}`;
    } else if (action === "Premiers soins") {
        let healAmount = calculateDamage(ability.minHeal, ability.maxHeal);
        if (abilitySuccess(ability.critRate)) {
            healAmount = ability.critHeal;
        }
        character.heal(healAmount);
        return `se soigne de ${healAmount} PV`;
    }
    return '';
}
