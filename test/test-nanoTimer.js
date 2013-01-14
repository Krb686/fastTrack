var nanoTimer = require('../lib/nanoTimer.js').nanoTimer;
var should = require('should');

describe('nanoTimer', function(){
    it('a high resolution timer object for node', function(){
      
        var task = function(){
            var count = 0;
            for(var i=0;i<100000;i++){
                count++;
            };
            
        };

        var task2 = function(){
            console.log('hey');
        };

        var task3 = function(){
            nanoTimer.clearInterval();
        };

        var task4 = function(){
            console.log('HELLLOOOO');
        };
        
      
        var numSamples  = 1000;
        var total   = 0;
        var avg     = 0;
        
        
        for(var i=0;i<numSamples;i++){
            var timeTook = nanoTimer.time(task);
            timeTook = timeTook[0] + (timeTook[1] / 1000000000);
            total+=timeTook;
        }

        
        avg = total/numSamples;
        console.log('\n\nAvg time for task 1 = ' + avg);
        console.log('========');

    });
});





