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
            b.x += 10;
            b.count++;
        }
        if (this.bullets.length > 0 && this.bullets[this.bullets.length - 1].count > 10) {
            this.bullets.pop();
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
        // if() {

        // }
        var p = this.players[name];

        this.bullets.push({ x: p.x, y: p.y, rot: p.rot, count: 0 });
    }
}
