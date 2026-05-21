"use client";

import {
  ColorType,
  LineSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { PriceHistoryPoint } from "@/lib/polymarket/types";

type PriceHistoryChartProps = {
  history: PriceHistoryPoint[];
  isLoading: boolean;
};

export function PriceHistoryChart({ history, isLoading }: PriceHistoryChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      height: 320,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: {
          color: "rgba(148, 163, 184, 0.12)",
        },
        horzLines: {
          color: "rgba(148, 163, 184, 0.12)",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.2)",
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.2)",
      },
    });

    const series = chart.addSeries(LineSeries, {
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 3,
        minMove: 0.001,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) {
        return;
      }

      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) {
      return;
    }

    const chartData: LineData<Time>[] = history.map((point) => ({
      time: point.time as Time,
      value: point.value,
    }));

    seriesRef.current.setData(chartData);
    chartRef.current?.timeScale().fitContent();
  }, [history]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Price history</h2>
        <p className="mt-1 text-sm text-slate-400">
          A simple line chart for the selected outcome token.
        </p>
      </div>

      <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
        <div ref={containerRef} className="h-80 w-full" />

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 text-sm text-slate-400">
            Loading chart...
          </div>
        ) : null}

        {!isLoading && history.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 text-sm text-slate-400">
            No price history available for this token.
          </div>
        ) : null}
      </div>
    </section>
  );
}
