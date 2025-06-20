"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Minimize2,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Volume2,
  VolumeX,
  Play,
  MousePointer,
  Eye,
  Bell,
  BarChart3,
  Zap,
} from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface OverlayWindowProps {
  id: string
  title: string
  children: React.ReactNode
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
  onClose: () => void
  className?: string
}

function OverlayWindow({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  onClose,
  className = "",
}: OverlayWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number }>()

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startX
        const deltaY = e.clientY - dragRef.current.startY
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - initialSize.width, dragRef.current.startPosX + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - initialSize.height, dragRef.current.startPosY + deltaY)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, initialSize])

  return (
    <div
      className={`fixed bg-black/80 backdrop-blur-sm border border-cyan-400/60 shadow-2xl shadow-cyan-400/20 rounded-lg overflow-hidden ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: isMinimized ? 40 : initialSize.height,
        zIndex: isDragging ? 1000 : 100,
      }}
    >
      <div
        className="flex items-center justify-between bg-gray-900/90 border-b border-cyan-400/40 px-3 py-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <span className="text-cyan-400 text-sm font-mono font-bold">{title}</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/20 hover:text-red-300"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {!isMinimized && <div className="p-3 h-full overflow-auto">{children}</div>}
    </div>
  )
}

function WelcomeScreen({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Pixel Trading Terminal",
      icon: <Zap className="h-8 w-8 text-cyan-400" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🌧️</div>
          <p className="text-white font-mono text-lg">Experience real-time trading in a cyberpunk Tokyo setting</p>
          <p className="text-cyan-400 font-mono text-sm">
            This interactive trading terminal simulates live market data with beautiful pixel art aesthetics
          </p>
        </div>
      ),
    },
    {
      title: "Live Market Data",
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <MousePointer className="h-5 w-5" />
            <span className="font-mono font-bold">CLICK ANY STOCK</span>
          </div>
          <p className="text-white font-mono text-sm">
            The Live Market Data window shows real-time prices for Japanese stocks including NIKKEI, SONY, TOYOTA, and
            more.
          </p>
          <div className="bg-gray-900/60 p-3 rounded border border-green-400/30">
            <p className="text-green-400 font-mono text-xs mb-2">✨ INTERACTIVE FEATURES:</p>
            <ul className="text-white font-mono text-xs space-y-1">
              <li>• Click any stock to see detailed real-time fluctuations</li>
              <li>• View live price charts and trading activity</li>
              <li>• Monitor bid/ask spreads and volume data</li>
              <li>• Watch animated price indicators</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Smart Alerts System",
      icon: <Bell className="h-8 w-8 text-yellow-400" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-yellow-400">
            <Bell className="h-5 w-5 animate-pulse" />
            <span className="font-mono font-bold">TOP-RIGHT ALERTS</span>
          </div>
          <p className="text-white font-mono text-sm">
            Smart trading alerts appear in the top-right corner with market notifications, price alerts, and order
            confirmations.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-900/40 p-2 rounded border border-green-400/30">
              <div className="text-green-400 font-mono text-xs">SUCCESS</div>
              <div className="text-white font-mono text-xs">Order fills & targets</div>
            </div>
            <div className="bg-yellow-900/40 p-2 rounded border border-yellow-400/30">
              <div className="text-yellow-400 font-mono text-xs">WARNING</div>
              <div className="text-white font-mono text-xs">Volume & margin alerts</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trading Controls",
      icon: <Activity className="h-8 w-8 text-red-400" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <Activity className="h-5 w-5" />
            <span className="font-mono font-bold">RIGHT SIDE PANEL</span>
          </div>
          <p className="text-white font-mono text-sm">
            Quick trading buttons on the right side let you simulate buy/sell orders and set alerts.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-green-900/40 p-2 rounded border border-green-400/30">
              <div className="w-12 h-6 bg-green-600 rounded text-white font-mono text-xs flex items-center justify-center">
                BUY
              </div>
              <span className="text-white font-mono text-xs">Place buy orders & trigger success alerts</span>
            </div>
            <div className="flex items-center gap-3 bg-red-900/40 p-2 rounded border border-red-400/30">
              <div className="w-12 h-6 bg-red-600 rounded text-white font-mono text-xs flex items-center justify-center">
                SELL
              </div>
              <span className="text-white font-mono text-xs">Place sell orders & confirm transactions</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Interactive Windows",
      icon: <Eye className="h-8 w-8 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-cyan-400">
            <Eye className="h-5 w-5" />
            <span className="font-mono font-bold">DRAG & CUSTOMIZE</span>
          </div>
          <p className="text-white font-mono text-sm">
            All windows are draggable and can be minimized or closed. Arrange your workspace however you like!
          </p>
          <div className="bg-gray-900/60 p-3 rounded border border-cyan-400/30">
            <p className="text-cyan-400 font-mono text-xs mb-2">🖱️ WINDOW CONTROLS:</p>
            <ul className="text-white font-mono text-xs space-y-1">
              <li>• Drag title bars to move windows</li>
              <li>• Yellow button: Minimize/Restore</li>
              <li>• Red button: Close window</li>
              <li>• Live charts update every few seconds</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Trade!",
      icon: <Play className="h-8 w-8 text-green-400" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🚀</div>
          <p className="text-white font-mono text-lg">You're all set to explore the trading terminal!</p>
          <div className="bg-gray-900/60 p-4 rounded border border-green-400/30">
            <p className="text-green-400 font-mono text-sm mb-2">🎯 QUICK START TIPS:</p>
            <ul className="text-white font-mono text-xs space-y-1 text-left">
              <li>• Click stocks in the Live Market Data window</li>
              <li>• Watch for alerts in the top-right corner</li>
              <li>• Use BUY/SELL buttons to trigger notifications</li>
              <li>• Drag windows to customize your layout</li>
              <li>• Enjoy the cyberpunk Tokyo atmosphere! 🌧️</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center">
      <div className="bg-gray-900/95 border border-cyan-400/60 rounded-lg shadow-2xl shadow-cyan-400/20 max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/90 border-b border-cyan-400/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {steps[currentStep].icon}
              <h2 className="text-cyan-400 font-mono text-xl font-bold">{steps[currentStep].title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">
                {currentStep + 1} / {steps.length}
              </span>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={skipTutorial}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">{steps[currentStep].content}</div>

        {/* Footer */}
        <div className="bg-gray-800/90 border-t border-cyan-400/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="text-gray-400 hover:text-white font-mono" onClick={skipTutorial}>
              Skip Tutorial
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  className="bg-black/60 text-cyan-400 border-cyan-400/60 hover:bg-cyan-400/20 font-mono"
                  onClick={prevStep}
                >
                  Previous
                </Button>
              )}
              <Button className="bg-cyan-600/80 hover:bg-cyan-600 text-white font-mono" onClick={nextStep}>
                {currentStep === steps.length - 1 ? "Start Trading!" : "Next"}
              </Button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-cyan-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Alert {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: Date
}

function AlertPopup({ alert, onClose }: { alert: Alert; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(alert.id)
    }, 5000) // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer)
  }, [alert.id, onClose])

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-400/60 bg-green-900/80 text-green-400"
      case "warning":
        return "border-yellow-400/60 bg-yellow-900/80 text-yellow-400"
      case "error":
        return "border-red-400/60 bg-red-900/80 text-red-400"
      case "info":
      default:
        return "border-cyan-400/60 bg-cyan-900/80 text-cyan-400"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-4 w-4" />
      case "warning":
        return <Activity className="h-4 w-4 animate-pulse" />
      case "error":
        return <TrendingDown className="h-4 w-4" />
      case "info":
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div
      className={`backdrop-blur-sm border rounded-lg p-4 shadow-2xl animate-in slide-in-from-right-full duration-300 ${getAlertStyles(alert.type)}`}
      style={{ minWidth: "300px", maxWidth: "400px" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">{getIcon(alert.type)}</div>
          <div className="flex-1">
            <div className="font-mono font-bold text-sm mb-1">{alert.title}</div>
            <div className="font-mono text-xs opacity-90 leading-relaxed">{alert.message}</div>
            <div className="font-mono text-xs opacity-60 mt-2">{alert.timestamp.toLocaleTimeString()}</div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          onClick={() => onClose(alert.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

function LiveStockTicker() {
  const [stocks, setStocks] = useState([
    {
      symbol: "NIKKEI",
      price: 33247.35,
      change: 156.23,
      changePercent: 0.47,
      volume: 1234567,
      bid: 33245.0,
      ask: 33250.0,
    },
    { symbol: "TOPIX", price: 2387.45, change: -12.34, changePercent: -0.51, volume: 987654, bid: 2386.0, ask: 2388.0 },
    { symbol: "USDJPY", price: 149.85, change: 0.23, changePercent: 0.15, volume: 2345678, bid: 149.83, ask: 149.87 },
    { symbol: "SONY", price: 12450, change: 89, changePercent: 0.72, volume: 456789, bid: 12448, ask: 12452 },
    { symbol: "TOYOTA", price: 2890, change: -15, changePercent: -0.52, volume: 678901, bid: 2888, ask: 2892 },
    { symbol: "NINTENDO", price: 7234, change: 45, changePercent: 0.63, volume: 345678, bid: 7232, ask: 7236 },
  ])

  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [priceHistory, setPriceHistory] = useState<{
    [key: string]: Array<{ time: number; price: number; volume: number }>
  }>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          const changeAmount = (Math.random() - 0.5) * 50
          const newPrice = Math.max(0, stock.price + changeAmount)
          const changePercent = (changeAmount / stock.price) * 100
          const volumeChange = Math.floor((Math.random() - 0.5) * 10000)
          const newVolume = Math.max(0, stock.volume + volumeChange)

          // Update price history
          setPriceHistory((prevHistory) => {
            const currentHistory = prevHistory[stock.symbol] || []
            const newHistory = [
              ...currentHistory.slice(-19),
              {
                time: Date.now(),
                price: newPrice,
                volume: newVolume,
              },
            ]
            return {
              ...prevHistory,
              [stock.symbol]: newHistory,
            }
          })

          return {
            ...stock,
            price: newPrice,
            change: changeAmount,
            changePercent,
            volume: newVolume,
            bid: newPrice - (Math.random() * 5 + 1),
            ask: newPrice + (Math.random() * 5 + 1),
          }
        }),
      )
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const DetailedStockView = ({ stock }: { stock: (typeof stocks)[0] }) => {
    const history = priceHistory[stock.symbol] || []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="ghost"
            className="text-cyan-400 hover:bg-cyan-400/20 font-mono text-xs"
            onClick={() => setSelectedStock(null)}
          >
            ← Back to List
          </Button>
          <div className="text-cyan-400 font-mono text-lg font-bold">{stock.symbol}</div>
        </div>

        {/* Real-time Price Display */}
        <div className="bg-gray-900/80 p-4 rounded border border-gray-700/50">
          <div className="text-center">
            <div className="text-white font-mono text-2xl font-bold mb-2">¥{stock.price.toFixed(2)}</div>
            <div
              className={`flex items-center justify-center gap-2 text-lg ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {stock.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Bid/Ask Spread */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/40 p-3 rounded border border-red-400/30">
            <div className="text-red-400 text-xs font-mono">BID</div>
            <div className="text-white font-mono font-bold">¥{stock.bid.toFixed(2)}</div>
          </div>
          <div className="bg-green-900/40 p-3 rounded border border-green-400/30">
            <div className="text-green-400 text-xs font-mono">ASK</div>
            <div className="text-white font-mono font-bold">¥{stock.ask.toFixed(2)}</div>
          </div>
        </div>

        {/* Volume and Spread Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
            <div className="text-cyan-400 text-xs font-mono">VOLUME</div>
            <div className="text-white font-mono font-bold">{stock.volume.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
            <div className="text-cyan-400 text-xs font-mono">SPREAD</div>
            <div className="text-white font-mono font-bold">¥{(stock.ask - stock.bid).toFixed(2)}</div>
          </div>
        </div>

        {/* Mini Price Chart */}
        {history.length > 1 && (
          <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
            <div className="text-cyan-400 text-xs font-mono mb-2">PRICE MOVEMENT (LAST 20 TICKS)</div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={stock.change >= 0 ? "#00ff88" : "#ff4444"}
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="0"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Live Trading Activity */}
        <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
          <div className="text-cyan-400 text-xs font-mono mb-2">LIVE ACTIVITY</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">{new Date(Date.now() - i * 1000).toLocaleTimeString()}</span>
                <span className={Math.random() > 0.5 ? "text-green-400" : "text-red-400"}>
                  {Math.random() > 0.5 ? "BUY" : "SELL"} {Math.floor(Math.random() * 1000 + 100)}
                </span>
                <span className="text-white">¥{(stock.price + (Math.random() - 0.5) * 10).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedStock) {
    const stock = stocks.find((s) => s.symbol === selectedStock)
    if (stock) {
      return <DetailedStockView stock={stock} />
    }
  }

  return (
    <div className="space-y-2 font-mono text-sm max-h-80 overflow-y-auto">
      <div className="text-cyan-400 text-xs mb-3 font-bold">CLICK ANY STOCK FOR DETAILED VIEW</div>
      {stocks.map((stock) => (
        <div
          key={stock.symbol}
          className="flex justify-between items-center bg-gray-900/60 p-3 rounded border border-gray-700/50 hover:bg-gray-800/80 hover:border-cyan-400/40 transition-all cursor-pointer group"
          onClick={() => setSelectedStock(stock.symbol)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold group-hover:text-cyan-300">{stock.symbol}</span>
              <div className="flex gap-1">
                {/* Live fluctuation indicators */}
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${stock.change >= 0 ? "bg-green-400" : "bg-red-400"}`}
                />
                <div className="w-1 h-4 bg-cyan-400/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-3 bg-cyan-400/20 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Vol: {stock.volume.toLocaleString()} | Spread: ¥{(stock.ask - stock.bid).toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">¥{stock.price.toFixed(2)}</div>
            <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniChart() {
  const [data, setData] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      time: i,
      price: 33000 + Math.random() * 500,
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)]
        const lastPrice = newData[newData.length - 1]?.price || 33000
        newData.push({
          time: prev[prev.length - 1].time + 1,
          price: lastPrice + (Math.random() - 0.5) * 100,
        })
        return newData
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} dot={false} strokeDasharray="0" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function QuickStats() {
  const [stats, setStats] = useState({
    volume: 1234567890,
    high: 33456.78,
    low: 32987.45,
    open: 33123.56,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        volume: prev.volume + Math.floor(Math.random() * 1000000),
        high: prev.high + (Math.random() - 0.5) * 10,
        low: prev.low + (Math.random() - 0.5) * 10,
        open: prev.open + (Math.random() - 0.5) * 5,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3 font-mono text-sm">
      <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
        <div className="text-cyan-400 text-xs">VOLUME</div>
        <div className="text-white font-bold">{stats.volume.toLocaleString()}</div>
      </div>
      <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
        <div className="text-cyan-400 text-xs">HIGH</div>
        <div className="text-green-400 font-bold">¥{stats.high.toFixed(2)}</div>
      </div>
      <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
        <div className="text-cyan-400 text-xs">LOW</div>
        <div className="text-red-400 font-bold">¥{stats.low.toFixed(2)}</div>
      </div>
      <div className="bg-gray-900/60 p-3 rounded border border-gray-700/50">
        <div className="text-cyan-400 text-xs">OPEN</div>
        <div className="text-white font-bold">¥{stats.open.toFixed(2)}</div>
      </div>
    </div>
  )
}

function NewsAlert() {
  const [news, setNews] = useState([
    "Tokyo Stock Exchange opens higher amid positive sentiment",
    "Bank of Japan maintains current monetary policy",
    "Tech stocks surge following earnings reports",
    "Yen strengthens against major currencies",
  ])

  const [currentNews, setCurrentNews] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % news.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [news.length])

  return (
    <div className="bg-gray-900/80 p-3 rounded border border-yellow-400/60">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />
        <span className="text-yellow-400 font-mono text-sm font-bold">BREAKING NEWS</span>
      </div>
      <div className="text-white text-sm font-mono">{news[currentNews]}</div>
    </div>
  )
}

function TrendingStocks() {
  const [trendingData, setTrendingData] = useState([
    {
      symbol: "SONY",
      price: 12450,
      change: 89,
      changePercent: 0.72,
      volume: 2456789,
      momentum: "🔥",
      sentiment: "Bullish",
      mentions: 1247,
      trend: "up",
      volatility: 2.3,
    },
    {
      symbol: "NINTENDO",
      price: 7234,
      change: -23,
      changePercent: -0.32,
      volume: 1876543,
      momentum: "📈",
      sentiment: "Mixed",
      mentions: 892,
      trend: "sideways",
      volatility: 1.8,
    },
    {
      symbol: "TOYOTA",
      price: 2890,
      change: 156,
      changePercent: 5.71,
      volume: 3245678,
      momentum: "🚀",
      sentiment: "Very Bullish",
      mentions: 2134,
      trend: "up",
      volatility: 3.1,
    },
    {
      symbol: "SOFTBANK",
      price: 5678,
      change: -89,
      changePercent: -1.54,
      volume: 1567890,
      momentum: "📉",
      sentiment: "Bearish",
      mentions: 756,
      trend: "down",
      volatility: 2.7,
    },
    {
      symbol: "RAKUTEN",
      price: 1234,
      change: 45,
      changePercent: 3.78,
      volume: 987654,
      momentum: "⚡",
      sentiment: "Bullish",
      mentions: 543,
      trend: "up",
      volatility: 4.2,
    },
  ])

  const [sortBy, setSortBy] = useState<"volume" | "mentions" | "volatility">("volume")

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendingData((prev) =>
        prev.map((stock) => {
          const changeAmount = (Math.random() - 0.5) * 100
          const newPrice = Math.max(0, stock.price + changeAmount)
          const changePercent = (changeAmount / stock.price) * 100
          const volumeChange = Math.floor((Math.random() - 0.5) * 100000)
          const newVolume = Math.max(0, stock.volume + volumeChange)
          const mentionChange = Math.floor((Math.random() - 0.5) * 50)
          const newMentions = Math.max(0, stock.mentions + mentionChange)

          // Update sentiment based on price movement
          let sentiment = stock.sentiment
          let momentum = stock.momentum
          let trend = stock.trend

          if (changePercent > 2) {
            sentiment = "Very Bullish"
            momentum = "🚀"
            trend = "up"
          } else if (changePercent > 0.5) {
            sentiment = "Bullish"
            momentum = "🔥"
            trend = "up"
          } else if (changePercent < -2) {
            sentiment = "Very Bearish"
            momentum = "📉"
            trend = "down"
          } else if (changePercent < -0.5) {
            sentiment = "Bearish"
            momentum = "📉"
            trend = "down"
          } else {
            sentiment = "Mixed"
            momentum = "📈"
            trend = "sideways"
          }

          return {
            ...stock,
            price: newPrice,
            change: changeAmount,
            changePercent,
            volume: newVolume,
            mentions: newMentions,
            sentiment,
            momentum,
            trend,
            volatility: Math.max(0.5, stock.volatility + (Math.random() - 0.5) * 0.5),
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const sortedData = [...trendingData].sort((a, b) => {
    switch (sortBy) {
      case "volume":
        return b.volume - a.volume
      case "mentions":
        return b.mentions - a.mentions
      case "volatility":
        return b.volatility - a.volatility
      default:
        return 0
    }
  })

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment.includes("Bullish")) return "text-green-400"
    if (sentiment.includes("Bearish")) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <div className="space-y-3 font-mono text-sm">
      {/* Header with sorting options */}
      <div className="flex items-center justify-between">
        <div className="text-cyan-400 text-xs font-bold">TRENDING NOW</div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "volume" | "mentions" | "volatility")}
          className="bg-gray-800 text-cyan-400 border border-gray-600 rounded px-2 py-1 text-xs font-mono"
        >
          <option value="volume">Volume</option>
          <option value="mentions">Social</option>
          <option value="volatility">Volatility</option>
        </select>
      </div>

      {/* Trending stocks list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {sortedData.map((stock, index) => (
          <div
            key={stock.symbol}
            className="bg-gray-900/60 p-3 rounded border border-gray-700/50 hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{stock.symbol}</span>
                <span className="text-lg">{stock.momentum}</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">¥{stock.price.toFixed(0)}</div>
                <div className={`text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-gray-400">Volume</div>
                <div className="text-white font-bold">{(stock.volume / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-gray-400">Social</div>
                <div className="text-cyan-400 font-bold">{stock.mentions}</div>
              </div>
              <div>
                <div className="text-gray-400">Volatility</div>
                <div className="text-yellow-400 font-bold">{stock.volatility.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/30">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Sentiment:</span>
                <span className={`text-xs font-bold ${getSentimentColor(stock.sentiment)}`}>{stock.sentiment}</span>
              </div>
              <div className={`text-xs font-bold ${getTrendColor(stock.trend)}`}>
                {stock.trend === "up" && "↗️ Trending Up"}
                {stock.trend === "down" && "↘️ Trending Down"}
                {stock.trend === "sideways" && "↔️ Sideways"}
              </div>
            </div>

            {/* Mini momentum bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-1000 ${
                    stock.trend === "up" ? "bg-green-400" : stock.trend === "down" ? "bg-red-400" : "bg-yellow-400"
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(stock.changePercent) * 10)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats footer */}
      <div className="bg-gray-900/80 p-2 rounded border border-cyan-400/30">
        <div className="flex justify-between text-xs">
          <span className="text-cyan-400">Market Heat: </span>
          <span className="text-green-400 font-bold animate-pulse">🔥 HIGH</span>
        </div>
      </div>
    </div>
  )
}

export default function PixelTradingOverlay() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [windows, setWindows] = useState([
    { id: "stocks", title: "Live Market Data", component: "stocks" },
    { id: "chart", title: "NIKKEI Mini Chart", component: "chart" },
    { id: "stats", title: "Market Stats", component: "stats" },
    { id: "trending", title: "Trending Stocks", component: "trending" },
  ])

  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (type: Alert["type"], title: string, message: string) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
    }
    setAlerts((prev) => [...prev, newAlert])
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  // Add sample alerts that trigger periodically (only after welcome screen is closed)
  useEffect(() => {
    if (showWelcome) return

    const alertMessages = [
      { type: "success" as const, title: "Price Alert", message: "SONY reached target price of ¥12,500" },
      { type: "warning" as const, title: "Volume Alert", message: "Unusual trading volume detected in NIKKEI" },
      { type: "info" as const, title: "Market Update", message: "Tokyo Stock Exchange volatility increased by 15%" },
      { type: "error" as const, title: "Connection Alert", message: "Market data feed experienced brief interruption" },
      { type: "success" as const, title: "Order Filled", message: "Buy order for 100 shares of TOYOTA executed" },
      { type: "warning" as const, title: "Margin Call", message: "Account margin level approaching minimum threshold" },
      { type: "info" as const, title: "News Alert", message: "Bank of Japan announces policy meeting results" },
    ]

    const interval = setInterval(() => {
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)]
      addAlert(randomAlert.type, randomAlert.title, randomAlert.message)
    }, 8000) // New alert every 8 seconds

    return () => clearInterval(interval)
  }, [showWelcome])

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const renderWindowContent = (component: string) => {
    switch (component) {
      case "stocks":
        return <LiveStockTicker />
      case "chart":
        return <MiniChart />
      case "stats":
        return <QuickStats />
      case "trending":
        return <TrendingStocks />
      default:
        return <div>Unknown component</div>
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.7) contrast(1.1)" }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />

      {/* Welcome Screen */}
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}

      {/* Top Status Bar */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
              <Activity className="h-4 w-4 animate-pulse" />
              <span className="font-bold">MARKET OPEN</span>
            </div>
            <div className="text-cyan-400 font-mono text-xs">
              Tokyo Stock Exchange • {new Date().toLocaleTimeString()} JST
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowWelcome(true)}
            size="sm"
            variant="ghost"
            className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-cyan-400/20 font-mono text-xs"
          >
            Help
          </Button>
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-cyan-400/20"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Alert Container - Top Right */}
      <div className="fixed top-4 right-4 z-[60] space-y-3" style={{ marginTop: "60px" }}>
        {alerts.map((alert) => (
          <AlertPopup key={alert.id} alert={alert} onClose={removeAlert} />
        ))}
      </div>

      {/* Floating Windows */}
      {windows.map((window, index) => (
        <OverlayWindow
          key={window.id}
          id={window.id}
          title={window.title}
          initialPosition={{
            x: 20 + index * 20,
            y: 80 + index * 30,
          }}
          initialSize={{
            width: window.component === "stocks" ? 320 : window.component === "trending" ? 350 : 280,
            height:
              window.component === "stocks"
                ? 400
                : window.component === "trending"
                  ? 450
                  : window.component === "chart"
                    ? 200
                    : 250,
          }}
          onClose={() => closeWindow(window.id)}
        >
          {renderWindowContent(window.component)}
        </OverlayWindow>
      ))}

      {/* Bottom News Ticker */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <NewsAlert />
      </div>

      {/* Side Panel - Quick Actions */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 rounded-lg p-3 space-y-2">
          <Button
            size="sm"
            className="w-full bg-green-600/80 hover:bg-green-600 text-white font-mono text-xs"
            onClick={() => addAlert("success", "Buy Order", "Market buy order placed successfully")}
          >
            BUY
          </Button>
          <Button
            size="sm"
            className="w-full bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs"
            onClick={() => addAlert("success", "Sell Order", "Market sell order placed successfully")}
          >
            SELL
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-black/60 text-cyan-400 border-cyan-400/60 hover:bg-cyan-400/20 font-mono text-xs"
            onClick={() => addAlert("info", "Alert Set", "Price alert configured for current market conditions")}
          >
            ALERT
          </Button>
        </div>
      </div>

      {/* System Info - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 rounded-lg p-2">
          <div className="flex gap-3 text-xs font-mono">
            <span className="text-green-400">CPU: 45%</span>
            <span className="text-yellow-400">RAM: 67%</span>
            <span className="text-cyan-400">NET: 1.2MB/s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
