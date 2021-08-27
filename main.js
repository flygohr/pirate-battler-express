const pirateIdOne = document.getElementById('pirateIdOne');
const pirateIdTwo = document.getElementById('pirateIdTwo');
const fightButton = document.getElementById('fightButton');
const logView = document.getElementById('logView');
const missedMessages = [
    'Nearly took his own eye out.',
    'Swung aimlessly in the air.',
    'Couldn\'t hit a barn door…',
];
const hitMessages = [
    'Somehow managed to land a blow.',
    'Delivers sweeping strike. ',
    'Stabbed them with pointy end.',
];
const dodgeMessages = [
    'Deftly side steps the attack.',
    'Pirouettes away from danger.',
    'Ducks under the clumsy swipe',
];
const knockedOutMessages = [
    'Curls up in a ball on the floor and sobs.',
    'Falls face first to the ground.',
    'Runs away screaming for his mother.',
];
const victoryMessages = [
    'Looks smug',
    'Does a little jig',
    'Will never stop gloating about this.'
];
let interval;

fightButton.onclick = async () => {
    if (interval) clearInterval(interval);
    if (!(pirateIdOne.value && pirateIdTwo.value)) {
        alert('Please enter the objkt ids for both pirates');
        return;
    }
    if (!(/\d+/.test(pirateIdOne.value) && /\d+/.test(pirateIdTwo.value))) {
        alert('Objkt ids must be numbers');
        return;
    }
    const response = await fetch(
        `https://pirate-battler-express.orderandchaos.repl.co/fight?pirates=${pirateIdOne.value},${pirateIdTwo.value}`
    );
    const battleLog = await response.json();
    let i = 0;
    interval = setInterval(() => {
        const logEntry = battleLog[i];
        switch (logEntry.type) {
            case 'pirate-one-stats':
            case 'pirate-two-stats':
                logView.innerHTML = '';
                logView.appendChild(handleStats(logEntry));
                break;
            case 'initiative-roll':
                logView.innerText = handleInitiative(logEntry);
                break;
            case 'attack-roll':
                logView.innerText = handleAttackRoll(logEntry);
                break;
            case 'dodge-roll':
                logView.innerText = handleDodgeRoll(logEntry);
                break;
            case 'damage-roll':
                logView.innerText = handleDamageRoll(logEntry);
                break;
            case 'missed':
                logView.innerText = handleMissed(logEntry);
                break;
            case 'hit':
                logView.innerText = handleHit(logEntry);
                break;
            case 'dodged':
                logView.innerText = handleDodge(logEntry);
                break;
            case 'knocked-out':
                logView.innerText = handleKnockOut(logEntry);
                break;
            case 'victory':
                logView.innerText = handleVictory(logEntry);
                break;
            default:
                logView.innerText = logEntry.message;
        }
        i++;
        if (i === battleLog.length) clearInterval(interval);
    }, 2000);

};

function handleStats(logEntry) {
    const div = document.createElement('div');
    const title = document.createElement('h3');
    const ul = document.createElement('ul');
    const id = document.createElement('li');
    id.innerText = `Objkt ID: ${logEntry.id}`;
    const name = document.createElement('li');
    name.innerText = `Name: ${logEntry.name}`;
    const damage = document.createElement('li');
    damage.innerText = `Damage: ${logEntry.damage}`;
    const hitChance = document.createElement('li');
    hitChance.innerText = 'Hit Chance: ' + logEntry.hitChance;
    const health = document.createElement('li');
    health.innerText = `Health: ${logEntry.health}`;
    const initiative = document.createElement('li');
    initiative.innerText = `Initiative: ${logEntry.initiative}`;
    const dodgeChance = document.createElement('li');
    dodgeChance.innerText = `Dodge Chance: ${logEntry.dodgeChance}`;
    div.appendChild(ul);
    div.appendChild(title);
    ul.appendChild(name);
    ul.appendChild(id);
    ul.appendChild(health);
    ul.appendChild(initiative);
    ul.appendChild(hitChance);
    ul.appendChild(damage);
    ul.appendChild(dodgeChance);
    return ul;
}

function handleInitiative(logEntry) {
    return logEntry.message;
}

function handleAttackRoll({
    message,
    required,
    roll
}) {
    const result = roll >= required ? 'Success' : 'Failure';
    return `${message} Attack Roll: ${roll} Required: ${required}, ${result}`;
}

function handleDodgeRoll({
    message,
    required,
    roll
}) {
    const result = roll >= required ? 'Success' : 'Failure';
    return `${message} Dodge Roll: ${roll} Required: ${required}, ${result}`;
}

function handleDamageRoll({
    message,
    modifier,
    roll
}) {
    const totalDamage = roll + modifier;
    return `${message} Damage Roll: ${roll}, Modifier: ${modifier}, Total: ${totalDamage}`;
}

function handleMissed(logEntry) {
    return logEntry.message + ' ' + missedMessages[~~(Math.random() * missedMessages.length)];
}

function handleHit(logEntry) {
    return logEntry.message + ' ' + hitMessages[~~(Math.random() * hitMessages.length)];
}

function handleDodge(logEntry) {
    return logEntry.message + ' ' + dodgeMessages[~~(Math.random() * dodgeMessages.length)];
}

function handleKnockOut(logEntry) {
    return logEntry.message + ' ' + knockedOutMessages[~~(Math.random() * knockedOutMessages.length)];
}

function handleVictory(logEntry) {
    return logEntry.message + ' ' + victoryMessages[~~(Math.random() * victoryMessages.length)];
}