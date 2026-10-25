"""Refresh the maintained planetary-hours page using the shared server/browser calculation."""
from pathlib import Path
import subprocess
ROOT = Path(__file__).resolve().parents[1]
subprocess.run(["node", "scripts/render-planetary-hours-static.mjs"], cwd=ROOT, check=True)
