import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Line, Circle, Polyline, G, Text as SvgText } from 'react-native-svg';

interface LineChartProps {
  data: number[];
  labels: string[];
  width: number;
  height: number;
  xLabel?: string;
  yLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, labels, width, height, xLabel = '', yLabel = '' }) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Encontrar valores máximo e mínimo
  const maxValue = Math.max(...data, 1);
  const minValue = 0;
  
  // Calcular pontos para a linha
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  // Linhas horizontais de grade
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = padding + chartHeight * (1 - ratio);
    return { y, value: Math.round(maxValue * ratio) };
  });

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Etiqueta do eixo Y */}
        {yLabel && (
          <SvgText
            x={15}
            y={padding + chartHeight / 2}
            fontSize="12"
            fill="rgba(54, 64, 51, 0.8)"
            textAnchor="middle"
            transform={`rotate(-90, 15, ${padding + chartHeight / 2})`}
            fontWeight="600"
          >
            {yLabel}
          </SvgText>
        )}
        
        {/* Linhas de grade horizontais */}
        {gridLines.map((line, index) => (
          <G key={index}>
            <Line
              x1={padding}
              y1={line.y}
              x2={width - padding}
              y2={line.y}
              stroke="rgba(54, 64, 51, 0.1)"
              strokeWidth="1"
            />
            <SvgText
              x={padding - 10}
              y={line.y + 5}
              fontSize="10"
              fill="rgba(54, 64, 51, 0.6)"
              textAnchor="end"
            >
              {line.value}
            </SvgText>
          </G>
        ))}
        
        {/* Linha do gráfico */}
        <Polyline
          points={points}
          fill="none"
          stroke="rgba(54, 64, 51, 1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Pontos no gráfico */}
        {data.map((value, index) => {
          const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight;
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#364033"
              stroke="#C8E6C9"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Labels do eixo X */}
        {labels.map((label, index) => {
          if (!label) return null;
          const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
          return (
            <SvgText
              key={index}
              x={x}
              y={height - padding + 20}
              fontSize="10"
              fill="rgba(54, 64, 51, 0.8)"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
        
        {/* Etiqueta do eixo X */}
        {xLabel && (
          <SvgText
            x={padding + chartWidth / 2}
            y={height - 5}
            fontSize="12"
            fill="rgba(54, 64, 51, 0.8)"
            textAnchor="middle"
            fontWeight="600"
          >
            {xLabel}
          </SvgText>
        )}
      </Svg>
    </View>
  );
};
