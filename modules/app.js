(function () {
    'use strict';

    angular.module('svgApp', [])

        .controller('svgController', ['$scope', function ($scope) {

            $scope.width = 600;
            $scope.height = 400;

            // rate, pmt, pv, nper
            $scope.inputs = {
                rate: 0.06,
                pmt: 10000,
                pv: 50000,
                nper: 20
            };
            
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
            
            $scope.points = buildArr($scope.inputs.rate, $scope.inputs.pmt, $scope.inputs.pv, $scope.inputs.nper);

            // build SVG path string
            $scope.linePath = function (points) {
                var pathParts = [],
                    currentPoint,
                    i,
                    numPoints = points.length - 1,
                    lastPointY = points[points.length - 1][1],
                    firstPointY = points[0][1],
                    
                    // multipliers are used to scale the output x & y coords
                    xMultiple = $scope.width / numPoints,
                    yMultiple = $scope.height / lastPointY,
                    
                    // convert y values to start at chart bottom
                    formattedPoints = points.map(function (point) {
                        return [point[0] * xMultiple, $scope.height - (point[1] * yMultiple)];
                    });

                // build path array
                for (i = 0; i < formattedPoints.length; i += 1) {
                    currentPoint = formattedPoints[i];

                    pathParts.push(currentPoint[0] + ',' + currentPoint[1]);
                }

                // return path array as a string
                // because SVG path 'd' attr expects a string
                return 'M' + pathParts.join(' L');
            };

            $scope.xAxisLabels = [];
            
            // generate x axis label matrix
            // each array element consists of two values:
            //   1) the SVG x value for positioning axis label text in the SVG graph
            //   2) the actual nper value for label text
            (function genXLabels(points) {
                var numPoints = points.length - 1,
                    xMultiple = $scope.width / numPoints,
                    xAxisMatrix = [],
                    xValue,
                    xPos,
                    i;
                
                for (i = 0; i < points.length; i += 1) {
                    // calculate y axis label values
                    xValue = points[i][0];
                    
                    // calculate y position
                    xPos = points[i][0] * xMultiple;
                    
                    // push
                    $scope.xAxisLabels.push([xPos, xValue]);
                }

            }($scope.points));

            
            $scope.yAxisLabels = [];
            
            // generate y axis label matrix
            // each array element consists of two values:
            //   1) the SVG y value for positioning axis label text in the SVG graph
            //   2) the actual FV value for each label
            (function genYLabels(points) {
                var numPoints = points.length - 1,
                    yspacing = $scope.height / numPoints,
                    yMax = points[points.length - 1][1],
                    yValue,
                    yPos,
                    i;
                                
                for (i = 0; i < points.length; i += 1) {
                    // calculate y axis label values
                    yValue = i * yMax / numPoints;
                    
                    // calculate y position
                    yPos = $scope.height - yspacing * i;
                        
                    // push
                    $scope.yAxisLabels.push([yPos, yValue]);
                }
                
            }($scope.points));

        }]);

}());