import { useParams } from 'react-router-dom'

export default function EditCourse() {
  const { id } = useParams()
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-xl font-semibold text-slate-800">Edit Course</h1>
      <p className="mt-2 text-slate-600">Edit course {id} (form coming next).</p>
    </main>
  )
}
