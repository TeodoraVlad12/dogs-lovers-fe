import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import { ChartData } from "../model/ChartData";

interface Props {
    chartData: ChartData;
}

function BarChart({ chartData }: Props) {
    const chartRef = useRef<Chart<"bar"> | null>(null);

    useEffect(() => {
        const canvas = document.getElementById("barChart") as HTMLCanvasElement | null;
        if (!canvas) {
            return; // Return early if canvas is not found
        }

        if (chartRef.current) {
            chartRef.current.destroy(); // Destroy previous chart instance
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return; // Return early if canvas context is not available
        }

        const newChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Under 4", "4-7", "Above 7"],
                datasets: [
                    {
                        label: "Age Groups",
                        data: [chartData.zeroThree, chartData.fourSeven, chartData.eightTen],
                        backgroundColor: [
                            "rgba(173, 216, 230, 0.6)",
                            "rgba(144, 238, 144, 0.6)",
                            "rgba(255, 192, 203, 0.6)",
                        ],
                    },
                ],
            },
        });

        chartRef.current = newChartInstance;

        // Clean up function
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy(); // Ensure previous chart instance is destroyed on component unmount
            }
        };
    }, [chartData]);

    return (
        <div>
            <canvas id="barChart" />
        </div>
    );
}

export default BarChart;
