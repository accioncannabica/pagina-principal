import { useState } from 'react';
import { ArrowUpRight, AtSign, Check, Copy, Mail, Send } from 'lucide-react';
import { ResearchHeading, Notice } from './ResearchUI';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Aporte de datos abiertos');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [opened, setOpened] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText('accioncannabica@gmail.com'); setCopied(true); setCopyError(''); setTimeout(() => setCopied(false), 2500); }
    catch { setCopyError('No se pudo copiar automáticamente. Seleccioná la dirección de correo para copiarla.'); }
  };
  return <div className="research-view">
    <ResearchHeading eyebrow="Asociación Civil / Argentina" title="El conocimiento se construye en red." description="Compartí una fuente pública, proponé una actividad cultural o ayudanos a mejorar la información del observatorio." />
    <div className="grid gap-12 py-3 lg:grid-cols-[0.9fr_1.1fr]">
      <section><h3 className="text-xl font-semibold text-white">Acción Cannábica</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">Asociación Civil Acción Cannábica, inscripta y aprobada legalmente bajo la personería jurídica número 1921803 de la Inspección General de Justicia (I.G.J.) Argentina</p>
        <div className="mt-7 border-t border-white/10"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-5"><a className="flex min-w-0 items-center gap-3 text-sm text-emerald-300 hover:text-emerald-100" href="mailto:accioncannabica@gmail.com"><Mail size={18} className="shrink-0" /><span className="break-all">accioncannabica@gmail.com</span></a><button onClick={() => void copy()} title="Copiar dirección de correo" aria-label="Copiar dirección de correo" className="research-button">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button></div>
          <a className="flex items-center gap-3 border-b border-white/10 py-5 text-sm text-slate-200 hover:text-emerald-300" href="https://www.instagram.com/accannabica/" target="_blank" rel="noopener noreferrer"><AtSign size={18} /><span>@accannabica</span><ArrowUpRight size={16} className="ml-auto" /></a></div>
        {copyError && <p role="status" className="mt-3 text-xs text-amber-200">{copyError}</p>}
        <Notice tone="slate">Para proponer un registro, incluí fuente, período, territorio, unidad y metodología. No envíes datos personales de personas detenidas, historias clínicas ni expedientes sin anonimizar.</Notice>
      </section>
      <form onSubmit={e => { e.preventDefault(); window.location.href = `mailto:accioncannabica@gmail.com?subject=${encodeURIComponent(`[Observatorio] ${topic}`)}&body=${encodeURIComponent(`Nombre: ${name}\nCorreo de respuesta: ${email}\n\n${message}`)}`; setOpened(true); }}>
        <h3 className="mb-5 text-base font-semibold text-white">Hacer un aporte al observatorio</h3>
        <div className="grid gap-4 sm:grid-cols-2"><label className="research-field">Tu nombre<input className="research-input" value={name} onChange={e => setName(e.target.value)} maxLength={120} autoComplete="name" required /></label><label className="research-field">Tu correo<input className="research-input" type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={200} autoComplete="email" required /></label></div>
        <label className="research-field mt-4">Motivo<select aria-label="Motivo" className="research-select" value={topic} onChange={e => setTopic(e.target.value)}><option>Aporte de datos abiertos</option><option>Corrección de un registro</option><option>Actividad cultural</option><option>Formación o colaboración</option><option>Consulta institucional</option></select></label>
        <label className="research-field mt-4">Mensaje y enlaces a las fuentes<textarea className="research-input min-h-36 resize-y" value={message} onChange={e => setMessage(e.target.value)} maxLength={3500} required placeholder="Contanos tu propuesta e incluí los enlaces públicos." /></label>
        <button className="research-button mt-5 border-emerald-400/30 bg-emerald-400/10 text-emerald-200" type="submit"><Send size={14} />Redactar correo</button>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Abre tu aplicación de correo con el borrador. Este sitio no envía ni almacena el mensaje y no confirma su entrega.</p>
        {opened && <p role="status" className="mt-3 text-xs text-emerald-300">Se solicitó abrir tu aplicación de correo. Si no tenés una configurada, escribí directamente a accioncannabica@gmail.com.</p>}
      </form>
    </div>
  </div>;
}