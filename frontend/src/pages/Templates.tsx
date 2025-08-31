import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { btnPrimary, btnDanger, btnGhost } from '../styles/buttons';

interface Template {
  _id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    api
      .get<Template[]>('/templates')
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error('Error fetching templates:', err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setName('');
    setSubject('');
    setBodyHtml('');
    setBodyText('');
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post<Template>('/templates', { name, subject, bodyHtml, bodyText })
      .then((res) => {
        setTemplates((prev) => [...prev, res.data]);
        resetForm();
        setIsModalOpen(false);
      })
      .catch((err) => console.error('Error adding template:', err));
  };

  const handleDeleteTemplate = (id: string) => {
    api
      .delete(`/templates/${id}`)
      .then(() => setTemplates((prev) => prev.filter((t) => t._id !== id)))
      .catch((err) => console.error('Error deleting template:', err));
  };

  if (loading) return <p className='p-6'>Loading templates…</p>;

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Email Templates</h1>
        <button onClick={() => setIsModalOpen(true)} className={btnPrimary}>
          + Add Template
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-slate-50 text-slate-600 text-xs uppercase tracking-wide'>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Subject</th>
              <th className='px-6 py-3'>Preview</th>
              <th className='px-6 py-3 w-24'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {templates.map((t) => (
              <tr key={t._id} className='hover:bg-blue-50/40 transition'>
                <td className='px-6 py-4 font-medium'>{t.name}</td>
                <td className='px-6 py-4'>{t.subject}</td>
                <td
                  className='px-6 py-4 text-sm text-slate-500 truncate max-w-xs'
                  title={
                    t.bodyText ||
                    t.bodyHtml.replace(/<[^>]+>/g, '').slice(0, 200)
                  }
                >
                  {t.bodyText
                    ? t.bodyText.slice(0, 50) + '...'
                    : t.bodyHtml.replace(/<[^>]+>/g, '').slice(0, 50) + '...'}
                </td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleDeleteTemplate(t._id)}
                    className={btnDanger}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td className='px-6 py-6 text-slate-500' colSpan={4}>
                  No templates yet. Click “Add Template” to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title='Add New Template'
      >
        <form onSubmit={handleAddTemplate} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input
              className='w-full border p-2 rounded'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Password Reset Email'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Subject</label>
            <input
              className='w-full border p-2 rounded'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Reset Your Password'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>HTML Body</label>
            <textarea
              className='w-full border p-2 rounded h-32'
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              placeholder="<p>Hello, reset your password <a href='#'>here</a></p>"
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Text Body (optional)
            </label>
            <textarea
              className='w-full border p-2 rounded h-24'
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder='Hello, reset your password at this link...'
            />
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
              className={btnGhost}
            >
              Cancel
            </button>
            <button type='submit' className={btnPrimary}>
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
