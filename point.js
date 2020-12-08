export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    static AngleBetweenPoints(pointA, pointB) {
        var dy = pointB.y - pointA.y;
        var dx = pointB.x - pointA.x;
        var theta = Math.atan2(dy, dx);
        return theta;
    }   
}