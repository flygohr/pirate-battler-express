const getPirate = require('./get-pirate.js');

const rankStatsLookup = {
    crewmate: {
        damage: 5,
        hitChance: 70,
        health: 50,
        initiative: 1,
        dodgeChance: 0,
    },
    carpenter: {
        damage: 6,
        hitChance: 72,
        health: 50,
        initiative: 2,
        dodgeChance: 0,
    },
    navigator: {
        damage: 7,
        hitChance: 75,
        health: 50,
        initiative: 3,
        dodgeChance: 0,
    },
    quartermaster: {
        damage: 8,
        hitChance: 77,
        health: 50,
        initiative: 4,
        dodgeChance: 0,
    },
    captain: {
        damage: 10,
        hitChance: 80,
        health: 50,
        initiative: 5,
        dodgeChance: 0,
    },
};

// +Damage
const sword = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 4,
    legendary: 6,
};

// +Health
const hat = {
    common: 0,
    uncommon: 5,
    rare: 9,
    epic: 14,
    legendary: 20,
};

// +Damage
const animal = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 4,
    legendary: 6,
};

// +Initiative
const beard = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 4,
    legendary: 6,
};

// +Health
const jacket = {
    common: 0,
    uncommon: 5,
    rare: 9,
    epic: 14,
    legendary: 20,
};

// +Health
const pants = {
    common: 0,
    uncommon: 5,
    rare: 9,
    epic: 14,
    legendary: 20,
};

// +Dodge Chance
const boots = {
    common: 3,
    uncommon: 6,
    rare: 9,
    epic: 12,
    legendary: 15,
};

function getItemsFromTags(tags) {
    const hatKey = tags.find(t => t.includes('hat')).replace('hat', '');
    const jacketKey = tags.find(t => t.includes('jacket')).replace('jacket', '');
    const pantsKey = tags.find(t => t.includes('pants')).replace('pants', '');
    const bootsKey = tags.find(t => t.includes('boots')).replace('boots', '');
    const swordKey = tags.find(t => t.includes('sword')).replace('sword', '');
    const beardKey = tags.find(t => t.includes('beard')).replace('beard', '');
    const foundAnimal = tags.find(t => t.includes('animal'));
    const animalKey = foundAnimal ? foundAnimal.replace('animal', '') : null;
    return {
        hat: hat[hatKey],
        jacket: jacket[jacketKey],
        pants: pants[pantsKey],
        boots: boots[bootsKey],
        sword: sword[swordKey],
        beard: beard[beardKey],
        animal: animal[animalKey],
    };
}

function getRankFromTags(tags) {
    return tags.find(tag => {
        switch(tag) {
            case 'crewmate':
            case 'carpenter':
            case 'navigator':
            case 'quartermaster':
            case 'captain':
                return true;
            default:
                return false;
        }
    });
}

const buildPirate = (id, title, tokenTags) => {
    const name = title.split(' | ')[0];
    const tags = tokenTags.map(tag => tag.tag.tag);
    const items = getItemsFromTags(tags);
    const rank = getRankFromTags(tags);
    const rankStats = rankStatsLookup[rank];
    return {
        id,
        name,
        damage: rankStats.damage + items.sword,
        hitChance: rankStats.hitChance,
        health: rankStats.health + items.jacket + items.pants + items.hat,
        initiative: rankStats.initiative + items.beard,
        dodgeChance: items.boots,
    };
};

const makePirate = async(objktId) => {
    const pirateObjkt = await getPirate(objktId);
    return buildPirate(
        pirateObjkt.id,
        pirateObjkt.title,
        pirateObjkt.token_tags,
    );
};

const log = (type, message, meta) => {
    return {type, message, ...meta};
};

const battle = (pirateOne, pirateTwo) => {
    const battleLog = [];
    const players = [pirateOne, pirateTwo];
    battleLog.push(log('start', `${pirateOne.name} vs ${pirateTwo.name}`));
    battleLog.push(log('pirate-one-stats', 'Pirate One Stats', pirateOne));
    battleLog.push(log('pirate-two-stats', 'Pirate Two Stats', pirateTwo));
    let round = 1;
    while(pirateOne.health > 0 && pirateTwo.health > 0) {
        battleLog.push(log('round-start', `Round No. ${round}`));
        round++;
        const playerOneInitiativeRoll = ~~(Math.random() * 20 + pirateOne.initiative);
        const playerTwoInitiativeRoll = ~~(Math.random() * 20 + pirateTwo.initiative);
        const playerOneInitiative = playerOneInitiativeRoll + pirateOne.initiative;
        const playerTwoInitiative = playerTwoInitiativeRoll + pirateTwo.initiative;
        battleLog.push(
            log('initiative-roll', `${pirateOne.name} initiative: ${playerOneInitiative}`,
                {roll: playerOneInitiativeRoll, initiative: pirateOne.initiative}));
        battleLog.push(
            log('initiative-roll', `${pirateTwo.name} initiative: ${playerTwoInitiative}`,
                {roll: playerTwoInitiativeRoll, initiative: pirateTwo.initiative}));
        const playerOrder = playerOneInitiative > playerTwoInitiative ? [0, 1] : [1, 0];
        for(const playerKey of playerOrder) {
            const attacker = players[playerKey];
            const defender = players[(playerKey + 1) % 2];
            const hitRoll = ~~(Math.random() * 100) + 1;
            battleLog.push(log('attack-roll', attacker.name,
                {roll: hitRoll, required: 100 - attacker.hitChance}));
            if(hitRoll <= 100 - attacker.hitChance) {
                battleLog.push(log('missed', attacker.name));
                continue;
            } else {
                battleLog.push(log('hit', attacker.name));
            }
            const dodgeRoll = ~~(Math.random() * 100) + 1;
            battleLog.push(log('dodge-roll', defender.name,
                {roll: dodgeRoll, required: 100 - defender.dodgeChance}));
            if(dodgeRoll >= 100 - defender.dodgeChance) {
                battleLog.push(log('dodged', defender.name));
                continue;
            }
            const damageRoll = ~~(4 + Math.random() * 12);
            const damage = damageRoll + attacker.damage;
            defender.health -= damage;
            battleLog.push(log('damage-roll', `${attacker.name} dealt ${damage} damage`,
                {roll: damageRoll, modifier: attacker.damage, defenderHealth: defender.health}));
            if(defender.health <= 0) {
                battleLog.push(log('knocked-out', defender.name));
                battleLog.push(log('victory', attacker.name));
                break;
            }
        }
        battleLog.push(log('round-end',
            `${pirateOne.name}, health ${~~pirateOne.health} : ${pirateTwo.name}, health ${~~pirateTwo.health}`));
    }

    return battleLog;
};

const pirateBattle = async(objktIdOne, objktIdTwo) => {
    const pirateOne = await makePirate(objktIdOne);
    const pirateTwo = await makePirate(objktIdTwo);

    return battle(pirateOne, pirateTwo)
};

module.exports = pirateBattle;
