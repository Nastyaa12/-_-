const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const message = document.getElementById('message');
const counter = document.getElementById('counter');
const backButton = document.getElementById('back-button');

const trashImages = [
    './assets/img/canned-food_15539388.png',
    './assets/img/bottle_296684.png',
    './assets/img/plastic-bag_11841028.png',
    './assets/img/banana_15690379.png',
    './assets/img/apple-core_16944382.png'
];

let collectedTrash = 0;
let activeTrash = null;
let startX, startY;

for (let i = 0; i < 5; i++) {
    createTrash(i);
}

function createTrash(index) {
    const trash = document.createElement('div');
    trash.className = 'trash';
    trash.id = `trash-${index}`;
    trash.style.backgroundImage = `url('${trashImages[index]}')`;
    
    gameContainer.appendChild(trash);
    
    const pos = getRandomPosition(trash);
    trash.style.left = `${pos.x}px`;
    trash.style.top = `${pos.y}px`;
    

    trash.addEventListener('mousedown', handleStart);
    trash.addEventListener('touchstart', handleStart, { passive: false });
}

function getRandomPosition(trashElement) {
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    const trashWidth = trashElement.offsetWidth;
    const trashHeight = trashElement.offsetHeight;
    

    const margin = 0.15;
    const safeZone = {
        left: containerWidth * margin,
        right: containerWidth - trashWidth - (containerWidth * margin),
        top: containerHeight * margin,
        bottom: containerHeight - trashHeight - (containerHeight * margin)
    };


    const positionType = Math.random() < 1 ? 'edge' : 'center';
    
    let x, y;
    
    if (positionType === 'edge') {

        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0:
                x = Math.random() * (safeZone.right - safeZone.left) + safeZone.left;
                y = safeZone.top;
                break;
            case 1:
                x = safeZone.right;
                y = Math.random() * (safeZone.bottom - safeZone.top) + safeZone.top;
                break;
            case 2:
                x = Math.random() * (safeZone.right - safeZone.left) + safeZone.left;
                y = safeZone.bottom;
                break;
            case 3:
                x = safeZone.left;
                y = Math.random() * (safeZone.bottom - safeZone.top) + safeZone.top;
                break;
        }
    } else {

        x = Math.random() * (safeZone.right - safeZone.left) + safeZone.left;
        y = Math.random() * (safeZone.bottom - safeZone.top) + safeZone.top;
    }
    
    return { x, y };
}


function handleStart(e) {
    e.preventDefault();
    activeTrash = e.target;
    
    const rect = activeTrash.getBoundingClientRect();
    if (e.type === 'mousedown') {
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    } else {
        const touch = e.touches[0];
        startX = touch.clientX - rect.left;
        startY = touch.clientY - rect.top;
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }
}

function handleMove(e) {
    if (!activeTrash) return;
    e.preventDefault();
    
    const containerRect = gameContainer.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    
    let x = clientX - startX - containerRect.left;
    let y = clientY - startY - containerRect.top;

    x = Math.max(0, Math.min(x, containerRect.width - activeTrash.offsetWidth));
    y = Math.max(0, Math.min(y, containerRect.height - activeTrash.offsetHeight));
    
    activeTrash.style.left = `${x}px`;
    activeTrash.style.top = `${y}px`;
}

function handleEnd() {
    if (!activeTrash) return;
    
    checkBasketDrop();
    
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
    
    activeTrash = null;
}

function checkBasketDrop() {
    const trashRect = activeTrash.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    
    if (
        trashRect.right > basketRect.left &&
        trashRect.left < basketRect.right &&
        trashRect.bottom > basketRect.top &&
        trashRect.top < basketRect.bottom
    ) {
        if (!activeTrash.classList.contains('collected')) {
            activeTrash.classList.add('collected');
            activeTrash.style.display = 'none';
            collectedTrash++;
            counter.textContent = `${collectedTrash}/5`;
            
            if (collectedTrash === 5) {
                showCongratulations();
            }
        }
    }
}

function showCongratulations() {
    message.style.opacity = '1';
    
    setTimeout(() => {
        message.style.opacity = '0';
        resetGame();
    }, 2000);
}

function resetGame() {
    document.querySelectorAll('.trash').forEach(trash => trash.remove());
    for (let i = 0; i < 5; i++) {
        createTrash(i);
    }
    collectedTrash = 0;
    counter.textContent = `0/5`;
}

window.addEventListener('resize', function() {
    document.querySelectorAll('.trash:not(.collected)').forEach(trash => {
        const pos = getRandomPosition(trash);
        trash.style.left = `${pos.x}px`;
        trash.style.top = `${pos.y}px`;
    });
});