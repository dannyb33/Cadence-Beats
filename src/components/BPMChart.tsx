import React, { useEffect, useRef } from 'react';
import { Run } from '../types';

interface BPMChartProps {
  runs: Run[];
}

const BPMChart: React.FC<BPMChartProps> = ({ runs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || runs.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Calculate scales
    const bpms = runs.map(run => run.avgBPM);
    const minBPM = Math.min(...bpms);
    const maxBPM = Math.max(...bpms);
    const bpmRange = maxBPM - minBPM;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw BPM line
    ctx.beginPath();
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;

    runs.forEach((run, i) => {
      const x = padding + (i / (runs.length - 1)) * width;
      const y = canvas.height - padding - ((run.avgBPM - minBPM) / bpmRange) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    runs.forEach((run, i) => {
      const x = padding + (i / (runs.length - 1)) * width;
      const y = canvas.height - padding - ((run.avgBPM - minBPM) / bpmRange) * height;
      
      ctx.beginPath();
      ctx.fillStyle = '#7c3aed';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    
    // Y-axis labels
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(maxBPM)} BPM`, padding - 5, padding);
    ctx.fillText(`${Math.round(minBPM)} BPM`, padding - 5, canvas.height - padding);

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const firstDate = new Date(runs[0].date).toLocaleDateString();
    const lastDate = new Date(runs[runs.length - 1].date).toLocaleDateString();
    ctx.fillText(firstDate, padding, canvas.height - padding + 5);
    ctx.fillText(lastDate, canvas.width - padding, canvas.height - padding + 5);

  }, [runs]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-auto bg-white rounded-lg shadow-sm p-4"
    />
  );
};

export default BPMChart;