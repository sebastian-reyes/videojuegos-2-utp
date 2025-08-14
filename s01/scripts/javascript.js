class Escena extends Phaser.Scene {
    preload() {
        this.load.image('fondo', '../img/fondo.jpg');
        this.load.spritesheet('bola', '../img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('mano1', '../img/mano1.png');
        this.load.image('mano2', '../img/mano2.png');
        this.load.image('leftBtn', '../img/flecha.png');
    }

    create() {

        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar')

        //Primer Jugador
        this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
        this.mano1.setImmovable(true);
        this.mano1.setBounce(10);
        this.mano1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano1)
        this.mano1.setCollideWorldBounds(true);

        //Segundo Jugador
        this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
        this.mano2.setImmovable(true);
        this.mano2.setBounce(10)
        this.mano2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano2)
        this.mano2.setCollideWorldBounds(true);

        const vel = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;

        const derechaOIzquierda = Math.floor(Math.random() * 2);
        if (derechaOIzquierda === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * vel;
        const vy = Math.cos(anguloInicial) * vel;
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //Controles visuales para Jugador 1
        this.controlesVisuales(
            { x: 50, y: 50 },
            { x: 50, y: 590 },
            this.mano1
        );

        //Controles visuales para Jugador 2
        this.controlesVisuales(
            { x: 910, y: 50 },
            { x: 910, y: 590 },
            this.mano2
        );

        this.alguienGano = false;

        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.1;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1
            this.colocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1
            this.colocarPelota();
        }

        //Movimiento 1er Jugador
        if (this.wKey.isDown || this.mano1.getData('direccionVertical') === 1) {
            this.mano1.y = this.mano1.y - 5;
        } else if (this.sKey.isDown || this.mano1.getData('direccionVertical') === -1) {
            this.mano1.y = this.mano1.y + 5
        }

        //Movimiento 2do Jugador
        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y = this.mano2.y - 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y = this.mano2.y + 5
        }
    }

    pintarMarcador() {
        this.marcadorMano1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorMano2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    colocarPelota() {
        const vel = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;

        const derechaOIzquierda = Math.floor(Math.random() * 2);
        if (derechaOIzquierda === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * vel;
        const vy = Math.cos(anguloInicial) * vel;

        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.play('brillar');

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola)

        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.physics.add.collider(this.bola, this.mano1);
        this.physics.add.collider(this.bola, this.mano2);

        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        player.setData('direccionVertical', 0);
        const upBtn = this.add.sprite(btn1.x, btn1.y, 'leftBtn').setInteractive();
        const downBtn = this.add.sprite(btn2.x, btn2.y, 'leftBtn').setInteractive();
        downBtn.flipY = true;

        downBtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });
        upBtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });
        downBtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
        upBtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade'
    }
};

new Phaser.Game(config)