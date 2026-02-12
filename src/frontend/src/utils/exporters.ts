export function exportToJSON(data: any): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recovery-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToTextSummary(data: any): void {
  const lines: string[] = [];
  
  lines.push('RECOVERY COMPANION - DATA SUMMARY');
  lines.push('='.repeat(50));
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('');

  // Recovery Program Progress
  lines.push('RECOVERY PROGRAM PROGRESS');
  lines.push('-'.repeat(50));
  const completedSteps = data.recoverySteps.filter((s: any) => s.completed).length;
  const totalSteps = data.recoverySteps.length;
  lines.push(`Steps Completed: ${completedSteps} / ${totalSteps}`);
  if (totalSteps > 0) {
    lines.push(`Progress: ${Math.round((completedSteps / totalSteps) * 100)}%`);
  }
  lines.push('');

  // Check-ins Summary
  lines.push('CHECK-INS SUMMARY');
  lines.push('-'.repeat(50));
  const now = Date.now();
  const last14Days = data.checkIns.filter(
    (ci: any) => now - Number(ci.timestamp) / 1000000 < 14 * 24 * 60 * 60 * 1000
  );
  const last30Days = data.checkIns.filter(
    (ci: any) => now - Number(ci.timestamp) / 1000000 < 30 * 24 * 60 * 60 * 1000
  );
  
  lines.push(`Total Check-ins: ${data.checkIns.length}`);
  lines.push(`Last 14 Days: ${last14Days.length}`);
  lines.push(`Last 30 Days: ${last30Days.length}`);
  
  if (last14Days.length > 0) {
    const avgStress = (
      last14Days.reduce((sum: number, ci: any) => sum + Number(ci.stressLevel), 0) / last14Days.length
    ).toFixed(1);
    const avgWork = (
      last14Days.reduce((sum: number, ci: any) => sum + Number(ci.workHours), 0) / last14Days.length
    ).toFixed(1);
    lines.push(`Avg Stress (14d): ${avgStress}/10`);
    lines.push(`Avg Work Hours (14d): ${avgWork}h`);
  }
  lines.push('');

  // Medication Adherence
  lines.push('MEDICATION ADHERENCE');
  lines.push('-'.repeat(50));
  lines.push(`Active Medications: ${data.medications.length}`);
  
  const last7DaysLogs = data.doseLogs.filter(
    (log: any) => now - Number(log.timestamp) / 1000000 < 7 * 24 * 60 * 60 * 1000
  );
  const last30DaysLogs = data.doseLogs.filter(
    (log: any) => now - Number(log.timestamp) / 1000000 < 30 * 24 * 60 * 60 * 1000
  );
  
  if (last7DaysLogs.length > 0) {
    const taken7 = last7DaysLogs.filter((log: any) => log.status === 'Taken').length;
    const adherence7 = ((taken7 / last7DaysLogs.length) * 100).toFixed(0);
    lines.push(`Adherence (7d): ${adherence7}% (${taken7}/${last7DaysLogs.length} doses)`);
  }
  
  if (last30DaysLogs.length > 0) {
    const taken30 = last30DaysLogs.filter((log: any) => log.status === 'Taken').length;
    const adherence30 = ((taken30 / last30DaysLogs.length) * 100).toFixed(0);
    lines.push(`Adherence (30d): ${adherence30}% (${taken30}/${last30DaysLogs.length} doses)`);
  }
  lines.push('');

  // Meetings
  lines.push('MEETINGS & SUPPORT');
  lines.push('-'.repeat(50));
  lines.push(`Total Meetings Logged: ${data.meetings.length}`);
  lines.push('');

  // Emergency Contacts
  lines.push('EMERGENCY CONTACTS');
  lines.push('-'.repeat(50));
  lines.push(`Contacts Saved: ${data.emergencyContacts.length}`);
  lines.push('');

  lines.push('='.repeat(50));
  lines.push('End of Summary');

  const textContent = lines.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recovery-summary-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
