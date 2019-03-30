var FPS = 60;

// sessionStorage.setItem("username", username);
// var socket = io.connect({ query: "username=" + sessionStorage.getItem("username") });


function main() {
    var socket = io.connect({ query: "username=" + sessionStorage.getItem("username") });

    socket.on('connect', function(data) {
        init_game(socket);
    });
}

main();

function init_game(socket) {
    var last_update = Date.now();
    var game = new Game()
    game.init_socket(socket)

    var interval = setInterval(function() {
            var delta_time = Date.now() - last_update;
            last_update = Date.now();
            game.Update(socket, delta_time);
            game.Render(delta_time);
        },
        1000 / FPS);

    socket.emit('init_client', "hello");
}



class Game {

    constructor() {

        // this.
        // ctx.drawImage(heroImage, hero.x, hero.y, 50, 50);

        // Hero image
        this.heroReady = false;
        this.heroImage = new Image();
        this.heroImage.onload = function() {
            this.heroReady = true;
        }.bind(this);
        this.heroImage.src = "images/west_idle_animation_by_hero_in_pixels.gif";
        this.heroImage.height = "50";

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.player = new Player({ x: 10, y: 10, h: 10, w: 10, rot: 0 });
        this.player.init_controller();
        this.players = [];
        this.bullets = [];
        this.mouse_x = 0;
        this.mouse_y = 0;

    }

    init_socket(socket) {
        socket.on('players', function(info) {
            this.players = info.players;
            this.bullets = info.bullets;
        }.bind(this));
    }

    Update(socket, delta_time) {
        this.player.Update(delta_time);
        socket.emit("move", this.player.loc);

        if (this.player.shoot) {
            socket.emit("shoot");
        }

    }

    Render(delta_time) {
        let ctx = this.ctx;
        let canvas = this.canvas;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.player.Render(ctx);

        for (var i in this.players) {
            var p = this.players[i];
            drawBox(ctx, p, "blue")
        }

        for (var b of this.bullets) {
            drawBox(ctx, { x: b.x, y: b.y, h: 2, w: 2 }, "red");
        }


        $("body").mousemove(function(e) {
            var rect = canvas.getBoundingClientRect();
            this.mouse_x = e.clientX - rect.left;
            this.mouse_y = e.clientY - rect.top;
            this.player.setRotation(this.mouse_x, this.mouse_y)
        }.bind(this));
    }

}

function drawBox(ctx, box, color) {
    ctx.fillStyle = color;
    ctx.fillRect(box.x, box.y, box.w, box.h);
}

class Player {

    constructor(loc) {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.shoot = false;

        this.loc = loc;
    }

    init_controller() {
        document.addEventListener('keydown', this.checkKeyDown.bind(this));
        document.addEventListener('keyup', this.checkKeyUp.bind(this));
    }

    Update(delta_time) {

        this.setRotation();

        if (this.left) {
            this.loc.x--;
        }
        if (this.right) {
            this.loc.x++;
        }
        if (this.up) {
            this.loc.y--;
        }
        if (this.down) {
            this.loc.y++;
        }

    }

    setRotation(mouse_x, mouse_y) {

        let adjacent = mouse_x - this.loc.x;
        let opposite = mouse_y - this.loc.y;

        let rad2deg = 180 / Math.PI;
        if (adjacent === 0) {
            return;
        }
        else if (adjacent > 0 && opposite < 0) { //First Quadrant
            let rot = Math.atan(-opposite / -adjacent) * rad2deg;
            this.loc.rot = rot + 360;
        }
        else if (adjacent > 0 && opposite > 0) { //Second Quadrant
            this.loc.rot = Math.atan(opposite / adjacent) * rad2deg;
        }
        else if (adjacent < 0 && opposite > 0) { //Third Quadrant
            let rot = Math.atan(opposite / adjacent) * rad2deg;
            this.loc.rot = rot + 180;
        }
        else if (adjacent < 0 && opposite < 0) { //Fourth Quadrant
            let rot = Math.atan(opposite / adjacent) * rad2deg;
            this.loc.rot = rot + 180;
        }
    }

    Render(ctx, delta_time) {
        // drawBox(ctx, this.loc, "blue");
        return;
    }


    checkKeyDown(evt) {
        const KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_LEFT = 37,
            KEY_RIGHT = 39,
            keyD = 68,
            keyS = 83,
            keyA = 65,
            keyW = 87,
            space = 32;

        evt.preventDefault();
        console.log(evt.keyCode)
        if (evt.keyCode === KEY_LEFT)
            this.left = true;
        if (evt.keyCode === KEY_RIGHT)
            this.right = true;
        if (evt.keyCode === KEY_UP)
            this.up = true;
        if (evt.keyCode === KEY_DOWN)
            this.down = true;

        if (evt.keyCode === keyA)
            this.left = true;
        if (evt.keyCode === keyD)
            this.right = true;
        if (evt.keyCode === keyW)
            this.up = true;
        if (evt.keyCode === keyS)
            this.down = true;
        if (evt.keyCode === space) {
            this.shoot = true;
            console.log("shot fired")
        }
    }

    checkKeyUp(evt) {
        const KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_LEFT = 37,
            KEY_RIGHT = 39,
            keyD = 68,
            keyS = 83,
            keyA = 65,
            keyW = 87,
            space = 32;

        evt.preventDefault();
        if (evt.keyCode === KEY_LEFT)
            this.left = false;
        if (evt.keyCode === KEY_RIGHT)
            this.right = false;
        if (evt.keyCode === KEY_UP)
            this.up = false;
        if (evt.keyCode === KEY_DOWN)
            this.down = false;
        if (evt.keyCode === keyA)
            this.left = false;
        if (evt.keyCode === keyD)
            this.right = false;
        if (evt.keyCode === keyW)
            this.up = false;
        if (evt.keyCode === keyS)
            this.down = false;
        if (evt.keyCode === space) {
            this.shoot = false;

        }

    }

}
