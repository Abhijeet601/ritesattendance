import { useEffect, useState } from 'react';

import { fetchAttendanceLogs } from '../api/api';

const AttendanceLogs = ({ userId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const loadLogs = async () => {
      try {
        setLoading(true);
        setError('');
        const rows = await fetchAttendanceLogs(userId);
        setLogs(rows);
      } catch (err) {
        setError(err?.response?.data?.detail || 'Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [userId]);

  if (!userId) {
    return <div className="text-sm text-slate-500">Select a user to view attendance logs.</div>;
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Loading attendance logs...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!logs.length) {
    return <div className="text-sm text-slate-500">No attendance logs found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">Check In</th>
            <th className="px-4 py-3 text-left">Check Out</th>
            <th className="px-4 py-3 text-left">Shift</th>
            <th className="px-4 py-3 text-left">Hours</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-slate-200">
              <td className="px-4 py-3">{log.check_in_time ? new Date(log.check_in_time).toLocaleString() : '-'}</td>
              <td className="px-4 py-3">{log.check_out_time ? new Date(log.check_out_time).toLocaleString() : '-'}</td>
              <td className="px-4 py-3">{log.shift || '-'}</td>
              <td className="px-4 py-3">{log.work_hours ?? 0}</td>
              <td className="px-4 py-3">{log.system_status || 'pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceLogs;
