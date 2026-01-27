// Mock for run-applescript module
export async function runAppleScript(_script: string): Promise<string> {
  // Return empty string by default - tests that need specific behavior can override
  return "";
}
