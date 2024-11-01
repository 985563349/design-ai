export function downloadFile(content: string, type: string) {
  const a = document.createElement('a');

  a.href = content;
  a.download = `${crypto.randomUUID()}.${type}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
