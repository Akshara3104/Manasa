async function fetchUnits() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${base}/api/units`, { cache: 'no-store' });
    if (!res.ok) return [];
    const j = await res.json();
    return j.units || [];
  } catch {
    return [];
  }
}

export default async function ManufacturingUnitsPage() {
  const units = await fetchUnits();
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-blue-950 md:text-5xl">Manufacturing Unit Addresses</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:p-8">
          <div className="rounded-xl bg-amber-300 px-6 py-5">
            <p className="text-center text-base font-bold text-slate-900 md:text-lg">
              To identify manufacturing unit address in India, read the first two characters of the batch number and see below:
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 pr-4 text-left text-sm font-bold text-slate-900 md:text-base">Sr. No.</th>
                  <th className="py-4 pr-4 text-left text-sm font-bold text-slate-900 md:text-base">Batch No</th>
                  <th className="py-4 text-left text-sm font-bold text-slate-900 md:text-base">Address</th>
                </tr>
              </thead>
              <tbody>
                {units.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-sm text-slate-500">
                      Manufacturing unit information will be updated soon.
                    </td>
                  </tr>
                ) : (
                  units.map((u) => (
                    <tr key={u.id} className="border-b border-slate-200 align-top">
                      <td className="py-5 pr-4 text-sm text-slate-800 md:text-base">{u.srNo}</td>
                      <td className="py-5 pr-4 text-sm font-medium text-slate-800 md:text-base">{u.batchCode}</td>
                      <td className="py-5 text-sm text-slate-700 md:text-base">
                        <div className="font-bold text-slate-900">{u.productCategory}:</div>
                        {u.companyName && (
                          <div className="mt-1 font-semibold text-blue-900">{u.companyName}</div>
                        )}
                        <div className="mt-1 whitespace-pre-line leading-relaxed">{u.address}</div>
                        {u.email && (
                          <div className="mt-2 text-sm">
                            <span className="font-semibold text-slate-800">E-Mail : </span>
                            <a href={`mailto:${u.email}`} className="text-blue-800 hover:underline">{u.email}</a>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
