import { Point } from "./point.js";
export class Spotlight {
    constructor(position, rotation, beamDistance, color, context) {
        this.beamDistance = beamDistance;

        this.beam = new Path2D();
        this.beam.moveTo(0, 0);
        this.beam.lineTo(this.beamDistance, 200);
        this.beam.lineTo(this.beamDistance, -200);
        this.beam.closePath();

        this.position = position;
        this.rotation = rotation;
        this.color = color;
        this.shadows = [];

        this.context = document.createElement('canvas').getContext('2d');
        this.context.canvas.width = context.canvas.width;
        this.context.canvas.height = context.canvas.height;        
    }

    pointAt(point) {
        this.rotation = Math.atan2(point.y - this.position.y, point.x - this.position.x);
    }

    calculateShadows(rectangles) {
        rectangles.forEach(rectangle => {
            const rectPoints = rectangle.getCornerPoints();

            rectPoints.sort((a, b) => {
                return Math.abs(Point.AngleBetweenPoints(a, this.position)) - Math.abs(Point.AngleBetweenPoints(b, this.position));
            });

            const finalPoints = [rectPoints[0], rectPoints[3]];

            finalPoints.push(this.getShadowEdgeEnd(finalPoints[1]));
            finalPoints.push(this.getShadowEdgeEnd(finalPoints[0]));

            const shadow = new Path2D();
            finalPoints.forEach((point, index) => {
                if (index === 0) {
                    shadow.moveTo(point.x, point.y);
                }
                else {
                    shadow.lineTo(point.x, point.y);
                }
            });
            shadow.closePath();
            this.shadows.push(shadow);
        });
    }

    draw() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.rotation);
        this.context.fillStyle = this.color;
        this.context.fill(this.beam);
        this.context.restore();

        this.context.save();
        this.context.fillStyle = '#000';
        this.shadows.forEach(shadow => {
            this.context.fill(shadow);
        });
        this.context.restore();
    }

    getBitmap() {
        const imageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
        return createImageBitmap(imageData);
    }

    getShadowEdgeEnd(startingPoint) {
        const angleOfPath = Point.AngleBetweenPoints(this.position, startingPoint);
        return new Point(
            startingPoint.x + this.beamDistance * Math.cos(angleOfPath),
            startingPoint.y + this.beamDistance * Math.sin(angleOfPath)
        );
    }
}
