import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, User, Phone, Heart, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { wargaApi } from '@/lib/api'
import { useToast } from '@/components/ui/toast'

const BASE_URL = 'http://localhost:8000'

const initialForm = {
  nama_lengkap: '',
  status_warga: 'tetap',
  nomor_telepon: '',
  status_pernikahan: 'menikah',
  foto_ktp: null,
}

function FormRow({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  )
}

export default function WargaPage() {
  const { addToast } = useToast()
  const [wargaList, setWargaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchWarga = useCallback(async () => {
    try {
      const res = await wargaApi.getAll()
      setWargaList(res.data?.data ?? [])
    } catch {
      addToast({ title: 'Gagal memuat data', description: 'Periksa koneksi ke server', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchWarga() }, [fetchWarga])

  const openAdd  = () => { setEditId(null); setForm(initialForm); setDialogOpen(true) }
  const openEdit = (w)  => { setEditId(w.id); setForm({ nama_lengkap: w.nama_lengkap, status_warga: w.status_warga, nomor_telepon: w.nomor_telepon||'', status_pernikahan: w.status_pernikahan, foto_ktp: null }); setDialogOpen(true) }
  const openDel  = (w)  => { setDeleteTarget(w); setDeleteDialogOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('nama_lengkap', form.nama_lengkap)
      fd.append('status_warga', form.status_warga)
      fd.append('nomor_telepon', form.nomor_telepon)
      fd.append('status_pernikahan', form.status_pernikahan)
      if (form.foto_ktp) fd.append('foto_ktp', form.foto_ktp)
      if (editId) fd.append('_method', 'PUT')
      editId ? await wargaApi.update(editId, fd) : await wargaApi.create(fd)
      addToast({ title: 'Berhasil', description: editId ? 'Data warga diperbarui' : 'Warga baru ditambahkan', variant: 'success' })
      setDialogOpen(false); fetchWarga()
    } catch (err) {
      addToast({ title: 'Gagal', description: err.response?.data?.message || 'Terjadi kesalahan', variant: 'destructive' })
    } finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await wargaApi.delete(deleteTarget.id)
      addToast({ title: 'Dihapus', description: `${deleteTarget.nama_lengkap} berhasil dihapus`, variant: 'success' })
      setDeleteDialogOpen(false); fetchWarga()
    } catch {
      addToast({ title: 'Gagal', description: 'Tidak dapat menghapus warga', variant: 'destructive' })
    }
  }

  const filtered = wargaList.filter(w =>
    w.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    w.nomor_telepon?.includes(search)
  )

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--text-muted))]" />
          <Input placeholder="Cari warga..." className="pl-8 w-56" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button id="btn-tambah-warga" onClick={openAdd} size="default">
          <Plus className="w-3.5 h-3.5" />
          Tambah Warga
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Warga</CardTitle>
            <Badge variant="secondary">{filtered.length} warga</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {loading ? (
            <div className="p-5 space-y-2">{[1,2,3,4].map(i=><Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--text-muted))] opacity-40" />
              <p className="text-sm text-[hsl(var(--text-muted))]">{search ? 'Tidak ada hasil pencarian' : 'Belum ada data warga'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Status Warga</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Status Nikah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(w => (
                  <TableRow key={w.id}>
                    <TableCell>
                      {w.foto_ktp ? (
                        <img src={`${BASE_URL}/storage/${w.foto_ktp}`} alt="KTP" className="w-8 h-8 rounded-[var(--radius-sm)] object-cover border border-[hsl(var(--border))]" onError={e=>{e.target.style.display='none'}} />
                      ) : (
                        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[hsl(0_0%_93%)] flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[hsl(var(--text-muted))]" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{w.nama_lengkap}</TableCell>
                    <TableCell>
                      <Badge variant={w.status_warga === 'tetap' ? 'success' : 'warning'}>
                        {w.status_warga === 'tetap' ? 'Tetap' : 'Kontrak'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--text-secondary))]">{w.nomor_telepon || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={w.status_pernikahan === 'menikah' ? 'secondary' : 'outline'}>
                        {w.status_pernikahan === 'menikah' ? 'Menikah' : 'Belum Menikah'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button id={`btn-edit-warga-${w.id}`} variant="ghost" size="icon-sm" onClick={() => openEdit(w)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button id={`btn-del-warga-${w.id}`} variant="ghost" size="icon-sm" className="hover:text-[hsl(var(--danger))]" onClick={() => openDel(w)}>
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Warga' : 'Tambah Warga Baru'}</DialogTitle>
            <DialogDescription>{editId ? 'Perbarui data warga.' : 'Isi form untuk mendaftarkan warga baru.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormRow label="Nama Lengkap *">
              <Input id="nama_lengkap" required value={form.nama_lengkap} onChange={e=>setForm(p=>({...p,nama_lengkap:e.target.value}))} placeholder="Budi Santoso" />
            </FormRow>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Status Warga *">
                <Select value={form.status_warga} onValueChange={v=>setForm(p=>({...p,status_warga:v}))}>
                  <SelectTrigger id="status_warga"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tetap">Tetap</SelectItem>
                    <SelectItem value="kontrak">Kontrak</SelectItem>
                  </SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Status Pernikahan *">
                <Select value={form.status_pernikahan} onValueChange={v=>setForm(p=>({...p,status_pernikahan:v}))}>
                  <SelectTrigger id="status_pernikahan"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menikah">Menikah</SelectItem>
                    <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
                  </SelectContent>
                </Select>
              </FormRow>
            </div>
            <FormRow label="Nomor Telepon">
              <Input id="nomor_telepon" value={form.nomor_telepon} onChange={e=>setForm(p=>({...p,nomor_telepon:e.target.value}))} placeholder="08123456789" maxLength={15} />
            </FormRow>
            <FormRow label={editId ? 'Foto KTP (opsional)' : 'Foto KTP *'}>
              <Input id="foto_ktp" type="file" accept="image/jpeg,image/png,image/jpg" onChange={e=>setForm(p=>({...p,foto_ktp:e.target.files?.[0]??null}))} required={!editId} className="cursor-pointer py-1.5 h-auto" />
              <p className="text-[11px] text-[hsl(var(--text-muted))]">Format: JPEG, PNG. Maks 2MB.</p>
            </FormRow>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>setDialogOpen(false)}>Batal</Button>
              <Button id="btn-submit-warga" type="submit" disabled={submitting}>
                {submitting ? 'Menyimpan...' : editId ? 'Simpan' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Warga</DialogTitle>
            <DialogDescription>Yakin hapus <strong>{deleteTarget?.nama_lengkap}</strong>? Tindakan ini tidak bisa dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDeleteDialogOpen(false)}>Batal</Button>
            <Button id="btn-confirm-del-warga" variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
