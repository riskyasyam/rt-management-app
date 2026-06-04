import { useState, useEffect, useCallback } from 'react'
import { Plus, Home, UserPlus, DoorOpen, History, Calendar, Search, ChevronRight, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { rumahApi, wargaApi } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { formatDate, formatCurrency, BULAN_NAMES } from '@/lib/utils'

function FormRow({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-[hsl(var(--text-muted))]">{hint}</p>}
    </div>
  )
}

export default function RumahPage() {
  const { addToast } = useToast()
  const [rumahList, setRumahList] = useState([])
  const [wargaList, setWargaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [addRumahOpen,    setAddRumahOpen]    = useState(false)
  const [setPenghuniOpen, setSetPenghuniOpen] = useState(false)
  const [kosongkanOpen,   setKosongkanOpen]   = useState(false)
  const [historiOpen,     setHistoriOpen]     = useState(false)
  const [rekapBayarOpen,  setRekapBayarOpen]  = useState(false)

  const [selectedRumah, setSelectedRumah] = useState(null)
  const [histori,        setHistori]        = useState([])
  const [historiLoading,  setHistoriLoading]  = useState(false)
  const [rekapBayar,      setRekapBayar]      = useState([])
  const [rekapBayarLoading, setRekapBayarLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [nomorRumah,    setNomorRumah]    = useState('')
  const [penghuniForm,  setPenghuniForm]  = useState({ warga_id: '', tanggal_masuk: '' })
  const [tanggalKeluar, setTanggalKeluar] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [rumahRes, wargaRes] = await Promise.allSettled([rumahApi.getAll(), wargaApi.getAll()])
      if (rumahRes.status === 'fulfilled') setRumahList(rumahRes.value.data?.data ?? [])
      if (wargaRes.status === 'fulfilled') setWargaList(wargaRes.value.data?.data ?? [])
    } catch {
      addToast({ title: 'Gagal', description: 'Tidak dapat memuat data', variant: 'destructive' })
    } finally { setLoading(false) }
  }, [addToast])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddRumah = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await rumahApi.create({ nomor_rumah: nomorRumah })
      addToast({ title: 'Berhasil', description: `Rumah ${nomorRumah} ditambahkan`, variant: 'success' })
      setAddRumahOpen(false); setNomorRumah(''); fetchData()
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message ?? 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const handleSetPenghuni = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await rumahApi.setPenghuni(selectedRumah.id, { warga_id: parseInt(penghuniForm.warga_id), tanggal_masuk: penghuniForm.tanggal_masuk })
      addToast({ title: 'Berhasil', description: 'Penghuni berhasil diperbarui', variant: 'success' })
      setSetPenghuniOpen(false); fetchData()
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message ?? 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const handleKosongkan = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await rumahApi.kosongkan(selectedRumah.id, { tanggal_keluar: tanggalKeluar })
      addToast({ title: 'Berhasil', description: `Rumah ${selectedRumah.nomor_rumah} dikosongkan`, variant: 'success' })
      setKosongkanOpen(false); fetchData()
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message ?? 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const openHistori = async (rumah) => {
    setSelectedRumah(rumah); setHistoriOpen(true); setHistoriLoading(true)
    try {
      const res = await rumahApi.getHistoriPenghuni(rumah.id)
      setHistori(res.data?.data ?? [])
    } catch {
      addToast({ title: 'Gagal', description: 'Tidak dapat memuat histori', variant: 'destructive' })
    } finally { setHistoriLoading(false) }
  }

  const openRekapBayar = async (rumah) => {
    setSelectedRumah(rumah); setRekapBayarOpen(true); setRekapBayarLoading(true)
    try {
      const res = await rumahApi.getHistoriPembayaran(rumah.id)
      setRekapBayar(res.data?.data ?? [])
    } catch {
      addToast({ title: 'Gagal', description: 'Tidak dapat memuat rekap pembayaran', variant: 'destructive' })
    } finally { setRekapBayarLoading(false) }
  }

  const filtered = rumahList.filter(r =>
    r.nomor_rumah?.toLowerCase().includes(search.toLowerCase()) ||
    r.penghuni_aktif?.warga?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--text-muted))]" />
          <Input placeholder="Cari nomor atau penghuni..." className="pl-8 w-64" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <Button id="btn-tambah-rumah" onClick={()=>{ setNomorRumah(''); setAddRumahOpen(true) }}>
          <Plus className="w-3.5 h-3.5" />
          Tambah Rumah
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle>Unit Rumah</CardTitle>
            <Badge variant="secondary">{filtered.length} unit</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {loading ? (
            <div className="p-5 space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <Home className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--text-muted))] opacity-40" />
              <p className="text-sm text-[hsl(var(--text-muted))]">{search ? 'Tidak ada hasil pencarian' : 'Belum ada data rumah'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Rumah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penghuni Aktif</TableHead>
                  <TableHead>Tgl. Masuk</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(rumah => (
                  <TableRow key={rumah.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[hsl(0_0%_93%)] flex items-center justify-center">
                          <Home className="w-3.5 h-3.5 text-[hsl(var(--text-secondary))]" />
                        </div>
                        <span className="font-semibold">{rumah.nomor_rumah}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rumah.status_rumah === 'dihuni' ? 'success' : 'warning'}>
                        {rumah.status_rumah === 'dihuni' ? 'Dihuni' : 'Kosong'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rumah.penghuni_aktif?.warga ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[hsl(0_0%_10%)] flex items-center justify-center text-[10px] font-bold text-white">
                            {rumah.penghuni_aktif.warga.nama_lengkap?.[0]}
                          </div>
                          <span className="text-sm">{rumah.penghuni_aktif.warga.nama_lengkap}</span>
                        </div>
                      ) : (
                        <span className="text-[hsl(var(--text-muted))] text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-[hsl(var(--text-muted))]">
                      {formatDate(rumah.penghuni_aktif?.tanggal_masuk)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-set-penghuni-${rumah.id}`}
                          variant="outline" size="sm"
                          onClick={()=>{ setSelectedRumah(rumah); setPenghuniForm({warga_id:'',tanggal_masuk:''}); setSetPenghuniOpen(true) }}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          {rumah.status_rumah === 'dihuni' ? 'Ganti' : 'Set'} Penghuni
                        </Button>
                        {rumah.status_rumah === 'dihuni' && (
                          <Button
                            id={`btn-kosongkan-${rumah.id}`}
                            variant="outline" size="sm"
                            onClick={()=>{ setSelectedRumah(rumah); setTanggalKeluar(''); setKosongkanOpen(true) }}
                          >
                            <DoorOpen className="w-3.5 h-3.5" />
                            Kosongkan
                          </Button>
                        )}
                        <Button id={`btn-histori-${rumah.id}`} variant="ghost" size="sm" onClick={()=>openHistori(rumah)}>
                          <History className="w-3.5 h-3.5" />
                          Histori
                        </Button>
                        <Button id={`btn-rekap-bayar-${rumah.id}`} variant="ghost" size="sm" onClick={()=>openRekapBayar(rumah)}>
                          <Receipt className="w-3.5 h-3.5" />
                          Rekap Bayar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Rumah */}
      <Dialog open={addRumahOpen} onOpenChange={setAddRumahOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Unit Rumah</DialogTitle>
            <DialogDescription>Nomor rumah harus unik.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRumah} className="space-y-3">
            <FormRow label="Nomor Rumah *">
              <Input id="nomor_rumah" required value={nomorRumah} onChange={e=>setNomorRumah(e.target.value)} placeholder="A01" />
            </FormRow>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>setAddRumahOpen(false)}>Batal</Button>
              <Button id="btn-submit-rumah" type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Tambah'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Set Penghuni */}
      <Dialog open={setPenghuniOpen} onOpenChange={setSetPenghuniOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Penghuni — Rumah {selectedRumah?.nomor_rumah}</DialogTitle>
            <DialogDescription>
              {selectedRumah?.status_rumah === 'dihuni' ? 'Penghuni lama akan otomatis dicatat keluar.' : 'Pilih warga penghuni.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetPenghuni} className="space-y-3">
            <FormRow label="Pilih Warga *">
              <Select value={penghuniForm.warga_id} onValueChange={v=>setPenghuniForm(p=>({...p,warga_id:v}))}>
                <SelectTrigger id="select-warga"><SelectValue placeholder="Pilih warga..." /></SelectTrigger>
                <SelectContent>
                  {wargaList.map(w=><SelectItem key={w.id} value={String(w.id)}>{w.nama_lengkap}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Tanggal Masuk *">
              <Input id="tanggal_masuk" type="date" required value={penghuniForm.tanggal_masuk} onChange={e=>setPenghuniForm(p=>({...p,tanggal_masuk:e.target.value}))} />
            </FormRow>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>setSetPenghuniOpen(false)}>Batal</Button>
              <Button id="btn-submit-penghuni" type="submit" disabled={submitting || !penghuniForm.warga_id}>{submitting ? 'Menyimpan...' : 'Set Penghuni'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Kosongkan */}
      <Dialog open={kosongkanOpen} onOpenChange={setKosongkanOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Kosongkan Rumah {selectedRumah?.nomor_rumah}</DialogTitle>
            <DialogDescription>Penghuni <strong>{selectedRumah?.penghuni_aktif?.warga?.nama_lengkap}</strong> akan dicatat keluar.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleKosongkan} className="space-y-3">
            <FormRow label="Tanggal Keluar *">
              <Input id="tanggal_keluar" type="date" required value={tanggalKeluar} onChange={e=>setTanggalKeluar(e.target.value)} />
            </FormRow>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>setKosongkanOpen(false)}>Batal</Button>
              <Button id="btn-submit-kosongkan" type="submit" disabled={submitting}>{submitting ? 'Memproses...' : 'Kosongkan'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Histori */}
      <Dialog open={historiOpen} onOpenChange={setHistoriOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Histori Penghuni — Rumah {selectedRumah?.nomor_rumah}</DialogTitle>
            <DialogDescription>Riwayat seluruh penghuni rumah ini.</DialogDescription>
          </DialogHeader>
          {historiLoading ? (
            <div className="space-y-2">{[1,2].map(i=><Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : histori.length === 0 ? (
            <p className="text-sm text-[hsl(var(--text-muted))] text-center py-6">Belum ada histori penghuni</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {histori.map((h, i) => (
                <div key={h.id} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(0_0%_99%)]">
                  <div className="w-7 h-7 rounded-full bg-[hsl(0_0%_10%)] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {h.warga?.nama_lengkap?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{h.warga?.nama_lengkap}</p>
                    <div className="flex items-center gap-1 text-[11px] text-[hsl(var(--text-muted))] mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(h.tanggal_masuk)}</span>
                      <span>→</span>
                      {h.tanggal_keluar ? <span>{formatDate(h.tanggal_keluar)}</span> : <Badge variant="success" className="text-[10px] py-0">Aktif</Badge>}
                    </div>
                  </div>
                  {i === 0 && !h.tanggal_keluar && <Badge variant="secondary">Aktif</Badge>}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rekap Pembayaran */}
      <Dialog open={rekapBayarOpen} onOpenChange={setRekapBayarOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rekap Pembayaran — Rumah {selectedRumah?.nomor_rumah}</DialogTitle>
            <DialogDescription>Histori seluruh pembayaran iuran untuk unit rumah ini.</DialogDescription>
          </DialogHeader>
          {rekapBayarLoading ? (
            <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : rekapBayar.length === 0 ? (
            <div className="py-10 text-center">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--text-muted))] opacity-40" />
              <p className="text-sm text-[hsl(var(--text-muted))]">Belum ada rekap pembayaran untuk rumah ini.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warga</TableHead>
                    <TableHead>Jenis Iuran</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekapBayar.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{p.warga?.nama_lengkap ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={p.jenis_iuran === 'satpam' ? 'secondary' : 'outline'} className="capitalize">
                          {p.jenis_iuran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--text-muted))]">
                        {BULAN_NAMES[p.bulan]} {p.tahun}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status_pembayaran === 'lunas' ? 'success' : 'warning'} className="capitalize">
                          {p.status_pembayaran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[hsl(var(--success))]">
                        {formatCurrency(p.jumlah_bayar)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
