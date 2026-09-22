import DrawConfigPanel from '../../components/admin/DrawConfigPanel.jsx';
import DrawHistoryTable from '../../components/draws/DrawHistoryTable.jsx';

export default function DrawManagement() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white mb-4">Draws</h1>
        <DrawConfigPanel />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Draw history</h2>
        <DrawHistoryTable />
      </div>
    </div>
  );
}