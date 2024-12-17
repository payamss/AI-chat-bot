import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const filePath = path.join(process.cwd(), 'python', Date.now().toString()+'_temp_script.py');

    // Save code to file
    await writeFile(filePath, code);

    // Execute code
    return new Promise((resolve) => {
      exec(`python "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ output: `Error: ${stderr}` }));
        } else {
          resolve(NextResponse.json({ output: stdout }));
        }
      });
    });
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json({ output: 'Failed to execute the code.' }, { status: 500 });
  }
}
