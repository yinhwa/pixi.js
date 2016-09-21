import math from '../math';
const Rectangle = math.Rectangle;

/**
 * 'Builder' pattern for bounds rectangles
 * Axis-Aligned Bounding Box
 * It is not a shape! Its mutable thing, no 'EMPTY' or that kind of problems
 *
 * @class
 * @memberof PIXI
 */
class Bounds
{
    constructor()
    {
        /**
         * @member {number}
         * @default 0
         */
        this.minX = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.minY = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxX = -Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxY = -Infinity;

        this.rect = null;
    }

    isEmpty()
    {
        return this.minX > this.maxX || this.minY > this.maxY;
    }

    clear()
    {
        this.updateID++;

        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    }

    /**
     * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
     * It is not guaranteed that it will return tempRect
     * @param rect {PIXI.Rectangle} temporary object will be used if AABB is not empty
     * @returns {PIXI.Rectangle}
     */
    getRectangle(rect)
    {
        if (this.minX > this.maxX || this.minY > this.maxY) {
            return Rectangle.EMPTY;
        }

        rect = rect || new Rectangle(0, 0, 1, 1);

        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.minY;

        return rect;
    }

    /**
     * This function should be inlined when its possible
     * @param point {PIXI.Point}
     */
    addPoint(point)
    {
        this.minX = Math.min(this.minX, point.x);
        this.maxX = Math.max(this.maxX, point.x);
        this.minY = Math.min(this.minY, point.y);
        this.maxY = Math.max(this.maxY, point.y);
    }

    /**
     * Adds a quad, not transformed
     * @param vertices {Float32Array}
     * @returns {PIXI.Bounds}
     */
    addQuad(vertices)
    {
        let minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;

        let x = vertices[0];
        let y = vertices[1];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * Adds sprite frame, transformed
     * @param transform {PIXI.TransformBase}
     * @param x0 {number}
     * @param y0 {number}
     * @param x1 {number}
     * @param y1 {number}
     */
    addFrame(transform, x0, y0, x1, y1)
    {
        const matrix = transform.worldTransform;
        const a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, tx = matrix.tx, ty = matrix.ty;
        let minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;

        let x = a * x0 + c * y0 + tx;
        let y = b * x0 + d * y0 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x1 + c * y0 + tx;
        y = b * x1 + d * y0 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x0 + c * y1 + tx;
        y = b * x0 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x1 + c * y1 + tx;
        y = b * x1 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * add an array of vertices
     * @param transform {PIXI.TransformBase}
     * @param vertices {Float32Array}
     * @param beginOffset {number}
     * @param endOffset {number}
     */
    addVertices(transform, vertices, beginOffset, endOffset)
    {
        const matrix = transform.worldTransform;
        const a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, tx = matrix.tx, ty = matrix.ty;
        let minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;

        for (let i = beginOffset; i < endOffset; i += 2)
        {
            const rawX = vertices[i], rawY = vertices[i + 1];
            const x = (a * rawX) + (c * rawY) + tx;
            const y = (d * rawY) + (b * rawX) + ty;

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    addBounds(bounds)
    {
        const minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY;

        this.minX = bounds.minX < minX ? bounds.minX : minX;
        this.minY = bounds.minY < minY ? bounds.minY : minY;
        this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
        this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    }
}

export default Bounds;