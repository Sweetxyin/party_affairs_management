(function ($) {
    var options = {
        series: {
            curvedLines: {
                active: false,
                apply: false,
                fit: false,
                curvePointFactor: 20,
                fitPointDist: undefined
            }
        }
    };

    function init(plot) {
        plot.hooks.processOptions.push(processOptions);

        function processOptions(plot, options) {
            if (options.series.curvedLines.active) {
                plot.hooks.processDatapoints.unshift(processDatapoints);
            }
        }

        function processDatapoints(plot, series, datapoints) {
            var nrPoints = datapoints.points.length / datapoints.pointsize;
            var EPSILON = 0.5;
            if (series.curvedLines.apply == true && series.originSeries === undefined && nrPoints > (1 + EPSILON)) {
                if (series.lines.fill) {
                    var pointsTop = calculateCurvePoints(datapoints, series.curvedLines, 1),
                        pointsBottom = calculateCurvePoints(datapoints, series.curvedLines, 2);
                    datapoints.pointsize = 3;
                    datapoints.points = [];
                    var j = 0;
                    var k = 0;
                    var i = 0;
                    var ps = 2;
                    while (i < pointsTop.length || j < pointsBottom.length) {
                        if (pointsTop[i] == pointsBottom[j]) {
                            datapoints.points[k] = pointsTop[i];
                            datapoints.points[k + 1] = pointsTop[i + 1];
                            datapoints.points[k + 2] = pointsBottom[j + 1];
                            j += ps;
                            i += ps;
                        } else if (pointsTop[i] < pointsBottom[j]) {
                            datapoints.points[k] = pointsTop[i];
                            datapoints.points[k + 1] = pointsTop[i + 1];
                            datapoints.points[k + 2] = k > 0 ? datapoints.points[k - 1] : null;
                            i += ps;
                        } else {
                            datapoints.points[k] = pointsBottom[j];
                            datapoints.points[k + 1] = k > 1 ? datapoints.points[k - 2] : null;
                            datapoints.points[k + 2] = pointsBottom[j + 1];
                            j += ps;
                        }
                        k += 3;
                    }
                } else if (series.lines.lineWidth > 0) {
                    datapoints.points = calculateCurvePoints(datapoints, series.curvedLines, 1);
                    datapoints.pointsize = 2;
                }
            }
        }

        function calculateCurvePoints(datapoints, curvedLinesOptions, yPos) {
            var points = datapoints.points, ps = datapoints.pointsize;
            var num = curvedLinesOptions.curvePointFactor * (points.length / ps);
            var xdata = new Array;
            var ydata = new Array;
            var curX = -1;
            var curY = -1;
            var j = 0;
            if (curvedLinesOptions.fit) {
                var fpDist;
                if (typeof curvedLinesOptions.fitPointDist == 'undefined') {
                    var minX = points[0];
                    var maxX = points[points.length - ps];
                    fpDist = (maxX - minX) / (500 * 100);
                } else {
                    fpDist = curvedLinesOptions.fitPointDist;
                }
                for (var i = 0; i < points.length; i += ps) {
                    var frontX;
                    var backX;
                    curX = i;
                    curY = i + yPos;
                    frontX = points[curX] - fpDist;
                    backX = points[curX] + fpDist;
                    var factor = 2;
                    while (frontX == points[curX] || backX == points[curX]) {
                        frontX = points[curX] - (fpDist * factor);
                        backX = points[curX] + (fpDist * factor);
                        factor++;
                    }
                    xdata[j] = frontX;
                    ydata[j] = points[curY];
                    j++;
                    xdata[j] = points[curX];
                    ydata[j] = points[curY];
                    j++;
                    xdata[j] = backX;
                    ydata[j] = points[curY];
                    j++;
                }
            } else {
                for (var i = 0; i < points.length; i += ps) {
                    curX = i;
                    curY = i + yPos;
                    xdata[j] = points[curX];
                    ydata[j] = points[curY];
                    j++;
                }
            }
            var n = xdata.length;
            var y2 = new Array();
            var delta = new Array();
            y2[0] = 0;
            y2[n - 1] = 0;
            delta[0] = 0;
            for (var i = 1; i < n - 1; ++i) {
                var d = (xdata[i + 1] - xdata[i - 1]);
                if (d == 0) {
                    return [];
                }
                var s = (xdata[i] - xdata[i - 1]) / d;
                var p = s * y2[i - 1] + 2;
                y2[i] = (s - 1) / p;
                delta[i] = (ydata[i + 1] - ydata[i]) / (xdata[i + 1] - xdata[i]) - (ydata[i] - ydata[i - 1]) / (xdata[i] - xdata[i - 1]);
                delta[i] = (6 * delta[i] / (xdata[i + 1] - xdata[i - 1]) - s * delta[i - 1]) / p;
            }
            for (var j = n - 2; j >= 0; --j) {
                y2[j] = y2[j] * y2[j + 1] + delta[j];
            }
            var step = (xdata[n - 1] - xdata[0]) / (num - 1);
            var xnew = new Array;
            var ynew = new Array;
            var result = new Array;
            xnew[0] = xdata[0];
            ynew[0] = ydata[0];
            result.push(xnew[0]);
            result.push(ynew[0]);
            for (j = 1; j < num; ++j) {
                xnew[j] = xnew[0] + j * step;
                var max = n - 1;
                var min = 0;
                while (max - min > 1) {
                    var k = Math.round((max + min) / 2);
                    if (xdata[k] > xnew[j]) {
                        max = k;
                    } else {
                        min = k;
                    }
                }
                var h = (xdata[max] - xdata[min]);
                if (h == 0) {
                    return [];
                }
                var a = (xdata[max] - xnew[j]) / h;
                var b = (xnew[j] - xdata[min]) / h;
                ynew[j] = a * ydata[min] + b * ydata[max] + ((a * a * a - a) * y2[min] + (b * b * b - b) * y2[max]) * (h * h) / 6;
                result.push(xnew[j]);
                result.push(ynew[j]);
            }
            return result;
        }
    }

    $.plot.plugins.push({init: init, options: options, name: 'curvedLines', version: '0.5'});
})(jQuery);