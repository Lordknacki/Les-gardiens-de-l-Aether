class Character {
    constructor(name, hp, mp, attack, defense, speed, abilities) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
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
        this.hp += amount;
    }
}

function abilitySuccess(probability) {
    return Math.random() < probability;
}

function calculateDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let hero = new Character('Guerrier', 100, 30, 20, 10, 5, {
    "Charge": { cost: 0, minDamage: 4, maxDamage: 6, critDamage: 8, successRate: 0.50, critRate: 0.10 },
    "Renforcement": { cost: 0, successRate: 0.65 },
    "Premiers soins": { cost: 0, successRate: 0.40, critRate: 0.20, minHeal: 3, maxHeal: 8, critHeal: 12 },
    "Final sword": { cost: 0, minDamage: 17, maxDamage: 22, critDamage: 30, successRate: 0.10, critRate: 0.01, failDamage: {min: 3, max: 10}, failRate: 0.04 }
});
let monster = new Character('Gobelin', 30, 10, 10, 5, 7, {
    "Coup vicieux": { minDamage: 3, maxDamage: 5, successRate: 0.70 },
    "Esquive rusée": { successRate: 0.50 },
    "Rugissement terrifiant": { successRate: 0.40 }
});

function performAction(character, target, action) {
    let ability = character.abilities[action];
    if (abilitySuccess(ability.successRate)) {
        if (action === "Charge" || action === "Final sword") {
            let damage = calculateDamage(ability.minDamage, ability.maxDamage);
            if (abilitySuccess(ability.critRate)) {
                damage = ability.critDamage;
            }
            target.takeDamage(damage);
            logAction(`${character.name} utilise ${action} et inflige ${damage} dégâts à ${target.name}`);
            if (action === "Final sword" && abilitySuccess(ability.failRate)) {
                let selfDamage = calculateDamage(ability.failDamage.min, ability.failDamage.max);
                character.takeDamage(selfDamage);
                logAction(`${character.name} échoue avec Final sword et se blesse pour ${selfDamage} dégâts`);
            }
        } else if (action === "Premiers soins") {
            let healAmount = calculateDamage(ability.minHeal, ability.maxHeal);
            if (abilitySuccess(ability.critRate)) {
                healAmount = ability.critHeal;
            }
            character.heal(healAmount);
            logAction(`${character.name} utilise ${action} et se soigne de ${healAmount} PV`);
        } else if (action === "Renforcement") {
            // Implémentation spécifique pour réduire les dégâts
        }
    } else {
        logAction(`${character.name} utilise ${action} mais échoue`);
    }
}

function logAction(message) {
    document.getElementById('logArea').textContent += message + "\n";
}

function updateStatus() {
    document.getElementById('heroStatus').textContent = `${hero.name} PV: ${hero.hp} | MP: ${hero.mp}`;
    document.getElementById('monsterStatus').textContent = `${monster.name} PV: ${monster.hp} | MP: ${monster.mp}`;
}

updateStatus();
