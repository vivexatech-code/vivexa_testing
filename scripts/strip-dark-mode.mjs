import fs from "fs";
import path from "path";

const root = path.resolve(".");
const files = [
  "app/components/Header.jsx",
  "app/components/Footer.jsx",
  "app/HomeClient.tsx",
  "app/admissions/AdmissionClient.jsx",
  "app/contact/ContactClient.jsx",
  "app/verify/VerifyClient.jsx",
  "app/courses/CoursesClient.jsx",
  "app/about/AboutClient.jsx",
  "app/terms/page.jsx",
  "app/privacy/page.jsx",
  "app/verify/page.jsx",
];

for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.log("skip", rel);
    continue;
  }
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(/\s+dark:[^\s"'`]+/g, "");
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log("updated", rel);
  } else {
    console.log("unchanged", rel);
  }
}
