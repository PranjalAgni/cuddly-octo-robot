var cols = 50;
var rows = 50;
var grid = new Array(cols);
//Vertex to be computed.
var openSet = [];
//Vertex that are computed.
var closedSet = [];
//starting point (i.e. extreme top left corner)
var start;
//end point (i.e. extreme end right corner)
var end;
// w = width of each pixel , h = height of each pixel
var w, h;
//Our path from start to end if exist.
var path = [];
//To tell if solution exist or not
var nosolution = false;


//To remove the element if its present in the set.
function removeFromSet(set, elt) {
    for (var i = set.length - 1; i >= 0; i--) {
        if (set[i] === elt) {
            set.splice(i, 1);
        }
    }
}


//calculation of heuristic using Manhattan Distance.
function heuristic(a, b) {
    var d = max(abs(a.x - b.x) , abs(a.y - b.y));
    return d;
}


//Property of every pixel in the grid.
function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;
    this.wall = 0;


    if (random(1) < 0.1) {
        this.wall = 1;
    }

    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0);
            noStroke();
            ellipse(this.x * w + w / 2, this.y * h + h / 2, w/2, h/2);
        }
        

        //rect(this.x * w, this.y * h, w - 1, h - 1);
    }

    //add neighbour to each pixel.
    this.addNeighbour = function (grid) {
        var i = this.x;
        var j = this.y;

        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }

        if (i < cols - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }

        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }

        if (j < rows - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
    }
}

function setup() {
    createCanvas(400, 400);
    console.log('A*');

    //calculation of w , h of pixels.
    w = width / cols;
    h = height / rows;

    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbour(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    //start and end cannot be a wall
    start.wall = false;
    end.wall = false;
    //Let's start computing by pushing open set.
    openSet.push(start);

}


function draw() {

    /*
        # DESCRIPTION ABOUT WHATS HAPPENING HERE:
        1. We will extract that vertex which has smallest value of f(n) from openSet.

        2. Store that extracted vertex in current.

        3. Compute every neighbour of current (g ,h === values) and push neighbour to openSet.

        4. Perform above steps till (current === end)

        5. If openSet is empty but condition in 4th step is not satisfied then print no solution.
    */
    if (openSet.length > 0) {
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];
        removeFromSet(openSet, current);
        closedSet.push(current);

        var neighbours = current.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            if (!closedSet.includes(neighbour) && !neighbour.wall) {
                var tempG = current.g + 1;

                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                }
                else {
                    neighbour.g = tempG;
                    openSet.push(neighbour);
                }

                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.previous = current;
            }

        }

        if (current === end) {
            console.log("We're done");
            console.log(current.f);
            noLoop();
        }


    }
    else {
        console.log('No solution');
        nosolution = true;
        noLoop();
    }


    //console.log(grid);
    background(255);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

   if (!nosolution) {
       path = [];
       var temp = current;
       path.push(current);
       while (temp.previous) {
           path.push(temp.previous);
           temp = temp.previous;
       }
   }

    for (var i = 0; i < path.length; i++) {
        //path[i].show(color(0, 0, 255));
    }

    noFill();
    stroke(255,0,200);
    strokeWeight(w/2);
    beginShape();
        for (var i = 0; i<path.length; i++) {
            vertex(path[i].x * w + w/2 , path[i].y * h + h/2);
        }
    endShape();


}
