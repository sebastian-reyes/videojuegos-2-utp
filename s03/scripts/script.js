var juego = new Phaser.Game(370, 600, Phaser.CANVAS, 'bloque-juego');
var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var enemigos;
var balas;
var tiempoBala = 0;
var botonDisparo;

var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'assets/img/bg.png');
        juego.load.spritesheet('animacion', 'assets/img/spritesheet1.png', 256, 256);
        juego.load.spritesheet('enemigo', 'assets/img/enemigo1.png', 48, 48);
    },

    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 600, 'fondo');
        personaje = juego.add.sprite(80, 380, 'animacion')
        personaje.animations.add('movimiento', [0, 1, 2, 3, 4], 10, true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemigo = enemigos.create(x * 50, y * 50, 'enemigo');
                enemigo.anchor.setTo(0.5);
            }
        }
        enemigos.x = 85;
        enemigos.y = 100;

        var animacionEnemigo = juego.add.tween(enemigos).to(
            { x: 200 },
            1000,
            Phaser.Easing.Linear.None,
            true,
            0,
            1000,
            true
        );

        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    },

    update: function () {
        if (teclaDerecha.isDown) {
            personaje.x++;
            personaje.animations.play('movimiento');
        } else if (teclaIzquierda.isDown) {
            personaje.x--;
            personaje.animations.play('movimiento');
        } else {
            personaje.animations.stop();
        }
    }
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');