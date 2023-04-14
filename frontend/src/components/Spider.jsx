import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Spider = ({skills}) => {
    const data = { 
        labels: skills?.map((skill) => skill.name), 
        datasets: [{
            label: "Skills",
            data: skills?.map((skill) => skill.level),
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]}

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: Math.max(skills?.map((skill) => skill.level))
            },
        },
    }

    return (
        <Radar data={data} options={options} />
    );
}

export default Spider;