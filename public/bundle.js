/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/client_game.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/client_game.js":
/*!***********************************!*\
  !*** ./src/client/client_game.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var FPS = 60;\n\n// sessionStorage.setItem(\"username\", username);\n// var socket = io.connect({ query: \"username=\" + sessionStorage.getItem(\"username\") });\n\n\nfunction main() {\n    var socket = io.connect({ query: \"username=\" + sessionStorage.getItem(\"username\") });\n\n    socket.on('connect', function(data) {\n        init_game(socket);\n    });\n}\n\nmain();\n\nfunction init_game(socket) {\n    var last_update = Date.now();\n    var game = new Game()\n    game.init_socket(socket)\n\n    var interval = setInterval(function() {\n            var delta_time = Date.now() - last_update;\n            last_update = Date.now();\n            game.Update(socket, delta_time);\n            game.Render(delta_time);\n        },\n        1000 / FPS);\n\n    socket.emit('init_client', \"hello\");\n}\n\n\n\nclass Game {\n\n    constructor() {\n\n\n        // ctx.drawImage(shipImage, ship.x, ship.y, 50, 50);\n\n        // ship image\n        this.shipReady = false;\n        this.shipImage = new Image();\n        this.shipImage.onload = function() {\n            this.shipReady = true;\n        }.bind(this);\n        this.shipImage.src = \"assets/greenShip.svg\";\n        // this.shipImage.src = \"https://farm3.staticflickr.com/2949/15209453240_dbb94dc67a_b.jpg\";\n        this.shipImage.height = \"auto\";\n\n        //swag\n\n        this.canvas = document.getElementById('canvas');\n        this.ctx = this.canvas.getContext(\"2d\");\n\n\n        let x_start = Math.floor(Math.random() * 500);\n        let y_start = Math.floor(Math.random() * 500);\n\n        console.log(\"x\", x_start, \"y\", y_start)\n\n        this.player_name = sessionStorage.getItem(\"username\");\n\n        this.player = new Player({ x: x_start, y: y_start, h: 10, w: 10, rot: 0, health: 100 });\n        this.player.init_controller();\n        this.players = [];\n        this.bullets = [];\n        this.mouse_x = 0;\n        this.mouse_y = 0;\n\n    }\n\n    init_socket(socket) {\n        socket.on('players', function(info) {\n            this.players = info.players;\n            this.bullets = info.bullets;\n            if (this.player_name in this.players)\n                this.player.loc.health = this.players[this.player_name].health;\n        }.bind(this));\n\n        socket.on('died', function(info) {\n            alert(\"You died!\")\n            location.reload();\n        }.bind(this));\n    }\n\n    Update(socket, delta_time) {\n        this.player.Update(delta_time);\n        socket.emit(\"move\", this.player.loc);\n\n        if (this.player.shoot) {\n            socket.emit(\"shoot\");\n        }\n\n    }\n\n    Render(delta_time) {\n        let ctx = this.ctx;\n        let canvas = this.canvas;\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n        this.player.Render(ctx);\n\n        for (var name in this.players) {\n            var p = this.players[name];\n            // drawBox(ctx, p, \"blue\")\n\n            ctx.drawImage(this.shipImage, p.x, p.y, 100, 50);\n            ctx.font = \"30px Verdana\";\n            ctx.fillText(name, p.x, p.y, 100);\n\n        }\n\n        for (var b of this.bullets) {\n            drawBox(ctx, { x: b.x + 30, y: b.y + 30, h: 5, w: 5 }, \"white\");\n        }\n\n\n        $(\"body\").mousemove(function(e) {\n            var rect = canvas.getBoundingClientRect();\n            this.mouse_x = e.clientX - rect.left;\n            this.mouse_y = e.clientY - rect.top;\n            this.player.setRotation(this.mouse_x, this.mouse_y)\n        }.bind(this));\n    }\n\n}\n\nfunction drawBox(ctx, box, color) {\n    ctx.fillStyle = color;\n    ctx.fillRect(box.x, box.y, box.w, box.h);\n}\n\nclass Player {\n\n    constructor(loc) {\n        this.left = false;\n        this.right = false;\n        this.up = false;\n        this.down = false;\n        this.shoot = false;\n\n        this.loc = loc;\n    }\n\n    init_controller() {\n        document.addEventListener('keydown', this.checkKeyDown.bind(this));\n        document.addEventListener('keyup', this.checkKeyUp.bind(this));\n    }\n\n    Update(delta_time) {\n\n        this.setRotation();\n\n        var speed = 2;\n\n        if (this.left) {\n            this.loc.x -= speed;\n        }\n        if (this.right) {\n            this.loc.x += speed;\n        }\n        if (this.up) {\n            this.loc.y -= speed;\n        }\n        if (this.down) {\n            this.loc.y += speed;\n        }\n\n    }\n\n    setRotation(mouse_x, mouse_y) {\n\n        let adjacent = mouse_x - this.loc.x;\n        let opposite = mouse_y - this.loc.y;\n\n        let rad2deg = 180 / Math.PI;\n        if (adjacent === 0) {\n            return;\n        }\n        else if (adjacent > 0 && opposite < 0) { //First Quadrant\n            let rot = Math.atan(-opposite / -adjacent) * rad2deg;\n            this.loc.rot = rot + 360;\n        }\n        else if (adjacent > 0 && opposite > 0) { //Second Quadrant\n            this.loc.rot = Math.atan(opposite / adjacent) * rad2deg;\n        }\n        else if (adjacent < 0 && opposite > 0) { //Third Quadrant\n            let rot = Math.atan(opposite / adjacent) * rad2deg;\n            this.loc.rot = rot + 180;\n        }\n        else if (adjacent < 0 && opposite < 0) { //Fourth Quadrant\n            let rot = Math.atan(opposite / adjacent) * rad2deg;\n            this.loc.rot = rot + 180;\n        }\n    }\n\n    Render(ctx, delta_time) {\n        // drawBox(ctx, this.loc, \"blue\");\n        return;\n    }\n\n\n    checkKeyDown(evt) {\n        const KEY_UP = 38,\n            KEY_DOWN = 40,\n            KEY_LEFT = 37,\n            KEY_RIGHT = 39,\n            keyD = 68,\n            keyS = 83,\n            keyA = 65,\n            keyW = 87,\n            space = 32;\n\n        evt.preventDefault();\n        // console.log(evt.keyCode)\n        if (evt.keyCode === KEY_LEFT)\n            this.left = true;\n        if (evt.keyCode === KEY_RIGHT)\n            this.right = true;\n        if (evt.keyCode === KEY_UP)\n            this.up = true;\n        if (evt.keyCode === KEY_DOWN)\n            this.down = true;\n\n        if (evt.keyCode === keyA)\n            this.left = true;\n        if (evt.keyCode === keyD)\n            this.right = true;\n        if (evt.keyCode === keyW)\n            this.up = true;\n        if (evt.keyCode === keyS)\n            this.down = true;\n        if (evt.keyCode === space) {\n            this.shoot = true;\n            console.log(\"shot fired\")\n        }\n    }\n\n    checkKeyUp(evt) {\n        const KEY_UP = 38,\n            KEY_DOWN = 40,\n            KEY_LEFT = 37,\n            KEY_RIGHT = 39,\n            keyD = 68,\n            keyS = 83,\n            keyA = 65,\n            keyW = 87,\n            space = 32;\n\n        evt.preventDefault();\n        if (evt.keyCode === KEY_LEFT)\n            this.left = false;\n        if (evt.keyCode === KEY_RIGHT)\n            this.right = false;\n        if (evt.keyCode === KEY_UP)\n            this.up = false;\n        if (evt.keyCode === KEY_DOWN)\n            this.down = false;\n        if (evt.keyCode === keyA)\n            this.left = false;\n        if (evt.keyCode === keyD)\n            this.right = false;\n        if (evt.keyCode === keyW)\n            this.up = false;\n        if (evt.keyCode === keyS)\n            this.down = false;\n        if (evt.keyCode === space) {\n            this.shoot = false;\n\n        }\n\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/client/client_game.js?");

/***/ })

/******/ });