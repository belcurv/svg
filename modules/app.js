(function () {
    'use strict';
    
    angular.module('svgApp', [])
    
        .controller('svgController', ['$scope', function ($scope) {

            $scope.width  = 600;
            $scope.height = 400;
            
            
            // future value
            function calcFv(rate, pmt, pv, nper) {
                
                var fv = ((pmt * (Math.pow(1 + rate, nper) - 1) / rate) + (pv * Math.pow(1 + rate, nper)));
                
                return Math.abs(fv);
            }
            
            // build array of time,value pairs
            function buildArr(rate, pmt, pv, nper) {
                var outputArr = [],
                    j,
                    y;
                
                for (j = 0; j < nper + 1; j += 1) {
                    y = calcFv(rate, pmt, pv, j);
                    outputArr.push([j, y]);
                }
                return outputArr;
            }
            
            // build SVG path string
            $scope.linePath = function () {
                var points = buildArr(0.06, 33000, 268000, 25),
                    pathParts = [],
                    currentPoint,
                    i,
                    numPoints = points.length - 1,
                    lastPointY = points[points.length - 1][1],
                    firstPointY = points[0][1];
                
                // multipliers are used to scale the output x & y coords
                var xMultiple = $scope.width / numPoints;
                var yMultiple = $scope.height / lastPointY;
                
                // convert y values to start at chart bottom
                function format(point) {
                    return [point[0] * xMultiple, $scope.height - (point[1] * yMultiple)];
                }
                var formattedPoints = points.map(format);
                
                for (i = 0; i < formattedPoints.length; i += 1) {
                    currentPoint = formattedPoints[i];
                    
                    pathParts.push(currentPoint[0] + ',' + currentPoint[1]);
                }
                
                return 'M' + pathParts.join(' L');
            };
            
            $scope.xAxisLabels = function () {
                var points = buildArr(0.06, 33000, 268000, 10),
                    numPoints = points.length - 1,
                    xMultiple = $scope.width / numPoints;
                
                // convert y values to start at chart bottom
                function format(point) {
                    return point[0] * xMultiple;
                }
                
                var newPoints = points.map(format);
                
                console.log(newPoints);
                
                return newPoints;
                
            };

        }]);
    
}());