"use strict";
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let mag = this.magnitude();
        if (mag !== 0) {
            this.divide(mag);
        }
    }

    static distance(vectorA, vectorB) {
        return Math.sqrt(Math.pow(vectorB.x - vectorA.x, 2) + Math.pow(vectorB.y - vectorA.y, 2));
    }
}
class Collider {
    static checkCollision(objA, objB) {
        return (
            objA.position.x < objB.position.x + objB.size.x &&
            objA.position.x + objA.size.x > objB.position.x &&
            objA.position.y < objB.position.y + objB.size.y &&
            objA.position.y + objA.size.y > objB.position.y
        );
    }

    static resolveCollision(objA, objB) {
        
        let overlapX = Math.min(
            Math.abs(objA.position.x + objA.size.x - objB.position.x),
            Math.abs(objB.position.x + objB.size.x - objA.position.x)
        );
        let overlapY = Math.min(
            Math.abs(objA.position.y + objA.size.y - objB.position.y),
            Math.abs(objB.position.y + objB.size.y - objA.position.y)
        );

        
        if (overlapX < overlapY) {
            if (objA.position.x < objB.position.x) {
                objA.position.x = objB.position.x - objA.size.x;
            } else {
                objA.position.x = objB.position.x + objB.size.x;
            }
        } else {
            if (objA.position.y < objB.position.y) {
                objA.position.y = objB.position.y - objA.size.y;
            } else {
                objA.position.y = objB.position.y + objB.size.y;
            }
        }
    }
}
class SoundEvents {
    static sounds = {
        pistol_shoot: new Audio("sfx/pistol_shoot.mp3"),
        pistol_reload: new Audio("sfx/pistol_reload.mp3"),
        shotgun_shoot: new Audio("sfx/shotgun_shoot.mp3"),
        shotgun_add_shell: new Audio("sfx/shotgun_add_shell.mp3"),
        shotgun_pump: new Audio("sfx/shotgun_pump.mp3"),
        rifle_shoot: new Audio("sfx/rifle_shoot.mp3"),
        rifle_reload: new Audio("sfx/rifle_reload.mp3"),
        pickup: new Audio("sfx/pickup.mp3"),
        door: new Audio("sfx/door.mp3"),
        robot_ping: new Audio("sfx/robot_ping.mp3"),
        turret: new Audio("sfx/turret.mp3"),
        sodacan: new Audio("sfx/sodacan.mp3"),
        melody: new Audio("sfx/ambient.mp3"),
        click: new Audio("sfx/click.mp3"),
        hit_melee: new Audio("sfx/hit_melee.mp3"),
        hit_bullet: new Audio("sfx/hit_bullet.mp3"),
        cheats: new Audio("sfx/cheats.mp3"),
        swing: new Audio("sfx/swing.mp3"),
        blade_hit: new Audio("sfx/blade_hit.mp3")
    };

    static musicEnabled = true;

    static playSound(soundName) {
        if (soundName in SoundEvents.sounds) {
            SoundEvents.sounds[soundName].currentTime = 0;
            SoundEvents.sounds[soundName].play();
        } else {
            console.warn(`Sound "${soundName}" not found.`);
        }
    }

    static stopSound(soundName) {
        if (soundName in SoundEvents.sounds) {
            SoundEvents.sounds[soundName].pause();
            SoundEvents.sounds[soundName].currentTime = 0;
        } else {
            console.warn(`Sound "${soundName}" not found.`);
        }
    }

    static playMusic() {
        SoundEvents.sounds.melody.play();
        SoundEvents.sounds.melody.addEventListener('ended', () => {
            if (SoundEvents.musicEnabled) {
                SoundEvents.sounds.melody.currentTime = 0; 
                SoundEvents.sounds.melody.play(); 
            }
        }, false);
    }

    static stopMusic() {
        SoundEvents.musicEnabled = false;
        if (SoundEvents.sounds.melody) {
            SoundEvents.sounds.melody.pause();
            SoundEvents.sounds.melody.currentTime = 0;
        }
    }
}
class InputEvents{
    static handlePress(event) {
        let key = event.keyCode;
        if (Game.state === 'Game') {
            switch (key) {
                case 27: 
                    Game.pause();
                    break;
            
                case 87: 
                    Game.player.moveUp = true;
                    break;

                case 83: 
                    Game.player.moveDown = true;
                    break;

                case 65: 
                    Game.player.moveLeft = true;
                    break;

                case 68: 
                    Game.player.moveRight = true;
                    break;

                case 16: 
                    Game.player.startAiming();
                    break;

                case 49: 
                    Game.player.switchWeapon('pistol');
                    break;
            
                case 50: 
                    Game.player.switchWeapon('shotgun');
                    break;
            
                case 51: 
                    Game.player.switchWeapon('rifle');
                    break;
            
                case 82: 
                    Game.player.currentWeapon.reload();
                    break;
                case 81: 
                    Game.player.meleeAttack.startSwing();
                    break;
                default:
                    break;
            }
        } else {
            Game.menuManager.handleInput(event);
        }
    }
    static handleRel(event) {
        let key = event.keyCode;
        if (Game.state === 'Game') {
            switch (key) {
                case 87: 
                    Game.player.moveUp = false;
                    break;
                case 83: 
                    Game.player.moveDown = false;
                    break;
                case 65: 
                    Game.player.moveLeft = false;
                    break;
                case 68: 
                    Game.player.moveRight = false;
                    break;
                case 16: 
                    Game.player.stopAiming();
                    break;
                default:
                    break;
            }
        }
    }
    static handleMousePress(event) {
        if (Game.state === 'Game') {
            if (Game.player.aims) {
                Game.player.shoot();
            }
            if (event.button === 2) {
                Game.player.startAiming();
            }
        }
    }
    static handleMouseRel(event) {
        if (Game.state === 'Game') {
            if (event.button === 2) {
                Game.player.stopAiming();
            }
            Game.player.stopShooting();
        }
    }
}
class Weapon {
    constructor(name, maxAmmo, currentAmmo, ammoReserve, reloadDuration, offset = 0, isUnlocked = false) {
        this.name = name; 
        this.maxAmmo = maxAmmo; 
        this.currentAmmo = currentAmmo; 
        this.ammoReserve = ammoReserve; 
        this.isUnlocked = isUnlocked; 
        this.reloadDuration = reloadDuration; 
        this.offset = offset;
    }

    
    reload() {
        console.log(`no reload found for ${this.name}, used default reload`);
    }

    
    shoot() {
        console.log(`no shooting function found for ${this.name}, used default shoot`);
    }

    
    unlock() {
        this.isUnlocked = true;
        this.currentAmmo = this.maxAmmo;
    }
    get currentAmmo() {
        return this._currentAmmo;
    }

    
    set currentAmmo(value) {
        if (value >= 0 && value <= this.maxAmmo) {
            this._currentAmmo = value;
        } else {
            console.warn(`Недопустимое значение для currentAmmo: ${value}`);
        }
    }

    
    get ammoReserve() {
        return this._ammoReserve;
    }
    
    set ammoReserve(value) {
        if (value >= 0) {
            this._ammoReserve = value;
        } else {
            console.warn(`Недопустимое значение для ammoReserve: ${value}`);
        }
    }
}
class Pistol extends Weapon {
    constructor() {
        super("pistol", 8, 8, Infinity, 2455, 6.5, true); 
    }
    reload() {
        if (Game.player.isReloading === false && this.maxAmmo !== this.currentAmmo) {
            Game.player.isReloading = true;
            Game.player.aims = false;
            Game.player.currMoveSpeed = Game.player.speedReloading;
            SoundEvents.playSound("pistol_reload");
            setTimeout(() => {
                Game.player.currMoveSpeed =  Game.player.speedDefault;;
                Game.player.isReloading = false;
                this.currentAmmo = 8;
            }, this.reloadDuration);
        }
    }
    shoot() {
        if (this.currentAmmo > 0 && Game.player.isReloading === false) {
            this.currentAmmo--;
            BulletManager.shootPlayerBullet(
                Game.player.position.x + Game.player.size.x/2, 
                Game.player.position.y + Game.player.size.y/2, 
                Game.player.plComponent.angle
            );
            ParticleManager.spawn(
                Game.player.position.x + Game.player.size.x/2, 
                Game.player.position.y + Game.player.size.y/2, 
                Game.player.plComponent.angle - Math.PI / 4, 
                15,
                "pistol"
            );
            SoundEvents.playSound("pistol_shoot");
        } else {
            SoundEvents.playSound("click");
        }
    }
}
class Shotgun extends Weapon {
    constructor() {
        super("shotgun", 5, 0, 0, 0, 10, false); 
        this.shotgunChamber = 1;
        this.pumping = false;
    }

    
    shoot() {
        if ((this.currentAmmo > 0 || this.shotgunChamber) && !Game.player.isReloading) {
            if (this.shotgunChamber === 1 && !this.pumping) {
                this.shotgunChamber = 0;
                PlayerComponent.sprite = "sprites/player/shotgun_shoot.png";
                SoundEvents.playSound("shotgun_shoot");
                BulletManager.shootBuckshot(
                    Game.player.position.x + Game.player.size.x/2, 
                    Game.player.position.y + Game.player.size.y/2, 
                    Game.player.plComponent.angle
                );
            } else {
                this.pump();
            }
        } else {
            SoundEvents.playSound("click");
        }
    }

    
    addShell() {
        return new Promise((resolve) => {
            SoundEvents.playSound("shotgun_add_shell");
            setTimeout(() => {
                this.currentAmmo += 1;
                this.ammoReserve -= 1;
                resolve(); 
            }, 400);
        });
    }

    
    pump() {
        return new Promise((resolve) => {
            if (this.currentAmmo > 0 && !this.pumping) {
                this.currentAmmo -= 1;
                this.pumping = true;
                SoundEvents.playSound("shotgun_pump"); 
                ParticleManager.spawn(
                    Game.player.plComponent.x + 15,
                    Game.player.plComponent.y + 15,
                    Game.player.plComponent.angle - Math.PI/4, 8, "shotgun");
                setTimeout(() => {
                    this.pumping = false;
                    this.shotgunChamber = 1;
                    resolve(); 
                }, 400);
            } else {
                resolve(); 
            }
        });
    }

    
    async reload() {
        if (this.shotgunChamber === 0 && this.currentAmmo !== 0) {
            await this.pump(); 
        }
        if (this.ammoReserve > 0 && Game.player.isReloading === false && this.maxAmmo !== this.currentAmmo) {
            Game.player.isReloading = true;
            Game.player.aims = false;
            Game.player.currMoveSpeed =  Game.player.speedReloading;
            if (this.shotgunChamber === 0) {
                await this.pump(); 
            }
            while (this.currentAmmo < this.maxAmmo && this.ammoReserve > 0) {
                await this.addShell(); 
                if (this.shotgunChamber === 0) {
                    await this.pump(); 
                }
            }

            Game.player.currMoveSpeed =  Game.player.speedDefault;;
            Game.player.isReloading = false;
        }
    }
}
class Rifle extends Weapon {
    constructor() {
        super("rifle", 25, 0, 0, 343, 11,  false); 
        this.isShooting = false; 
        this.shootInterval = null; 
    }

    
    shoot() {
        if (this.currentAmmo > 0) {
            this.currentAmmo--;
            SoundEvents.playSound("rifle_shoot");
            BulletManager.shootPlayerBullet(
                Game.player.position.x + Game.player.size.x/2, 
                Game.player.position.y + Game.player.size.y/2, 
                Game.player.plComponent.angle
            );
            ParticleManager.spawn(
                Game.player.position.x + Game.player.size.x/2,
                Game.player.position.y + Game.player.size.y/2,
                Game.player.plComponent.angle - Math.PI/ 4, 
                20,
                "rifle"
            );
        } else {
            SoundEvents.playSound("click");
            this.stopShooting(); 
        }
        
    }

    
    startShooting() {
        if (!this.isShooting) {
            this.isShooting = true;
            if (this.currentAmmo > 0) this.shoot();
            this.shootInterval = setInterval(() => {
                this.shoot();
            }, 75); 
        }
    }

    
    stopShooting() {
        if (this.isShooting) {
            clearInterval(this.shootInterval);
            this.isShooting = false;
        }
    }

    
    reload() {
        if (this.ammoReserve > 0 && Game.player.isReloading === false && this.maxAmmo !== this.currentAmmo) {
            Game.player.isReloading = true;
            let ammoNeeded = this.maxAmmo - this.currentAmmo;
            let ammoToAdd = Math.min(ammoNeeded, this.ammoReserve);
            Game.player.aims = false;
            Game.player.currMoveSpeed =  Game.player.speedReloading;
            SoundEvents.playSound("rifle_reload");
            
            setTimeout(() => {
                Game.player.isReloading = false;
                Game.player.currMoveSpeed =  Game.player.speedDefault;;
                this.currentAmmo += ammoToAdd;
                this.ammoReserve -= ammoToAdd;
            }, 3343);
        }
    }
}
class MeleeAttack {
    constructor(player, damage = 1, cooldownSeconds = 1) {
        this.player = player;
        this.sprite = new Image();
        this.sprite.src = "sprites/player/swing.png"; 
        this.width = 60; 
        this.height = 80; 
        this.angle = 0; 
        this.meleeMoveSpeed = this.player.speedMelee;
        this.swingAngle = 0;
        this.swingSpeed = 1.2; 
        this.isSwinging = false; 
        this.damage = damage; 
        this.swingCenterX;
        this.swingCenterY;
        this.damaged = false;
        this.colboxOffsetX = 25; 
        this.colboxOffsetY = 25; 
        this.cooldown = 0; 
        this.cooldownDuration = cooldownSeconds * 60; 
        this.meleeHitbox;
    }

    startSwing() {
        if (this.cooldown <= 0 && !this.isSwinging) {
            console.log('swing started')
            this.damaged = false;
            this.isSwinging = true;
            this.swingAngle = +Math.PI / 4; 
            this.cooldown = this.cooldownDuration; 
            SoundEvents.playSound("swing");
        }
    }

    update() {
        if (this.cooldown > 0) {
            const progress = 1 - (this.cooldown / 60);
            this.player.currMoveSpeed = this.player.speedMelee + (this.player.speedDefault - this.player.speedMelee) * progress;
            this.cooldown -= 1;
        } else {
            this.player.currMoveSpeed = this.player.speedDefault;
        }

        if (this.isSwinging) {
            this.player.currMoveSpeed = this.meleeMoveSpeed;
            this.angle = this.player.plComponent.angle;
            this.swingAngle -= this.swingSpeed; 

            
            this.checkCollisions();

            
            if (this.swingAngle <= -Math.PI / 1) {
                this.player.currMoveSpeed = this.player.speedDefault;
                this.isSwinging = false;
            }
        }
    }

    checkCollisions() {
        if (!this.damaged) {
            
            this.meleeHitbox = {
                position: new Vector2(
                    this.player.position.x - this.colboxOffsetX,
                    this.player.position.y - this.colboxOffsetY,
                ),
                size: new Vector2(80, 80) 
            };

            
            for (let enemy of EnemyManager.enemies) {
                if (Collider.checkCollision(this.meleeHitbox, enemy)) {
                    enemy.health -= this.damage;
                    SoundEvents.playSound("blade_hit");
                    this.damaged = true;
                    if (enemy.health <= 0) {
                        enemy.delete();
                    }
                }
            }

            
            for (let prop of PropManager.props) {
                if (Collider.checkCollision(this.meleeHitbox, prop)) {
                    prop.onHit();
                }
            }

            
            for (let bullet of BulletManager.bullets) {
                if (bullet.type === "enemy" && Collider.checkCollision(this.meleeHitbox, bullet)) {
                    SoundEvents.playSound("blade_hit");
                    bullet.delete(); 
                    this.damaged = true;
                }
            }
        }
    }

    render(ctx) {
        if (this.isSwinging) {
            const playerCenterX = this.player.position.x + this.player.size.x / 2;
            const playerCenterY = this.player.position.y + this.player.size.y / 2;

            
            ctx.save();
            ctx.translate(playerCenterX, playerCenterY);
            ctx.rotate(this.angle + this.swingAngle + Math.PI / 2); 
            ctx.drawImage(
                this.sprite,
                -this.width / 2, 
                -this.height / 2, 
                this.width,
                this.height
            );
            ctx.restore(); 
        }
    }

    renderDebugMeleeHitbox(ctx) {
        if (this.isSwinging) {
            
            ctx.save();
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)"; 
            ctx.fillRect(
                this.meleeHitbox.position.x, 
                this.meleeHitbox.position.y, 
                this.meleeHitbox.size.x, 
                this.meleeHitbox.size.y  
            );
            ctx.restore();
        }
    }
}
class ItemManager {
    static items = [];

    
    static randomItemTypes = ["medkit", "rifleAmmo", "shotgunAmmo", "shotgun", "rifle", "sodacan"];

    static getItemClass(type) {
        switch (type) {
            case "medkit":
                return Medkit;
            case "sodacan":
                return Sodacan;
            case "rifleAmmo":
                return RifleAmmo;
            case "shotgunAmmo":
                return ShotgunAmmo;
            case "shotgun":
                return ShotgunItem;
            case "rifle":
                return RifleItem;
            case "random":
                
                const randomIndex = Math.floor(Math.random() * ItemManager.randomItemTypes.length);
                const randomType = ItemManager.randomItemTypes[randomIndex];
                return ItemManager.getItemClass(randomType);
            default:
                throw new Error(`Unknown item type: ${type}`);
        }
    }

    static spawn(x, y, type) {
        const itemClass = ItemManager.getItemClass(type);
        ItemManager.items.push(new itemClass(x, y));
    }

    static updateAll() {
        for (let item of ItemManager.items) {
            item.update();
        }
    }

    static renderAll(ctx) {
        for (let item of ItemManager.items) {
            item.render(ctx);
        }
    }

    static clear() {
        ItemManager.items = [];
    }
    static loadSaveData(data) {
        ItemManager.items = data.roomCurrItems ? data.roomCurrItems.map(itemData => {
            if (!itemData.type) {
                console.error("Invalid item data:", itemData); 
                return null; 
            }
            const itemClass = ItemManager.getItemClass(itemData.type);
            return new itemClass(itemData.x, itemData.y);
        }).filter(item => item !== null) : []; 
    }
}
class Item {
    constructor(x, y, type, source) {
        this.position = new Vector2(x-5, y-5); 
        this.type = type;
        this.isPicked = false;
        this.itemSprite = new Image();
        this.isLoaded = false; 

        
        this.itemSprite.src = source;
        this.itemSprite.onload = () => {
            this.isLoaded = true;
            
            this.size = new Vector2(this.itemSprite.width+10, this.itemSprite.height+10);
        };
        this.itemSprite.onerror = () => {
            console.error(`Failed to load image: ${source}`);
        };

        
        this.size = new Vector2(32, 32); 
    }

    update() {
        
        if (Collider.checkCollision(this, Game.player)) {
            this.onPickup();
        }

        
        if (this.isPicked) {
            this.delete();
        }
    }

    onPickup() {
        throw new Error("onPickup method must be implemented by subclass");
    }

    render(ctx) {
        if (!this.isLoaded) {
            return; 
        }
        
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.itemSprite, this.position.x+5, this.position.y+5, this.size.x-10, this.size.y-10);
        ctx.restore();
    }

    delete() {
        ItemManager.items.splice(ItemManager.items.indexOf(this), 1);
    }

    getSaveData() {
        return {
            type: this.type, 
            x: this.position.x,
            y: this.position.y,
            isPicked: this.isPicked
        };
    }
}
class Medkit extends Item {
    constructor(x, y) {
        super(x, y, 'medkit', "sprites/enviroment/medkit.png");
    }

    onPickup() {
        if (Game.player.health < Game.player.maxHealth) {
            this.isPicked = true;
            SoundEvents.playSound("pickup");
            Game.player.health = Math.min(Game.player.health + 50, Game.player.maxHealth);
        }
    }
}
class Sodacan extends Item {
    constructor(x, y) {
        super(x, y, 'sodacan', "sprites/enviroment/sodacan.png");
    }

    onPickup() {
        if (Game.player.health < Game.player.maxHealth) {
            this.isPicked = true;
            SoundEvents.playSound("sodacan");
            Game.player.health = Math.min(Game.player.health + 10, Game.player.maxHealth);
        }
    }
}
class RifleAmmo extends Item {
    constructor(x, y) {
        super(x, y, 'rifleAmmo', "sprites/enviroment/ammobag.png");
    }

    onPickup() {
        this.isPicked = true;
        SoundEvents.playSound("pickup");
        Game.player.weapons["rifle"].ammoReserve += Math.ceil(25 * 1 / 4 * Game.player.difficulty);
    }
}
class ShotgunAmmo extends Item {
    constructor(x, y) {
        super(x, y, 'shotgunAmmo', "sprites/enviroment/shellbox.png");
    }

    onPickup() {
        this.isPicked = true;
        SoundEvents.playSound("pickup");
        Game.player.weapons["shotgun"].ammoReserve += Math.ceil(5 * 2 / Game.player.difficulty);
    }
}
class ShotgunItem extends Item {
    constructor(x, y) {
        super(x, y, 'shotgun', "sprites/enviroment/shotgun.png");
    }

    onPickup() {
        this.isPicked = true;
        SoundEvents.playSound("pickup");
        if (Game.player.weapons["shotgun"].isUnlocked) {
            Game.player.weapons["shotgun"].ammoReserve += Math.ceil(Math.random() * 2 + 2 * 2 / Game.player.difficulty);
        } else {
            Game.player.unlockWeapon("shotgun");
        }
    }
}
class RifleItem extends Item {
    constructor(x, y) {
        super(x, y, 'rifle', "sprites/enviroment/rifle.png");
    }

    onPickup() {
        this.isPicked = true;
        SoundEvents.playSound("pickup");
        if (Game.player.weapons["rifle"].isUnlocked) {
            Game.player.weapons["rifle"].ammoReserve += Math.ceil(Math.random() * 5 + 5 * 2 / Game.player.difficulty);
        } else {
            Game.player.unlockWeapon("rifle");
        }
    }
}
class Component {
    constructor(width, height, x, y, angle = 0) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.image = new Image();
    }

    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
    setImageSource(src) {
        this.image.src = src;
    }
}
class PlayerComponent extends Component {
    static sprite = 'sprites/player/pistol_idle.png';
    constructor(width, height, x, y) {
        super(width, height, x, y);
        this.angle = 0;

        
        this.colboxOffsetX = -15; 
        this.colboxOffsetY = -5; 

        this.setupMouseMoveListener();
    }

    setupMouseMoveListener() {
        onmousemove = (e) => {
            if (Game.state === 'Game') {
                let rect = GameField.canvas.getBoundingClientRect();
                let scaleX = GameField.canvas.width / rect.width;
                let scaleY = GameField.canvas.height / rect.height;
                let mouseX = (e.clientX - rect.left) * scaleX;
                let mouseY = (e.clientY - rect.top) * scaleY;
                this.calculateAngle(mouseX, mouseY);
            }
        };
    }

    calculateAngle(mouseX, mouseY) {
        let deltaX = mouseX - (Game.player.position.x + Game.player.size.x/2);
        let deltaY = mouseY - (Game.player.position.y + Game.player.size.y/2);
        this.angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
    }

    update() {
        this.setImageSource(PlayerComponent.sprite);
        if (Game.player.aims === false) {
            if (Game.player.currentWeapon instanceof Rifle) {
                PlayerComponent.sprite = "sprites/player/rifle_idle.png";
            } else if (Game.player.currentWeapon instanceof Shotgun) {
                PlayerComponent.sprite = "sprites/player/shotgun_idle.png";
            } else {
                PlayerComponent.sprite = "sprites/player/pistol_idle.png";
            }
        } else {
            if (Game.player.currentWeapon instanceof Rifle) {
                PlayerComponent.sprite = "sprites/player/rifle_aim.png";
            } else if (Game.player.currentWeapon instanceof Shotgun) {
                if (Game.player.currentWeapon.pumping) {
                    PlayerComponent.sprite = "sprites/player/shotgun_pump.png";
                } else {
                    PlayerComponent.sprite = "sprites/player/shotgun_aim.png";
                }
            } else {
                PlayerComponent.sprite = "sprites/player/pistol_aim.png";
            }
        }

        this.x = Game.player.position.x + this.colboxOffsetX;
        this.y = Game.player.position.y + this.colboxOffsetY;

        for (let bullet of BulletManager.bullets) {
            if (bullet.type !== "player") {
                
                const bulletObj = {
                    position: new Vector2(bullet.x, bullet.y),
                    size: new Vector2(bullet.size.x, bullet.size.y)
                };

                
                if (Collider.checkCollision(bulletObj, Game.player)) {
                    let dmg = Math.ceil(Math.random() * 15 + 10 * (Game.player.difficulty - 1));
                    SoundEvents.playSound("hit_bullet");
                    Game.player.health -= dmg;
                    Game.score -= dmg;
                    bullet.delete();
                }
            }
        }
    }

    renderDebugColbox(ctx) {
        
        ctx.save();
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; 
        ctx.strokeStyle = "red"; 
        ctx.lineWidth = 2; 

        
        ctx.fillRect(
            this.x - this.colboxOffsetX, 
            this.y - this.colboxOffsetY, 
            Game.player.size.x, 
            Game.player.size.y 
        );

        
        ctx.strokeRect(
            this.x - this.colboxOffsetX, 
            this.y - this.colboxOffsetY, 
            Game.player.size.x, 
            Game.player.size.y  
        );

        ctx.restore();
    }

    render(ctx) {
        
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height / 4;
        ctx.translate(playerCenterX, playerCenterY);

        ctx.rotate(this.angle);

        ctx.drawImage(
            this.image, 
            -this.width / 2, 
            -this.height * 3 / 4,
            this.width, 
            this.height 
        );

        ctx.restore();

        
        
    }
}
class HUDTextComponent extends Component {
    constructor() {
        super(0, 0, 0, 0); 
    }

    render(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "15pt PixelCode";
        ctx.fillText(`➕ ${Game.player.health}`, 500, 40); 
        ctx.fillText(`${Game.player.weapons["rifle"].currentAmmo}/${Game.player.weapons["rifle"].ammoReserve}`, 300, 80); 
        ctx.fillText(`${Game.player.weapons["pistol"].currentAmmo}/∞`, 30, 80); 
        ctx.fillText(`${Game.player.weapons["shotgun"].currentAmmo}/${Game.player.weapons["shotgun"].ammoReserve}`, 140, 80); 
        ctx.fillText(`Счет: ${Game.score}`, 430, 105); 
        ctx.fillText(`Комната: ${Game.roomCounter}`, 430, 75); 
        ctx.restore();
    }
}
class HUDPictureComponent extends Component {
    constructor(width, height, x, y, locked, currSprite) {
        super(width, height, x, y);
        this.locked = locked;
    }
    render(ctx) {
        super.render(ctx);
    }
}
class HUDPistol extends HUDPictureComponent {
    constructor(width, height, x, y, locked, unequipped, equipped) {
        super(width, height, x, y, locked);
        this.unequipped = unequipped;
        this.equipped = equipped;
    }

    update() {
        if (Game.player.currentWeapon instanceof Pistol) {
            this.setImageSource(this.equipped);
        } else {
            this.setImageSource(this.unequipped);
        }
    }

    render(ctx) {
        super.render(ctx);
    }
}
class HUDShotgun extends HUDPictureComponent {
    constructor(width, height, x, y, locked, unequipped, equipped, equipped_pumped, unequipped_pumped) {
        super(width, height, x, y, locked);
        this.unequipped = unequipped;
        this.equipped = equipped;
        this.equipped_pumped = equipped_pumped;
        this.unequipped_pumped = unequipped_pumped;
    }

    update() {
        if (!Game.player.weapons['shotgun'].isUnlocked) {
            this.setImageSource(this.locked);
        } else {
            if (Game.player.currentWeapon instanceof Shotgun) {
                if (Game.player.weapons['shotgun'].shotgunChamber === 1) {
                    this.setImageSource(this.equipped_pumped);
                } else {
                    this.setImageSource(this.equipped);
                }
            } else {
                if (Game.player.weapons['shotgun'].shotgunChamber === 1) {
                    this.setImageSource(this.unequipped_pumped);
                } else {
                    this.setImageSource(this.unequipped);
                }
            }
        }
    }

    render(ctx) {
        super.render(ctx);
    }
}
class HUDRifle extends HUDPictureComponent{
    constructor(width, height, x, y, locked, unequipped, equipped) {
        super(width, height, x, y, locked);
        this.unequipped = unequipped;
        this.equipped = equipped;
    }
    update() {
        if (Game.player.weapons['rifle'].isUnlocked === false) {this.setImageSource(this.locked)    
        } else {
        if (Game.player.currentWeapon instanceof Rifle) {this.setImageSource(this.equipped);
        } else {this.setImageSource(this.unequipped)}
        }
    }
    render(ctx){
        super.render(ctx);
    }
}
class MenuComponent extends Component {
    constructor(width, height, x, y, src = null) {
        super(width, height, x, y);
        this.setImageSource(src);
    }
    update(ctx = GameField.context) {
        super.update(ctx);
    }
}
class BulletManager {
    static bullets = [];

    static getBulletClass(type) {
        switch (type) {
            case "player":
                return PlayerBullet;
            case "enemy":
                return EnemyBullet;
            case "buckshot":
                return BuckshotBullet;
            default:
                throw new Error(`Unknown bullet type: ${type}`);
        }
    }

    static shootBullet(x, y, angle, speed, type = 'player') {
        const bulletClass = BulletManager.getBulletClass(type);
        BulletManager.bullets.push(new bulletClass(x, y, angle - Math.PI/2, speed));
    }

    static shootEnemyBullet(x, y, angle) {
        BulletManager.shootBullet(x, y, angle + Math.PI/2, 5, "enemy");
    }

    static shootPlayerBullet(x, y, angle) {
        BulletManager.shootBullet(
            x,
            y,
            angle,
            25,
            "player"
        );
    }

    static shootBuckshot(x, y, angle) {
        for (let i = 8; i !== 0; i--) {
            BulletManager.shootBullet(
                x,
                y,
                angle - 0.15 + Math.random() * 0.3,
                22 + Math.random() * 3,
                "player"
            );
        }
    }

    static updateAll() {
        for (let bullet of BulletManager.bullets) {
            bullet.update();
        }
    }

    static renderAll(ctx) {
        for (let bullet of BulletManager.bullets) {
            bullet.render(ctx);
        }
    }

    static clear() {
        BulletManager.bullets = [];
    }
}
class Bullet {
    constructor(x, y, angle, speed, type) {
        this.position = new Vector2(x, y);
        if (type === 'enemy'){
            this.size = new Vector2(4, 4); 
        } else {
            this.size = new Vector2(2, 2);
        }
        this.angle = angle;
        this.speed = speed;
        this.type = type;
        this.lifetime = 2000; 
    }

    update() {
        
        this.position.x += this.speed * Math.cos(this.angle);
        this.position.y += this.speed * Math.sin(this.angle);
        this.lifetime--;

        
        if (this.lifetime <= 0) {
            this.delete();
        }
    }

    delete() {
        BulletManager.bullets.splice(BulletManager.bullets.indexOf(this), 1);
    }

    render(ctx) {
        ctx.fillStyle = this.type === "player" ? "orange" : "red"; 
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    getSaveData() {
        return {
            x: this.position.x,
            y: this.position.y,
            angle: this.angle,
            speed: this.speed,
            type: this.type
        };
    }
}
class PlayerBullet extends Bullet {
    constructor(x, y, angle, speed) {
        super(x, y, angle, speed, "player");
    }
}
class EnemyBullet extends Bullet {
    constructor(x, y, angle, speed) {
        super(x, y, angle, speed, "enemy");
    }
}
class BuckshotBullet extends Bullet {
    constructor(x, y, angle, speed) {
        super(x, y, angle, speed, "player");
    }
}
class ParticleManager {
    static particles = [];

    static spawn(x, y, angle, speed, type) {
        ParticleManager.particles.push(new Particle(x, y, angle, speed, type));
    }

    static updateAll() {
        for (let particle of ParticleManager.particles){
            particle.update();
        }
    }
    static renderAll(ctx) {
        for (let particle of ParticleManager.particles){
            particle.render(ctx);
        }
    }

    static clear(){
        ParticleManager.particles = [];
    }
}
class Particle {

    constructor(x, y, angle, speed, type) {
        this.x = x;
        this.y = y;
        this.angle = angle + Math.random()*Math.PI/10; 
        this.speed = speed;
        this.lifetime = 70; 
        this.type = type; 
        this.image = new Image();
        this.image.src = this.getTexture();
        RoomManager.bulletIdCounter++;
        this.x = x + 15 + 10 * Math.cos(this.angle);
        this.y = y + 15 + 23 * Math.sin(this.angle);
    }

    
    getTexture() {
        switch (this.type) {
            case "pistol":
                return "sprites/particles/shell_pistol.png";
            case "rifle":
                return "sprites/particles/shell_rifle.png";
            case "shotgun":
                return "sprites/particles/shell_shotgun.png";
            case "metal_chip":
                return "sprites/particles/metal.png";
            case "yellow_metal_chip":
                return "sprites/particles/yellow_metal.png";
            case "wooden_chip":
                return "sprites/particles/wood.png";
            case "glass_chip":
                return "sprites/particles/glass.png";
            default:
                return "sprites/particles/metal.png"; 
        }
    }

    
    update() {
        this.x += this.speed * Math.cos(this.angle*0.8+(Math.random()* this.angle*0.4));
        this.y += this.speed * Math.sin(this.angle*0.8+(Math.random()* this.angle*0.4));
        this.speed *= (0.6+Math.random()*0.4); 
        this.lifetime--;
        if (this.lifetime <= 0){
            ParticleManager.particles.shift();
        }
    }

    
    render(ctx) {
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle - this.speed/0.5 + Math.random() * this.lifetime/200);
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        ctx.restore();
    }
}
class EnemyManager {
    static enemies = []; 

    
    static getEnemyClass(type) {
        switch (type) {
            case 'small':
                return SmallEnemy;
            case 'medium':
                return MediumEnemy;
            case 'turret':
                return TurretEnemy;
            default:
                throw new Error(`Unknown enemy type: ${type}`);
        }
    }

    
    static updateAll(deltaTime) {
        for (let enemy of this.enemies) {
            enemy.update(deltaTime);
        }
    }

    
    static renderAll(ctx) {
        for (let enemy of this.enemies) {
            enemy.render(ctx);
        }
    }

    
    static spawn(x, y, type = 'small') {
        let enemy;
        switch (type) {
            case 'small':
                enemy = new SmallEnemy(x, y);
                break;
            case 'medium':
                enemy = new MediumEnemy(x, y);
                break;
            case 'turret':
                enemy = new TurretEnemy(x, y);
                break;
            default:
                console.warn(`Unknown enemy type: ${type}`);
                return;
        }
        this.enemies.push(enemy);
    }

    
    static spawnDebug() {
        this.spawn(300, 300, 'medium');
    }

    
    static clear() {
        for (let enemy of this.enemies) {
            enemy.delete();
        }
        this.enemies = [];
    }
}
class Enemy {
    constructor(x, y, type, health, speed, damage, spriteSource, damagedSpriteSource, attackInterval, colboxWidth, colboxHeight) {
        this.position = new Vector2(x, y); 
        this.type = type;
        this.health = health;
        this.speed = speed;
        this.damage = damage;
        this.deleted = false;
        this.enemySprite = new Image();
        this.isLoaded = false; 
        this.colbox = new Vector2(colboxWidth, colboxHeight); 
        this.angle = 0; 

        
        this.colboxOffsetX = colboxWidth / 4; 
        this.colboxOffsetY = colboxHeight / 8; 

        
        this.enemySprite.src = spriteSource;
        this.source2 = damagedSpriteSource;
        this.enemySprite.onload = () => {
            this.isLoaded = true;
            
            this.size = new Vector2(this.enemySprite.width, this.enemySprite.height);
        };
        this.enemySprite.onerror = () => {
            console.error(`Failed to load image: ${spriteSource}`);
        };

        
        this.size = new Vector2(50, 50); 

        
        this.attackInterval = setInterval(() => {
            if (Game.state === 'Game') {
                this.handleAttack(); 
            }
        }, 1800 + (Game.player.difficulty - 1) * -500); 
    }

    update() {
        
        let direction = new Vector2(
            Game.player.position.x - this.position.x, 
            Game.player.position.y - this.position.y  
        );
        direction.normalize();
        this.position.add(new Vector2(direction.x * this.speed, direction.y * this.speed));

        
        this.angle = Math.atan2(
            Game.player.position.y - this.position.y, 
            Game.player.position.x - this.position.x  
        );

        
        for (let bullet of BulletManager.bullets) {
            if (Collider.checkCollision(this, bullet) && bullet.type !== "enemy") {
                this.health--;
                bullet.delete();
            }
        }

        
        for (let prop of PropManager.props) {
            if (Collider.checkCollision(this, prop)) {
                Collider.resolveCollision(this, prop);
            }
        }
        if (this.health <= 1) {
            this.enemySprite.src = this.source2;
        }
        
        
        if (this.health <= 0) {
            this.onDeath();
            this.delete();
        }
    }

    onDeath() {
        
        if (this.type === 'turret') {
            ItemManager.spawn(
                this.position.x + this.enemySprite.width / 2,
                this.position.y + this.enemySprite.height / 2,
                "rifleAmmo"
            );
        }
    }

    delete() {
        if (!this.deleted){
            this.deleted = true;
            clearInterval(this.attackInterval);
            this.attackInterval = null; 
            EnemyManager.enemies.splice(EnemyManager.enemies.indexOf(this), 1);
        }
    }

    render(ctx) {
        if (!this.isLoaded) {
            return; 
        }

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);

        
        ctx.rotate(this.angle + Math.PI / 2);

        
        ctx.drawImage(
            this.enemySprite,
            -this.size.x / 2, 
            -this.size.y / 2, 
            this.size.x,
            this.size.y
        );

        ctx.restore();

        
        
    }

    renderDebugColbox(ctx) {
        
        const colboxX = this.position.x + this.colboxOffsetX;
        const colboxY = this.position.y + this.colboxOffsetY;

        
        ctx.save();
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; 
        ctx.strokeStyle = "red"; 
        ctx.lineWidth = 2; 

        
        ctx.fillRect(
            colboxX, 
            colboxY, 
            this.colbox.x, 
            this.colbox.y 
        );

        
        ctx.strokeRect(
            colboxX, 
            colboxY, 
            this.colbox.x, 
            this.colbox.y 
        );
        ctx.restore();
    }
    getSaveData() {
        return {
            x: this.position.x,
            y: this.position.y,
            type: this.type,
            health: this.health,
            speed: this.speed,
            damage: this.damage
        };
    }
}
class SmallEnemy extends Enemy {
    constructor(x, y) {
        super(
            x, y, 
            'small', 
            5, 
            1, 
            10 * Game.player.difficulty, 
            "sprites/enemy/small.png", 
            "sprites/enemy/small_damaged.png", 
            1800 + (Game.player.difficulty - 1) * -500, 
            28, 28 
        );
    }

    handleAttack() {
        if (Collider.checkCollision(this, Game.player)) {
            let damage = 20 + Math.ceil(10 * (Game.player.difficulty - 1));
            SoundEvents.playSound("hit_melee");
            Game.player.health -= damage;
            Game.score -= damage;
        }
    }

    onDeath() {
        let count = Math.ceil(Math.random()*10);
        for (let index = 0; index < count; index++) {
            ParticleManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y/2, index, 5, 'metal_chip')
        }
        
    }
}
class MediumEnemy extends Enemy {
    constructor(x, y) {
        super(
            x, y, 
            'medium', 
            12, 
            0.7, 
            20 * Game.player.difficulty, 
            "sprites/enemy/medium.png", 
            "sprites/enemy/medium_damaged.png", 
            1800 + (Game.player.difficulty - 1) * -500, 
            56, 56 
        );
    }

    handleAttack() {
        if (Collider.checkCollision(this, Game.player)) {
            let damage = 20 + Math.ceil(10 * (Game.player.difficulty - 1));
            SoundEvents.playSound("hit_melee");
            Game.player.health -= damage;
            Game.score -= damage;
        }
    }

    onDeath() {
        let count = Math.ceil(Math.random()*10);
        for (let index = 0; index < count; index++) {
            ParticleManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y/2, index, 5, 'yellow_metal_chip')
        }
        
    }
}
class TurretEnemy extends Enemy {
    constructor(x, y) {
        super(
            x, y, 
            'turret', 
            10, 
            0,
            0,
            "sprites/enemy/turret.png", 
            "sprites/enemy/turret_damaged.png", 
            1800 + (Game.player.difficulty - 1) * -500, 
            65, 65 
        );
    }

    handleAttack() {
        if (Math.random() < 0.7 + (Game.player.difficulty - 1) * -0.1) {
            BulletManager.shootEnemyBullet(this.position.x + this.size.x/2, this.position.y + this.size.x/2, this.angle);
            SoundEvents.playSound("turret");
        }
    }

    onDeath() {
        let count = Math.ceil(Math.random()*10);
        for (let index = 0; index < count; index++) {
            ParticleManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y/2, index, 5, 'metal_chip')
        }
        ItemManager.spawn(this.position.x + this.enemySprite.width / 2, this.position.y + this.enemySprite.height / 2, "rifleAmmo");
    }
}
class PropManager {
    static props = [];

    static getPropClass(type) {
        switch (type) {
            case "chair1":
                return Chair1;
            case "chair2":
                return Chair2;
            case "box":
                return Box;
            case "box_wooden":
                return BoxWooden;
            case "doorLocked":
                return DoorLocked;
            case "doorLockedH":
                return DoorLockedH;
            case "doorOpen":
                return DoorOpen;
            case "doorOpenH":
                return DoorOpenH;
            case "wall":
                return Wall;
            case "cupboard":
                return Cupboard;
            case "computers":
                return Computers;
            case "soda":
                return Soda;
            case "table1":
                return Table1;
            case "table2":
                return Table2;
            default:
                throw new Error(`Unknown prop type: ${type}`);
        }
    }

    static spawn(x, y, type, width = 0, height = 0) {
        const propClass = PropManager.getPropClass(type);
        PropManager.props.push(new propClass(x, y, width, height)); 
    }

    static updateAll() {
        for (let prop of PropManager.props) {
            prop.update();
        }
    }

    static renderAll(ctx) {
        for (let prop of PropManager.props) {
            prop.render(ctx);
        }
    }

    static clear() {
        PropManager.props = [];
    }
}
class Prop {
    constructor(x, y, type, width, height, source) {
        this.position = new Vector2(x, y);
        this.type = type;
        this.propSprite = new Image();
        this.isLoaded = false; 
        this.deleted = false;
        
        this.propSprite.src = source;
        this.propSprite.onload = () => {
            this.isLoaded = true; 
            
            if (!width || !height) {
                this.size = new Vector2(this.propSprite.width, this.propSprite.height);
            }
        };
        this.propSprite.onerror = () => {
            console.error(`Failed to load image: ${source}`);
        };

        
        this.size = new Vector2(width, height);
    }

    update() {
        
        if (Collider.checkCollision(this, Game.player)) {
            this.handlePlayerCollision();
        }

        
        for (let bullet of BulletManager.bullets) {
            if (Collider.checkCollision(this, bullet)) {
                this.onHit(bullet);
            }
        }
    }

    handlePlayerCollision() {
        
        Collider.resolveCollision(Game.player, this);
    }

    onHit(bullet) {
        
    }

    render(ctx) {
        if (!this.isLoaded) {
            return; 
        }

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.propSprite, this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.restore();
    }

    delete() {
        if (!this.deleted){
            this.deleted = true;
            PropManager.props.splice(PropManager.props.indexOf(this), 1);
        }
    }
    getSaveData() {
        return {
            x: this.position.x,
            y: this.position.y,
            type: this.type,
            width: this.size.x,
            height: this.size.y
        };
    }
}
class BoxWooden extends Prop {
    constructor(x, y) {
        super(x, y, "box_wooden", 0, 0, "sprites/enviroment/box_wooden.png");
    }

    onHit(bullet) {
        if(!this.deleted){
        
        let count = Math.ceil(Math.random()*10);
        for (let index = 0; index < count; index++) {
            ParticleManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y/2, index, 5, 'wooden_chip')
        }
        ItemManager.spawn(this.position.x+this.size.x/10, this.position.y + this.size.y/3, "random");
        this.delete();
        if (bullet) bullet.delete();
        }
    }
}
class Chair1 extends Prop {
    constructor(x, y) {
        super(x, y, "chair1", 0, 0, "sprites/enviroment/chair1.png");
    }
}
class Chair2 extends Prop {
    constructor(x, y) {
        super(x, y, "chair2", 0, 0, "sprites/enviroment/chair2.png");
    }
}
class Box extends Prop {
    constructor(x, y) {
        super(x, y, "box", 0, 0, "sprites/enviroment/box.png");
    }
    onHit(bullet){
        if(bullet) bullet.delete();
    }
}
class DoorLocked extends Prop {
    constructor(x, y, width, height) {
        super(x, y, "doorLocked", width, height, "sprites/enviroment/door_locked.png");
    }
}
class DoorLockedH extends Prop {
    constructor(x, y, width, height) {
        super(x, y, "doorLockedH", width, height, "sprites/enviroment/door_locked_horisontal.png");
    }
}
class DoorOpen extends Prop {
    constructor(x, y, width, height) {
        super(x, y, "doorOpen", width, height, "sprites/enviroment/door_unlocked.png");
    }

    handlePlayerCollision() {
        RoomManager.loadNewRoom();
    }
}
class DoorOpenH extends Prop {
    constructor(x, y, width, height) {
        super(x, y, "doorOpenH", width, height, "sprites/enviroment/door_unlocked_horisontal.png");
    }

    handlePlayerCollision() {
        RoomManager.loadNewRoom();
    }
}
class Wall extends Prop {
    constructor(x, y, width, height) {
        super(x, y, "wall", width, height, "sprites/enviroment/colbox.png");
    }
}
class Cupboard extends Prop {
    constructor(x, y) {
        super(x, y, "cupboard", 0, 0, "sprites/enviroment/cupboard.png");
    }
    onHit(bullet){
        if(bullet) bullet.delete();
    }
}
class Computers extends Prop {
    constructor(x, y) {
        super(x, y, "computers", 0, 0, "sprites/enviroment/computers.png");
    }
}
class Table1 extends Prop {
    constructor(x, y) {
        super(x, y, "table1", 0, 0, "sprites/enviroment/table1.png");
    }
}
class Table2 extends Prop {
    constructor(x, y) {
        super(x, y, "table2", 0, 0, "sprites/enviroment/table2.png");
    }
}
class Soda extends Prop {
    constructor(x, y) {
        super(x, y, "soda", 0, 0, "sprites/enviroment/soda.png");
        this.solid = true;
    }

    onHit(bullet) {
        if(this.solid){
            this.solid = false;
            this.propSprite.src = "sprites/enviroment/soda_broken.png";
            let count = Math.ceil(Math.random()*10);
            for (let index = 0; index < count; index++) {
                ParticleManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y/2, index, 5, 'glass_chip')
            }
            ItemManager.spawn(this.position.x + this.size.x/2, this.position.y + this.size.y*1.5, "sodacan");
            if (bullet) bullet.delete();
        } else {
            if (bullet) bullet.delete();
        }
    }
}
class Point {
    constructor(id, cord) {
        this.id = id;
        this.cord = cord;
    }
}
class RoomManager {
    static roomCounter = 0;
    static roomTemplates = {
        room1: () => {
            PropManager.spawn(70, 175, "box_wooden");
            PropManager.spawn(70, 235, "chair1");
            PropManager.spawn(100, 235, "chair1");
            PropManager.spawn(436, 175, "box_wooden");
            PropManager.spawn(436, 245, "box");
            PropManager.spawn(360, 175, "box");
            PropManager.spawn(360, 245, "box_wooden");
            ItemManager.spawn(506, 210, "shotgunAmmo");
            PropManager.spawn(488, 450, "box");
            PropManager.spawn(420, 450, "box_wooden");
            PropManager.spawn(500, 510, "chair1");
            EnemyManager.spawn(120, 480, 'turret')
            EnemyManager.spawn(280, 229, 'small')
            EnemyManager.spawn(320, 229, 'small')
        },
        room2: () => {
            PropManager.spawn(175, 460, "chair1");
            PropManager.spawn(160, 485, "table1");
            PropManager.spawn(485, 485, "box")
            PropManager.spawn(195, 180, "chair2");
            PropManager.spawn(450, 175, "soda");
            PropManager.spawn(45, 176, "box_wooden");
            PropManager.spawn(115, 176, "box");
            ItemManager.spawn(200, 210, "medkit");
            EnemyManager.spawn(280, 350, 'small')
            EnemyManager.spawn(380, 250, 'small')
            EnemyManager.spawn(400, 450, 'turret')
        },
        room3: () => {
            PropManager.spawn(43, 174, "computers")
            ItemManager.spawn(60, 221, "medkit")
            PropManager.spawn(409, 174, "cupboard")
            PropManager.spawn(505, 184, "chair1")
            PropManager.spawn(86, 495, "table1")
            PropManager.spawn(106, 452, "chair1")
            ItemManager.spawn(462, 231, "shotgun")
            PropManager.spawn(462, 472, "box")
            EnemyManager.spawn(440, 402, 'medium')
            EnemyManager.spawn(180, 472, 'medium')
            EnemyManager.spawn(300, 361, 'small')
        },
        room4: () => {
            PropManager.spawn(86, 180, "table2")
            PropManager.spawn(45, 180, "chair1")
            PropManager.spawn(176, 180, "chair1")
            PropManager.spawn(343, 176, "soda")
            PropManager.spawn(453, 176, "soda")
            PropManager.spawn(386, 472, "table1")
            PropManager.spawn(472, 472, "table1")
            PropManager.spawn(408, 428, "chair1")
            PropManager.spawn(492, 428, "chair1")
            PropManager.spawn(64, 472, "box_wooden")
            ItemManager.spawn(455, 428, "medkit")
            EnemyManager.spawn(159, 472, 'medium')
            EnemyManager.spawn(470, 265, 'small')
        },
        room5: () => {
            PropManager.spawn(393, 174, "cupboard")
            PropManager.spawn(476, 174, "cupboard")
            PropManager.spawn(46, 174, "cupboard")
            PropManager.spawn(129, 174, "cupboard")
            PropManager.spawn(46, 418, "cupboard")
            PropManager.spawn(476, 418, "cupboard")
            PropManager.spawn(129, 418, "box")
            PropManager.spawn(409, 418, "box")
            ItemManager.spawn(86, 250, "rifleAmmo")
            ItemManager.spawn(429, 250, "shotgunAmmo")
            ItemManager.spawn(86, 505, "medkit")
            ItemManager.spawn(480, 505, "random")
            EnemyManager.spawn(279, 328, 'turret')
            EnemyManager.spawn(203, 355, 'small')
            EnemyManager.spawn(376, 355, 'small')
        },
        room6: () => {
            PropManager.spawn(43, 174, "computers")
            PropManager.spawn(383, 174, "computers")
            PropManager.spawn(220, 174, "chair2")
            PropManager.spawn(343, 174, "chair2")
            PropManager.spawn(43, 408, "computers")
            PropManager.spawn(43, 505, "table1")
            PropManager.spawn(129, 505, "table1")
            PropManager.spawn(53, 452, "chair2")
            ItemManager.spawn(109, 462, "medkit")
            PropManager.spawn(492, 482, "box_wooden")
            PropManager.spawn(407, 482, "box")
            EnemyManager.spawn(492, 432, 'medium')
            EnemyManager.spawn(159, 259, 'small')
            EnemyManager.spawn(456, 259, 'small')
        },
        room7: () => {
            PropManager.spawn(86, 180, "table2")
            PropManager.spawn(45, 180, "chair1")
            PropManager.spawn(176, 180, "chair1")
            PropManager.spawn(343, 176, "soda")
            PropManager.spawn(453, 176, "soda")
            PropManager.spawn(386, 472, "table1")
            PropManager.spawn(472, 472, "table1")
            PropManager.spawn(408, 428, "chair1")
            PropManager.spawn(492, 428, "chair1")
            PropManager.spawn(64, 472, "box_wooden")
            ItemManager.spawn(455, 428, "rifle")
            EnemyManager.spawn(159, 472, 'medium')
            EnemyManager.spawn(470, 265, 'small')
        },
        room8: () => {
            PropManager.spawn(446, 200, "table1")
            PropManager.spawn(405, 195, "chair1")
            PropManager.spawn(106, 480, "table2")
            PropManager.spawn(65, 480, "chair1")
            ItemManager.spawn(405, 220, "sodacan")
            PropManager.spawn(45, 180, "chair1")
            EnemyManager.spawn(240, 329, 'small')
            EnemyManager.spawn(360, 329, 'small')
            PropManager.spawn(130, 180, "box_wooden")
            ItemManager.spawn(456, 230, "rifle")
        },
        room9: () => {
            PropManager.spawn(446, 200, "table2")
            PropManager.spawn(405, 195, "chair2")
            PropManager.spawn(106, 480, "table1")
            PropManager.spawn(65, 480, "chair2")
            ItemManager.spawn(470, 520, "random")
            PropManager.spawn(65, 180, "chair2")
            EnemyManager.spawn(240, 329, 'small')
            EnemyManager.spawn(360, 329, 'small')
            PropManager.spawn(430, 430, "box")
        },
        room10: () => {
            PropManager.spawn(445, 225, "chair1")
            PropManager.spawn(485, 225, "chair1")
            PropManager.spawn(446, 240, "table2")
        
            PropManager.spawn(85, 225, "chair1")
            PropManager.spawn(125, 225, "chair1")
            PropManager.spawn(86, 240, "table2")
            ItemManager.spawn(480, 530, "random")
            PropManager.spawn(85, 425, "chair1")
            PropManager.spawn(125, 425, "chair1")
            PropManager.spawn(86, 440, "table1")
        
            PropManager.spawn(445, 425, "chair1")
            PropManager.spawn(485, 425, "chair1")
            PropManager.spawn(446, 440, "table1")
            ItemManager.spawn(60, 190, "random")
            EnemyManager.spawn(350, 350, 'medium')
            EnemyManager.spawn(400, 220, 'turret')
        },
        room11: () => {
            PropManager.spawn(445, 170, "soda")
        
            PropManager.spawn(85, 225, "chair1")
            PropManager.spawn(125, 225, "chair1")
            PropManager.spawn(86, 240, "table2")
            ItemManager.spawn(480, 530, "random")
            PropManager.spawn(85, 425, "chair1")
            PropManager.spawn(125, 425, "chair1")
            PropManager.spawn(86, 440, "table1")
        
            PropManager.spawn(445, 425, "chair1")
            PropManager.spawn(485, 425, "chair1")
            PropManager.spawn(446, 440, "table1")
            ItemManager.spawn(60, 190, "random")
            EnemyManager.spawn(350, 350, 'medium')
            EnemyManager.spawn(400, 220, 'small')
        },
        room12: () => {
            PropManager.spawn(364, 364, "box")
            PropManager.spawn(364, 300, "box")
            PropManager.spawn(364, 236, "box")
            PropManager.spawn(300, 236, "box")
            PropManager.spawn(236, 236, "box")
            PropManager.spawn(172, 300, "box")
            PropManager.spawn(172, 364, "box")
            PropManager.spawn(172, 236, "box")
            EnemyManager.spawn(70, 480, 'turret')
            EnemyManager.spawn(480, 200, 'turret')
            ItemManager.spawn(280, 350, "rifle")
            ItemManager.spawn(320, 320, "rifleAmmo")
            ItemManager.spawn(290, 320, "rifleAmmo")
            ItemManager.spawn(260, 320, "rifleAmmo")
        },
        };

static initRoom() {
    PropManager.spawn(0, 65, "wall", 600, 30); 
    PropManager.spawn(-60, 123, "wall", 30, 475);
    PropManager.spawn(630, 123, "wall", 30, 475);
    PropManager.spawn(0, 630, "wall", 600, 30);
    PropManager.spawn(0, 93, "wall", 258, 80);
    PropManager.spawn(340, 93, "wall", 258, 80);
    PropManager.spawn(0, 552, "wall", 258, 80);
    PropManager.spawn(340, 552, "wall", 258, 80);
    PropManager.spawn(-38, 173, "wall", 80, 140);
    PropManager.spawn(-38, 409, "wall", 80, 143);
    PropManager.spawn(558, 173, "wall", 80, 140);
    PropManager.spawn(558, 409, "wall", 80, 143);
}
static clearRoom(){
    for (let enemy of EnemyManager.enemies) {
        if (enemy.attackInterval) {
            clearInterval(enemy.attackInterval); 
            enemy.attackInterval = null;
        }
    }
    ParticleManager.clear()
    PropManager.clear()
    ItemManager.clear()
    EnemyManager.clear()
    BulletManager.clear()
    RoomManager.initRoom();
}
static loadNewRoom() {
    this.clearRoom();
    SoundEvents.playSound("door");       
    Game.score += 100;
    Game.roomCounter += 1;
    Game.player.difficulty = Game.player.difficulty + 0.03;



    let doors = [
        { side: 'left', x: -4, y: 313, closedType: "doorLocked", openType: "doorOpen", width: 12, height: 96 },
        { side: 'right', x: 590, y: 314, closedType: "doorLocked", openType: "doorOpen", width: 12, height: 100 },
        { side: 'top', x: 257, y: 125, closedType: "doorLockedH", openType: "doorOpenH", width: 86, height: 12 },
        { side: 'bottom', x: 257, y: 588, closedType: "doorLockedH", openType: "doorOpenH", width: 86, height: 12 }
    ];
    let cameFrom = "bottom";
        
    if (Game.player.position.y > 500) {
        cameFrom = 'top'; 
        Game.player.position.y = 150;
    } else if (Game.player.position.y < 230) {
        cameFrom = 'bottom'; 
        Game.player.position.y = 550;
    } else if (Game.player.position.x < 50) {
        cameFrom = 'right'; 
        Game.player.position.x = 550;
    } else {
        cameFrom = 'left'; 
        Game.player.position.x = 10;
    }

    
    let closedDoor = doors.find(door => door.side === cameFrom);
    PropManager.spawn(closedDoor.x, closedDoor.y, closedDoor.closedType, closedDoor.width, closedDoor.height)
    
    let remainingDoors = doors.filter(door => door.side !== cameFrom);

    
    let numberOfOpenDoors = Math.floor(Math.random() * 3) + 1; 

    
    let shuffledDoors = remainingDoors.sort(() => Math.random() - 0.5); 
    for (let i = 0; i < shuffledDoors.length; i++) {
        let door = shuffledDoors[i];
        let doorType = i < numberOfOpenDoors ? door.openType : door.closedType; 
        PropManager.spawn(door.x, door.y, doorType, door.width, door.height);
    }

RoomManager.loadRandomTemplate();
}
static loadRandomTemplate() {
    let roomNames = Object.keys(this.roomTemplates);
    let randomIndex = Math.floor(Math.random() * roomNames.length);
    let randomRoomName = roomNames[randomIndex];
    this.roomTemplates[randomRoomName]();
}
static getSaveData() {
    return {
        roomCounter: this.roomCounter,
        bullets: BulletManager.bullets ? BulletManager.bullets.map(bullet => bullet.getSaveData()) : [],
        roomCurrProps: PropManager.props ? PropManager.props.map(prop => prop.getSaveData()) : [],
        roomCurrItems: ItemManager.items ? ItemManager.items.map(item => item.getSaveData()) : [],
        roomCurrEnemies: EnemyManager.enemies ? EnemyManager.enemies.map(enemy => enemy.getSaveData()) : []
    };
}

static loadSaveData(data) {
    
    for (let enemy of EnemyManager.enemies) {
        if (enemy.attackInterval) {
            clearInterval(enemy.attackInterval);
            enemy.attackInterval = null;
        }
    }

    
    EnemyManager.enemies = [];

    
    this.roomCounter = data.roomCounter;

    
    BulletManager.bullets = data.bullets ? data.bullets.map(bulletData => new Bullet(bulletData.x, bulletData.y, bulletData.angle, bulletData.speed, bulletData.type)) : [];

    
    PropManager.props = data.roomCurrProps ? data.roomCurrProps.map(propData => {
        const propClass = PropManager.getPropClass(propData.type);
        return new propClass(propData.x, propData.y, propData.width, propData.height);
    }) : [];

    
    ItemManager.items = data.roomCurrItems ? data.roomCurrItems.map(itemData => {
        const itemClass = ItemManager.getItemClass(itemData.type);
        return new itemClass(itemData.x, itemData.y);
    }) : [];

    
    EnemyManager.enemies = data.roomCurrEnemies ? data.roomCurrEnemies.map(enemyData => {
        const enemyClass = EnemyManager.getEnemyClass(enemyData.type);
        return new enemyClass(enemyData.x, enemyData.y);
    }) : [];
}
}
class Player {
    constructor() {
        this.aims = false;
        this.isReloading = false;
        this.angle = 0;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.weapons = {
            pistol: new Pistol(),
            shotgun: new Shotgun(),
            rifle: new Rifle()
        };
        this.sprite = "sprites/player/pistol_idle.png";
        this.plComponent = new PlayerComponent(61, 70, 285, 10);
        this.position = new Vector2(this.plComponent.x, this.plComponent.y); 
        this.velocity = new Vector2(0, 0);
        this.speedDefault = 2
        this.speedMelee = 0.8;
        this.speedSighted = 0.8;
        this.speedReloading = 1.5; 
        this.currMoveSpeed = this.speedDefault; 
        this.size = new Vector2(30, 30);
        this.currentWeapon = this.weapons.pistol; 
        this.meleeAttack = new MeleeAttack(this,1,1); 

        
        this.colboxOffsetX = -15; 
        this.colboxOffsetY = -15; 

        
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    move(direction) {
        
        if (direction.x !== 0) this.velocity.x = direction.x;
        if (direction.y !== 0) this.velocity.y = direction.y;
    }

    updateMovement() {
        
        this.velocity.x = 0;
        this.velocity.y = 0;

        
        if (this.moveUp) this.velocity.y -= 1;
        if (this.moveDown) this.velocity.y += 1;
        if (this.moveLeft) this.velocity.x -= 1;
        if (this.moveRight) this.velocity.x += 1;

        
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.velocity.normalize();
            this.velocity.multiply(this.currMoveSpeed); 
        }
    }

    switchWeapon(weaponName) {
        if (this.weapons[weaponName] && this.weapons[weaponName].isUnlocked && !this.isReloading) {
            this.currentWeapon = this.weapons[weaponName];
        } else {
        }
    }

    shoot() {
        if (this.currentWeapon instanceof Rifle) {
            this.currentWeapon.startShooting(); 
        } else {
            this.currentWeapon.shoot(); 
        }
    }

    stopShooting() {
        if (this.currentWeapon instanceof Rifle) {
            this.currentWeapon.stopShooting();
        }
    }

    startAiming() {
        if (this.isReloading === false) {
            this.aims = true;
            this.currMoveSpeed = Game.player.speedSighted; 
        }
    }

    stopAiming() {
        if (this.isReloading === false) {
            this.aims = false;
            this.currMoveSpeed = Game.player.speedDefault;
        }
    }

    reload() {
        this.currentWeapon.reload();
    }

    pump() {
        if (this.currentWeapon instanceof Shotgun) {
            this.currentWeapon.pump();
        } else {
        }
    }

    unlockWeapon(weaponName) {
        if (this.weapons[weaponName]) {
            this.weapons[weaponName].unlock();
        }
    }

    restart() {
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.difficulty = Game.chosenDifficulty;
        this.currMoveSpeed =  Game.player.speedDefault;;
        this.aims = false;
        this.plComponent = new PlayerComponent(61, 70, 285, 10);
        this.position = new Vector2(this.plComponent.x, this.plComponent.y);
        this.health = 100;
        this.roomCounter = 0;
        PropManager.props = [];
        ItemManager.items = [];
        EnemyManager.enemies = [];
        this.weapons = {
            pistol: new Pistol(),
            shotgun: new Shotgun(),
            rifle: new Rifle()
        };
        this.currentWeapon = this.weapons.pistol;
        this.score = -100;
        GameField.update();
    }

    update() {
        if (this.health <= 0) {
            Game.shutdown();
        }

        
        this.updateMovement();

        
        this.position.add(this.velocity);

        
        this.plComponent.x = this.position.x;
        this.plComponent.y = this.position.y;

        
        this.meleeAttack.update();

        
        this.plComponent.update();

        
        for (let bullet of BulletManager.bullets) {
            if (Collider.checkCollision(this, bullet) && bullet.type !== "player") {
                let dmg = Math.ceil(Math.random() * 15 + 10 * (Game.player.difficulty - 1));
                SoundEvents.playSound("hit_bullet");
                this.health -= dmg;
                Game.score -= dmg;
                bullet.delete();
            }
        }
    }

    render(ctx) {
        this.plComponent.render(ctx);
        this.meleeAttack.render(ctx); 
    }

    getSaveData() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            weapons: {
                pistol: this.weapons.pistol,
                shotgun: this.weapons.shotgun,
                rifle: this.weapons.rifle
            },
            currentWeapon: this.currentWeapon.name,
            position: {
                x: this.plComponent.x,
                y: this.plComponent.y
            },
            difficulty: this.difficulty,
            score: Game.score,
            roomCounter: Game.roomCounter
        };
    }

    loadSaveData(data) {
        this.health = data.health;
        this.maxHealth = data.maxHealth;
    
        
        this.weapons.pistol = new Pistol();
        this.weapons.shotgun = new Shotgun();
        this.weapons.rifle = new Rifle();
    
        
        Object.assign(this.weapons.pistol, data.weapons.pistol);
        Object.assign(this.weapons.shotgun, data.weapons.shotgun);
        Object.assign(this.weapons.rifle, data.weapons.rifle);
    
        
        this.currentWeapon = this.weapons[data.currentWeapon];
    
        
        this.position = new Vector2(data.position.x, data.position.y); 
        this.plComponent.x = this.position.x;
        this.plComponent.y = this.position.y;
    
        
        this.difficulty = data.difficulty;
        Game.score = data.score;
        Game.roomCounter = data.roomCounter;
    }
}
class Menu {
    constructor(backgroundSprite) {
        if (backgroundSprite) {
            this.backgroundSprite = new Image();
            this.backgroundSprite.src = backgroundSprite;
        } else {
            this.backgroundSprite = null; 
        }
    }

    
    render(ctx) {
        if (this.backgroundSprite) {
            ctx.drawImage(this.backgroundSprite, 0, 0, GameField.canvas.width, GameField.canvas.height);
        }
    }

    
    handleInput(event) {}
}
class MainMenu extends Menu {
    constructor() {
        super("sprites/ui/main_menu_bg.png"); 
        this.buttons = [">Начать игру", "Загрузить игру", "Настройки", "Управление"];
        this.button = 0; 
    }

    render(ctx = GameField.context) {
        super.render(ctx); 
        

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20pt PixelCode"
        ctx.fillText(`Лучший результат : ${localStorage.getItem('highscore')}`, 70, 500)
        ctx.fillText(this.buttons[0], 40, 220);
        ctx.fillText(this.buttons[1], 40, 280);
        ctx.fillText(this.buttons[2], 40, 340);
        ctx.fillText(this.buttons[3], 40, 400);
    }

    handleInput(event) {
        if (event.type === "keydown") {
            switch (event.keyCode) {
                case 38: 
                    this.button = (this.button - 1 + this.buttons.length) % this.buttons.length;
                    for (let i = 0; i < this.buttons.length; i++) {
                        this.buttons[i] = this.buttons[i].replace(/^>/, '');
                    }
                    this.buttons[this.button] = '>' + this.buttons[this.button];
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 40: 
                    this.button = (this.button + 1) % this.buttons.length;
                    for (let i = 0; i < this.buttons.length; i++) {
                        this.buttons[i] = this.buttons[i].replace(/^>/, '');
                    }
                    this.buttons[this.button] = '>' + this.buttons[this.button];
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 13: 
                    this.handleButtonSelect();
                    break;
                case 27: 
                    
                    break;
            }
        }
    }

    handleButtonSelect() {
        switch (this.button) {
            case 0:
                Game.state = 'Game';
                Game.restart();
                Game.menuManager.popMenu(); 
                break;
            case 1: 
                SoundEvents.playSound("pistol_shoot");
                Game.loadGame();
                break;
            case 2: 
                SoundEvents.playSound("shotgun_pump");
                Game.menuManager.pushMenu(new OptionsMenu());
                break;
            case 3: 
                SoundEvents.playSound("shotgun_pump");
                Game.menuManager.pushMenu(new ControlsMenu());
                break;
        }
    }
}
class OptionsMenu extends Menu {
    constructor() {
        super("sprites/ui/options_menu.png"); 
        this.options = ["Музыка:", "Сложность:"];
        this.difficulties = ["Легкая", "Средняя", "Сложная"];
        this.musicStates = ["Включена", "Выключена"];
        this.optionRow = 0; 
        this.difficultyIndex = 1; 
        this.musicIndex = 0; 
    }

    render(ctx = GameField.context) {
        super.render(ctx); 
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20pt PixelCode";

        for (let i = 0; i < this.options.length; i++) {
            let optionText = this.options[i];
            if (i === this.optionRow) {
                optionText = '>' + optionText;
            }
            ctx.fillText(optionText, 100, 400 + i * 100);
        }

        let difficultyText = this.difficulties.join(' ');
            difficultyText = this.difficulties.map((difficulty, index) => {
                if (index === this.difficultyIndex) {
                    return '>' + difficulty + '<';
                } else {
                    return difficulty;
                }
            }).join(' ');
        ctx.fillText(`${difficultyText}`, 100, 540);

        
        let musicText = this.musicStates.join(' ');
            musicText = this.musicStates.map((state, index) => {
                if (index === this.musicIndex) {
                    return '>' + state + '<';
                } else {
                    return state;
                }
            }).join(' ');
        ctx.fillText(`${musicText}`, 100, 440);
    }

    handleInput(event) {
        if (event.type === "keydown") {
            Game.chosenDifficulty = this.difficultyIndex + 1;
            switch (event.keyCode) {
                case 38: 
                    this.optionRow = (this.optionRow - 1 + this.options.length) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 40: 
                    this.optionRow = (this.optionRow + 1) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 37: 
                    if (this.optionRow === 0) {
                        this.musicIndex = (this.musicIndex - 1 + this.musicStates.length) % this.musicStates.length;
                        if (this.musicIndex === 1) SoundEvents.musicEnabled = false;
                        if (this.musicIndex === 0) SoundEvents.musicEnabled = true;
                    } else if (this.optionRow === 1) {
                        this.difficultyIndex = (this.difficultyIndex - 1 + this.difficulties.length) % this.difficulties.length;
                    }
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 39: 
                    if (this.optionRow === 0) {
                        this.musicIndex = (this.musicIndex + 1) % this.musicStates.length;
                        if (this.musicIndex === 1) SoundEvents.musicEnabled = false;
                        if (this.musicIndex === 0) SoundEvents.musicEnabled = true;
                    } else if (this.optionRow === 1) {
                        this.difficultyIndex = (this.difficultyIndex + 1) % this.difficulties.length;
                    }
                    SoundEvents.playSound("pistol_shoot");
                    break;
                case 27: 
                    SoundEvents.playSound("pistol_shoot");
                    Game.menuManager.popMenu(); 
                    break;
            }
        }
    }
}
class InputMenu extends Menu {
    constructor() {
        super("sprites/ui/enter.png");
    }

    handleInput(event) {
        if (event.type === "keydown" && event.keyCode === 13){
                console.log('Input registered!')
                SoundEvents.playSound('pistol_shoot');
                this.handleButtonSelect();
            }
        }

    handleButtonSelect() {
        Game.menuManager.popMenu();
        Game.inputRegistered = true;
        Game.menuManager.pushMenu(new MainMenu());
    }
    render(ctx){
        super.render(ctx);
    }
}
class ControlsMenu extends Menu {
    constructor() {
        super("sprites/ui/controls_menu.png"); 
    }

    
    handleInput(event) {
        if (event.type === "keydown" && event.keyCode === 27) { 
            Game.menuManager.popMenu(); 
            SoundEvents.playSound("pistol_shoot"); 
        }
    }

    
    render(ctx = GameField.context) {
        super.render(ctx); 
    }
}
class PauseMenu extends Menu {
    constructor() {
        super("sprites/ui/blank.png");
        this.options = ["Продолжить", "Сохранить", "Загрузить", "В главное меню"];
        this.selectedOption = 0;
    }

    render(ctx) {
        
        ctx.save(); 
        super.render(ctx);
        ctx.fillStyle = "#000000"; 
        ctx.fillRect(0, 0, GameField.width, GameField.height); 
        ctx.restore(); 

        "Пауза"
        ctx.fillStyle = "#FFFFFF"; 
        ctx.font = "20pt PixelCode";
        ctx.fillText("Пауза", 40, 100);

        
        for (let i = 0; i < this.options.length; i++) {
            let optionText = this.options[i];
            if (i === this.selectedOption) {
                optionText = '>' + optionText; 
            }
            ctx.fillText(optionText, 40, 200 + i * 40);
        }
    }

    handleInput(event) {
        if (event.type === "keydown") {
            switch (event.keyCode) {
                case 38: 
                    this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;

                case 40: 
                    this.selectedOption = (this.selectedOption + 1) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;

                case 13: 
                    SoundEvents.playSound("pistol_shoot");
                    this.handleOptionSelect();
                    break;

                case 27:
                    this.selectedOption = 0;
                    this.handleOptionSelect();
                    break;
            }
        }
    }

    handleOptionSelect() {
        switch (this.selectedOption) {
            case 0: 
                Game.state = 'Game';
                Game.menuManager.popMenu(); 
                break;

            case 1: 
                Game.saveGame();
                break;

            case 2: 
                Game.loadGame();
                break;

            case 3: 
                Game.menuManager.loadMainMenu();
                break;
        }
    }
}
class GameOverMenu extends Menu {
    constructor() {
        super("sprites/ui/blank.png");
        this.options = ["Начать заново", "В главное меню"];
        this.selectedOption = 0;
    }

    render(ctx) {
        
        ctx.save(); 
        super.render(ctx);
        ctx.fillStyle = "#000000"; 
        ctx.fillRect(0, 0, GameField.width, GameField.height); 
        ctx.restore(); 

        "Пауза"
        ctx.fillStyle = "#FFFFFF"; 
        ctx.font = "20pt PixelCode";
        ctx.fillText(`Вы проиграли!`, 40, 100);
        ctx.fillText(`Результат: ${Game.score} очков.`, 40, 140);

        
        for (let i = 0; i < this.options.length; i++) {
            let optionText = this.options[i];
            if (i === this.selectedOption) {
                optionText = '>' + optionText; 
            }
            ctx.fillText(optionText, 40, 250 + i * 40);
        }
    }

    handleInput(event) {
        if (event.type === "keydown") {
            switch (event.keyCode) {
                case 38: 
                    this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;

                case 40: 
                    this.selectedOption = (this.selectedOption + 1) % this.options.length;
                    SoundEvents.playSound("pistol_shoot");
                    break;

                case 13: 
                    SoundEvents.playSound("pistol_shoot");
                    this.handleOptionSelect();
                    break;

                case 27:
                    this.selectedOption = 3;
                    this.handleOptionSelect();
                    break;
            }
        }
    }

    handleOptionSelect() {
        switch (this.selectedOption) {
            case 0: 
                Game.restart();
                Game.state = 'Game';
                Game.menuManager.popMenu(); 
                break;

            case 1: 
                Game.menuManager.loadMainMenu();
                break;
        }
    }
}
class MenuManager {
    constructor() {
        this.menus = []; 
    }

    pushMenu(menu) {
        this.menus.push(menu);
    }

    popMenu() {
        return this.menus.pop();
    }

    getCurrentMenu() {
        return this.menus[this.menus.length - 1];
    }

    render(ctx) {
        for (let menu of this.menus) {
            menu.render(ctx);
        }
    }
    loadMainMenu(){
        this.menus = [];
        this.pushMenu(new MainMenu());
    }

    handleInput(event) {
        let currentMenu = this.getCurrentMenu();
        if (currentMenu && currentMenu.handleInput) {
            currentMenu.handleInput(event);
        }
    }
}
class Game {
    static mousePosX;
    static mousePosY;  
    static roomCounter = 0;
    static inputRegistered = false;
    static player = null; 
    static floor = null; 
    static score = -100; 
    static state = 'Menu';
    static chosenDifficulty = 2; 
    
    static start() {
        ImagePreloader.init();
        if (localStorage.getItem('highscore') === undefined) {
            localStorage.setItem('highscore', 0);
        }
        this.score = localStorage.getItem('highscore');

        this.player = new Player();
        PlayerComponent.sprite = "sprites/player/pistol_idle.png";
        this.state = 'Menu';
        GameField.start();

        this.uiPistol = new HUDPistol(71, 49, 10, 10, null, 'sprites/ui/pistol.png', 'sprites/ui/pistol_outline.png');
        this.uiShotgun = new HUDShotgun(144, 47, 91, 10,'sprites/ui/shotgun_empty.png', 'sprites/ui/shotgun.png', 'sprites/ui/shotgun_outline.png', 'sprites/ui/shotgun_outline_pumped.png', 'sprites/ui/shotgun_pumped.png');
        this.uiRifle = new HUDRifle(175, 55, 246, 5,'sprites/ui/rifle_empty.png', 'sprites/ui/rifle.png', 'sprites/ui/rifle_outline.png');
        this.uiText = new HUDTextComponent();

        this.floor = new Component(600, 600, 0, 0);
        this.floor.setImageSource('sprites/enviroment/floor.png');
        this.menuManager = new MenuManager([]);
        this.menuManager.pushMenu(new InputMenu());

        window.addEventListener("keydown", InputEvents.handlePress);
        window.addEventListener("keyup", InputEvents.handleRel);
        window.addEventListener("mousedown", InputEvents.handleMousePress);
        window.addEventListener("mouseup", InputEvents.handleMouseRel);
        window.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        Object.defineProperty(window, 'give_all_weapons', {
            get: function () {
                Game.score = NaN
                Game.player.unlockWeapon("shotgun");
                Game.player.unlockWeapon("rifle");
                Game.player.weapons["rifle"].ammoReserve = 400;
                Game.player.weapons["shotgun"].ammoReserve = 400;
                SoundEvents.playSound('cheats')
                return 'Cheats activated: score disabled'
            }
          });
        Object.defineProperty(window, 'god', {
            get: function () {
                Game.player.health = NaN
                Game.score = NaN
                SoundEvents.playSound('cheats')
                return 'Cheats activated: score disabled'
            }
          });
        Object.defineProperty(window, 'pistol_inf_ammo', {
            get: function () {
                Game.player.weapons["pistol"]._currentAmmo = 9999;
                Game.score = NaN
                SoundEvents.playSound('cheats')
                return 'Cheats activated: score disabled'
            }
          });
    }

    static shutdown() {
        Game.state = 'GameOver'
        Game.deleteSaveData();
        Game.menuManager.pushMenu(new GameOverMenu);
        if (this.score > localStorage.highscore) {
            localStorage.setItem('highscore', this.score);
        }
    }
    static restart() {
        for (let enemy of EnemyManager.enemies) {
            if (enemy.attackInterval) {
                clearInterval(enemy.attackInterval); 
                enemy.attackInterval = null;
            }
        }
        Game.state = 'Game'
        this.score = -100;
        this.roomCounter = 0;
        Game.player.restart();
        RoomManager.loadNewRoom();
    }
    static pause() {
        GameField.togglePause();
    }
    static saveGame() {
        let saveData = {
            player: Game.player.getSaveData(),
            score: Game.score,
            roomManager: RoomManager.getSaveData()
        };
        localStorage.setItem('gameSave', JSON.stringify(saveData));
        console.log('Game saved');
    }

    static loadGame() {
        let saveData = JSON.parse(localStorage.getItem('gameSave'));
        if (saveData) {
            Game.state = 'Game';
            Game.menuManager.popMenu(); 
            Game.player.loadSaveData(saveData.player);
            Game.score = saveData.score;
            RoomManager.loadSaveData(saveData.roomManager);
            console.log('Game loaded');
        } else {
            console.log('No save data found');
        }
    }
    static deleteSaveData() {
        localStorage.removeItem('gameSave');
        console.log('Save data deleted.');
    }
}
class GameField {
    static canvas = document.createElement("canvas");
    static context = null;
    static animationFrameId = null;
    static inputMenu = new InputMenu();
    static isPaused = false;

    static start() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.canvas.id = "Window";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        let h1Element = document.querySelector(".title");
        h1Element.insertAdjacentElement("beforebegin", this.canvas);

        
        let myFont = new FontFace('PixelCode', 'url(fonts/PixelCode-Thin.otf)');
        myFont.load().then((font) => {
            document.fonts.add(font);
            console.log('Font loaded!');
        });

        this.startGameLoop();
    }

    static startGameLoop() {
        let lastTime = 0;
        let gameLoop = (timestamp) => {
            let deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            GameField.update(deltaTime);
            GameField.render();

            GameField.animationFrameId = requestAnimationFrame(gameLoop);
        };

        GameField.animationFrameId = requestAnimationFrame(gameLoop);
    }

    static stopGameLoop() {
        if (GameField.animationFrameId) {
            cancelAnimationFrame(GameField.animationFrameId);
            GameField.animationFrameId = null;
        }
    }

    static update(deltaTime) {
        if (Game.inputRegistered) {
            if (SoundEvents.musicEnabled === true) {
                SoundEvents.playMusic();
            } else {
                SoundEvents.stopMusic();
            }
            if (Game.state === 'Game') {
                Game.uiPistol.update(deltaTime);
                Game.uiShotgun.update(deltaTime);
                Game.uiRifle.update(deltaTime);

                EnemyManager.updateAll(deltaTime);
                ParticleManager.updateAll(deltaTime);
                PropManager.updateAll(deltaTime);
                ItemManager.updateAll(deltaTime);
                BulletManager.updateAll(deltaTime);
                Game.player.update(deltaTime);
            }
        }
    }

    static render() {
        GameField.clear();
        let ctx = GameField.context;
        switch (Game.state) {
            case 'Game':
                Game.floor.render(ctx);
                Game.uiPistol.render(ctx);
                Game.uiShotgun.render(ctx);
                Game.uiRifle.render(ctx);
                Game.uiText.render(ctx);

                ParticleManager.renderAll(ctx);
                PropManager.renderAll(ctx);
                ItemManager.renderAll(ctx);
                EnemyManager.renderAll(ctx);
                BulletManager.renderAll(ctx);
                Game.player.render(ctx);
                break;
            case 'Menu':
                Game.menuManager.render(ctx);
                break;
            default:
                Game.floor.render(ctx);
                Game.uiPistol.render(ctx);
                Game.uiShotgun.render(ctx);
                Game.uiRifle.render(ctx);
                Game.uiText.render(ctx);

                ParticleManager.renderAll(ctx);
                PropManager.renderAll(ctx);
                ItemManager.renderAll(ctx);
                EnemyManager.renderAll(ctx);
                BulletManager.renderAll(ctx);
                Game.player.render(ctx);
                Game.menuManager.render(ctx);
                break;
        }
    }

    static clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static togglePause() {
        if (Game.state === 'Game') {
            Game.state = 'Pause';
            console.log("Game paused");
            Game.menuManager.pushMenu(new PauseMenu());
        } else if (Game.state === 'Pause'){
            Game.state = 'Game';
            console.log("Game resumed");
            Game.menuManager.popMenu(); 
        }
    }
}
class ImagePreloader {
    
    static images = {};
    static totalAssets = 0;
    static loadedAssets = 0;

    
    static addImage(key, src) {
        this.totalAssets++;
        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.loadedAssets++;
            this.images[key] = img;
            if (this.isDone()) {
                console.log("All assets loaded!");
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
    }

    static isDone() {
        return this.loadedAssets === this.totalAssets;
    }

    
    static init() {

        
        this.addImage("player_pistol_idle", "sprites/player/pistol_idle.png");
        this.addImage("player_pistol_aim", "sprites/player/pistol_aim.png");
        this.addImage("player_shotgun_idle", "sprites/player/shotgun_idle.png");
        this.addImage("player_shotgun_aim", "sprites/player/shotgun_aim.png");
        this.addImage("player_shotgun_pump", "sprites/player/shotgun_pump.png");
        this.addImage("player_rifle_idle", "sprites/player/rifle_idle.png");
        this.addImage("player_rifle_aim", "sprites/player/rifle_aim.png");
        this.addImage("player_swing", "sprites/player/swing.png");

        
        this.addImage("enemy_small", "sprites/enemy/small.png");
        this.addImage("enemy_small_damaged", "sprites/enemy/small_damaged.png");
        this.addImage("enemy_medium", "sprites/enemy/medium.png");
        this.addImage("enemy_medium_damaged", "sprites/enemy/medium_damaged.png");
        this.addImage("enemy_turret", "sprites/enemy/turret.png");
        this.addImage("enemy_turret_damaged", "sprites/enemy/turret_damaged.png");

        
        this.addImage("floor", "sprites/enviroment/floor.png");
        this.addImage("box_wooden", "sprites/enviroment/box_wooden.png");
        this.addImage("box", "sprites/enviroment/box.png");
        this.addImage("chair1", "sprites/enviroment/chair1.png");
        this.addImage("chair2", "sprites/enviroment/chair2.png");
        this.addImage("cupboard", "sprites/enviroment/cupboard.png");
        this.addImage("computers", "sprites/enviroment/computers.png");
        this.addImage("soda", "sprites/enviroment/soda.png");
        this.addImage("soda_broken", "sprites/enviroment/soda_broken.png");
        this.addImage("table1", "sprites/enviroment/table1.png");
        this.addImage("table2", "sprites/enviroment/table2.png");
        this.addImage("door_locked", "sprites/enviroment/door_locked.png");
        this.addImage("door_locked_horisontal", "sprites/enviroment/door_locked_horisontal.png");
        this.addImage("door_unlocked", "sprites/enviroment/door_unlocked.png");
        this.addImage("door_unlocked_horisontal", "sprites/enviroment/door_unlocked_horisontal.png");
        this.addImage("colbox", "sprites/enviroment/colbox.png");

        
        this.addImage("medkit", "sprites/enviroment/medkit.png");
        this.addImage("sodacan", "sprites/enviroment/sodacan.png");
        this.addImage("ammobag", "sprites/enviroment/ammobag.png");
        this.addImage("shellbox", "sprites/enviroment/shellbox.png");
        this.addImage("shotgun", "sprites/enviroment/shotgun.png");
        this.addImage("rifle", "sprites/enviroment/rifle.png");

        
        this.addImage("shell_pistol", "sprites/particles/shell_pistol.png");
        this.addImage("shell_rifle", "sprites/particles/shell_rifle.png");
        this.addImage("shell_shotgun", "sprites/particles/shell_shotgun.png");
        this.addImage("metal", "sprites/particles/metal.png");
        this.addImage("yellow_metal", "sprites/particles/yellow_metal.png");
        this.addImage("wood", "sprites/particles/wood.png");
        this.addImage("glass", "sprites/particles/glass.png");

        
        this.addImage("main_menu_bg", "sprites/ui/main_menu_bg.png");
        this.addImage("options_menu", "sprites/ui/options_menu.png");
        this.addImage("controls_menu", "sprites/ui/controls_menu.png");
        this.addImage("blank", "sprites/ui/blank.png");
        this.addImage("pistol", "sprites/ui/pistol.png");
        this.addImage("pistol_outline", "sprites/ui/pistol_outline.png");
        this.addImage("shotgun", "sprites/ui/shotgun.png");
        this.addImage("shotgun_outline", "sprites/ui/shotgun_outline.png");
        this.addImage("shotgun_outline_pumped", "sprites/ui/shotgun_outline_pumped.png");
        this.addImage("shotgun_pumped", "sprites/ui/shotgun_pumped.png");
        this.addImage("rifle", "sprites/ui/rifle.png");
        this.addImage("rifle_outline", "sprites/ui/rifle_outline.png");
        this.addImage("rifle_empty", "sprites/ui/rifle_empty.png");
        this.addImage("shotgun_empty", "sprites/ui/shotgun_empty.png");

    }
}