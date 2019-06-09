'use strict'

module.exports = class Game {
    constructor(connections) {
        this.fps = 45;
        this.players = {};
        this.connections = connections;
        this.bullets = [];
    }

    start() {
        this.physics_loop = setInterval(function() { this.updateState(); }.bind(this), this.fps);
        this.runnning = true;
    }

    stop() {
        clearInterval(this.physics_loop);
        this.running = false;
    }

    isRunning() {
        return this.running;
    }

    calculateHit(b) {
        for (var name in this.players) {
            var p = this.players[name];
            if (name != b.name && b.hit != true && Math.abs(p.x - b.x) <= 15 && Math.abs(p.y - b.y) <= 15) {

                p.health -= 10;
                b.hit = true;
                if (p.health <= 0 && name in this.connections) {
                    this.connections[name].emit("died");
                    this.removeClient(name);
                }
            }
        }
    }

    updateState() {
        this.delta_time = Date.now() - this.last_update;
        this.last_update = Date.now();



        for (var b of this.bullets) {
            b.x += b.x_speed * b.count;
            b.y += b.y_speed * b.count;
            b.count++;

            this.calculateHit(b);

        }

        let max_bullet_life = 30;

        for (var b of this.bullets) {

            if (b.count > max_bullet_life) {
                this.bullets.shift();
            }


        }




        this.sendUpdates();
    }

    sendUpdates() {

        for (var i in this.connections) {
            var c = this.connections[i];
            c.emit("players", { players: this.players, bullets: this.bullets });
        }
    }

    updatePlayer(name, player) {
        this.players[name] = player;
    }

    addPlayer(name, player) {
        this.players[name] = player;
    }

    shoot(name, shot_x, shot_y) {
        if (!(name in this.players))
            return;
        var p = this.players[name];

        // console.log(p.x, p.y, shot_x, shot_y)

        var speed = 5;

        let x = shot_x - p.x;
        let y = shot_y - p.y;

        let slope = (y / x);


        let x_speed = 1;
        let y_speed = slope;

        if (shot_x < p.x) {
            y_speed = -y_speed;
            x_speed = -x_speed;
        }

        // let norm = Math.sqrt((x * x) + (y * y));

        // let x_speed = (x / norm);
        // let y_speed = (y / norm);



        this.bullets.push({ x: p.x, y: p.y, count: 0, x_speed, y_speed, name });


    }

    removeClient(username) {
        delete this.players[username]
        delete this.connections[username]
        console.log(username + " left the game")
    }
}
