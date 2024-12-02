export default class Utilities {
    /**
     * Clips the input index to ensure it falls within the valid range of the array.
     * If the index is outside the bounds, it returns the nearest valid index.
     * @param {number} index - The index to clip.
     * @param {Array} arr - The array to clip the index against.
     * @returns {*} The clipped value from the array.
     */
    static clipToArrayRange(index, arr) {
        // Ensure index is within array bounds
        if (index < 0) index = 0;
        if (index > arr.length - 1) index = arr.length - 1;

        return arr[index];
    }

    /**
     * Computes the tangent at a given index in the array using a specified factor.
     * The tangent is calculated based on the difference between the previous and next values.
     * @param {number} index - The index value to compute the tangent for.
     * @param {number} factor - The scaling factor for the tangent calculation.
     * @param {Array} array - The array of values.
     * @returns {number} The calculated tangent value.
     */
    static calculateTangent(index, factor, array) {
        // Calculate tangent using central difference method
        return (factor * (Utilities.clipToArrayRange(index + 1, array) - Utilities.clipToArrayRange(index - 1, array))) / 2;
    }

    /**
     * Performs cubic interpolation on an array of values.
     * The function returns an interpolated value based on the position and tangents of adjacent points.
     * @param {Array} array - The array of values to interpolate.
     * @param {number} t - The interpolation factor (0 <= t < array.length - 1).
     * @param {number} [tangentFactor=1] - The factor to scale the tangents.
     * @returns {number} The interpolated value at the specified position.
     */
    static cubicInterpolate(array, t, tangentFactor = 1) {
        // Calculate integer index and fractional part
        const k = Math.floor(t);
        const m = [
            Utilities.calculateTangent(k, tangentFactor, array),
            Utilities.calculateTangent(k + 1, tangentFactor, array)
        ];
        const p = [
            Utilities.clipToArrayRange(k, array),
            Utilities.clipToArrayRange(k + 1, array)
        ];

        // Calculate interpolation weights
        t -= k;
        const t2 = t * t;
        const t3 = t * t2;

        // Return cubic interpolation result
        return (
            (2 * t3 - 3 * t2 + 1) * p[0] +
            (t3 - 2 * t2 + t) * m[0] +
            (-2 * t3 + 3 * t2) * p[1] +
            (t3 - t2) * m[1]
        );
    }

    /**
     * Checks if two line segments intersect and returns the intersection point if they do.
     * @param {number} x1 - X coordinate of the start of the first line segment.
     * @param {number} y1 - Y coordinate of the start of the first line segment.
     * @param {number} x2 - X coordinate of the end of the first line segment.
     * @param {number} y2 - Y coordinate of the end of the first line segment.
     * @param {number} x3 - X coordinate of the start of the second line segment.
     * @param {number} y3 - Y coordinate of the start of the second line segment.
     * @param {number} x4 - X coordinate of the end of the second line segment.
     * @param {number} y4 - Y coordinate of the end of the second line segment.
     * @returns {boolean|Object} False if no intersection, or an object with the x and y coordinates of the intersection.
     */
    static findLineSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Check for zero-length line segments
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false;
        }

        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

        // Lines are parallel
        if (denominator === 0) {
            return false;
        }

        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Check if intersection is within the line segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        // Calculate intersection point
        const x = x1 + ua * (x2 - x1);
        const y = y1 + ua * (y2 - y1);

        return { x, y };
    }
}
