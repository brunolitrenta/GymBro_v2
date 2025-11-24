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
  trainableDays?: number[];
  minY?: number;
  maxY?: number;
  invertYAxis?: boolean;
  showDataPoints?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ data, labels, width, height, xLabel = '', yLabel = '', trainableDays, minY, maxY, invertYAxis = false, showDataPoints = false }) => {
  const basePadding = 40;
  const paddingTop = basePadding;
  const paddingBottom = basePadding;
  const paddingRight = basePadding;
  const paddingLeft = yLabel ? basePadding + 24 : basePadding;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const allValues = trainableDays ? [...data, ...trainableDays] : data;
  const fallbackValues = allValues.length > 0 ? allValues : [0];

  let computedMin = Math.min(...fallbackValues);
  let computedMax = Math.max(...fallbackValues);

  if (!Number.isFinite(computedMin)) computedMin = 0;
  if (!Number.isFinite(computedMax)) computedMax = 1;

  if (computedMax === computedMin) {
    const adjustment = computedMax === 0 ? 1 : Math.abs(computedMax) * 0.1 || 1;
    computedMin -= adjustment;
    computedMax += adjustment;
  }

  const initialRange = computedMax - computedMin;
  const paddingValue = initialRange * 0.1;

  let minValue = minY ?? (computedMin < 0 ? 0 : computedMin - paddingValue);
  let maxValue = maxY ?? (computedMax + paddingValue);

  if (minY === undefined && minValue < 0) {
    minValue = 0;
  }

  if (maxValue <= minValue) {
    maxValue = minValue + 1;
  }

  const valueRange = maxValue - minValue || 1;

  const valueLabelDecimals = valueRange <= 10 ? 1 : 0;

  const dataPoints = data.map((value, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const normalized = (value - minValue) / valueRange;
    const oriented = invertYAxis ? normalized : 1 - normalized;
    const y = paddingTop + oriented * chartHeight;
    return {
      x,
      y,
      value,
      label: Number(value.toFixed(valueLabelDecimals)),
    };
  });

  const points = dataPoints.map((point) => `${point.x},${point.y}`).join(' ');

  const trainablePointsData = trainableDays
    ? trainableDays.map((value, index) => {
        const x = paddingLeft + (index / (trainableDays.length - 1 || 1)) * chartWidth;
        const normalized = (value - minValue) / valueRange;
        const oriented = invertYAxis ? normalized : 1 - normalized;
        const y = paddingTop + oriented * chartHeight;
        return { x, y };
      })
    : [];

  const trainablePoints = trainablePointsData
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  // Linhas horizontais de grade
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = paddingTop + chartHeight * (1 - ratio);
    const rawValue = minValue + (maxValue - minValue) * ratio;
    const decimals = maxValue - minValue <= 10 ? 1 : 0;
    const formatted = Number(rawValue.toFixed(decimals));
    return { y, value: formatted };
  });

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Etiqueta do eixo Y */}
        {yLabel && (
          <SvgText
            x={paddingLeft - basePadding - 10}
            y={paddingTop + chartHeight / 2}
            fontSize="12"
            fill="rgba(54, 64, 51, 0.8)"
            textAnchor="middle"
            transform={`rotate(-90, ${paddingLeft - basePadding - 10}, ${paddingTop + chartHeight / 2})`}
            fontWeight="600"
          >
            {yLabel}
          </SvgText>
        )}
        
        {/* Linhas de grade horizontais */}
        {gridLines.map((line, index) => (
          <G key={index}>
            <Line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="rgba(54, 64, 51, 0.1)"
              strokeWidth="1"
            />
            <SvgText
              x={paddingLeft - 12}
              y={line.y + 5}
              fontSize="10"
              fill="rgba(54, 64, 51, 0.6)"
              textAnchor="end"
            >
              {line.value}
            </SvgText>
          </G>
        ))}
        
        {/* Linha de dias treináveis (se fornecida) */}
        {trainableDays && trainablePoints && (
          <Polyline
            points={trainablePoints}
            fill="none"
            stroke="rgba(213, 217, 98, 0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5,5"
          />
        )}
        
        {/* Linha do gráfico de treinos do usuário */}
        <Polyline
          points={points}
          fill="none"
          stroke="rgba(54, 64, 51, 1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos e valores da série principal */}
        {showDataPoints && dataPoints.map((point, index) => {
          const isNearTop = point.y - 12 < paddingTop;
          const isNearBottom = point.y + 12 > height - paddingBottom;
          let labelY = point.y - 8;

          if (isNearTop) {
            labelY = point.y + 14;
          } else if (isNearBottom) {
            labelY = point.y - 14;
          }

          return (
            <G key={`point-${index}`}>
              <Circle cx={point.x} cy={point.y} r={4} fill="#364033" />
              <SvgText
                x={point.x}
                y={labelY}
                fontSize="10"
                fill="rgba(54, 64, 51, 0.9)"
                textAnchor="middle"
                fontWeight="600"
              >
                {point.label}
              </SvgText>
            </G>
          );
        })}
        
        {/* Labels do eixo X */}
        {labels.map((label, index) => {
          if (!label) return null;
          const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
          return (
            <SvgText
              key={index}
              x={x}
              y={height - paddingBottom + 20}
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
            x={paddingLeft + chartWidth / 2}
            y={height - paddingBottom + 35}
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
