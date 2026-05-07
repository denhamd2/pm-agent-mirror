#!/usr/bin/env python3
"""
Dashboard server: static file serving + a tiny API for prototype save/unsave.
Replaces `python3 -m http.server 8765` with one additional endpoint pair.
"""
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path

PORT = 8765
REPO_ROOT = Path(__file__).resolve().parent.parent
SAVED_FILE = REPO_ROOT / "docs" / "saved-prototypes.json"


def _read_saved():
    if SAVED_FILE.exists():
        return json.loads(SAVED_FILE.read_text())
    return {"saved": []}


def _write_saved(data):
    SAVED_FILE.parent.mkdir(parents=True, exist_ok=True)
    SAVED_FILE.write_text(json.dumps(data, indent=2) + "\n")


class DashboardHandler(SimpleHTTPRequestHandler):

    def _cors_headers(self):
        """Allow cross-origin requests from the Vite dev server."""
        origin = self.headers.get("Origin", "")
        if origin.startswith("http://localhost:"):
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        path_only = self.path.split("?", 1)[0]
        if path_only == "/api/saved-prototypes":
            body = json.dumps(_read_saved()).encode()
            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        path_only = self.path.split("?", 1)[0]
        if path_only == "/api/save-prototype":
            length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length)) if length else {}
            slug = payload.get("slug")
            files = payload.get("files", [])
            saved = payload.get("saved", True)

            if not slug:
                self.send_error(400, "Missing slug")
                return

            data = _read_saved()
            existing_slugs = {e["slug"] for e in data["saved"]}

            if saved and slug not in existing_slugs:
                data["saved"].append({"slug": slug, "files": files})
            elif not saved and slug in existing_slugs:
                data["saved"] = [e for e in data["saved"] if e["slug"] != slug]

            _write_saved(data)

            body = json.dumps(data).encode()
            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_error(405, "Method not allowed")


if __name__ == "__main__":
    os.chdir(str(REPO_ROOT))
    server = HTTPServer(("", PORT), DashboardHandler)
    print(f"Dashboard server running on http://localhost:{PORT}  (root: {REPO_ROOT})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.server_close()
