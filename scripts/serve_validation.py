"""Compressed static origin for repeatable cold-load comparisons."""
import argparse, functools, gzip, io
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        path=Path(self.translate_path(self.path))
        if path.is_dir(): path=path/"index.html"
        if path.is_file() and path.suffix in {".html",".css",".js",".json",".svg",".xml"} and "gzip" in self.headers.get("Accept-Encoding",""):
            body=gzip.compress(path.read_bytes(),compresslevel=6,mtime=0)
            self.send_response(200)
            self.send_header("Content-Type",self.guess_type(str(path)))
            self.send_header("Content-Encoding","gzip")
            self.send_header("Vary","Accept-Encoding")
            self.send_header("Content-Length",str(len(body)))
            self.end_headers()
            return io.BytesIO(body)
        return super().send_head()
args=argparse.ArgumentParser()
args.add_argument("--port",type=int,required=True)
args.add_argument("--directory",required=True)
cfg=args.parse_args()
ThreadingHTTPServer(("127.0.0.1",cfg.port),functools.partial(Handler,directory=cfg.directory)).serve_forever()
