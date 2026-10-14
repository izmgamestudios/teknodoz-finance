// src/components/BetaGate.tsx
interface Props {
  onAccept: () => void;
}

/** UX gate only (client-side). It informs users about beta limits; it is not access control. */
export function BetaGate({ onAccept }: Props): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-4 sm:items-center">
      <div className="card w-full max-w-md space-y-3">
        <img src="/logo.svg" alt="teknodoz" className="h-10" />
        <h2 className="text-lg font-semibold">Erken erişim betası</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Verileriniz yalnızca bu tarayıcıda (localStorage) saklanır; sunucuya gönderilmez.</li>
          <li>Tarayıcı verisini temizlerseniz her şey silinir. Düzenli olarak dışa aktarın.</li>
          <li>Cihazlar arası senkron yok. Telefon ↔ bilgisayar için JSON/CSV/XLSX kullanın.</li>
          <li>Veriler şifrelenmez. Paylaşılan cihazlarda kullanmayın.</li>
        </ul>
        <button className="btn w-full" onClick={onAccept}>
          Anladım, başla
        </button>
      </div>
    </div>
  );
}
