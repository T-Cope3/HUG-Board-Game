/**
 * Stuff to draw to.
 */
let canvas, ctx;

/**
 * Every tile in the game (a 2d array)
 */
let tiles = [];

/**
 * Dimensions of the window
 */
let w, h;

/**
 * The dimensions of each tile
 */
const DIMENSIONS = 64;

/**
 * Stores the camera offsets
 */
let camera = 
{
    x: 0,
    y: 0
};

/**
 * Stores the mouse coords
 */
let mouse =
{
    x: 0,
    y: 0
};

/**
 * Stores the corresponding colors to each player
 */
const playerColors = 
[
    '#333',
    '#b4b',
    '#4b0',
    '#b40',
    '#04b'
];

/**
 * Stores the dots available to each player (.length is how many players are playing)
 */
let players = [];

/**
 * The current player that's up
 * MAKE SURE THIS GOES FROM 1-4; 0 is neutral (as in no player)
 */
let currentPlayer = 1;

/**
 * No player owns this tile
 */
const NEUTRAL = 0;

/**
 * Every tile in the game
 */
class Tile
{
    constructor(x, y, player)
    {
        this._x = x;
        this._y = y;
		
		//Why, why would you ever do this?
        //this._player = player === undefined ? -1 : player;
		if(player === undefined)
		{
			this.player = -1;
		}
		else
		{
			this.player = player;
		}
    }

    get player() { return this._player; }
    set player(p) { this._player = p ; }
    
    get moveable() { return this.player !== -1; }

    get x() { return this._x; }
    get y() { return this._y; }

    set x(x) { this._x = x; }
    set y(y) { this._y = y; }

    get color() { return this.player !== -1 ? playerColors[this.player] : '#000' }
}

/**
 * Initializes the game to be played
 * @param {number} numPlayers How many players will be playing
 */
function init(numPlayers)
{
    players = [];
    for(let i = 0; i < numPlayers; i++)
        player.push(0);

    let mapW = 100, mapH = 100;

    for(let y = 0; y < mapH; y++)
    {
        tiles.push([]);

        for(let x = 0; x < mapW; x++)
        {
            if(Math.random() < .2)
                tiles[y].push(new Tile(x * DIMENSIONS, y * DIMENSIONS));
            else
                tiles[y].push(new Tile(x * DIMENSIONS, y * DIMENSIONS, NEUTRAL));
        }
    }
}

let downKeys = {};
window.onkeyup = (e) => { downKeys[e.key] = false; }
window.onkeydown = (e) => { downKeys[e.key] = true; }

window.onmousemove = e =>
{
    mouse.x = e.x;
    mouse.y = e.y;
};

window.onload = () =>
{
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = w = window.innerWidth;
    canvas.height = h = window.innerHeight;

    init();
    draw();
};

window.onresize = () =>
{
    canvas.width = w = window.innerWidth;
    canvas.height = h = window.innerHeight;
};

function tick()
{
    // Key codes https://keycode.info/
    if(downKeys['ArrowLeft'] || downKeys['a'])
        camera.x -= 5;
    if(downKeys['ArrowRight'] || downKeys['d'])
        camera.x += 5;
    if(downKeys['ArrowUp'] || downKeys['w'])
        camera.y -= 5;
    if(downKeys['ArrowDown'] || downKeys['s'])
        camera.y += 5;

    camera.x = clamp(camera.x, 0, tiles[0].length * DIMENSIONS - w);
    camera.y = clamp(camera.y, 0, tiles.length * DIMENSIONS - h);
}

function clamp(v, min, max)
{
    if(v < min)
        return min;
    if(v > max)
        return max;

    return v;
}

function draw()
{
    requestAnimationFrame(draw);
    tick();

    ctx.clearRect(0, 0, w, h);

    let tileOver = getTileMouseOver();

    for(let y = Math.floor(camera.y / DIMENSIONS); y < (camera.y + h) / DIMENSIONS; y++)
    {
        for(let x = Math.floor(camera.x / DIMENSIONS); x < (camera.x + w) / DIMENSIONS; x++)
        {
            let tile = tiles[y][x];

            let drawX = tile.x - camera.x;
            let drawY = tile.y - camera.y;

            ctx.fillStyle = tile.color;
            ctx.fillRect(drawX, drawY, DIMENSIONS, DIMENSIONS);

            // Shows the user what tile they're hovering over
            if(tile.moveable && tileOver === tile)
            {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(drawX, drawY, DIMENSIONS, DIMENSIONS);
            }

            ctx.fillStyle = 'black';
            ctx.strokeRect(drawX, drawY, DIMENSIONS, DIMENSIONS);
        }
    }
}

/**
 * Gets the tile the mouse is over, or null if it isn't over any tile
 */
function getTileMouseOver()
{
    if(mouse.x < 0 || mouse.x > w || mouse.y < 0 || mouse.y > h)
        return null;

    let iX = Math.floor((mouse.x + camera.x) / DIMENSIONS);
    let iY = Math.floor((mouse.y + camera.y) / DIMENSIONS);

    return tiles[iY][iX];
}