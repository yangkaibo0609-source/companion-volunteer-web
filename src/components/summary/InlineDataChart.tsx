import { useEffect, useRef, useState } from 'react'
import type { BlackboardChart } from '../../data/dataBlackboard'

type InlineDataChartProps = {
  chart: BlackboardChart
  className?: string
}

export function InlineDataChart({ chart, className }: InlineDataChartProps) {
  const chartRef = useRef<HTMLElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const element = chartRef.current
    if (!element || shouldLoad) return
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '1100px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [shouldLoad])

  useEffect(() => {
    if (!shouldLoad || loaded || failed) return
    const timeout = window.setTimeout(() => setFailed(true), 16000)
    return () => window.clearTimeout(timeout)
  }, [failed, loaded, shouldLoad])

  return (
    <figure className={`inline-data-chart${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`} ref={chartRef}>
      <figcaption>{chart.title}</figcaption>
      <div className="inline-data-chart__viewport">
        {shouldLoad && !failed ? (
          <>
            {!loaded && <span className="inline-data-chart__status">图表正在展开</span>}
            <iframe
              src={chart.src}
              title={chart.title}
              loading="lazy"
              onError={() => setFailed(true)}
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : failed ? (
          <div className="inline-data-chart__fallback">
            <strong>{chart.title}</strong>
            <a href={chart.src} rel="noreferrer" target="_blank">查看交互图表</a>
          </div>
        ) : (
          <span aria-hidden="true" className="inline-data-chart__loading">图表正在展开</span>
        )}
      </div>
    </figure>
  )
}
