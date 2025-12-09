// frontend/src/pages/Result.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function Result(){
  const { state } = useLocation();
  const nav = useNavigate();
  if (!state) {
    nav('/');
    return null;
  }

  const { email, found, count, risk, remedies, message } = state;

  const data = {
    labels: ['Exposure'],
    datasets: [{
      label: 'Breach Count',
      data: [count],
      backgroundColor: 'rgba(2,132,199,0.6)'
    }]
  };

  const downloadCSV = () => {
    const csv = `email,found,count,risk,message\n"${email}",${found},${count},"${risk}","${message}"\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `scan_${email.replace(/[@.]/g,'_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('ShadowPass Guardian - Scan Report', 10, 10);
    doc.setFontSize(11);
    doc.text(`Email: ${email}`, 10, 20);
    doc.text(`Found in breaches: ${found}`, 10, 30);
    doc.text(`Count: ${count}`, 10, 40);
    doc.text(`Risk Level: ${risk}`, 10, 50);
    remedies.forEach((r, i) => doc.text(`${i+1}. ${r}`, 10, 60 + i*8));
    doc.save(`scan_${email.replace(/[@.]/g,'_')}.pdf`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white/5 p-6 rounded-lg">
        <h2 className="text-xl font-bold">Scan Result — {email}</h2>
        <p className="opacity-80 my-2">{message}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-white/4 rounded">
            <h3 className="font-semibold">Risk</h3>
            <div className="text-2xl mt-2">{risk}</div>
            <div className="mt-4">Breach Count: <strong>{count}</strong></div>
          </div>

          <div className="p-4 bg-white/4 rounded">
            <h3 className="font-semibold">Exposure Chart</h3>
            <div className="mt-4">
              <Bar data={data} />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/4 rounded">
          <h3 className="font-semibold">Recommended Remedies</h3>
          <ul className="list-disc pl-6 mt-2">
            {remedies.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded bg-white/6" onClick={downloadCSV}>Download CSV</button>
          <button className="px-4 py-2 rounded bg-white/6" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}
