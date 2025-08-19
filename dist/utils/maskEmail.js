"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskEmailLocalPart = maskEmailLocalPart;
function maskEmailLocalPart(email) {
    const [localPart, domain] = email.split("@");
    if (!domain)
        return email;
    if (localPart.length <= 3) {
        return `${localPart}***`;
    }
    const visiblePart = localPart.slice(0, localPart.length - 3);
    return `${visiblePart}***`;
}
