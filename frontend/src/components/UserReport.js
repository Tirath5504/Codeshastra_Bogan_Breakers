import React, { useEffect, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import "./css/UserReport.css";
const UserReport = () => {
    const [data, setData] = useState(null);
    const myPlot = (ctx, labels, data, label, type) => {
        const backgroundColor = ['rgba(0, 203, 2, 0.64)'];
        const borderColor = ['rgba(0, 203, 2, 0.8)'];
        if (type === 'bar') {
            backgroundColor.push('rgba(255, 0, 2, 0.64)');
            borderColor.push('rgba(255, 0, 2, 0.8)');
        }
        new Chart(ctx, {
            type,
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor,
                    borderColor,
                    borderWidth: 1,
                    pointRadius:5,
                }]
            },
        });
    }
    const drawGraph = useCallback(() => {
        if (!data) {
            return;
        };
        try {
            const ctx1 = document.getElementById('ctx1');
            myPlot(ctx1, Object.keys(data.clickActivation), Object.values(data.clickActivation), 'Click Activation', 'bar');

            const ctx2 = document.getElementById('ctx2');
            myPlot(ctx2, Object.keys(data.correctPosture), Object.values(data.correctPosture), 'Posture', 'bar');

            const ctx3 = document.getElementById('ctx3');
            myPlot(ctx3, data.time.slice(5,20), data.distance.slice(5,20), 'Distance Of Pen And User', 'line');

            const ctx4 = document.getElementById('ctx4');
            myPlot(ctx4, data.time.slice(5,20), data.holdTime.slice(5,20), 'Hold Time Of Breadth(in sec)', 'line');

        } catch (err) {
            console.log(err);
        }
    }, [data]);
    const getData = useCallback(async () => {
        if (!data) {
            let res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/record/getReport`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': localStorage.getItem('authToken')
                }
            });
            res = await res.json();
            drawGraph(res.data);
            setData(res.data);
        }
    }, [data, drawGraph]);
    useEffect(() => {
        getData();
    }, [getData]);
    useEffect(() => {
        drawGraph();
    }, [drawGraph]);
    return (
        <>
            <h1 className='text-center' style={{fontFamily:"Inter"}}>Reports</h1>
            <div className='graphs'>
                <canvas className='graph graph0' id='ctx1'></canvas>
                <canvas className='graph graph0' id='ctx2'></canvas>
                <canvas className='graph graph1' id='ctx3'></canvas>
                <canvas className='graph graph1' id='ctx4'></canvas>
            </div>
        </>
    )
}

export default UserReport
