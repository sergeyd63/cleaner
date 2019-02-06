const socket = require('socket.io');
const express = require('express');

const app = express();
const server = app.listen(4040, () => {
    console.log('Listening on 4040');
});

app.use(express.static('client'));

const io = socket(server);
let floorMap = [];
let cleaned = 0;
let totalToClean = 0;
const cleaningTime = 200;

io.on('connection', (socket) => {
    console.log('connect');

    socket.on('floor', (data) => {
        floorMap = data.floorPlan.splice(0);
        cleaned = 0;
        totalToClean = 0;

        floorMap.forEach(el => {
            totalToClean += el.filter(val => val == ' ').length;
        });
        clean(data.start);
        // console.log(floorMap);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

function clean(pos) {
    io.sockets.emit('position', {
        pos: pos,
        status: 'C',
        floorPlan: floorMap
    });
    if (pos.h < 0 || pos.h >= floorMap.length || pos.v < 0 || pos.v >= floorMap[0].length) {
        return new Promise(resolve => setTimeout(resolve, cleaningTime));
        // --- No Delay Solution
        // return;
    }

    if (floorMap[pos.h][pos.v] === ' ') {
        floorMap[pos.h][pos.v] = 'C';
        cleaned++;
        io.sockets.emit('clean', {
            pos,
            status: 'C',
            stats: {
                cleaned,
                totalToClean
            },
            floorPlan: floorMap
        });
    }
    else {
        return new Promise(resolve => setTimeout(resolve, cleaningTime));
        // --- No Delay Solution
        // return;
    }
    let newPos = {
        h: pos.h,
        v: pos.v - 1
    };
    clean(newPos).then(() => {
        newPos = {
            h: pos.h - 1,
            v: pos.v
        };
        clean(newPos).then(() => {
            newPos = {
                h: pos.h + 1,
                v: pos.v
            };
            clean(newPos).then(() => {
                newPos = {
                    h: pos.h,
                    v: pos.v + 1
                };
                clean(newPos).then(() => {
                });
            });
        });
    });

    // --- No Delay Solution
    // let move = [
    //     { h: 0, v: -1 },
    //     { h: -1, v: 0 },
    //     { h: 1, v: 0 },
    //     { h: 0, v: 1 }
    // ];
    // while (move.length > 0) {
    //     let thisMove = move.pop();
    //     let newPos = {
    //         h: pos.h + thisMove.h,
    //         v: pos.v + thisMove.v
    //     };

    //     clean(newPos);
    // }

    return new Promise(resolve => setTimeout(resolve, cleaningTime));
}