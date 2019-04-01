'use strict'

module.exports = class Game {
    constructor(connections) {
        this.fps = 45;
        this.players = {};
        this.connections = connections;
        this.bullets = []
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

    updateState() {
        this.delta_time = Date.now() - this.last_update;
        this.last_update = Date.now();

        for (var b of this.bullets) {
            b.x += b.x_speed;
            b.y += b.y_speed;
            b.count++;

            for (var name in this.players) {
                var p = this.players[name]
                if (name != b.name && b.hit != true && Math.abs(p.x - b.x) <= 9 && Math.abs(p.y - b.y) <= 9) {

                    p.health -= 10;
                    b.hit = true;
                    if (p.health <= 0 && name in this.connections) {
                        this.connections[name].emit("died");
                        this.removeClient(name);
                    }
                }
            }
        }
        if (this.bullets.length > 0 && this.bullets[0].count > 50) {
            this.bullets.shift();
            // console.log(this.bullets)
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

    shoot(name) {
        if (!(name in this.players))
            return;
        var p = this.players[name];

        // if (p.bullets.length > 10) {
            //     return;
            // }

        var speed = 5;
        var theta = (p.rot + 90) * (180 / Math.PI);
        var x_speed = Math.sin(theta) * speed;
        var y_speed = Math.cos(theta) * speed;

        // console.log(x_speed)

        this.bullets.push({ x: p.x, y: p.y, rot: p.rot, count: 0, x_speed, y_speed, name });
    }

    removeClient(username) {
        delete this.players[username]
        delete this.connections[username]
        console.log(username + " left the game")
    }
}
