export function maskEmailLocalPart(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  if (localPart.length <= 3) {
    return `${localPart}***`;
  }
  const visiblePart = localPart.slice(0, localPart.length - 3);
  return `${visiblePart}***`;
}
