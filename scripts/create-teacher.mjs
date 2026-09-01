import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function loadEnv() {
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const cut = trimmed.indexOf("=");
    if (cut < 1) continue;
    const key = trimmed.slice(0, cut).trim();
    let value = trimmed.slice(cut + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value.replace(/\\n/g, "\n");
  }
}

loadEnv();

const [email, password, fullName = "Trainer"] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node scripts/create-teacher.mjs EMAIL PASSWORD "Full Name"');
  process.exit(1);
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, or FIREBASE_ADMIN_PRIVATE_KEY in .env.local");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const auth = getAuth();
const db = getFirestore();

const existing = await auth.getUserByEmail(email).catch(() => null);
const user = existing
  ? await auth.updateUser(existing.uid, { password, displayName: fullName, emailVerified: true })
  : await auth.createUser({ email, password, displayName: fullName, emailVerified: true });

await db.collection("users").doc(email).set({
  uid: user.uid,
  email,
  fullName,
  role: "trainer",
  status: "active",
  staffId: `TRN-${String(Date.now()).slice(-4)}`,
  mustChangePassword: false,
  assignedBatchIds: [],
  updatedAt: new Date(),
}, { merge: true });

console.log("Trainer ready.");
console.log(`Email: ${email}`);
console.log(`UID:   ${user.uid}`);
console.log("Login: /portal/login");
console.log("Then open: /portal/staff/live-classes");
