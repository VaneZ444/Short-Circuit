"use strict";
//////////////////////////////////////////////ПЕРЕМЕННЫЕ////////////////////////////////////////////
//звуки
let pistol_shoot = new Audio("sfx/pistol_shoot.mp3");
let pistol_reload = new Audio("sfx/pistol_reload.mp3");
let shotgun_shoot = new Audio("sfx/shotgun_shoot.mp3");
let shotgun_add_shell = new Audio("sfx/shotgun_add_shell.mp3");
let shotgun_pump = new Audio("sfx/shotgun_pump.mp3");
let rifle_shoot = new Audio("sfx/rifle_shoot.mp3");
let rifle_reload = new Audio("sfx/rifle_reload.mp3");
let pickup = new Audio("sfx/pickup.mp3");
let door = new Audio("sfx/door.mp3");
let robot_ping = new Audio("sfx/robot_ping.mp3");
let turret = new Audio("sfx/turret.mp3");
let sodacan = new Audio("sfx/sodacan.mp3");
let melody = new Audio("sfx/ambient.mp3")
//Игровые объекты
let optionScreen;
let menuScreen;
let keysScreen
let restartScreen;
let startScreen;
let menuButton = 1;
//Состояния меню
let ctx;
let music = true;
let option = false
let keys = false
let chosenDifficulty = 2;
let difficulty;
let oldX;
let oldY;
let propid = -1;
let enemyid = -1;
let itemid = -1;
//комната
let roomCounter = 0;
let optionRow = 1;
let bulletIdCounter = 0;
let propIdCounter = 0;
let itemIdCounter = 0;
let enemyIdCounter = 0;
let mousePosX;
let mousePosY;
let roomCurrProps = [];
let roomCurrItems = [];
let roomCurrEnemies = [];
let bullets = [];
let player;
let ui_Bcg;
let roomCurr;
let ui_Pistol;
let ui_Shotgun;
let ui_Rifle;
//состояния
let startMenu = true;
let GameOver = true;
let ke = 0;
let k = 0;
let InputRegistered = false;
let shiftPressed = false;
let playerPumps = false;
let mousePressed = false;
let shotgunChamber = true;
let shotgun = false;
let rifle = false;
let weapon = 1; //выбранное оружие
let playerReloads = false;
//размеры магазинов
const pistolMag = 8;
const shotgunMag = 5;
const rifleMag = 25;

//патроны в магазине
let pistolMagCurr = 8;
let shotgunMagCurr = 5;
let rifleMagCurr = 25;

//патроны в запасе
let shotgunAmmo = 0;
let rifleAmmo = 0;

//статы игрока
const playerHealthMax = 100;
let playerHealth = 0;
let score = -100;
if (localStorage.getItem('highscore') === undefined) {
    localStorage.setItem('highscore', 0);
}
//передвижение
let playerAims = false;
let moveUp;
let moveDown;
let moveLeft;
let moveRight;
let moveSpeed = 2;
let angle = 0;
//переменные для анимаций
let playerSprite = "sprites/ui/pistol.png";
let pistolSprite = "sprites/ui/pistol.png";
let rifleSprite = "sprites/ui/rifle_empty.png";
let shotgunSprite = "sprites/ui/shotgun_empty.png";

////////////////////////////////////////////СТАРТ////////////////////////////////////////////
function startGame(playerSprite) {

    GameField.start();

    player = new Component(61, 70, playerSprite, 300 - (61) / 2, 300 - (70) / 2, "player", 0);
    ui_Pistol = new Component(71, 49, pistolSprite, 10, 10, "ui_pistol", 0);
    ui_Shotgun = new Component(144, 47, shotgunSprite, 91, 10, "ui_shotgun", 0);
    ui_Rifle = new Component(175, 55, rifleSprite, 246, 5, "ui_rifle", 0);
    roomCurr = new Component(600, 600, "sprites/enviroment/floor.png", 0, 0, "room", 0);
    restartScreen = new Component(600, 600, "sprites/ui/restart.png", 0, 0, "ui", 0);
    startScreen = new Component(600, 600, "sprites/ui/enter.png", 0, 0, "ui", 0);
    menuScreen = new Component(600, 600, "sprites/ui/menu.png", 0, 0, "ui", 0);
    optionScreen = new Component(600, 600, "sprites/ui/menu_options.png", 0, 0, "ui", 0);
    keysScreen = new Component(600, 600, "sprites/ui/menu_keys.png", 0, 0, "ui", 0);
    //инпуты
    window.addEventListener("keydown", handlePress)
    window.addEventListener("keyup", handleRel)
    window.addEventListener("mousedown", handleMousePress)
    window.addEventListener("mouseup", handleMouseRel)
}


//////////////////////////////////////////////СОЗДАНИЕ ПОЛЯ////////////////////////////////////////////
let GameField = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        clearInterval(GameField.interval);
        this.interval = setInterval(updateGameField, 20);
        this.canvas.id = "Window";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        let h1Element = document.querySelector(".title");
        h1Element.insertAdjacentElement("beforebegin", this.canvas);

        let canvas = document.getElementById('Window')
        var myFont = new FontFace('PixelCode', 'url(fonts/PixelCode-Thin.otf)');

        myFont.load().then(function (font) {
            document.fonts.add(font);
            console.log('Font loaded');
        });
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
////////////////////////////////////////////ОТРИСОВКА/////////////////////////////////////////////////
function Component(width, height, source, x, y, type, angle = 0) {
    this.type = type;
    this.angle = angle;

    if (type === "room" || type === "ui" || type === "ui_shotgun" || type === "ui_pistol" || type === "ui_rifle") {
        this.image = new Image();
        this.image.src = source;
    }
    else if (type === "player") {
        this.image = new Image();
        this.image.src = playerSprite;
    }

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.update = function () {
        let ctx = GameField.context;
        ctx.imageSmoothingEnabled = false;

        ctx.save();

        if (k > 20 && mousePressed && (!GameOver)) { //автоогонь
            k = 0;
            rifleFire();
        } else {
            k++;
        }
        //Поворот игрока в зависимости от мыши
        if (type === "player") {
            ctx.translate(this.x + this.width / 2, this.y - 3 * this.height / 4);
        } else {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        }
        ctx.rotate(this.angle);
        if (type === "room") {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            GameField.context.fillStyle = "#FFFFFF";
            GameField.context.font = "15pt PixelCode"
            GameField.context.fillText(`➕ ${playerHealth}`, 200, -260)
            GameField.context.fillText(`${rifleMagCurr}/${rifleAmmo}`, 0, -220)
            GameField.context.fillText(`${pistolMagCurr}/∞`, -270, -220)
            GameField.context.fillText(`${shotgunMagCurr}/${shotgunAmmo}`, -160, -220)
            GameField.context.fillText(`Счет: ${score}`, 130, -195)
            GameField.context.fillText(`Комната: ${roomCounter}`, 130, -225)
        }
        if (type === "ui") {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        ////////////////////////////////////////ОТРИСОВКА ИНТЕРФЕЙСА/////////////////////////////////////////////

        if (type === "ui_shotgun") {
            this.image.src = shotgunSprite;
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        if (type === "ui_pistol") {
            this.image.src = pistolSprite;
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        if (type === "ui_rifle") {
            this.image.src = rifleSprite;
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        if (type === "player") {
            this.image.src = playerSprite;
            ctx.drawImage(this.image, -this.width / 2, -3 * this.height / 4, this.width, this.height);



            ///////////////////////////////////////ОТРИСОВКА ПЕРСОНАЖА/////////////////////////////////////////
            if (playerAims === false) {
                if (weapon === 3) {
                    playerSprite = "sprites/player/rifle_idle.png";
                }
                else if (weapon === 2) {
                    playerSprite = "sprites/player/shotgun_idle.png";
                }
                else {
                    playerSprite = "sprites/player/pistol_idle.png";
                }
            } else {
                if (weapon === 3) {
                    playerSprite = "sprites/player/rifle_aim.png";
                }
                else if (weapon === 2) {
                    if (playerPumps) {
                        playerSprite = "sprites/player/shotgun_pump.png";
                    } else {
                        playerSprite = "sprites/player/shotgun_aim.png";
                    }
                }
                else {
                    playerSprite = "sprites/player/pistol_aim.png";
                }
            }

            if (moveUp) {
                this.y -= moveSpeed
            }
            if (moveDown) {
                this.y += moveSpeed
            }
            if (moveLeft) {
                this.x -= moveSpeed
            }
            if (moveRight) {
                this.x += moveSpeed
            }

            for (let bullet of Object.values(bullets)) {
                if (checkEntCollision(bullet.getBulletX(), bullet.getBulletY(), player.x, player.y, "player") && bullet.getBulletType() !== "player") {
                    playerHealth = Math.ceil(playerHealth - Math.floor(15 * difficulty))
                    score = score - 15;
                    let idToDel = bullet.getBulletID();
                    var index = bullets.map(x => {
                        return x.id;
                    }).indexOf(idToDel);
                    bullets.splice(index, 1);
                }
            }
        }
        ctx.restore();
    }
}
////////////////////////////////////////////ОБНОВЛЕНИЕ///////////////////////////////////////////////
function updateGameField() {
    GameField.clear();
    //повороты мышкой
    if (music && InputRegistered) {
        melody.play();
        melody.addEventListener('ended', function () {
            if (music && InputRegistered) {
            this.currentTime = 0;
            this.play();
            }
        }, false);
    } else {
        melody.pause()
        melody.currentTime = 0
    }
    if (InputRegistered){
    if (!GameOver) {
        onmousemove = function (e) {
            mousePosX = e.clientX
            mousePosY = e.clientY
            let rect = GameField.canvas.getBoundingClientRect();
            angle = Math.atan2(e.clientY - player.y - rect.top + player.height * 2 / 4, e.clientX - player.x - rect.left);
            player.angle = angle + Math.PI / 2 - 0.10 * Math.sin(-Math.PI * 3 / 4 + angle);
        };
        if (weapon === 1) {
            pistolSprite = "sprites/ui/pistol_outline.png";
        } else {
            pistolSprite = "sprites/ui/pistol.png";
        }
        if (rifle) {
            if (weapon === 3) {
                rifleSprite = "sprites/ui/rifle_outline.png";
            } else {
                rifleSprite = "sprites/ui/rifle.png";
            }
        }
        if (shotgun) {
            if (weapon === 2) {
                if (shotgunChamber === true) {
                    shotgunSprite = "sprites/ui/shotgun_outline_pumped.png";
                } else {
                    shotgunSprite = "sprites/ui/shotgun_outline.png";
                }
            } else {
                if (shotgunChamber === true) {
                    shotgunSprite = "sprites/ui/shotgun_pumped.png";
                } else {
                    shotgunSprite = "sprites/ui/shotgun.png";
                }
            }
        }
    }
    roomCurr.update();
    ui_Pistol.update();
    ui_Shotgun.update();
    ui_Rifle.update();
    if (playerHealth <= 0) {
        killGame()
    }
    if (!GameOver) {
        for (let enemy of roomCurrEnemies) {
            enemyid = enemy.updateEnemy();
            if (enemyid !== -1) {
                score += 30
                if (enemy.getType() === 3) {
                    spawnItem(enemy.getX() + 20, enemy.getY() + 40, "rifleAmmo")
                }
                var index3 = roomCurrEnemies.map(x => {
                    return x.id;
                }).indexOf(enemyid);

                roomCurrEnemies.splice(index3, 1);
                enemyid = -1;
            }
        }
        for (let prop of roomCurrProps) {
            propid = prop.updateProp()
        }
        for (let item of roomCurrItems) {
            itemid = item.updateItem()
            if (itemid !== -1) {
                var index = roomCurrItems.map(x => {
                    return x.id;
                }).indexOf(itemid);
                roomCurrItems.splice(index, 1);
            }
        }
        for (let bullet of bullets) {
            bullet.updateBullet();
            bullet.drawBullet();
        }
        player.update();
    } else {
        if (startMenu) {
            if (keys) {
                keysScreen.update()
                GameField.context.fillStyle = "#FFFFFF";
                GameField.context.font = "20pt PixelCode"
                if (menuButton === 1) {
                    GameField.context.fillText(`>Начать игру`, 20, 220);
                    GameField.context.fillText(`Настройки`, 40, 280);
                    GameField.context.fillText(`Управление`, 40, 340);
                } else if (menuButton === 2) {
                    GameField.context.fillText(`Начать игру`, 40, 220);
                    GameField.context.fillText(`>Настройки`, 20, 280);
                    GameField.context.fillText(`Управление`, 40, 340);
                } else if (menuButton === 3) {
                    GameField.context.fillText(`Начать игру`, 40, 220);
                    GameField.context.fillText(`Настройки`, 40, 280);
                    GameField.context.fillText(`>Управление`, 20, 340);
                }
            } else if (option) {
                optionScreen.update()
                GameField.context.fillStyle = "#FFFFFF";
                GameField.context.font = "20pt PixelCode"
                GameField.context.fillText(`Начать игру`, 40, 220);
                GameField.context.fillText(`>Настройки`, 20, 280);
                GameField.context.fillText(`Управление`, 40, 340);
                if (optionRow === 1) {
                    if (chosenDifficulty === 1) {
                        GameField.context.fillText(`>Сложность :                            `, 100, 400);
                        GameField.context.fillText(`>Легкая<Средняя Сложная`, 82, 440);
                    } else if (chosenDifficulty === 2) {
                        GameField.context.fillText(`>Сложность :                            `, 100, 400);
                        GameField.context.fillText(`Легкая>Средняя<Сложная`, 100, 440);
                    } else if (chosenDifficulty === 3) {
                        GameField.context.fillText(`>Сложность :                            `, 100, 400);
                        GameField.context.fillText(`Легкая Средняя>Сложная<`, 100, 440);
                    }
                    if (music) {
                        GameField.context.fillText(`Музыка :                            `, 100, 500);
                        GameField.context.fillText(` >Включена<  Выключена`, 87, 540);
                    } else {
                        GameField.context.fillText(`Музыка :                            `, 100, 500);
                        GameField.context.fillText(` Включена  >Выключена<`, 105, 540);
                    }
                }
                else if (optionRow === 2) {
                    if (chosenDifficulty === 1) {
                        GameField.context.fillText(`Сложность :                            `, 100, 400);
                        GameField.context.fillText(`>Легкая<Средняя Сложная`, 82, 440);
                    } else if (chosenDifficulty === 2) {
                        GameField.context.fillText(`Сложность :                            `, 100, 400);
                        GameField.context.fillText(`Легкая>Средняя<Сложная`, 100, 440);
                    } else if (chosenDifficulty === 3) {
                        GameField.context.fillText(`Сложность :                            `, 100, 400);
                        GameField.context.fillText(`Легкая Средняя>Сложная<`, 100, 440);
                    }
                    if (music) {
                        GameField.context.fillText(`>Музыка :                            `, 100, 500);
                        GameField.context.fillText(` >Включена<  Выключена`, 87, 540);
                    } else {
                        GameField.context.fillText(`>Музыка :                            `, 100, 500);
                        GameField.context.fillText(` Включена  >Выключена<`, 105, 540);
                    }
                }
            } else {
                menuScreen.update()
                GameField.context.fillStyle = "#FFFFFF";
                GameField.context.font = "20pt PixelCode"
                if (menuButton === 1) {
                    GameField.context.fillText(`Наилучший результат : ${localStorage.highscore}`, 30, 500)
                    GameField.context.fillText(`>Начать игру`, 20, 220);
                    GameField.context.fillText(`Настройки`, 40, 280);
                    GameField.context.fillText(`Управление`, 40, 340);
                } else if (menuButton === 2) {
                    GameField.context.fillText(`Наилучший результат : ${localStorage.highscore}`, 30, 500)
                    GameField.context.fillText(`Начать игру`, 40, 220);
                    GameField.context.fillText(`>Настройки`, 20, 280);
                    GameField.context.fillText(`Управление`, 40, 340);
                } else if (menuButton === 3) {
                    GameField.context.fillText(`Наилучший результат : ${localStorage.highscore}`, 30, 500)
                    GameField.context.fillText(`Начать игру`, 40, 220);
                    GameField.context.fillText(`Настройки`, 40, 280);
                    GameField.context.fillText(`>Управление`, 20, 340);
                }
            }
        } else {
            restartScreen.update()
            GameField.context.fillStyle = "#FFFFFF";
            GameField.context.font = "15pt PixelCode"
            GameField.context.fillText(`Вы проиграли! Результат: ${score} очков.`, 20, 220);
            GameField.context.fillText(`Наилучший результат : ${localStorage.highscore}`, 20, 280)
            GameField.context.fillText(`Нажмите клавишу "R" для перезапуска`, 20, 340);
        }
    }
    } else {
        startScreen.update()
    }
}
////////////////////////////////////////////СЧИТЫВАНИЕ КЛАВИШ////////////////////////////////////////
function handlePress(event) {
    let key = event.keyCode;
    if (InputRegistered) {
        if (!GameOver) {
            if (key === 27) { //escape
                localStorage.highscore = score;
                startMenu = true;
                GameOver = true;
                if (option) {
                    pistol_shoot.currentTime = 0
                    pistol_shoot.play()
                    option = false;
                }
            }
            if (key === 87) { //w
                moveUp = true;
            }
            if (key === 83) {
                moveDown = true; //s
            }
            if (key === 65) {
                moveLeft = true; //a
            }
            if (key === 68) {
                moveRight = true; //d
            }
            if (key === 16) {
                if (playerReloads === false) {
                    playerAims = true; //shift
                    moveSpeed = 0.8;
                }
            }

            if (key === 49) { //pistol
                if (playerReloads === false) {
                    weapon = 1;
                    if (shotgun) {
                        shotgunSprite = "sprites/ui/shotgun.png";
                    }
                    if (rifle) {
                        rifleSprite = "sprites/ui/rifle.png";
                    }
                    pistolSprite = "sprites/ui/pistol_outline.png"
                }
            }
            if (key === 50) { //shotgun
                if (playerReloads === false) {
                    if (shotgun && (shotgunAmmo > 0 || shotgunMagCurr > 0)) {
                        weapon = 2
                        if (rifle) {
                            rifleSprite = "sprites/ui/rifle.png";
                        }
                        pistolSprite = "sprites/ui/pistol.png"
                        shotgunSprite = "sprites/ui/shotgun_outline.png"

                    }
                }
            }

            if (key === 51) { //rifle
                if (playerReloads === false) {
                    if (rifle && (rifleAmmo > 0 || rifleMagCurr > 0)) {
                        weapon = 3
                        rifleSprite = "sprites/ui/rifle_outline.png"
                        pistolSprite = "sprites/ui/pistol.png"
                        if (shotgun) {
                            shotgunSprite = "sprites/ui/shotgun.png";
                        }
                    }
                }
            }
            if (key === 82) {
                reloadCurrent() //r
            }
        } else {
            if (startMenu) {
                if (key === 13) { //Enter
                    if (menuButton === 1) {
                        GameOver = false
                        startMenu = false
                        keys = false
                        option = false
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        restartGame()
                    } else if (menuButton === 2) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        option = true;
                        keys = false
                    } else if (menuButton === 3) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        option = false
                        keys = true
                    }
                }
                if (key === 27) { //escape
                    if (option) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        option = false;
                    }
                    if (keys) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        keys = false;
                    }
                }
                if (key === 38) { //arrowUP
                    if (option) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        optionRow--;
                        if (optionRow === 0) {
                            optionRow = 2
                        }
                    } else {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        keys = false
                        if (menuButton === 1) {
                            menuButton = 3;
                        } else {
                            menuButton--;
                        }
                    }
                }
                if (key === 40) { //arrowDOWN
                    if (option) {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        optionRow++;
                        if (optionRow === 3) {
                            optionRow = 1
                        }
                    } else {
                        pistol_shoot.currentTime = 0
                        pistol_shoot.play()
                        keys = false
                        if (menuButton === 3) {
                            menuButton = 1;
                        } else {
                            menuButton++;
                        }
                    }
                }
                if (key === 37) { //arrowLeft
                    if (option === true) {
                        if (optionRow === 1) {
                            if (chosenDifficulty === 1) {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                chosenDifficulty = 3;
                            } else {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                chosenDifficulty--;
                            }
                        } else {
                            if (music) {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                music = false;
                                melody.pause();
                                melody.currentTime = 0;
                            } else {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                music = true;
                            }
                        }
                    }
                }
                if (key === 39) { //arrowRight
                    if (option === true) {
                        if (optionRow === 1) {
                            if (chosenDifficulty === 3) {
                                chosenDifficulty = 1;
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                            } else {
                                chosenDifficulty += 1;
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                            }
                        } else {
                            if (music) {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                music = false;
                            } else {
                                pistol_shoot.currentTime = 0
                                pistol_shoot.play()
                                music = true;
                            }
                        }
                    }
                }
            } else {
                if (key === 82) {
                    restartGame() //r
                }
                if (key === 27) { //escape
                    startMenu = true;
                }
            }
        }
    } else {
        if (key === 13) { //Enter
                InputRegistered = true;
                pistol_shoot.currentTime = 0
                pistol_shoot.play()
            }
        }
    }
function handleRel(event) {
    let key = event.keyCode;
    if (!GameOver) {
        if (key === 87) { //w
            moveUp = false;
        }
        if (key === 83) {
            moveDown = false; //s
        }
        if (key === 65) {
            moveLeft = false; //a
        }
        if (key === 68) {
            moveRight = false; //d
        }
        if (key === 16) {
            playerAims = false; //shift
            moveSpeed = 2;
        }
    }
}
////////////////////////////////////////////Стрельба 1 : Система патронов (считывание клавиш 2)//////
function handleMousePress() {
    if (!GameOver) {
        mousePressed = true;
        if (playerAims) {
            if (weapon === 1) {
                if (pistolMagCurr > 0) {
                    playerSprite = "sprites/player/pistol_shoot.png";
                    pistolMagCurr--;
                    shootBullet();
                    pistol_shoot.currentTime = 0;
                    pistol_shoot.play();
                }
            } else if (weapon === 2 && !playerPumps) {
                if (shotgunMagCurr > 0 && shotgunChamber === true) {
                    playerSprite = "sprites/player/shotgun_shoot.png";
                    shotgunMagCurr--;
                    shotgunChamber = false;
                    pistol_shoot.currentTime = 0;
                    shotgun_shoot.currentTime = 0;
                    shotgun_shoot.play();
                    shootBuckshot();
                } else {
                    playerPumps = true;
                    shotgun_pump.currentTime = 0;
                    shotgun_pump.play();
                    setTimeout(function () {
                        playerPumps = false;
                        if (shotgunMagCurr > 0) {
                            shotgunChamber = true;
                        }
                    }, 400);
                }
            }
        }
    }
}
function handleMouseRel() {
    mousePressed = false;
}
function rifleFire() {
    if (playerAims) {
        if (weapon === 3) {
            if (mousePressed) {
                if (rifleMagCurr > 0) {
                    playerSprite = "sprites/player/rifle_shoot.png";
                    rifleMagCurr--;
                    GameField.context.fillText(`${rifleMagCurr}/${rifleAmmo}`, 0, -220)
                    shootBullet();
                    rifle_shoot.currentTime = 0;
                    rifle_shoot.play()
                }
            }
        }
    }
}
////////////////////////////////////////////Стрельба 2 :Перезарядка////////////////////////////////////////////
function reloadCurrent() {
    if (weapon === 1 && !playerReloads) { //пистолет
        if (pistolMagCurr !== pistolMag) {
            playerReloads = true;
            playerAims = false;
            moveSpeed = 1.5;
            pistol_reload.currentTime = 0;
            pistol_reload.play()
            setTimeout(function () {
                pistolMagCurr = 8;
                moveSpeed = 2;
                playerReloads = false;
            }, 2455);
        }
    } else if (weapon === 2 && !playerReloads) {
        if (shotgunMagCurr !== shotgunMag && shotgunAmmo !== 0) {
            playerReloads = true;
            playerAims = false;
            moveSpeed = 1.5;
            shotgun_add_shell.currentTime = 0;
            shotgun_add_shell.play()
            setTimeout(function () {
                shotgunMagCurr += 1;
                shotgunAmmo -= 1;
                moveSpeed = 2;
                playerReloads = false;
            }, 323);
        }
    } else if (weapon === 3 && !playerReloads) {
        if (rifleMagCurr !== rifleMag && rifleAmmo !== 0) {
            let ammoCanAdd;
            let ammoNeeded = rifleMag - rifleMagCurr;
            if (ammoNeeded <= rifleAmmo) {
                ammoCanAdd = ammoNeeded;
            } else {
                ammoCanAdd = rifleAmmo;
            }
            playerReloads = true;
            rifle_reload.play()
            playerAims = false;
            moveSpeed = 1.5;
            setTimeout(function () {
                rifleMagCurr += ammoCanAdd;
                rifleAmmo -= ammoCanAdd;
                moveSpeed = 2;
                playerReloads = false;
            }, 3343);
        }
    }
}
////////////////////////////////////////////Стрельба 3 : Пуля////////////////////////////////////////////
class Bullet {
    constructor(x, y, angle, speed, type) {
        bulletIdCounter++;
        this.type = type;
        this.id = bulletIdCounter;
        this.angle = angle + Math.PI / 2;
        this.x = x + player.width * 0.63 - 20 * Math.cos(this.angle);
        this.y = y - player.height * 3 / 4 - 23 * Math.sin(this.angle);
        this.speed = speed;
        this.createdAt = Date.now()
    }

    drawBullet() {
        if (this.type === "player") {
            GameField.context.fillStyle = "orange";
            this.bulletSprite = GameField.context.fillRect(this.x, this.y, 2, 2);
        } else {
            GameField.context.fillStyle = "red";
            this.bulletSprite = GameField.context.fillRect(this.x, this.y, 4, 4)
        }
    }
    getBulletX() {
        return this.x;
    }
    getBulletY() {
        return this.y;
    }
    getBulletID() {
        return this.id;
    }
    getBulletType() {
        return this.type;
    }
    updateBullet() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        setInterval(function checkItems() {
            bullets.forEach(function (item) {
                if (Date.now() - 2000 > item.createdAt) {
                    bullets.shift()
                }
            })
        }, 1000)
    }
}
function shootBullet() {
    bullets.push(new Bullet(player.x, player.y, player.angle, -25, "player"));
}
function shootBuckshot() {
    for (let i = 8; i !== 0; i--) {
        bullets.push(new Bullet(player.x, player.y, player.angle - 0.15 + Math.random() * 0.3, -22 + Math.random() * 3, "player"));
    }
}
////////////////////////////////////////////Противники////////////////////////////////////////////
class Enemy {
    constructor(x, y, type = 1) {
        enemyIdCounter++;
        this.id = enemyIdCounter;
        this.flag = -1;
        this.type = type
        this.angle = 0;
        this.x = x;
        this.y = y;
        if (type === 1) {
            this.speed = 1;
            this.enemyHealth = 5;
            this.source = "sprites/enemy/small.png"
            this.damage = 10 * difficulty;
            this.source2 = "sprites/enemy/small_damaged.png"
        }
        if (type === 2) {
            this.speed = 0.7;
            this.enemyHealth = 12;
            this.source = "sprites/enemy/medium.png"
            this.damage = 20 * difficulty;
            this.source2 = "sprites/enemy/medium_damaged.png"
        }
        if (type === 3) {
            this.speed = 0;
            this.enemyHealth = 10;
            this.source = "sprites/enemy/turret.png"
            this.source2 = "sprites/enemy/turret_damaged.png"
        }
    }
    getType() {
        return this.type;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    updateEnemy() {
        GameField.context.save()
        this.oldX;
        this.oldY;
        this.enemySprite = new Image();
        if (this.enemyHealth < 3) {
            this.enemySprite.src = this.source2;
        } else {
            this.enemySprite.src = this.source;
        }
        this.angle = -Math.atan2(player.x + player.width / 2 - this.enemySprite.width / 2 - this.x, player.y - 3 * player.height / 4 - this.y,) + Math.PI;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);

        for (let bullet of Object.values(bullets)) {
            if (checkEntCollision(bullet.getBulletX(), bullet.getBulletY(), this.x, this.y, "enemy") && (bullet.getBulletType() !== "enemy")) {
                this.enemyHealth--;
                let idToDel = bullet.getBulletID();
                var index = bullets.map(x => {
                    return x.id;
                }).indexOf(idToDel);
                bullets.splice(index, 1);
            }
        }
        for (let prop of Object.values(roomCurrProps)) {
            if (this.x < prop.getPropX2() &&
                this.x + this.enemySprite.width > prop.getPropX() &&
                this.y < prop.getPropY2() &&
                this.y + this.enemySprite.height > prop.getPropY()
            ) {
                this.x = prop.getOldX(this.id)
                this.y = prop.getOldY(this.id)
            } else {
                prop.setOldX(this.x, this.id)
                prop.setOldY(this.y, this.id)
            }
        }
        if (this.enemyHealth <= 0) {
            this.flag = 1;
        }
        if (ke === 40) {
            ke = 0;
            if (checkEntCollision(player.x, player.y, this.x, this.y + 60, "enemy")) {
                playerHealth = Math.ceil(playerHealth - this.damage - Math.round(Math.random() * 5));
                score = Math.ceil(score - this.damage / 5);
            }
            if ((Math.random() < 0.5 * difficulty / 2) && (this.type === 3)) {
                bullets.push(new Bullet(this.x - this.enemySprite.width / 2, this.y + this.enemySprite.height + 10, this.angle, -5, "enemy"));
                turret.currentTime = 0;
                turret.play();
            }
        } else {
            ke++;
        }
        GameField.context.translate(this.x + this.enemySprite.width / 2, this.y + this.enemySprite.height / 2);
        GameField.context.rotate(this.angle);
        GameField.context.translate(-this.x - this.enemySprite.width / 2, -this.y - this.enemySprite.height / 2);
        if (this.flag === -1) {
            GameField.context.drawImage(this.enemySprite, this.x, this.y, this.enemySprite.width, this.enemySprite.height);
            GameField.context.restore();
            return this.flag;
        } else {
            GameField.context.restore();
            return this.id;
        }
    }
}
function spawnEnemy(x, y, type = 1) {
    roomCurrEnemies.push(new Enemy(x, y, type));
}
function spawnEnemyDebug() {
    roomCurrEnemies.push(new Enemy(300, 300, 2));

}
////////////////////////////////////////////Подбираемые////////////////////////////////////////////
class Item {
    constructor(x, y, type = 1) {
        itemIdCounter++;
        this.id = itemIdCounter;
        this.type = type;
        this.x = x;
        this.y = y;
        if (this.type === "random") {
            let rdm = Math.random() * 5;
            if (rdm <= 1 && rdm > 0) {
                this.type = "medkit"
            } else if (rdm <= 2 && rdm > 1) {
                this.type = `rifleAmmo`
            } else if (rdm <= 3 && rdm > 2) {
                this.type = `shotgunAmmo`
            } else if (rdm <= 4 && rdm > 3) {
                this.type = `shotgun`
            } else if (rdm <= 5 && rdm > 4) {
                this.type = `rifle`
            }
        }
        if (this.type === "medkit") {
            this.source = "sprites/enviroment/medkit.png"
        }
        if (this.type === "sodacan") {
            this.source = "sprites/enviroment/sodacan.png"
        }
        if (this.type === `rifleAmmo`) {
            this.source = "sprites/enviroment/ammobag.png"
        }
        if (this.type === `shotgunAmmo`) {
            this.source = "sprites/enviroment/shellbox.png"
        }
        if (this.type === `shotgun`) {
            this.source = "sprites/enviroment/shotgun.png"
        }
        if (this.type === `rifle`) {
            this.source = "sprites/enviroment/rifle.png"
        }
    }

    updateItem() {
        GameField.context.save()
        this.itemSprite = new Image();
        this.itemSprite.src = this.source;
        this.flag = -1;
        if (checkEntCollision(player.x, player.y, this.x, this.y, this.type)) {
            if (this.type === "medkit") {
                if (playerHealth < 100) {
                    this.flag = 1;
                    pickup.currentTime = 0;
                    pickup.play();
                    if (playerHealth + 50 > 100) {
                        playerHealth = 100;
                    } else {
                        playerHealth += 50;
                    }
                }

            }
            if (this.type === "sodacan") {
                if (playerHealth < 100) {
                    this.flag = 1;
                    pickup.currentTime = 0;
                    sodacan.play();
                    if (playerHealth + 10 > 100) {
                        playerHealth = 100;
                    } else {
                        playerHealth += 10;
                    }
                }

            }
            if (this.type === `rifleAmmo`) {
                this.flag = 1;
                pickup.currentTime = 0;
                pickup.play();
                rifleAmmo += Math.ceil(25 * 1 / 4 * difficulty)
            }
            if (this.type === `shotgunAmmo`) {
                this.flag = 1;
                pickup.currentTime = 0;
                pickup.play();
                shotgunAmmo += Math.ceil(5 * 2 / difficulty);
            }
            if (this.type === `shotgun`) {
                this.flag = 1;
                pickup.currentTime = 0;
                pickup.play();
                if (shotgun === true) {
                    shotgunAmmo = Math.ceil(shotgunAmmo + Math.floor(Math.random() * 2) + Math.floor(2 * 2 / difficulty));
                } else {
                    shotgun = true
                }
            }
            if (this.type === `rifle`) {
                this.flag = 1;
                pickup.currentTime = 0;
                pickup.play();
                if (rifle === true) {
                    rifleAmmo = Math.ceil(rifleAmmo + Math.floor(Math.random() * 5) + Math.floor(5 * 2 / difficulty));
                } else {
                    rifle = true;
                }
            }
        }
        if (this.flag === -1) {
            GameField.context.drawImage(this.itemSprite, this.x, this.y, this.itemSprite.width, this.itemSprite.height);
            GameField.context.restore();
            return this.flag;
        } else {
            GameField.context.restore();
            return this.id;
        }
    }
}
function spawnItem(x, y, type) {
    roomCurrItems.push(new Item(x, y, type));
}
////////////////////////////////////////////Коллизия////////////////////////////////////////////
class Prop {
    constructor(x, y, type, width, height) {
        propIdCounter++;
        this.id = propIdCounter;
        this.type = type;
        this.x = x;
        this.y = y;
        this.oldX;
        this.oldY;
        this.oldEnemX = [];
        this.oldEnemY = [];
        this.width = width
        this.height = height
        if (this.type === "chair1") {
            this.source = "sprites/enviroment/chair1.png"
        }
        if (this.type === `chair2`) {
            this.source = "sprites/enviroment/chair2.png"
        }
        if (this.type === `box`) {
            this.source = "sprites/enviroment/box.png"
        }
        if (this.type === `box_wooden`) {
            this.source = "sprites/enviroment/box_wooden.png"
        }
        if (this.type === `doorLocked`) {
            this.source = "sprites/enviroment/door_locked.png"
        }
        if (this.type === `doorLockedH`) {
            this.source = "sprites/enviroment/door_locked_horisontal.png"
        }
        if (this.type === `doorOpen`) {
            this.source = "sprites/enviroment/door_unlocked.png"
        }
        if (this.type === `doorOpenH`) {
            this.source = "sprites/enviroment/door_unlocked_horisontal.png"
        }
        if (this.type === `wall`) {
            this.source = "sprites/enviroment/colbox.png"
        }
        if (this.type === `cupboard`) {
            this.source = "sprites/enviroment/cupboard.png"
        }
        if (this.type === `computers`) {
            this.source = "sprites/enviroment/computers.png"
        }
        if (this.type === `soda`) {
            this.source = "sprites/enviroment/soda.png"
        }
        if (this.type === `table2`) {
            this.source = "sprites/enviroment/table2.png"
        }
        if (this.type === `table1`) {
            this.source = "sprites/enviroment/table1.png"
        }
    }
    getPropX() {
        return this.propX1;
    }
    getPropX2() {
        return this.propX2;
    }
    getPropY() {
        return this.propY1;
    }
    getPropY2() {
        return this.propY2;
    }
    getOldX(id) {
        for (let i = 0; i < this.oldEnemX.length; i++) {
            if (this.oldEnemX[i].id === id) {
                return this.oldEnemX[i].cord;
            }
        }
        return 300;
    }
    getOldY(id) {
        for (let i = 0; i < this.oldEnemY.length; i++) {
            if (this.oldEnemY[i].id === id) {
                return this.oldEnemY[i].cord;
            }
        }
        return 300;
    }
    setOldX(cord, id) {
        let pointExists = false;
        for (let i = 0; i < this.oldEnemX.length; i++) {
            if (this.oldEnemX[i].id === id) {
                this.oldEnemX[i].cord = cord;
                pointExists = true;
                break;
            }
        }

        if (!pointExists) {
            const newPoint = new Point(id, cord);
            this.oldEnemX.push(newPoint);
        }
    }
    setOldY(cord, id) {
        let pointExists = false;
        for (let i = 0; i < this.oldEnemY.length; i++) {
            if (this.oldEnemY[i].id === id) {
                this.oldEnemY[i].cord = cord;
                pointExists = true;
                break;
            }
        }

        if (!pointExists) {
            const newPoint = new Point(id, cord);
            this.oldEnemY.push(newPoint);
        }
    }
    updateProp() {
        GameField.context.save()
        this.propSprite = new Image();
        this.propSprite.src = this.source;
        if (this.type === `wall` || this.type === `doorLocked` || this.type === `doorLockedH` || this.type === `doorOpen` || this.type === `doorOpenH`) {
            GameField.context.drawImage(this.propSprite, this.x, this.y, this.width, this.height);
        } else {
            GameField.context.drawImage(this.propSprite, this.x, this.y, this.propSprite.width, this.propSprite.height);
        }
        GameField.context.restore();


        this.propX1 = this.x
        this.propY1 = this.y

        if (this.type === `wall` || this.type === `doorLocked` || this.type === `doorLockedH` || this.type === `doorOpen` || this.type === `doorOpenH`) {
            this.propX2 = this.x + this.width
            this.propY2 = this.y + this.height
        } else {
            this.propX2 = this.x + this.propSprite.width
            this.propY2 = this.y + this.propSprite.height
        }
        if (
            player.x + 10 < this.propX2 &&
            player.x + 51 > this.propX1 &&
            player.y - 70 < this.propY2 &&
            player.y - 30 > this.propY1
        ) {
            if (this.type === `doorOpen` || this.type === `doorOpenH`) {
                loadNewRoom();
            } else {
                player.x = this.oldX
                player.y = this.oldY
            }
        } else {
            this.oldX = player.x;
            this.oldY = player.y;
        }
        if (this.type === `box_wooden` || this.type === `soda`) {
            for (let bullet of Object.values(bullets)) {
                if (bullet.getBulletX() < this.propX2 &&
                    bullet.getBulletX() > this.propX1 &&
                    bullet.getBulletY() < this.propY2 &&
                    bullet.getBulletY() > this.propY1) {

                    let idToDel = bullet.getBulletID();
                    var index = bullets.map(x => {
                        return x.id;
                    }).indexOf(idToDel);
                    bullets.splice(index, 1);
                    if (this.type === `box_wooden`) {
                        roomCurrItems.push(new Item(this.propX1, this.propY1 + this.propSprite.height / 3, "random"));

                        idToDel = this.id
                        index = roomCurrProps.map(x => {
                            return x.id;
                        }).indexOf(idToDel);
                        roomCurrProps.splice(index, 1);
                    } else {
                        if (this.source === "sprites/enviroment/soda.png") {
                            this.source = "sprites/enviroment/soda_broken.png"
                            roomCurrItems.push(new Item(this.propX1 + this.propSprite.width / 2, this.propY1 + 4 * this.propSprite.height / 3, "sodacan"));
                        }
                    }
                    return;
                }
            }
        }
        if (this.type === `wall` || this.type === "doorLocked" || this.type === "doorLockedH" || this.type === "doorOpen" || this.type === "doorOpenH" || this.type === "box" || this.type === "soda" || this.type === "cupboard" || this.type === "computer") {
            for (let bullet of Object.values(bullets)) {
                if (bullet.getBulletX() < this.propX2 &&
                    bullet.getBulletX() > this.propX1 &&
                    bullet.getBulletY() < this.propY2 &&
                    bullet.getBulletY() > this.propY1) {
                    let idToDel = bullet.getBulletID();
                    var index = bullets.map(x => {
                        return x.id;
                    }).indexOf(idToDel);
                    bullets.splice(index, 1);
                }
            }
        }
    }
}
function Point(id, cord) {
    this.id = id
    this.cord = cord
}
function spawnProp(x, y, type) {
    roomCurrProps.push(new Prop(x, y, type));
}
function checkEntCollision(x1, y1, entX, entY, type) {
    let radialDistance;
    let x2 = entX;
    let y2 = entY;
    if (type === "rifle" ||
        type === "rifleAmmo" ||
        type === "shotgun" ||
        type === "shotgunAmmo" ||
        type === "medkit" ||
        type === "sodacan") {
        x2 = entX - 10;
        y2 = entY + 50;
        radialDistance = Math.sqrt(Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2));
        if (radialDistance < 50) {
            return true;
        }
    } else if (type === "enemy") {
        x2 = entX + 10;
        y2 = entY + 10;
        radialDistance = Math.sqrt(Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2));
        if (radialDistance < 50) {
            return true;
        }
    } else if (type === "player") {
        if (x1 < x2 + 61 &&
            x1 > x2 &&
            y1 < y2 - 30 &&
            y1 > y2 - 71) {
            return true;
        }
    }
}
////////////////////////////////////////////Игровые события////////////////////////////////////////////
function roomInit() {
    roomCurrProps.push(new Prop(0, 65, "wall", 600, 30)); //крышечка верх!
    roomCurrProps.push(new Prop(-60, 123, "wall", 30, 475));//крышечка лево!
    roomCurrProps.push(new Prop(630, 123, "wall", 30, 475));//крышечка право!
    roomCurrProps.push(new Prop(0, 630, "wall", 600, 30)); ///крышечка низ!

    roomCurrProps.push(new Prop(0, 93, "wall", 258, 80));//стенка1 верх!
    roomCurrProps.push(new Prop(340, 93, "wall", 258, 80));//стенка2 верх!

    roomCurrProps.push(new Prop(0, 552, "wall", 258, 80));//стенка1 низ
    roomCurrProps.push(new Prop(340, 552, "wall", 258, 80));//стенка2 низ

    roomCurrProps.push(new Prop(-38, 173, "wall", 80, 140));//стенка1 лево
    roomCurrProps.push(new Prop(-38, 409, "wall", 80, 143));//стенка2 лево

    roomCurrProps.push(new Prop(558, 173, "wall", 80, 140));//стенка1 право
    roomCurrProps.push(new Prop(558, 409, "wall", 80, 143));//стенка2 право

}
let rounded = function (number) {
    return +number.toFixed(3);
}

function loadNewRoom() {
    door.currentTime = 0;
    door.play()
    roomCurrProps = [];
    roomCurrItems = [];
    roomCurrEnemies = [];
    bullets = [];
    roomInit()
    let cameFrom;
    score += 100;
    roomCounter += 1;
    console.log(roomCounter)
    difficulty = rounded(difficulty + 0.03);
    console.log(difficulty)

    if (player.y > 500) {
        cameFrom = 'up'
        player.y = 210
    } else {
        if (player.y < 230) {
            cameFrom = 'down'
            player.y = 610
        } else {
            if (player.x < 50) {
                cameFrom = `right`
                player.x = 535;
            } else {
                cameFrom = `left`
                player.x = 10;
            }
        }
    }

    roomCurrProps.push(new Prop(-4, 313, "doorLocked", 12, 96)); //лево
    roomCurrProps.push(new Prop(590, 314, "doorLocked", 12, 100));// право
    roomCurrProps.push(new Prop(257, 125, "doorLockedH", 86, 12)); //верх
    roomCurrProps.push(new Prop(257, 588, "doorLockedH", 86, 12)); //низ

    if (cameFrom === 'up') {
        let doorsOpen = Math.ceil(Math.random() * 3);
        if (doorsOpen === 1) {
            let doorWay = Math.ceil(Math.random() * 3);
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(586, 314, "doorOpen", 14, 100));

            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));

            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));

            }
        } else if (doorsOpen === 2) {
            let doorWay = Math.ceil(Math.random() * 3);
            let doorWaytwo = Math.ceil(Math.random() * 3);
            if (doorWaytwo === doorWay) {
                if (doorWaytwo === 3) {
                    doorWay = 2
                } else if (doorWaytwo === 2) {
                    doorWay = 1
                } else if (doorWaytwo === 1) {
                    doorWay = 3
                }
            }
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(586, 314, "doorOpen", 14, 100));

            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));

            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));

            }
            if (doorWaytwo === 1) {
                roomCurrProps.push(new Prop(586, 314, "doorOpen", 14, 100));

            } else if (doorWaytwo === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));

            } else if (doorWaytwo === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));

            }
        } else if (doorsOpen === 3) {
            roomCurrProps.push(new Prop(586, 314, "doorOpen", 14, 100));
            roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
        }
    } else if (cameFrom === 'down') {
        {
            let doorsOpen = Math.ceil(Math.random() * 3);
            if (doorsOpen === 1) {
                let doorWay = Math.ceil(Math.random() * 3);
                if (doorWay === 1) {
                    roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
                } else if (doorWay === 2) {
                    roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
                } else if (doorWay === 3) {
                    roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
                }
            } else if (doorsOpen === 2) {
                let doorWay = Math.ceil(Math.random() * 3);
                let doorWaytwo = Math.ceil(Math.random() * 3);
                if (doorWaytwo === doorWay) {
                    if (doorWaytwo === 3) {
                        doorWay = 2
                    } else if (doorWaytwo === 2) {
                        doorWay = 1
                    } else if (doorWaytwo === 1) {
                        doorWay = 3
                    }
                }
                if (doorWay === 1) {
                    roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
                } else if (doorWay === 2) {
                    roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
                } else if (doorWay === 3) {
                    roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
                }
                if (doorWaytwo === 1) {
                    roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
                } else if (doorWaytwo === 2) {
                    roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
                } else if (doorWaytwo === 3) {
                    roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
                }
            } else if (doorsOpen === 3) {
                roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
            }
        }

    } else if (cameFrom === 'left') {
        let doorsOpen = Math.ceil(Math.random() * 3);
        if (doorsOpen === 1) {
            let doorWay = Math.ceil(Math.random() * 3);
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100)); // право
            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14)); // низ
            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            }
        } else if (doorsOpen === 2) {
            let doorWay = Math.ceil(Math.random() * 3);
            let doorWaytwo = Math.ceil(Math.random() * 3);
            if (doorWaytwo === doorWay) {
                if (doorWaytwo === 3) {
                    doorWay = 2
                } else if (doorWaytwo === 2) {
                    doorWay = 1
                } else if (doorWaytwo === 1) {
                    doorWay = 3
                }
            }
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100)); //право
            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            }
            if (doorWaytwo === 1) {
                roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
            } else if (doorWaytwo === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            } else if (doorWaytwo === 3) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            }
        } else if (doorsOpen === 3) {
            roomCurrProps.push(new Prop(588, 314, "doorOpen", 14, 100));
            roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
        }

    } else if (cameFrom === 'right') {
        let doorsOpen = Math.ceil(Math.random() * 3);
        if (doorsOpen === 1) {
            let doorWay = Math.ceil(Math.random() * 3);
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
            }
        } else if (doorsOpen === 2) {
            let doorWay = Math.ceil(Math.random() * 3);
            let doorWaytwo = Math.ceil(Math.random() * 3);
            if (doorWaytwo === doorWay) {
                if (doorWaytwo === 3) {
                    doorWay = 2
                } else if (doorWaytwo === 2) {
                    doorWay = 1
                } else if (doorWaytwo === 1) {
                    doorWay = 3
                }
            }
            if (doorWay === 1) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            } else if (doorWay === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            } else if (doorWay === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
            }
            if (doorWaytwo === 1) {
                roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            } else if (doorWaytwo === 2) {
                roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            } else if (doorWaytwo === 3) {
                roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
            }
        } else if (doorsOpen === 3) {
            roomCurrProps.push(new Prop(257, 125, "doorOpenH", 86, 14));
            roomCurrProps.push(new Prop(257, 586, "doorOpenH", 86, 14));
            roomCurrProps.push(new Prop(0, 313, "doorOpen", 14, 96));
        }

    }
    loadRandomTemplate();
}
function killGame() {
    GameOver = true;
    if (score > localStorage.highscore) {
        localStorage.setItem('highscore', score)
    }
}
function restartGame() {
    GameOver = false;
    score = -100
    restartPlayer()
    loadNewRoom()
}
function restartPlayer() {
    difficulty = chosenDifficulty;
    moveDown = false
    moveLeft = false
    moveRight = false
    moveUp = false
    moveSpeed = 2;
    playerAims = false
    player.x = 270
    player.y = 125
    playerHealth = 100
    weapon = 1;
    shotgun = false;
    rifle = false;
    pistolMagCurr = 8;
    shotgunAmmo = 0;
    shotgunChamber = true;
    shotgunMagCurr = 5;
    rifleMagCurr = 25;
    rifleAmmo = 0;
    roomCounter = 0;
    bulletIdCounter = 0;
    propIdCounter = 0;
    itemIdCounter = 0;
    enemyIdCounter = 0;
    shotgunSprite = "sprites/ui/shotgun_empty.png"
    rifleSprite = "sprites/ui/rifle_empty.png"
    roomCurrProps = [];
    roomCurrItems = [];
    roomCurrEnemies = [];
    score = 0;
    updateGameField()
}
function loadTemplate(roomName) {
    roomTemplates[roomName]();
}
function loadRandomTemplate() {
    const roomNames = Object.keys(roomTemplates);
    const randomIndex = Math.floor(Math.random() * roomNames.length);
    const randomRoomName = roomNames[randomIndex];
    roomTemplates[randomRoomName]();

}
////////////////////////////////////////////ШАБЛОНЫ КОМНАТ////////////////////////////////////////////
const roomTemplates = {
    room1: () => {
        spawnProp(70, 175, "box_wooden");
        spawnProp(70, 235, "chair1");
        spawnProp(100, 235, "chair1");
        spawnProp(436, 175, "box_wooden");
        spawnProp(436, 245, "box");
        spawnProp(360, 175, "box");
        spawnProp(360, 245, "box_wooden");
        spawnItem(506, 210, "shotgunAmmo");
        spawnProp(488, 450, "box");
        spawnProp(420, 450, "box_wooden");
        spawnProp(500, 510, "chair1");
        spawnEnemy(120, 480, 3)
        spawnEnemy(280, 229, 1)
        spawnEnemy(320, 229, 1)
    },
    room2: () => {
        spawnProp(175, 460, "chair1");
        spawnProp(160, 485, "table1");
        spawnProp(485, 485, "box")
        spawnProp(195, 180, "chair2");
        spawnProp(450, 175, "soda");
        spawnProp(45, 176, "box_wooden");
        spawnProp(115, 176, "box");
        spawnItem(200, 210, "medkit");
        spawnEnemy(280, 350, 1)
        spawnEnemy(380, 250, 1)
        spawnEnemy(400, 450, 3)
    },
    room3: () => {
        spawnProp(43, 174, "computers")
        spawnItem(60, 221, "medkit")
        spawnProp(409, 174, "cupboard")
        spawnProp(505, 184, "chair1")
        spawnProp(86, 495, "table1")
        spawnProp(106, 452, "chair1")
        spawnItem(462, 231, "shotgun")
        spawnProp(462, 472, "box")
        spawnEnemy(440, 402, 2)
        spawnEnemy(180, 472, 2)
        spawnEnemy(300, 361, 1)
    },
    room4: () => {
        spawnProp(86, 180, "table2")
        spawnProp(45, 180, "chair1")
        spawnProp(176, 180, "chair1")
        spawnProp(343, 176, "soda")
        spawnProp(453, 176, "soda")
        spawnProp(386, 472, "table1")
        spawnProp(472, 472, "table1")
        spawnProp(408, 428, "chair1")
        spawnProp(492, 428, "chair1")
        spawnProp(64, 472, "box_wooden")
        spawnItem(455, 428, "medkit")
        spawnEnemy(159, 472, 2)
        spawnEnemy(470, 265, 1)
    },
    room5: () => {
        spawnProp(393, 174, "cupboard")
        spawnProp(476, 174, "cupboard")
        spawnProp(46, 174, "cupboard")
        spawnProp(129, 174, "cupboard")
        spawnProp(46, 418, "cupboard")
        spawnProp(476, 418, "cupboard")
        spawnProp(129, 418, "box")
        spawnProp(409, 418, "box")
        spawnItem(86, 250, "rifleAmmo")
        spawnItem(429, 250, "shotgunAmmo")
        spawnItem(86, 505, "medkit")
        spawnItem(480, 505, "random")
        spawnEnemy(279, 328, 3)
        spawnEnemy(203, 355, 1)
        spawnEnemy(376, 355, 1)
    },
    room6: () => {
        spawnProp(43, 174, "computers")
        spawnProp(383, 174, "computers")
        spawnProp(220, 174, "chair2")
        spawnProp(343, 174, "chair2")
        spawnProp(43, 408, "computers")
        spawnProp(43, 505, "table1")
        spawnProp(129, 505, "table1")
        spawnProp(53, 452, "chair2")
        spawnItem(109, 462, "medkit")
        spawnProp(492, 482, "box_wooden")
        spawnProp(407, 482, "box")
        spawnEnemy(492, 432, 2)
        spawnEnemy(159, 259, 1)
        spawnEnemy(456, 259, 1)
    },
    room7: () => {
        spawnProp(86, 180, "table2")
        spawnProp(45, 180, "chair1")
        spawnProp(176, 180, "chair1")
        spawnProp(343, 176, "soda")
        spawnProp(453, 176, "soda")
        spawnProp(386, 472, "table1")
        spawnProp(472, 472, "table1")
        spawnProp(408, 428, "chair1")
        spawnProp(492, 428, "chair1")
        spawnProp(64, 472, "box_wooden")
        spawnItem(455, 428, "rifle")
        spawnEnemy(159, 472, 2)
        spawnEnemy(470, 265, 1)
    },
    room8: () => {
        spawnProp(446, 200, "table1")
        spawnProp(405, 195, "chair1")
        spawnProp(106, 480, "table2")
        spawnProp(65, 480, "chair1")
        spawnItem(405, 220, "sodacan")
        spawnProp(45, 180, "chair1")
        spawnEnemy(240, 329, 1)
        spawnEnemy(360, 329, 1)
        spawnProp(130,180,"box_wooden")
        spawnItem(456, 230, "rifle")
    },
    room9: () => {
        spawnProp(446, 200, "table2")
        spawnProp(405, 195, "chair2")
        spawnProp(106, 480, "table1")
        spawnProp(65, 480, "chair2")
        spawnItem(470, 520, "random")
        spawnProp(65, 180, "chair2")
        spawnEnemy(240, 329, 1)
        spawnEnemy(360, 329, 1)
        spawnProp(430,430,"box")
    },
    room10: () => {
        spawnProp(445, 225, "chair1")
        spawnProp(485, 225, "chair1")
        spawnProp(446, 240, "table2")

        spawnProp(85, 225, "chair1")
        spawnProp(125, 225, "chair1")
        spawnProp(86, 240, "table2")
        spawnItem(480,530, "random")
        spawnProp(85, 425, "chair1")
        spawnProp(125, 425, "chair1")
        spawnProp(86, 440, "table1")

        spawnProp(445, 425, "chair1")
        spawnProp(485, 425, "chair1")
        spawnProp(446, 440, "table1")
        spawnItem(60,190, "random")
        spawnEnemy(350,350, 2)
        spawnEnemy(400,220, 3)
    },
    room11: () => {
        spawnProp(445, 170, "soda")

        spawnProp(85, 225, "chair1")
        spawnProp(125, 225, "chair1")
        spawnProp(86, 240, "table2")
        spawnItem(480,530, "random")
        spawnProp(85, 425, "chair1")
        spawnProp(125, 425, "chair1")
        spawnProp(86, 440, "table1")

        spawnProp(445, 425, "chair1")
        spawnProp(485, 425, "chair1")
        spawnProp(446, 440, "table1")
        spawnItem(60,190, "random")
        spawnEnemy(350,350, 2)
        spawnEnemy(400,220, 1)
    },
    room12: () => {
        spawnProp(364,364,"box")
        spawnProp(364,300,"box")
        spawnProp(364,236,"box")
        spawnProp(300,236,"box")
        spawnProp(236,236,"box")
        spawnProp(172,300,"box")
        spawnProp(172,364,"box")
        spawnProp(172,236,"box")
        spawnEnemy(70,480, 3)
        spawnEnemy(480,200, 3)
        spawnItem(280,350,"rifle")
        spawnItem(320,320,"rifleAmmo")
        spawnItem(290,320,"rifleAmmo")
        spawnItem(260,320,"rifleAmmo")
    },
};
