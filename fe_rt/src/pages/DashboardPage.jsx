import { useState, useEffect } from 'react'
import { Users, Home, Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { wargaApi, rumahApi, keuanganApi } from '@/lib/api'
import { formatCurrency, BULAN_NAMES } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'

const StatCard = ({ title, value, sub, icon: Icon, trend, loading }) => (
  <Card>
    <CardContent className="p-5">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-28" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[hsl(var(--text-muted))] font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-[hsl(var(--text-primary))] leading-tight">{value}</p>
            {sub && <p className="text-xs text-[hsl(var(--text-muted))] mt-1">{sub}</p>}
          </div>
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[hsl(0_0%_95%)] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
          </div>
        </div>
      )}
      {trend !== undefined && !loading && (
        <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-1">
          {trend >= 0
            ? <ArrowUp className="w-3 h-3 text-[hsl(var(--success))]" />
            : <ArrowDown className="w-3 h-3 text-[hsl(var(--danger))]" />
          }
          <span className={`text-[11px] font-medium ${trend >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-[11px] text-[hsl(var(--text-muted))]">dari bulan lalu</span>
        </div>
      )}
    </CardContent>
  </Card>
)

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-3 shadow-md text-xs">
      <p className="font-semibold mb-2 text-[hsl(var(--text-primary))]">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
          <span>{e.name}:</span>
          <span className="font-medium text-[hsl(var(--text-primary))]">{formatCurrency(e.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ warga: 0, rumah: 0, dihuni: 0, kosong: 0 })
  const [summary, setSummary] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [wargaRes, rumahRes, summaryRes] = await Promise.allSettled([
          wargaApi.getAll(),
          rumahApi.getAll(),
          keuanganApi.getReportSummary(currentYear),
        ])
        if (wargaRes.status === 'fulfilled') {
          setStats(p => ({ ...p, warga: wargaRes.value.data?.data?.length ?? 0 }))
        }
        if (rumahRes.status === 'fulfilled') {
          const list = rumahRes.value.data?.data ?? []
          const dihuni = list.filter(r => r.status_rumah === 'dihuni').length
          setStats(p => ({ ...p, rumah: list.length, dihuni, kosong: list.length - dihuni }))
        }
        if (summaryRes.status === 'fulfilled') {
          const d = summaryRes.value.data
          setSummary(d.summary)
          setChartData(
            (d.chart_data ?? []).map(item => ({
              bulan: BULAN_NAMES[item.bulan]?.slice(0, 3) ?? item.bulan,
              Pemasukan: item.pemasukan,
              Pengeluaran: item.pengeluaran,
            }))
          )
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [currentYear])

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Warga"    value={stats.warga}  sub="Warga terdaftar"                                     icon={Users}       loading={loading} />
        <StatCard title="Total Rumah"    value={stats.rumah}  sub={`${stats.dihuni} dihuni · ${stats.kosong} kosong`}   icon={Home}        loading={loading} />
        <StatCard title="Total Pemasukan" value={loading ? '—' : formatCurrency(summary?.total_pemasukan ?? 0)} sub={`Tahun ${currentYear}`} icon={TrendingUp} loading={loading} />
        <StatCard title="Saldo Kas"      value={loading ? '—' : formatCurrency(summary?.sisa_saldo_kas ?? 0)}  sub="Setelah pengeluaran"       icon={Wallet}      loading={loading} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart — spans 2 cols */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Arus Kas {currentYear}</CardTitle>
                <CardDescription>Pemasukan & pengeluaran per bulan</CardDescription>
              </div>
              <Badge variant="secondary">{currentYear}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : chartData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-[hsl(var(--text-muted))]">Belum ada data transaksi</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPemasukan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: 'hsl(0 0% 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'hsl(0 0% 50%)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="Pemasukan"   stroke="#16a34a" strokeWidth={1.5} fill="url(#gPemasukan)" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#dc2626" strokeWidth={1.5} fill="url(#gPengeluaran)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Occupancy + Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Status Hunian</CardTitle>
            <CardDescription>Distribusi unit rumah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
              <>
                {/* Occupancy bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[hsl(var(--text-muted))]">Tingkat Hunian</span>
                    <span className="font-semibold">{stats.rumah>0 ? Math.round((stats.dihuni/stats.rumah)*100) : 0}%</span>
                  </div>
                  <div className="h-1.5 bg-[hsl(0_0%_92%)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--text-primary))] rounded-full transition-all duration-700"
                      style={{ width:`${stats.rumah>0?(stats.dihuni/stats.rumah)*100:0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-sm)] border border-[hsl(var(--border))] p-3 text-center">
                    <p className="text-xl font-bold">{stats.dihuni}</p>
                    <p className="text-[11px] text-[hsl(var(--text-muted))] mt-0.5">Dihuni</p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[hsl(var(--border))] p-3 text-center">
                    <p className="text-xl font-bold">{stats.kosong}</p>
                    <p className="text-[11px] text-[hsl(var(--text-muted))] mt-0.5">Kosong</p>
                  </div>
                </div>

                {summary && (
                  <div className="space-y-2 pt-3 border-t border-[hsl(var(--border))]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">Ringkasan {currentYear}</p>
                    {[
                      { label: 'Pemasukan',    val: summary.total_pemasukan,  color: 'text-[hsl(var(--success))]' },
                      { label: 'Pengeluaran',  val: summary.total_pengeluaran, color: 'text-[hsl(var(--danger))]' },
                      { label: 'Saldo',        val: summary.sisa_saldo_kas,    color: 'text-[hsl(var(--text-primary))]', bold: true },
                    ].map(r => (
                      <div key={r.label} className={`flex justify-between text-xs ${r.bold ? 'pt-2 border-t border-[hsl(var(--border))] font-semibold' : ''}`}>
                        <span className="text-[hsl(var(--text-muted))]">{r.label}</span>
                        <span className={r.color}>{formatCurrency(r.val)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
