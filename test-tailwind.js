import { execSync } from 'child_process';
import fs from 'fs';

fs.writeFileSync('src/index.css', `@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
`);

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build succeeded');
} catch (err) {
  console.log('Build failed');
}
