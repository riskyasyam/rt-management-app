import { useState, useEffect, useCallback } from 'react'
import { CreditCard, Receipt, BarChart3, FileText, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { keuanganApi, rumahApi } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { formatCurrency, formatDate, BULAN_NAMES } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function FormRow({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-[hsl(var(--text-muted))]">{hint}</p>}
    </div>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-white p-3 shadow-md text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span>{e.name}:</span>
          <span className="font-medium text-[hsl(var(--text-primary))]">{formatCurrency(e.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Bayar Iuran ─────────────────────────────────────────
function BayarIuranTab({ rumahList }) {
  const { addToast } = useToast()
  const [form, setForm] = useState({ rumah_id:'', jenis_iuran:'satpam', bulan_mulai:'1', tahun:String(new Date().getFullYear()), durasi_bulan:'1' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setResult(null)
    try {
      const res = await keuanganApi.bayarIuran({
        rumah_id: parseInt(form.rumah_id),
        jenis_iuran: form.jenis_iuran,
        bulan_mulai: parseInt(form.bulan_mulai),
        tahun: parseInt(form.tahun),
        durasi_bulan: parseInt(form.durasi_bulan),
      })
      setResult(res.data)
      addToast({ title: 'Iuran dicatat', description: `${res.data.total_bulan_dibayar} bulan berhasil dibayar`, variant: 'success' })
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message ?? 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const dihuni = rumahList.filter(r => r.status_rumah === 'dihuni')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Bayar Iuran</CardTitle>
          <CardDescription>Catat pembayaran iuran warga RT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormRow label="Pilih Rumah *" hint="Hanya rumah yang sedang dihuni">
              <Select value={form.rumah_id} onValueChange={v=>setForm(p=>({...p,rumah_id:v}))}>
                <SelectTrigger id="select-rumah-iuran"><SelectValue placeholder="Pilih unit rumah..." /></SelectTrigger>
                <SelectContent>
                  {dihuni.map(r=><SelectItem key={r.id} value={String(r.id)}>Rumah {r.nomor_rumah} — {r.penghuni_aktif?.warga?.nama_lengkap}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Jenis Iuran *">
              <Select value={form.jenis_iuran} onValueChange={v=>setForm(p=>({...p,jenis_iuran:v}))}>
                <SelectTrigger id="select-jenis-iuran"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="satpam">Satpam — Rp 100.000/bulan</SelectItem>
                  <SelectItem value="kebersihan">Kebersihan — Rp 15.000/bulan</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>
            <div className="grid grid-cols-3 gap-3">
              <FormRow label="Bulan Mulai *">
                <Select value={form.bulan_mulai} onValueChange={v=>setForm(p=>({...p,bulan_mulai:v}))}>
                  <SelectTrigger id="select-bulan"><SelectValue /></SelectTrigger>
                  <SelectContent>{BULAN_NAMES.slice(1).map((b,i)=><SelectItem key={i+1} value={String(i+1)}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Tahun *">
                <Input id="tahun-iuran" type="number" min="2020" max="2099" required value={form.tahun} onChange={e=>setForm(p=>({...p,tahun:e.target.value}))} />
              </FormRow>
              <FormRow label="Durasi (bln)">
                <Input id="durasi-bulan" type="number" min="1" max="12" value={form.durasi_bulan} onChange={e=>setForm(p=>({...p,durasi_bulan:e.target.value}))} />
              </FormRow>
            </div>
            <Button id="btn-bayar-iuran" type="submit" className="w-full" disabled={submitting || !form.rumah_id}>
              {submitting ? 'Memproses...' : 'Bayar Iuran'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="lg:col-span-2 border-[hsl(var(--success)/0.4)] bg-[hsl(var(--success-bg))]">
          <CardHeader><CardTitle className="text-[hsl(var(--success))]">Pembayaran Berhasil</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-[hsl(var(--text-secondary))]">{result.message}</p>
            <div className="mt-4 rounded-[var(--radius-sm)] border border-[hsl(var(--success)/0.3)] bg-white/60 p-4 text-center">
              <p className="text-3xl font-bold text-[hsl(var(--success))]">{result.total_bulan_dibayar}</p>
              <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Bulan berhasil dicatat</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Tambah Pengeluaran ───────────────────────────────────
function PengeluaranTab() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ deskripsi:'', nominal:'', tanggal_pengeluaran:'' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setResult(null)
    try {
      const res = await keuanganApi.tambahPengeluaran({ deskripsi:form.deskripsi, nominal:parseFloat(form.nominal), tanggal_pengeluaran:form.tanggal_pengeluaran })
      setResult(res.data)
      addToast({ title: 'Berhasil', description: 'Pengeluaran dicatat', variant: 'success' })
      setForm({ deskripsi:'', nominal:'', tanggal_pengeluaran:'' })
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message ?? 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Tambah Pengeluaran</CardTitle>
          <CardDescription>Catat pengeluaran kas RT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormRow label="Deskripsi *">
              <Input id="deskripsi-pengeluaran" required value={form.deskripsi} onChange={e=>setForm(p=>({...p,deskripsi:e.target.value}))} placeholder="Pembelian Cat Pagar RT" />
            </FormRow>
            <FormRow label="Nominal (Rp) *">
              <Input id="nominal-pengeluaran" type="number" min="0" required value={form.nominal} onChange={e=>setForm(p=>({...p,nominal:e.target.value}))} placeholder="350000" />
            </FormRow>
            <FormRow label="Tanggal Pengeluaran *">
              <Input id="tanggal-pengeluaran" type="date" required value={form.tanggal_pengeluaran} onChange={e=>setForm(p=>({...p,tanggal_pengeluaran:e.target.value}))} />
            </FormRow>
            <Button id="btn-tambah-pengeluaran" type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Catat Pengeluaran'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {result?.data && (
        <Card className="lg:col-span-2 border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger-bg))]">
          <CardHeader><CardTitle className="text-[hsl(var(--danger))]">Pengeluaran Dicatat</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-[var(--radius-sm)] border border-[hsl(var(--danger)/0.2)] bg-white/60 p-4">
              <p className="text-2xl font-bold text-[hsl(var(--danger))]">{formatCurrency(result.data.nominal)}</p>
              <p className="text-sm mt-1">{result.data.deskripsi}</p>
              <p className="text-xs text-[hsl(var(--text-muted))] mt-0.5">{formatDate(result.data.tanggal_pengeluaran)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Laporan Tahunan ──────────────────────────────────────
function ReportSummaryTab() {
  const { addToast } = useToast()
  const [tahun, setTahun] = useState(String(new Date().getFullYear()))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await keuanganApi.getReportSummary(parseInt(tahun))
      setData(res.data)
    } catch { addToast({ title: 'Gagal', description: 'Tidak dapat memuat laporan', variant: 'destructive' }) }
    finally { setLoading(false) }
  }, [tahun, addToast])

  useEffect(() => { fetch() }, [fetch])

  const chartData = (data?.chart_data ?? []).map(item => ({
    bulan: BULAN_NAMES[item.bulan]?.slice(0,3),
    Pemasukan: item.pemasukan,
    Pengeluaran: item.pengeluaran,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-xs shrink-0">Tahun</Label>
        <Select value={tahun} onValueChange={setTahun}>
          <SelectTrigger id="select-tahun-summary" className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{Array.from({length:5},(_,i)=>String(new Date().getFullYear()-i)).map(y=><SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><Skeleton key={i} className="h-20" />)}</div>
      ) : data?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Total Pemasukan',  val: data.summary.total_pemasukan,  color: 'text-[hsl(var(--success))]', borderColor: 'border-[hsl(var(--success)/0.3)]' },
            { label:'Total Pengeluaran', val: data.summary.total_pengeluaran, color: 'text-[hsl(var(--danger))]',  borderColor: 'border-[hsl(var(--danger)/0.3)]' },
            { label:'Saldo Kas',         val: data.summary.sisa_saldo_kas,    color: 'text-[hsl(var(--text-primary))]', borderColor: 'border-[hsl(var(--border))]' },
          ].map(r => (
            <Card key={r.label} className={r.borderColor}>
              <CardContent className="p-4">
                <p className="text-xs text-[hsl(var(--text-muted))]">{r.label}</p>
                <p className={`text-xl font-bold mt-1 ${r.color}`}>{formatCurrency(r.val)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Grafik Keuangan {tahun}</CardTitle>
          <CardDescription>Pemasukan vs pengeluaran per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-52 w-full" /> : chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-[hsl(var(--text-muted))]">Tidak ada data untuk tahun {tahun}</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} margin={{ top:6, right:4, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" />
                <XAxis dataKey="bulan" tick={{ fontSize:11, fill:'hsl(0 0% 50%)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v=>`${(v/1000).toFixed(0)}k`} tick={{ fontSize:11, fill:'hsl(0 0% 50%)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize:'12px', paddingTop:'8px' }} />
                <Bar dataKey="Pemasukan"   fill="#16a34a" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[3,3,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Detail Bulanan ───────────────────────────────────────
function ReportDetailTab() {
  const { addToast } = useToast()
  const [bulan, setBulan] = useState(String(new Date().getMonth()+1))
  const [tahun, setTahun] = useState(String(new Date().getFullYear()))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await keuanganApi.getReportDetail(parseInt(bulan), parseInt(tahun))
      setData(res.data)
    } catch { addToast({ title: 'Gagal', description: 'Tidak dapat memuat laporan detail', variant: 'destructive' }) }
    finally { setLoading(false) }
  }, [bulan, tahun, addToast])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-xs shrink-0">Periode</Label>
        <Select value={bulan} onValueChange={setBulan}>
          <SelectTrigger id="select-bulan-detail" className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{BULAN_NAMES.slice(1).map((b,i)=><SelectItem key={i+1} value={String(i+1)}>{b}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={tahun} onValueChange={setTahun}>
          <SelectTrigger id="select-tahun-detail" className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent>{Array.from({length:5},(_,i)=>String(new Date().getFullYear()-i)).map(y=><SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : data && (
        <div className="space-y-4">
          {/* Header summary */}
          <div className="flex items-center justify-between p-4 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(0_0%_99%)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[hsl(var(--text-muted))]" />
              <span className="text-sm font-semibold">{data.periode}</span>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[11px] text-[hsl(var(--text-muted))]">Pemasukan</p>
                <p className="text-sm font-bold text-[hsl(var(--success))]">{formatCurrency(data.data?.total_pemasukan ?? 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[hsl(var(--text-muted))]">Pengeluaran</p>
                <p className="text-sm font-bold text-[hsl(var(--danger))]">{formatCurrency(data.data?.total_pengeluaran ?? 0)}</p>
              </div>
            </div>
          </div>

          {/* Pemasukan */}
          <Card>
            <CardHeader className="pb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--success))]" />
                <CardTitle className="text-sm">Pemasukan</CardTitle>
                <Badge variant="secondary">{data.data?.pemasukan_detail?.length ?? 0}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {(data.data?.pemasukan_detail?.length ?? 0) === 0
                ? <p className="px-5 py-4 text-sm text-[hsl(var(--text-muted))]">Tidak ada pemasukan bulan ini.</p>
                : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rumah</TableHead>
                        <TableHead>Warga</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.pemasukan_detail.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.rumah?.nomor_rumah}</TableCell>
                          <TableCell>{t.warga?.nama_lengkap}</TableCell>
                          <TableCell><Badge variant="success">{t.jenis_iuran}</Badge></TableCell>
                          <TableCell className="text-[hsl(var(--text-muted))]">{BULAN_NAMES[t.bulan]} {t.tahun}</TableCell>
                          <TableCell className="text-right font-semibold text-[hsl(var(--success))]">{formatCurrency(t.jumlah_bayar)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              }
            </CardContent>
          </Card>

          {/* Pengeluaran */}
          <Card>
            <CardHeader className="pb-1">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[hsl(var(--danger))]" />
                <CardTitle className="text-sm">Pengeluaran</CardTitle>
                <Badge variant="secondary">{data.data?.pengeluaran_detail?.length ?? 0}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {(data.data?.pengeluaran_detail?.length ?? 0) === 0
                ? <p className="px-5 py-4 text-sm text-[hsl(var(--text-muted))]">Tidak ada pengeluaran bulan ini.</p>
                : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.pengeluaran_detail.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.deskripsi}</TableCell>
                          <TableCell className="text-[hsl(var(--text-muted))]">{formatDate(t.tanggal_pengeluaran)}</TableCell>
                          <TableCell className="text-right font-semibold text-[hsl(var(--danger))]">{formatCurrency(t.nominal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              }
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────
export default function KeuanganPage() {
  const { addToast } = useToast()
  const [rumahList, setRumahList] = useState([])

  useEffect(() => {
    rumahApi.getAll()
      .then(res => setRumahList(res.data?.data ?? []))
      .catch(() => addToast({ title: 'Gagal', description: 'Tidak dapat memuat data rumah', variant: 'destructive' }))
  }, [addToast])

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs defaultValue="bayar-iuran">
        <TabsList>
          <TabsTrigger id="tab-bayar-iuran" value="bayar-iuran">
            <CreditCard className="w-3.5 h-3.5" /> Bayar Iuran
          </TabsTrigger>
          <TabsTrigger id="tab-pengeluaran" value="pengeluaran">
            <Receipt className="w-3.5 h-3.5" /> Pengeluaran
          </TabsTrigger>
          <TabsTrigger id="tab-report-summary" value="report-summary">
            <BarChart3 className="w-3.5 h-3.5" /> Laporan Tahunan
          </TabsTrigger>
          <TabsTrigger id="tab-report-detail" value="report-detail">
            <FileText className="w-3.5 h-3.5" /> Detail Bulanan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bayar-iuran"><BayarIuranTab rumahList={rumahList} /></TabsContent>
        <TabsContent value="pengeluaran"><PengeluaranTab /></TabsContent>
        <TabsContent value="report-summary"><ReportSummaryTab /></TabsContent>
        <TabsContent value="report-detail"><ReportDetailTab /></TabsContent>
      </Tabs>
    </div>
  )
}
