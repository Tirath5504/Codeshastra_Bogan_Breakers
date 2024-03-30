import React, { useEffect, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import "./UserReport.css";
const UserReport = () => {
    const [data, setData] = useState(null);
    const myPlot = (ctx, labels, data, label, type) => {
        new Chart(ctx, {
            type,
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor: [
                        'rgba(0, 203, 2, 0.64)',
                        'rgba(255, 0, 2, 0.64)',
                    ],
                    borderColor: [
                        'rgba(0, 203, 2, 0.8)',
                        'rgba(255, 0, 2, 0.8)',
                    ],
                    borderWidth: 1
                }]
            },
        });
    }
    const linePlot = (ctx, data, labels) => {
        // const options = {
        //     scales: {
        //         y: {
        //             beginAtZero: true
        //         }
        //     }
        // };
        new Chart(ctx, {
            type: 'line',
            data,
            // options
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
            myPlot(ctx3, data.time, data.distance, 'Distance', 'line');

            const ctx4 = document.getElementById('ctx4');
            myPlot(ctx4, data.time, data.holdTime, 'Hold Time(in sec)', 'line');

        } catch (err) {
            console.log(err);
        }
    }, [data]);
    const getData = async () => {
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
    }
    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        drawGraph();
    }, [drawGraph]);
    return (
        <div className='graphs'>
            <canvas className='graph graph0' id='ctx1'></canvas>
            <canvas className='graph graph0' id='ctx2'></canvas>
            <canvas className='graph graph1' id='ctx3'></canvas>
            <canvas className='graph graph1' id='ctx4'></canvas>
        </div>
    )
}

export default UserReport
