// node_modules/@kuntay/swisseph/wasm/swisseph.mjs
async function createSwissEphModule(moduleArg = {}) {
  var Module = moduleArg;
  var ENVIRONMENT_IS_WEB = !!globalThis.window;
  var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
  var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
  if (ENVIRONMENT_IS_NODE) {
    const { createRequire } = await import("node:module");
    var require2 = createRequire(import.meta.url);
  }
  var programArgs = [];
  var thisProgram = "./this.program";
  var quit_ = (status, toThrow) => {
    throw toThrow;
  };
  var _scriptName = import.meta.url;
  var scriptDirectory = "";
  function locateFile(path) {
    return scriptDirectory + path;
  }
  var readAsync, readBinary;
  if (ENVIRONMENT_IS_NODE) {
    var fs = require2("node:fs");
    if (_scriptName.startsWith("file:")) {
      scriptDirectory = require2("node:path").dirname(require2("node:url").fileURLToPath(_scriptName)) + "/";
    }
    readBinary = (filename) => {
      filename = isFileURI(filename) ? new URL(filename) : filename;
      var ret = fs.readFileSync(filename);
      return ret;
    };
    readAsync = async (filename, binary = true) => {
      filename = isFileURI(filename) ? new URL(filename) : filename;
      var ret = fs.readFileSync(filename, binary ? void 0 : "utf8");
      return ret;
    };
    if (process.argv.length > 1) {
      thisProgram = process.argv[1].replace(/\\/g, "/");
    }
    programArgs = process.argv.slice(2);
    quit_ = (status, toThrow) => {
      process.exitCode = status;
      throw toThrow;
    };
  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    try {
      scriptDirectory = new URL(".", _scriptName).href;
    } catch {
    }
    {
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
      readAsync = async (url) => {
        var response = await fetch(url, { credentials: "same-origin" });
        if (response.ok) {
          return response.arrayBuffer();
        }
        throw new Error(response.status + " : " + response.url);
      };
    }
  } else {
  }
  var out = console.log.bind(console);
  var err = console.error.bind(console);
  var wasmBinary;
  var ABORT = false;
  var isFileURI = (filename) => filename.startsWith("file://");
  class EmscriptenEH {
  }
  class EmscriptenSjLj extends EmscriptenEH {
  }
  var runtimeInitialized = false;
  function getMemoryBuffer() {
    return wasmMemory.buffer;
  }
  function updateMemoryViews() {
    if (HEAP8?.buffer?.resizable) return;
    var b = getMemoryBuffer();
    HEAP8 = new Int8Array(b);
    HEAP16 = new Int16Array(b);
    HEAPU8 = new Uint8Array(b);
    HEAP32 = new Int32Array(b);
    HEAPU32 = new Uint32Array(b);
    HEAPF32 = new Float32Array(b);
    HEAPF64 = new Float64Array(b);
    HEAP64 = new BigInt64Array(b);
  }
  function preRun() {
  }
  function initRuntime() {
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.initialized) FS.init();
    TTY.init();
    wasmExports["m"]();
    FS.ignorePermissions = false;
  }
  function postRun() {
  }
  function abort(what) {
    what = `Aborted(${what})`;
    err(what);
    ABORT = true;
    what += ". Build with -sASSERTIONS for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e;
  }
  var wasmBinaryFile;
  function findWasmBinary() {
    if (Module["locateFile"]) {
      return locateFile("swisseph.wasm");
    }
    return new URL("swisseph.wasm?v=20261004-wasmfix2", import.meta.url).href;
  }
  function getBinarySync(file) {
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  async function getWasmBinary(binaryFile) {
    if (!wasmBinary) {
      try {
        var response = await readAsync(binaryFile);
        return new Uint8Array(response);
      } catch {
      }
    }
    return getBinarySync(binaryFile);
  }
  async function instantiateArrayBuffer(binaryFile, imports) {
    try {
      var binary = await getWasmBinary(binaryFile);
      var instance = await WebAssembly.instantiate(binary, imports);
      return instance;
    } catch (reason) {
      err(`failed to asynchronously prepare wasm: ${reason}`);
      abort(reason);
    }
  }
  async function instantiateAsync(binary, binaryFile, imports) {
    if (!binary && !ENVIRONMENT_IS_NODE) {
      try {
        var response = fetch(binaryFile, { credentials: "same-origin" });
        var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
        return instantiationResult;
      } catch (reason) {
        err(`wasm streaming compile failed: ${reason}`);
        err("falling back to ArrayBuffer instantiation");
      }
    }
    return instantiateArrayBuffer(binaryFile, imports);
  }
  function getWasmImports() {
    var imports = { a: wasmImports };
    return imports;
  }
  async function createWasm() {
    function receiveInstance(instance) {
      wasmExports = instance.exports;
      assignWasmExports(wasmExports);
      updateMemoryViews();
      return wasmExports;
    }
    function receiveInstantiationResult(result2) {
      return receiveInstance(result2["instance"]);
    }
    var info = getWasmImports();
    wasmBinaryFile ??= findWasmBinary();
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
    var exports = receiveInstantiationResult(result);
    return exports;
  }
  class ExitStatus {
    name = "ExitStatus";
    constructor(status) {
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }
  }
  var HEAP8;
  var stackRestore = (val) => __emscripten_stack_restore(val);
  var stackSave = () => _emscripten_stack_get_current();
  var HEAP32;
  var syscallGetVarargI = () => {
    var ret = HEAP32[+SYSCALLS.varargs >> 2];
    SYSCALLS.varargs += 4;
    return ret;
  };
  var syscallGetVarargP = syscallGetVarargI;
  var PATH = { isAbs: (path) => path.charAt(0) === "/", splitPath: (filename) => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  }, normalizeArray: (parts, allowAboveRoot) => {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  }, normalize: (path) => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  }, dirname: (path) => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.slice(0, -1);
    }
    return root + dir;
  }, basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1], join: (...paths) => PATH.normalize(paths.join("/")), join2: (l, r) => PATH.normalize(l + "/" + r) };
  var initRandomFill = () => {
    if (ENVIRONMENT_IS_NODE) {
      var nodeCrypto = require2("node:crypto");
      return (view) => (nodeCrypto.randomFillSync(view), 0);
    }
    return (view) => (crypto.getRandomValues(view), 0);
  };
  var randomFill = (view) => (randomFill = initRandomFill())(view);
  var PATH_FS = { resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? args[i] : FS.cwd();
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  }, relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  } };
  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
    var maxIdx = idx + maxBytesToRead;
    if (ignoreNul) return maxIdx;
    while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
    return idx;
  };
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
    var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
      return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
    }
    var str = "";
    while (idx < endPtr) {
      var u0 = heapOrArray[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heapOrArray[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode((u0 & 31) << 6 | u1);
        continue;
      }
      var u2 = heapOrArray[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = (u0 & 15) << 12 | u1 << 6 | u2;
      } else {
        u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
      }
    }
    return str;
  };
  var FS_stdin_getChar_buffer = [];
  var lengthBytesUTF8 = (str) => {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      var c = str.charCodeAt(i);
      if (c <= 127) {
        len++;
      } else if (c <= 2047) {
        len += 2;
      } else if (c >= 55296 && c <= 57343) {
        len += 4;
        ++i;
      } else {
        len += 3;
      }
    }
    return len;
  };
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
      var u = str.codePointAt(i);
      if (u <= 127) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 192 | u >> 6;
        heap[outIdx++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 224 | u >> 12;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
      } else {
        if (outIdx + 3 >= endIdx) break;
        heap[outIdx++] = 240 | u >> 18;
        heap[outIdx++] = 128 | u >> 12 & 63;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
        i++;
      }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
  };
  var intArrayFromString = (stringy, dontAddNull, length) => {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  };
  var FS_stdin_getChar = () => {
    if (!FS_stdin_getChar_buffer.length) {
      var result = null;
      if (ENVIRONMENT_IS_NODE) {
        var BUFSIZE = 256;
        var buf = Buffer.alloc(BUFSIZE);
        var bytesRead = 0;
        var fd = process.stdin.fd;
        try {
          bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
        } catch (e) {
          if (e.toString().includes("EOF")) bytesRead = 0;
          else throw e;
        }
        if (bytesRead > 0) {
          result = buf.slice(0, bytesRead).toString("utf-8");
        }
      } else if (globalThis.window?.prompt) {
        result = window.prompt("Input: ");
        if (result !== null) {
          result += "\n";
        }
      } else {
      }
      if (!result) {
        return null;
      }
      FS_stdin_getChar_buffer = intArrayFromString(result, true);
    }
    return FS_stdin_getChar_buffer.shift();
  };
  var TTY = { ttys: [], init() {
  }, shutdown() {
  }, register(dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops };
    FS.registerDevice(dev, TTY.stream_ops);
  }, stream_ops: { open(stream) {
    var tty = TTY.ttys[stream.node.rdev];
    if (!tty) {
      throw new FS.ErrnoError(43);
    }
    stream.tty = tty;
    stream.seekable = false;
  }, close(stream) {
    stream.tty.ops.fsync(stream.tty);
  }, fsync(stream) {
    stream.tty.ops.fsync(stream.tty);
  }, read(stream, buffer, offset, length, pos) {
    if (!stream.tty || !stream.tty.ops.get_char) {
      throw new FS.ErrnoError(60);
    }
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
      var result;
      try {
        result = stream.tty.ops.get_char(stream.tty);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (result === void 0 && bytesRead === 0) {
        throw new FS.ErrnoError(6);
      }
      if (result === null || result === void 0) break;
      bytesRead++;
      buffer[offset + i] = result;
    }
    if (bytesRead) {
      stream.node.atime = Date.now();
    }
    return bytesRead;
  }, write(stream, buffer, offset, length, pos) {
    if (!stream.tty || !stream.tty.ops.put_char) {
      throw new FS.ErrnoError(60);
    }
    try {
      for (var i = 0; i < length; i++) {
        stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
      }
    } catch (e) {
      throw new FS.ErrnoError(29);
    }
    if (length) {
      stream.node.mtime = stream.node.ctime = Date.now();
    }
    return i;
  } }, default_tty_ops: { get_char(tty) {
    return FS_stdin_getChar();
  }, put_char(tty, val) {
    if (val === null || val === 10) {
      out(UTF8ArrayToString(tty.output));
      tty.output = [];
    } else {
      if (val != 0) tty.output.push(val);
    }
  }, fsync(tty) {
    if (tty.output?.length > 0) {
      out(UTF8ArrayToString(tty.output));
      tty.output = [];
    }
  }, ioctl_tcgets(tty) {
    return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
  }, ioctl_tcsets(tty, optional_actions, data) {
    return 0;
  }, ioctl_tiocgwinsz(tty) {
    return [24, 80];
  } }, default_tty1_ops: { put_char(tty, val) {
    if (val === null || val === 10) {
      err(UTF8ArrayToString(tty.output));
      tty.output = [];
    } else {
      if (val != 0) tty.output.push(val);
    }
  }, fsync(tty) {
    if (tty.output?.length > 0) {
      err(UTF8ArrayToString(tty.output));
      tty.output = [];
    }
  } } };
  var mmapAlloc = (size) => {
    abort();
  };
  var MEMFS = { ops_table: null, mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  }, createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  }, getFileDataAsTypedArray(node) {
    return node.contents.subarray(0, node.usedBytes);
  }, expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents.length;
    if (prevCapacity >= newCapacity) return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
    if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
    var oldContents = MEMFS.getFileDataAsTypedArray(node);
    node.contents = new Uint8Array(newCapacity);
    node.contents.set(oldContents);
  }, resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    var oldContents = node.contents;
    node.contents = new Uint8Array(newSize);
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
    node.usedBytes = newSize;
  }, node_ops: { getattr(node) {
    var attr = {};
    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
    attr.ino = node.id;
    attr.mode = node.mode;
    attr.nlink = 1;
    attr.uid = 0;
    attr.gid = 0;
    attr.rdev = node.rdev;
    if (FS.isDir(node.mode)) {
      attr.size = 4096;
    } else if (FS.isFile(node.mode)) {
      attr.size = node.usedBytes;
    } else if (FS.isLink(node.mode)) {
      attr.size = node.link.length;
    } else {
      attr.size = 0;
    }
    attr.atime = new Date(node.atime);
    attr.mtime = new Date(node.mtime);
    attr.ctime = new Date(node.ctime);
    attr.blksize = 4096;
    attr.blocks = Math.ceil(attr.size / attr.blksize);
    return attr;
  }, setattr(node, attr) {
    for (const key of ["mode", "atime", "mtime", "ctime"]) {
      if (attr[key] != null) {
        node[key] = attr[key];
      }
    }
    if (attr.size !== void 0) {
      MEMFS.resizeFileStorage(node, attr.size);
    }
  }, lookup(parent, name) {
    if (!MEMFS.doesNotExistError) {
      MEMFS.doesNotExistError = new FS.ErrnoError(44);
      MEMFS.doesNotExistError.stack = "<generic error, no stack>";
    }
    throw MEMFS.doesNotExistError;
  }, mknod(parent, name, mode, dev) {
    return MEMFS.createNode(parent, name, mode, dev);
  }, rename(old_node, new_dir, new_name) {
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {
    }
    if (new_node) {
      if (FS.isDir(old_node.mode)) {
        for (var i in new_node.contents) {
          throw new FS.ErrnoError(55);
        }
      }
      FS.hashRemoveNode(new_node);
    }
    delete old_node.parent.contents[old_node.name];
    new_dir.contents[new_name] = old_node;
    old_node.name = new_name;
    new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
  }, unlink(parent, name) {
    delete parent.contents[name];
    parent.ctime = parent.mtime = Date.now();
  }, rmdir(parent, name) {
    var node = FS.lookupNode(parent, name);
    for (var i in node.contents) {
      throw new FS.ErrnoError(55);
    }
    delete parent.contents[name];
    parent.ctime = parent.mtime = Date.now();
  }, readdir(node) {
    return [".", "..", ...Object.keys(node.contents)];
  }, symlink(parent, newname, oldpath) {
    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
    node.link = oldpath;
    return node;
  }, readlink(node) {
    if (!FS.isLink(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    return node.link;
  } }, stream_ops: { read(stream, buffer, offset, length, position) {
    var contents = stream.node.contents;
    if (position >= stream.node.usedBytes) return 0;
    var size = Math.min(stream.node.usedBytes - position, length);
    buffer.set(contents.subarray(position, position + size), offset);
    return size;
  }, write(stream, buffer, offset, length, position, canOwn) {
    if (buffer.buffer === HEAP8.buffer) {
      canOwn = false;
    }
    if (!length) return 0;
    var node = stream.node;
    node.mtime = node.ctime = Date.now();
    if (canOwn) {
      node.contents = buffer.subarray(offset, offset + length);
      node.usedBytes = length;
    } else if (node.usedBytes === 0 && position === 0) {
      node.contents = buffer.slice(offset, offset + length);
      node.usedBytes = length;
    } else {
      MEMFS.expandFileStorage(node, position + length);
      node.contents.set(buffer.subarray(offset, offset + length), position);
      node.usedBytes = Math.max(node.usedBytes, position + length);
    }
    return length;
  }, llseek(stream, offset, whence) {
    var position = offset;
    if (whence === 1) {
      position += stream.position;
    } else if (whence === 2) {
      if (FS.isFile(stream.node.mode)) {
        position += stream.node.usedBytes;
      }
    }
    if (position < 0) {
      throw new FS.ErrnoError(28);
    }
    return position;
  }, mmap(stream, length, position, prot, flags) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    var ptr;
    var allocated;
    var contents = stream.node.contents;
    if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
      allocated = false;
      ptr = contents.byteOffset;
    } else {
      allocated = true;
      ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      if (contents) {
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(contents, position, position + length);
          }
        }
        HEAP8.set(contents, ptr);
      }
    }
    return { ptr, allocated };
  }, msync(stream, buffer, offset, length, mmapFlags) {
    MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
    return 0;
  } } };
  var FS_modeStringToFlags = (str) => {
    if (typeof str != "string") return str;
    var flagModes = { r: 0, "r+": 2, w: 512 | 64 | 1, "w+": 512 | 64 | 2, a: 1024 | 64 | 1, "a+": 1024 | 64 | 2 };
    var flags = flagModes[str];
    if (typeof flags == "undefined") {
      throw new Error(`Unknown file open mode: ${str}`);
    }
    return flags;
  };
  var FS_fileDataToTypedArray = (data) => {
    if (typeof data == "string") {
      data = intArrayFromString(data, true);
    }
    if (!data.subarray) {
      data = new Uint8Array(data);
    }
    return data;
  };
  var FS_getMode = (canRead, canWrite) => {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  };
  var ERRNO_CODES = { EPERM: 63, ENOENT: 44, ESRCH: 71, EINTR: 27, EIO: 29, ENXIO: 60, E2BIG: 1, ENOEXEC: 45, EBADF: 8, ECHILD: 12, EAGAIN: 6, EWOULDBLOCK: 6, ENOMEM: 48, EACCES: 2, EFAULT: 21, ENOTBLK: 105, EBUSY: 10, EEXIST: 20, EXDEV: 75, ENODEV: 43, ENOTDIR: 54, EISDIR: 31, EINVAL: 28, ENFILE: 41, EMFILE: 33, ENOTTY: 59, ETXTBSY: 74, EFBIG: 22, ENOSPC: 51, ESPIPE: 70, EROFS: 69, EMLINK: 34, EPIPE: 64, EDOM: 18, ERANGE: 68, ENOMSG: 49, EIDRM: 24, ECHRNG: 106, EL2NSYNC: 156, EL3HLT: 107, EL3RST: 108, ELNRNG: 109, EUNATCH: 110, ENOCSI: 111, EL2HLT: 112, EDEADLK: 16, ENOLCK: 46, EBADE: 113, EBADR: 114, EXFULL: 115, ENOANO: 104, EBADRQC: 103, EBADSLT: 102, EDEADLOCK: 16, EBFONT: 101, ENOSTR: 100, ENODATA: 116, ETIME: 117, ENOSR: 118, ENONET: 119, ENOPKG: 120, EREMOTE: 121, ENOLINK: 47, EADV: 122, ESRMNT: 123, ECOMM: 124, EPROTO: 65, EMULTIHOP: 36, EDOTDOT: 125, EBADMSG: 9, ENOTUNIQ: 126, EBADFD: 127, EREMCHG: 128, ELIBACC: 129, ELIBBAD: 130, ELIBSCN: 131, ELIBMAX: 132, ELIBEXEC: 133, ENOSYS: 52, ENOTEMPTY: 55, ENAMETOOLONG: 37, ELOOP: 32, EOPNOTSUPP: 138, EPFNOSUPPORT: 139, ECONNRESET: 15, ENOBUFS: 42, EAFNOSUPPORT: 5, EPROTOTYPE: 67, ENOTSOCK: 57, ENOPROTOOPT: 50, ESHUTDOWN: 140, ECONNREFUSED: 14, EADDRINUSE: 3, ECONNABORTED: 13, ENETUNREACH: 40, ENETDOWN: 38, ETIMEDOUT: 73, EHOSTDOWN: 142, EHOSTUNREACH: 23, EINPROGRESS: 26, EALREADY: 7, EDESTADDRREQ: 17, EMSGSIZE: 35, EPROTONOSUPPORT: 66, ESOCKTNOSUPPORT: 137, EADDRNOTAVAIL: 4, ENETRESET: 39, EISCONN: 30, ENOTCONN: 53, ETOOMANYREFS: 141, EUSERS: 136, EDQUOT: 19, ESTALE: 72, ENOTSUP: 138, ENOMEDIUM: 148, EILSEQ: 25, EOVERFLOW: 61, ECANCELED: 11, ENOTRECOVERABLE: 56, EOWNERDEAD: 62, ESTRPIPE: 135 };
  var NODEFS = { isWindows: false, staticInit() {
    NODEFS.isWindows = !!process.platform.match(/^win/);
    var flags = process.binding("constants")["fs"];
    NODEFS.flagsForNodeMap = { 1024: flags["O_APPEND"], 64: flags["O_CREAT"], 128: flags["O_EXCL"], 256: flags["O_NOCTTY"], 0: flags["O_RDONLY"], 2: flags["O_RDWR"], 4096: flags["O_SYNC"], 512: flags["O_TRUNC"], 1: flags["O_WRONLY"], 131072: flags["O_NOFOLLOW"] };
  }, convertNodeCode(e) {
    var code = e.code;
    return ERRNO_CODES[code];
  }, tryFSOperation(f) {
    try {
      return f();
    } catch (e) {
      if (!e.code) throw e;
      if (e.code === "UNKNOWN") throw new FS.ErrnoError(28);
      throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
    }
  }, mount(mount) {
    return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
  }, createNode(parent, name, mode, dev) {
    if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
      throw new FS.ErrnoError(28);
    }
    var node = FS.createNode(parent, name, mode);
    node.node_ops = NODEFS.node_ops;
    node.stream_ops = NODEFS.stream_ops;
    return node;
  }, getMode(path) {
    return NODEFS.tryFSOperation(() => {
      var mode = fs.lstatSync(path).mode;
      if (NODEFS.isWindows) {
        mode |= (mode & 292) >> 2;
      }
      return mode;
    });
  }, realPath(node) {
    var parts = [];
    while (node.parent !== node) {
      parts.push(node.name);
      node = node.parent;
    }
    parts.push(node.mount.opts.root);
    parts.reverse();
    return PATH.join(...parts);
  }, flagsForNode(flags) {
    flags &= ~2097152;
    flags &= ~2048;
    flags &= ~32768;
    flags &= ~524288;
    flags &= ~65536;
    var newFlags = 0;
    for (var k in NODEFS.flagsForNodeMap) {
      if (flags & k) {
        newFlags |= NODEFS.flagsForNodeMap[k];
        flags ^= k;
      }
    }
    if (flags) {
      throw new FS.ErrnoError(28);
    }
    return newFlags;
  }, getattr(func, node) {
    var stat = NODEFS.tryFSOperation(func);
    if (NODEFS.isWindows) {
      if (!stat.blksize) {
        stat.blksize = 4096;
      }
      if (!stat.blocks) {
        stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0;
      }
      stat.mode |= (stat.mode & 292) >> 2;
    }
    return { dev: stat.dev, ino: node.id, mode: stat.mode, nlink: stat.nlink, uid: stat.uid, gid: stat.gid, rdev: stat.rdev, size: stat.size, atime: stat.atime, mtime: stat.mtime, ctime: stat.ctime, blksize: stat.blksize, blocks: stat.blocks };
  }, setattr(arg, node, attr, chmod, utimes, truncate, stat) {
    NODEFS.tryFSOperation(() => {
      if (attr.mode !== void 0) {
        var mode = attr.mode;
        if (NODEFS.isWindows) {
          mode &= 384;
        }
        chmod(arg, mode);
        node.mode = attr.mode;
      }
      if (typeof (attr.atime ?? attr.mtime) === "number") {
        var atime = new Date(attr.atime ?? stat(arg).atime);
        var mtime = new Date(attr.mtime ?? stat(arg).mtime);
        utimes(arg, atime, mtime);
      }
      if (attr.size !== void 0) {
        truncate(arg, attr.size);
      }
    });
  }, node_ops: { getattr(node) {
    var path = NODEFS.realPath(node);
    return NODEFS.getattr(() => fs.lstatSync(path), node);
  }, setattr(node, attr) {
    var path = NODEFS.realPath(node);
    if (attr.mode != null && attr.dontFollow) {
      throw new FS.ErrnoError(52);
    }
    var utimes = attr.dontFollow ? fs.lutimesSync : fs.utimesSync;
    NODEFS.setattr(path, node, attr, fs.chmodSync, utimes, fs.truncateSync, fs.lstatSync);
  }, lookup(parent, name) {
    var path = PATH.join2(NODEFS.realPath(parent), name);
    var mode = NODEFS.getMode(path);
    return NODEFS.createNode(parent, name, mode);
  }, mknod(parent, name, mode, dev) {
    var node = NODEFS.createNode(parent, name, mode, dev);
    var path = NODEFS.realPath(node);
    NODEFS.tryFSOperation(() => {
      if (FS.isDir(node.mode)) {
        fs.mkdirSync(path, node.mode);
      } else {
        fs.writeFileSync(path, "", { mode: node.mode });
      }
    });
    return node;
  }, rename(oldNode, newDir, newName) {
    var oldPath = NODEFS.realPath(oldNode);
    var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
    try {
      FS.unlink(newPath);
    } catch (e) {
    }
    NODEFS.tryFSOperation(() => fs.renameSync(oldPath, newPath));
    oldNode.name = newName;
  }, unlink(parent, name) {
    var path = PATH.join2(NODEFS.realPath(parent), name);
    NODEFS.tryFSOperation(() => fs.unlinkSync(path));
  }, rmdir(parent, name) {
    var path = PATH.join2(NODEFS.realPath(parent), name);
    NODEFS.tryFSOperation(() => fs.rmdirSync(path));
  }, readdir(node) {
    var path = NODEFS.realPath(node);
    return NODEFS.tryFSOperation(() => fs.readdirSync(path));
  }, symlink(parent, newName, oldPath) {
    var newPath = PATH.join2(NODEFS.realPath(parent), newName);
    NODEFS.tryFSOperation(() => fs.symlinkSync(oldPath, newPath));
  }, readlink(node) {
    var path = NODEFS.realPath(node);
    return NODEFS.tryFSOperation(() => fs.readlinkSync(path));
  }, statfs(path) {
    var stats = NODEFS.tryFSOperation(() => fs.statfsSync(path));
    stats.frsize = stats.bsize;
    return stats;
  } }, stream_ops: { getattr(stream) {
    return NODEFS.getattr(() => fs.fstatSync(stream.nfd), stream.node);
  }, setattr(stream, attr) {
    NODEFS.setattr(stream.nfd, stream.node, attr, fs.fchmodSync, fs.futimesSync, fs.ftruncateSync, fs.fstatSync);
  }, open(stream) {
    var path = NODEFS.realPath(stream.node);
    NODEFS.tryFSOperation(() => {
      stream.shared.refcount = 1;
      stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
    });
  }, close(stream) {
    NODEFS.tryFSOperation(() => {
      if (stream.nfd && --stream.shared.refcount === 0) {
        fs.closeSync(stream.nfd);
      }
    });
  }, dup(stream) {
    stream.shared.refcount++;
  }, read(stream, buffer, offset, length, position) {
    return NODEFS.tryFSOperation(() => fs.readSync(stream.nfd, buffer, offset, length, position));
  }, write(stream, buffer, offset, length, position) {
    return NODEFS.tryFSOperation(() => fs.writeSync(stream.nfd, buffer, offset, length, position));
  }, llseek(stream, offset, whence) {
    var position = offset;
    if (whence === 1) {
      position += stream.position;
    } else if (whence === 2) {
      if (FS.isFile(stream.node.mode)) {
        NODEFS.tryFSOperation(() => {
          var stat = fs.fstatSync(stream.nfd);
          position += stat.size;
        });
      }
    }
    if (position < 0) {
      throw new FS.ErrnoError(28);
    }
    return position;
  }, mmap(stream, length, position, prot, flags) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    var ptr = mmapAlloc(length);
    NODEFS.stream_ops.read(stream, HEAP8, ptr, length, position);
    return { ptr, allocated: true };
  }, msync(stream, buffer, offset, length, mmapFlags) {
    NODEFS.stream_ops.write(stream, buffer, 0, length, offset, false);
    return 0;
  } } };
  var asyncLoad = async (url) => {
    var arrayBuffer = await readAsync(url);
    return new Uint8Array(arrayBuffer);
  };
  var FS_createDataFile = (...args) => FS.createDataFile(...args);
  var getUniqueRunDependency = (id) => id;
  var dependenciesPromise = null;
  var resolveRunDependencies = async () => dependenciesPromise;
  var runDependencies = 0;
  var dependenciesPromiseResolve = null;
  var removeRunDependency = (id) => {
    runDependencies--;
    if (!runDependencies) {
      dependenciesPromiseResolve();
    }
  };
  var addRunDependency = (id) => {
    if (!runDependencies) {
      dependenciesPromise = new Promise((resolve) => dependenciesPromiseResolve = resolve);
    }
    runDependencies++;
  };
  var preloadPlugins = [];
  var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
    if (typeof Browser != "undefined") Browser.init();
    for (var plugin of preloadPlugins) {
      if (plugin["canHandle"](fullname)) {
        return plugin["handle"](byteArray, fullname);
      }
    }
    return byteArray;
  };
  var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency(`cp ${fullname}`);
    addRunDependency(dep);
    try {
      var byteArray = url;
      if (typeof url == "string") {
        byteArray = await asyncLoad(url);
      }
      byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
      preFinish?.();
      if (!dontCreateFile) {
        FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
      }
    } finally {
      removeRunDependency(dep);
    }
  };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
    FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
  };
  var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, filesystems: null, syncFSRequests: 0, ErrnoError: class {
    name = "ErrnoError";
    constructor(errno) {
      this.errno = errno;
    }
  }, FSStream: class {
    shared = {};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return this.flags & 1024;
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  }, FSNode: class {
    node_ops = {};
    stream_ops = {};
    readMode = 292 | 73;
    writeMode = 146;
    mounted = null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
    addListener(cb, exclusive = false) {
      var entry = { cb, exclusive };
      var listeners = this.listeners ??= /* @__PURE__ */ new Set();
      listeners.add(entry);
      return { listeners, entry };
    }
    notifyListeners(flags) {
      if (!this.listeners) return;
      var excl;
      for (var entry of this.listeners) {
        if (entry.exclusive) (excl ||= []).push(entry);
        else entry.cb(flags);
      }
      if (excl) {
        var i = (this.exclTurn || 0) % excl.length;
        this.exclTurn = i + 1;
        excl[i].cb(flags);
      }
    }
  }, lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
      var parts = path.split("/").filter((p) => !!p);
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = i === parts.length - 1;
        if (islast && opts.parent) {
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
          if (e?.errno === 44 && islast && opts.noent_okay) {
            return { path: current_path };
          }
          throw e;
        }
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return { path: current_path, node: current };
    }
    throw new FS.ErrnoError(32);
  }, getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  }, hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
    }
    return (parentid + hash >>> 0) % FS.nameTable.length;
  }, hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  }, hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  }, lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    return FS.lookup(parent, name);
  }, createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  }, destroyNode(node) {
    FS.hashRemoveNode(node);
  }, isRoot(node) {
    return node === node.parent;
  }, isMountpoint(node) {
    return !!node.mounted;
  }, isFile(mode) {
    return (mode & 61440) === 32768;
  }, isDir(mode) {
    return (mode & 61440) === 16384;
  }, isLink(mode) {
    return (mode & 61440) === 40960;
  }, isChrdev(mode) {
    return (mode & 61440) === 8192;
  }, isBlkdev(mode) {
    return (mode & 61440) === 24576;
  }, isFIFO(mode) {
    return (mode & 61440) === 4096;
  }, isSocket(mode) {
    return (mode & 49152) === 49152;
  }, flagsToPermissionString(flag) {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  }, nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    }
    if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    }
    if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  }, mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  }, mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {
    }
    return FS.nodePermissions(dir, "wx");
  }, mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else if (FS.isDir(node.mode)) {
      return 31;
    }
    return 0;
  }, mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    }
    var mode = FS.flagsToPermissionString(flags);
    if (FS.isDir(node.mode)) {
      if (mode !== "r" || flags & (512 | 64)) {
        return 31;
      }
    }
    return FS.nodePermissions(node, mode);
  }, checkOpExists(op, err2) {
    if (!op) {
      throw new FS.ErrnoError(err2);
    }
    return op;
  }, MAX_OPEN_FDS: 4096, nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  }, getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  }, getStream: (fd) => FS.streams[fd], createStream(stream, fd = -1) {
    stream = Object.assign(new FS.FSStream(), stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  }, closeStream(fd) {
    FS.streams[fd] = null;
  }, dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  }, doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    try {
      setattr(arg, attr);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new FS.ErrnoError(22);
      }
      throw e;
    }
  }, chrdev_stream_ops: { open(stream) {
    var device = FS.getDevice(stream.node.rdev);
    stream.stream_ops = device.stream_ops;
    stream.stream_ops.open?.(stream);
  }, llseek() {
    throw new FS.ErrnoError(70);
  } }, major: (dev) => dev >> 8, minor: (dev) => dev & 255, makedev: (ma, mi) => ma << 8 | mi, registerDevice(dev, ops) {
    FS.devices[dev] = { stream_ops: ops };
  }, getDevice: (dev) => FS.devices[dev], getMounts(mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  }, syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    for (var mount of mounts) {
      if (mount.type.syncfs) {
        mount.type.syncfs(mount, populate, done);
      } else {
        done(null);
      }
    }
  }, mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = { type, opts, mountpoint, mounts: [] };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  }, unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    for (var [hash, current] of Object.entries(FS.nameTable)) {
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    }
    node.mounted = null;
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  }, lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  }, mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  }, statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
  }, statfsStream(stream) {
    return FS.statfsNode(stream.node);
  }, statfsNode(node) {
    var rtn = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: FS.nextInode, ffree: FS.nextInode - 1, fsid: 42, flags: 2, namelen: 255 };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  }, create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  }, mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  }, mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  }, mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  }, symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  }, link(oldpath, newpath, flags) {
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.link) {
      throw new FS.ErrnoError(34);
    }
    return parent.node_ops.link(parent, newname, oldpath, flags);
  }, rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    var lookup, old_dir, new_dir;
    lookup = FS.lookupPath(old_path, { parent: true });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, { parent: true });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    var old_node = FS.lookupNode(old_dir, old_name);
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {
    }
    if (old_node === new_node) {
      return;
    }
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
      throw new FS.ErrnoError(10);
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      FS.hashAddNode(old_node);
    }
  }, rmdir(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  }, readdir(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  }, unlink(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  }, readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  }, stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  }, fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  }, lstat(path) {
    return FS.stat(path, true);
  }, doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, { mode: mode & 4095 | node.mode & ~4095, ctime: Date.now(), dontFollow });
  }, chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  }, lchmod(path, mode) {
    FS.chmod(path, mode, true);
  }, fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  }, doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
  }, chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  }, lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  }, fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  }, doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
  }, truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  }, ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  }, utime(path, atime, mtime, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    FS.doSetAttr(null, lookup.node, { atime, mtime, dontFollow });
  }, open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = FS_modeStringToFlags(flags);
    if (flags & 64) {
      mode = mode & 4095 | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
      var lookup = FS.lookupPath(path, { follow: !(flags & 131072), noent_okay: true });
      node = lookup.node;
      path = lookup.path;
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    if (flags & 512 && !created) {
      FS.truncate(node, 0);
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false });
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    return stream;
  }, close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    stream.node?.notifyListeners(32);
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  }, isClosed(stream) {
    return stream.fd === null;
  }, llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  }, read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  }, write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  }, mmap(stream, length, position, prot, flags) {
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  }, msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  }, ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  }, readFile(path, opts = {}) {
    opts.flags = opts.flags ?? 0;
    opts.encoding = opts.encoding ?? "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  }, writeFile(path, data, opts = {}) {
    opts.flags = opts.flags ?? 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    data = FS_fileDataToTypedArray(data);
    FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
    FS.close(stream);
  }, cwd: () => FS.currentPath, chdir(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  }, createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  }, createDefaultDevices() {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length, pos) => length, llseek: () => 0 });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  }, createSpecialDirectories() {
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({ mount() {
      var node = FS.createNode(proc_self, "fd", 16895, 73);
      node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
      node.node_ops = { lookup(parent, name) {
        var fd = +name;
        var stream = FS.getStreamChecked(fd);
        var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => stream.path }, id: fd + 1 };
        ret.parent = ret;
        return ret;
      }, readdir() {
        return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
      } };
      return node;
    } }, {}, "/proc/self/fd");
  }, createStandardStreams(input, output, error) {
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  }, staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = { MEMFS, NODEFS };
  }, init(input, output, error) {
    FS.initialized = true;
    FS.createStandardStreams(input, output, error);
  }, quit() {
    FS.initialized = false;
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  }, findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  }, analyzePath(path, dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {
    }
    var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  }, createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  }, createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  }, createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      data = FS_fileDataToTypedArray(data);
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  }, createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    FS.registerDevice(dev, { open(stream) {
      stream.seekable = false;
    }, close(stream) {
      if (output?.buffer?.length) {
        output(10);
      }
    }, read(stream, buffer, offset, length, pos) {
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = input();
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === void 0 && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === void 0) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    }, write(stream, buffer, offset, length, pos) {
      for (var i = 0; i < length; i++) {
        try {
          output(buffer[offset + i]);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    } });
    return FS.mkdev(path, mode, dev);
  }, forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (globalThis.XMLHttpRequest) {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  }, createLazyFile(parent, name, url, canRead, canWrite) {
    class LazyUint8Array {
      lengthKnown = false;
      chunks = [];
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return void 0;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = idx / this.chunkSize | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr.status}`);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        if (!hasByteServing) chunkSize = datalength;
        var doXHR = (from, to) => {
          if (from > to) abort(`invalid range (${from}, ${to}) or no bytes requested!`);
          if (to > datalength - 1) abort(`only ${datalength} bytes available! programmer error!`);
          var xhr2 = new XMLHttpRequest();
          xhr2.open("GET", url, false);
          if (datalength !== chunkSize) xhr2.setRequestHeader("Range", `bytes=${from}-${to}`);
          xhr2.responseType = "arraybuffer";
          if (xhr2.overrideMimeType) {
            xhr2.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr2.send(null);
          if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr2.status}`);
          if (xhr2.response !== void 0) {
            return new Uint8Array(xhr2.response || []);
          }
          return intArrayFromString(xhr2.responseText ?? "", true);
        };
        var lazyArray2 = this;
        lazyArray2.setDataGetter((chunkNum) => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          end = Math.min(end, datalength - 1);
          if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
            lazyArray2.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray2.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray2.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          chunkSize = datalength = 1;
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (globalThis.XMLHttpRequest) {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array();
      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    Object.defineProperties(node, { usedBytes: { get: function() {
      return this.contents.length;
    } } });
    var stream_ops = {};
    for (const [key, fn] of Object.entries(node.stream_ops)) {
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    }
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, HEAP8, ptr, length, position);
      return { ptr, allocated: true };
    };
    node.stream_ops = stream_ops;
    return node;
  } };
  var HEAPU8;
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
  var HEAPU32;
  var HEAP64;
  var SYSCALLS = { currentUmask: 18, calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  }, writeStat(buf, stat) {
    HEAPU32[buf >> 2] = stat.dev;
    HEAPU32[buf + 4 >> 2] = stat.mode;
    HEAPU32[buf + 8 >> 2] = stat.nlink;
    HEAPU32[buf + 12 >> 2] = stat.uid;
    HEAPU32[buf + 16 >> 2] = stat.gid;
    HEAPU32[buf + 20 >> 2] = stat.rdev;
    HEAP64[buf + 24 >> 3] = BigInt(stat.size);
    HEAP32[buf + 32 >> 2] = 4096;
    HEAP32[buf + 36 >> 2] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
    HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
    HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
    HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
    HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
    HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
    HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
    return 0;
  }, writeStatFs(buf, stats) {
    HEAPU32[buf + 4 >> 2] = stats.bsize;
    HEAPU32[buf + 60 >> 2] = stats.bsize;
    HEAP64[buf + 8 >> 3] = BigInt(stats.blocks);
    HEAP64[buf + 16 >> 3] = BigInt(stats.bfree);
    HEAP64[buf + 24 >> 3] = BigInt(stats.bavail);
    HEAP64[buf + 32 >> 3] = BigInt(stats.files);
    HEAP64[buf + 40 >> 3] = BigInt(stats.ffree);
    HEAPU32[buf + 48 >> 2] = stats.fsid;
    HEAPU32[buf + 64 >> 2] = stats.flags;
    HEAPU32[buf + 56 >> 2] = stats.namelen;
  }, doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      return 0;
    }
    var buffer = HEAPU8.subarray(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  }, getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  }, varargs: void 0, getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  } };
  var HEAP16;
  function ___syscall_fcntl64(fd, cmd, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = syscallGetVarargI();
          if (arg < 0) {
            return -28;
          }
          while (FS.streams[arg]) {
            arg++;
          }
          var newStream;
          newStream = FS.dupStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;
        case 3:
          return stream.flags;
        case 4: {
          var arg = syscallGetVarargI();
          var mask = 289792;
          stream.flags = stream.flags & ~mask | arg & mask;
          return 0;
        }
        case 12: {
          var arg = syscallGetVarargP();
          var offset = 0;
          HEAP16[arg + offset >> 1] = 2;
          return 0;
        }
        case 13:
        case 14:
          return 0;
      }
      return -28;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21505: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcgets) {
            var termios = stream.tty.ops.ioctl_tcgets(stream);
            var argp = syscallGetVarargP();
            HEAP32[argp >> 2] = termios.c_iflag || 0;
            HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
            HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
            HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
            for (var i = 0; i < 32; i++) {
              HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
            }
            return 0;
          }
          return 0;
        }
        case 21510:
        case 21511:
        case 21512: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcsets) {
            var argp = syscallGetVarargP();
            var c_iflag = HEAP32[argp >> 2];
            var c_oflag = HEAP32[argp + 4 >> 2];
            var c_cflag = HEAP32[argp + 8 >> 2];
            var c_lflag = HEAP32[argp + 12 >> 2];
            var c_cc = [];
            for (var i = 0; i < 32; i++) {
              c_cc.push(HEAP8[argp + i + 17]);
            }
            return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
          }
          return 0;
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = syscallGetVarargP();
          HEAP32[argp >> 2] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28;
        }
        case 21537:
        case 21531: {
          var argp = syscallGetVarargP();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tiocgwinsz) {
            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
            var argp = syscallGetVarargP();
            HEAP16[argp >> 1] = winsize[0];
            HEAP16[argp + 2 >> 1] = winsize[1];
          }
          return 0;
        }
        case 21524: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21515: {
          if (!stream.tty) return -59;
          return 0;
        }
        default:
          return -28;
      }
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  function ___syscall_openat(dirfd, path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? syscallGetVarargI() : 0;
      if (flags & 64) {
        mode &= ~SYSCALLS.currentUmask;
      }
      return FS.open(path, flags, mode).fd;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
    try {
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf + len];
      stringToUTF8(ret, buf, bufsize + 1);
      HEAP8[buf + len] = endChar;
      return len;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return -e.errno;
    }
  }
  var getHeapMax = () => 2147483648;
  var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
  var growMemory = (size) => {
    var oldHeapSize = wasmMemory.buffer.byteLength;
    var pages = (size - oldHeapSize + 65535) / 65536 | 0;
    try {
      wasmMemory.grow(pages);
      updateMemoryViews();
      return 1;
    } catch (e) {
    }
  };
  var _emscripten_resize_heap = (requestedSize) => {
    var oldSize = HEAPU8.length;
    requestedSize >>>= 0;
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
      return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
      var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
      var replacement = growMemory(newSize);
      if (replacement) {
        return true;
      }
    }
    return false;
  };
  var ENV = {};
  var getExecutableName = () => thisProgram;
  var getEnvStrings = () => {
    if (!getEnvStrings.strings) {
      var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
      var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
      for (var x in ENV) {
        if (ENV[x] === void 0) delete env[x];
        else env[x] = ENV[x];
      }
      var strings = [];
      for (var x in env) {
        strings.push(`${x}=${env[x]}`);
      }
      getEnvStrings.strings = strings;
    }
    return getEnvStrings.strings;
  };
  var _environ_get = (__environ, environ_buf) => {
    var bufSize = 0;
    var envp = 0;
    for (var string of getEnvStrings()) {
      var ptr = environ_buf + bufSize;
      HEAPU32[__environ + envp >> 2] = ptr;
      bufSize += stringToUTF8(string, ptr, Infinity) + 1;
      envp += 4;
    }
    return 0;
  };
  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    for (var string of strings) {
      bufSize += lengthBytesUTF8(string) + 1;
    }
    HEAPU32[penviron_buf_size >> 2] = bufSize;
    return 0;
  };
  function _fd_close(fd) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var doReadv = (stream, iov, iovcnt, offset) => {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAPU32[iov >> 2];
      var len = HEAPU32[iov + 4 >> 2];
      iov += 8;
      try {
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
      } catch (e) {
        if (ret > 0 && e instanceof FS.ErrnoError && (e.errno == 6 || e.errno == 6)) {
          break;
        }
        throw e;
      }
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
      if (typeof offset != "undefined") {
        offset += curr;
      }
    }
    return ret;
  };
  function _fd_read(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var INT53_MAX = 9007199254740992;
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
    try {
      if (isNaN(offset)) return 22;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      HEAP64[newOffset >> 3] = BigInt(stream.position);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var doWritev = (stream, iov, iovcnt, offset) => {
    if (iovcnt == 1) {
      return FS.write(stream, HEAP8, HEAPU32[iov >> 2], HEAPU32[iov + 4 >> 2], offset);
    }
    var total = 0;
    for (var i = 0, p = iov; i < iovcnt; i++, p += 8) {
      total += HEAPU32[p + 4 >> 2];
    }
    var view = new Uint8Array(total);
    var voff = 0;
    for (var i = 0; i < iovcnt; i++, iov += 8) {
      var ptr = HEAPU32[iov >> 2];
      var len = HEAPU32[iov + 4 >> 2];
      view.set(HEAPU8.subarray(ptr, ptr + len), voff);
      voff += len;
    }
    return FS.write(stream, view, 0, total, offset);
  };
  function _fd_write(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
      return e.errno;
    }
  }
  var getCFunc = (ident) => {
    var func = Module["_" + ident];
    return func;
  };
  var writeArrayToMemory = (array, buffer) => {
    HEAP8.set(array, buffer);
  };
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8(str, ret, size);
    return ret;
  };
  var ccall = (ident, returnType, argTypes, args, opts) => {
    var toC = { string: (str) => {
      var ret2 = 0;
      if (str !== null && str !== void 0 && str !== 0) {
        ret2 = stringToUTF8OnStack(str);
      }
      return ret2;
    }, array: (arr) => {
      var ret2 = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret2);
      return ret2;
    } };
    function convertReturnValue(ret2) {
      if (returnType === "string") {
        return UTF8ToString(ret2);
      }
      if (returnType === "boolean") return Boolean(ret2);
      return ret2;
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func(...cArgs);
    function onDone(ret2) {
      if (stack !== 0) stackRestore(stack);
      return convertReturnValue(ret2);
    }
    ret = onDone(ret);
    return ret;
  };
  var cwrap = (ident, returnType, argTypes, opts) => {
    var numericArgs = !argTypes || argTypes.every((type) => type === "number" || type === "boolean");
    var numericRet = returnType !== "string";
    if (numericRet && numericArgs && !opts) {
      return getCFunc(ident);
    }
    return (...args) => ccall(ident, returnType, argTypes, args, opts);
  };
  var HEAPF32;
  var HEAPF64;
  function getValue(ptr, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        return HEAP8[ptr];
      case "i8":
        return HEAP8[ptr];
      case "i16":
        return HEAP16[ptr >> 1];
      case "i32":
        return HEAP32[ptr >> 2];
      case "i64":
        return HEAP64[ptr >> 3];
      case "float":
        return HEAPF32[ptr >> 2];
      case "double":
        return HEAPF64[ptr >> 3];
      case "*":
        return HEAPU32[ptr >> 2];
      default:
        abort(`invalid type for getValue: ${type}`);
    }
  }
  function setValue(ptr, value, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        HEAP8[ptr] = value;
        break;
      case "i8":
        HEAP8[ptr] = value;
        break;
      case "i16":
        HEAP16[ptr >> 1] = value;
        break;
      case "i32":
        HEAP32[ptr >> 2] = value;
        break;
      case "i64":
        HEAP64[ptr >> 3] = BigInt(value);
        break;
      case "float":
        HEAPF32[ptr >> 2] = value;
        break;
      case "double":
        HEAPF64[ptr >> 3] = value;
        break;
      case "*":
        HEAPU32[ptr >> 2] = value;
        break;
      default:
        abort(`invalid type for setValue: ${type}`);
    }
  }
  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.preloadFile = FS_preloadFile;
  FS.staticInit();
  if (ENVIRONMENT_IS_NODE) {
    NODEFS.staticInit();
  }
  {
  }
  Module["ccall"] = ccall;
  Module["cwrap"] = cwrap;
  Module["setValue"] = setValue;
  Module["getValue"] = getValue;
  Module["UTF8ToString"] = UTF8ToString;
  Module["stringToUTF8"] = stringToUTF8;
  Module["lengthBytesUTF8"] = lengthBytesUTF8;
  Module["FS"] = FS;
  Module["NODEFS"] = NODEFS;
  var _swe_date_conversion, _swe_julday, _swe_revjul, _swe_utc_time_zone, _swe_utc_to_jd, _swe_deltat_ex, _swe_jdet_to_utc, _swe_jdut1_to_utc, _swe_houses, _swe_sidtime0, _swe_degnorm, _swe_calc_ut, _swe_houses_armc_ex2, _swe_difdeg2n, _swe_houses_ex, _swe_houses_ex2, _swe_set_sid_mode, _swe_get_ayanamsa_ex, _swe_houses_armc, _swe_cotrans, _swe_radnorm, _swe_house_name, _swe_house_pos, _free, _malloc, _swe_version, _swe_get_library_path, _swe_calc, _swe_set_tid_acc, _swe_set_ephe_path, _swe_difrad2n, _swe_close, _swe_set_jpl_file, _swe_fixstar, _swe_get_ayanamsa_ex_ut, _swe_get_ayanamsa, _swe_get_ayanamsa_ut, _swe_fixstar2, _swe_fixstar2_ut, _swe_fixstar2_mag, _swe_get_planet_name, _swe_get_ayanamsa_name, _swe_set_topo, _swe_time_equ, _swe_sidtime, _swe_lmt_to_lat, _swe_lat_to_lmt, _swe_fixstar_ut, _swe_fixstar_mag, _swe_calc_pctr, _swe_get_current_file_data, _swe_solcross, _swe_solcross_ut, _swe_mooncross, _swe_mooncross_ut, _swe_mooncross_node, _swe_mooncross_node_ut, _swe_helio_cross, _swe_helio_cross_ut, _swe_deg_midp, _swe_rad_midp, _swe_cotrans_sp, _swe_deltat, _swe_get_tid_acc, _swe_set_delta_t_userdef, _swe_set_interpolate_nut, _swe_csnorm, _swe_difcsn, _swe_difdegn, _swe_difcs2n, _swe_csroundsec, _swe_d2l, _swe_day_of_week, _swe_cs2timestr, _swe_cs2lonlatstr, _swe_cs2degstr, _swe_split_deg, _swe_set_astro_models, _swe_get_astro_models, _swe_sol_eclipse_where, _swe_refrac_extended, _swe_lun_occult_where, _swe_sol_eclipse_how, _swe_azalt, _swe_sol_eclipse_when_glob, _swe_lun_occult_when_glob, _swe_sol_eclipse_when_loc, _swe_rise_trans, _swe_lun_occult_when_loc, _swe_azalt_rev, _swe_refrac, _swe_set_lapse_rate, _swe_lun_eclipse_how, _swe_lun_eclipse_when, _swe_lun_eclipse_when_loc, _swe_rise_trans_true_hor, _swe_pheno, _swe_pheno_ut, _swe_nod_aps, _swe_nod_aps_ut, _swe_get_orbital_elements, _swe_orbit_max_min_true_distance, _swe_gauquelin_sector, _swe_vis_limit_mag, _swe_topo_arcus_visionis, _swe_heliacal_angle, _swe_heliacal_pheno_ut, _swe_heliacal_ut, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, memory, __indirect_function_table, wasmMemory;
  function assignWasmExports(wasmExports2) {
    _swe_date_conversion = Module["_swe_date_conversion"] = wasmExports2["n"];
    _swe_julday = Module["_swe_julday"] = wasmExports2["o"];
    _swe_revjul = Module["_swe_revjul"] = wasmExports2["p"];
    _swe_utc_time_zone = Module["_swe_utc_time_zone"] = wasmExports2["q"];
    _swe_utc_to_jd = Module["_swe_utc_to_jd"] = wasmExports2["r"];
    _swe_deltat_ex = Module["_swe_deltat_ex"] = wasmExports2["s"];
    _swe_jdet_to_utc = Module["_swe_jdet_to_utc"] = wasmExports2["t"];
    _swe_jdut1_to_utc = Module["_swe_jdut1_to_utc"] = wasmExports2["u"];
    _swe_houses = Module["_swe_houses"] = wasmExports2["v"];
    _swe_sidtime0 = Module["_swe_sidtime0"] = wasmExports2["w"];
    _swe_degnorm = Module["_swe_degnorm"] = wasmExports2["x"];
    _swe_calc_ut = Module["_swe_calc_ut"] = wasmExports2["y"];
    _swe_houses_armc_ex2 = Module["_swe_houses_armc_ex2"] = wasmExports2["z"];
    _swe_difdeg2n = Module["_swe_difdeg2n"] = wasmExports2["A"];
    _swe_houses_ex = Module["_swe_houses_ex"] = wasmExports2["B"];
    _swe_houses_ex2 = Module["_swe_houses_ex2"] = wasmExports2["C"];
    _swe_set_sid_mode = Module["_swe_set_sid_mode"] = wasmExports2["D"];
    _swe_get_ayanamsa_ex = Module["_swe_get_ayanamsa_ex"] = wasmExports2["E"];
    _swe_houses_armc = Module["_swe_houses_armc"] = wasmExports2["F"];
    _swe_cotrans = Module["_swe_cotrans"] = wasmExports2["G"];
    _swe_radnorm = Module["_swe_radnorm"] = wasmExports2["H"];
    _swe_house_name = Module["_swe_house_name"] = wasmExports2["I"];
    _swe_house_pos = Module["_swe_house_pos"] = wasmExports2["J"];
    _free = Module["_free"] = wasmExports2["K"];
    _malloc = Module["_malloc"] = wasmExports2["L"];
    _swe_version = Module["_swe_version"] = wasmExports2["M"];
    _swe_get_library_path = Module["_swe_get_library_path"] = wasmExports2["N"];
    _swe_calc = Module["_swe_calc"] = wasmExports2["O"];
    _swe_set_tid_acc = Module["_swe_set_tid_acc"] = wasmExports2["P"];
    _swe_set_ephe_path = Module["_swe_set_ephe_path"] = wasmExports2["Q"];
    _swe_difrad2n = Module["_swe_difrad2n"] = wasmExports2["R"];
    _swe_close = Module["_swe_close"] = wasmExports2["S"];
    _swe_set_jpl_file = Module["_swe_set_jpl_file"] = wasmExports2["T"];
    _swe_fixstar = Module["_swe_fixstar"] = wasmExports2["U"];
    _swe_get_ayanamsa_ex_ut = Module["_swe_get_ayanamsa_ex_ut"] = wasmExports2["V"];
    _swe_get_ayanamsa = Module["_swe_get_ayanamsa"] = wasmExports2["W"];
    _swe_get_ayanamsa_ut = Module["_swe_get_ayanamsa_ut"] = wasmExports2["X"];
    _swe_fixstar2 = Module["_swe_fixstar2"] = wasmExports2["Y"];
    _swe_fixstar2_ut = Module["_swe_fixstar2_ut"] = wasmExports2["Z"];
    _swe_fixstar2_mag = Module["_swe_fixstar2_mag"] = wasmExports2["_"];
    _swe_get_planet_name = Module["_swe_get_planet_name"] = wasmExports2["$"];
    _swe_get_ayanamsa_name = Module["_swe_get_ayanamsa_name"] = wasmExports2["aa"];
    _swe_set_topo = Module["_swe_set_topo"] = wasmExports2["ba"];
    _swe_time_equ = Module["_swe_time_equ"] = wasmExports2["ca"];
    _swe_sidtime = Module["_swe_sidtime"] = wasmExports2["da"];
    _swe_lmt_to_lat = Module["_swe_lmt_to_lat"] = wasmExports2["ea"];
    _swe_lat_to_lmt = Module["_swe_lat_to_lmt"] = wasmExports2["fa"];
    _swe_fixstar_ut = Module["_swe_fixstar_ut"] = wasmExports2["ga"];
    _swe_fixstar_mag = Module["_swe_fixstar_mag"] = wasmExports2["ha"];
    _swe_calc_pctr = Module["_swe_calc_pctr"] = wasmExports2["ia"];
    _swe_get_current_file_data = Module["_swe_get_current_file_data"] = wasmExports2["ja"];
    _swe_solcross = Module["_swe_solcross"] = wasmExports2["ka"];
    _swe_solcross_ut = Module["_swe_solcross_ut"] = wasmExports2["la"];
    _swe_mooncross = Module["_swe_mooncross"] = wasmExports2["ma"];
    _swe_mooncross_ut = Module["_swe_mooncross_ut"] = wasmExports2["na"];
    _swe_mooncross_node = Module["_swe_mooncross_node"] = wasmExports2["oa"];
    _swe_mooncross_node_ut = Module["_swe_mooncross_node_ut"] = wasmExports2["pa"];
    _swe_helio_cross = Module["_swe_helio_cross"] = wasmExports2["qa"];
    _swe_helio_cross_ut = Module["_swe_helio_cross_ut"] = wasmExports2["ra"];
    _swe_deg_midp = Module["_swe_deg_midp"] = wasmExports2["sa"];
    _swe_rad_midp = Module["_swe_rad_midp"] = wasmExports2["ta"];
    _swe_cotrans_sp = Module["_swe_cotrans_sp"] = wasmExports2["ua"];
    _swe_deltat = Module["_swe_deltat"] = wasmExports2["va"];
    _swe_get_tid_acc = Module["_swe_get_tid_acc"] = wasmExports2["wa"];
    _swe_set_delta_t_userdef = Module["_swe_set_delta_t_userdef"] = wasmExports2["xa"];
    _swe_set_interpolate_nut = Module["_swe_set_interpolate_nut"] = wasmExports2["ya"];
    _swe_csnorm = Module["_swe_csnorm"] = wasmExports2["za"];
    _swe_difcsn = Module["_swe_difcsn"] = wasmExports2["Aa"];
    _swe_difdegn = Module["_swe_difdegn"] = wasmExports2["Ba"];
    _swe_difcs2n = Module["_swe_difcs2n"] = wasmExports2["Ca"];
    _swe_csroundsec = Module["_swe_csroundsec"] = wasmExports2["Da"];
    _swe_d2l = Module["_swe_d2l"] = wasmExports2["Ea"];
    _swe_day_of_week = Module["_swe_day_of_week"] = wasmExports2["Fa"];
    _swe_cs2timestr = Module["_swe_cs2timestr"] = wasmExports2["Ga"];
    _swe_cs2lonlatstr = Module["_swe_cs2lonlatstr"] = wasmExports2["Ha"];
    _swe_cs2degstr = Module["_swe_cs2degstr"] = wasmExports2["Ia"];
    _swe_split_deg = Module["_swe_split_deg"] = wasmExports2["Ja"];
    _swe_set_astro_models = Module["_swe_set_astro_models"] = wasmExports2["Ka"];
    _swe_get_astro_models = Module["_swe_get_astro_models"] = wasmExports2["La"];
    _swe_sol_eclipse_where = Module["_swe_sol_eclipse_where"] = wasmExports2["Ma"];
    _swe_refrac_extended = Module["_swe_refrac_extended"] = wasmExports2["Na"];
    _swe_lun_occult_where = Module["_swe_lun_occult_where"] = wasmExports2["Oa"];
    _swe_sol_eclipse_how = Module["_swe_sol_eclipse_how"] = wasmExports2["Pa"];
    _swe_azalt = Module["_swe_azalt"] = wasmExports2["Qa"];
    _swe_sol_eclipse_when_glob = Module["_swe_sol_eclipse_when_glob"] = wasmExports2["Ra"];
    _swe_lun_occult_when_glob = Module["_swe_lun_occult_when_glob"] = wasmExports2["Sa"];
    _swe_sol_eclipse_when_loc = Module["_swe_sol_eclipse_when_loc"] = wasmExports2["Ta"];
    _swe_rise_trans = Module["_swe_rise_trans"] = wasmExports2["Ua"];
    _swe_lun_occult_when_loc = Module["_swe_lun_occult_when_loc"] = wasmExports2["Va"];
    _swe_azalt_rev = Module["_swe_azalt_rev"] = wasmExports2["Wa"];
    _swe_refrac = Module["_swe_refrac"] = wasmExports2["Xa"];
    _swe_set_lapse_rate = Module["_swe_set_lapse_rate"] = wasmExports2["Ya"];
    _swe_lun_eclipse_how = Module["_swe_lun_eclipse_how"] = wasmExports2["Za"];
    _swe_lun_eclipse_when = Module["_swe_lun_eclipse_when"] = wasmExports2["_a"];
    _swe_lun_eclipse_when_loc = Module["_swe_lun_eclipse_when_loc"] = wasmExports2["$a"];
    _swe_rise_trans_true_hor = Module["_swe_rise_trans_true_hor"] = wasmExports2["ab"];
    _swe_pheno = Module["_swe_pheno"] = wasmExports2["bb"];
    _swe_pheno_ut = Module["_swe_pheno_ut"] = wasmExports2["cb"];
    _swe_nod_aps = Module["_swe_nod_aps"] = wasmExports2["db"];
    _swe_nod_aps_ut = Module["_swe_nod_aps_ut"] = wasmExports2["eb"];
    _swe_get_orbital_elements = Module["_swe_get_orbital_elements"] = wasmExports2["fb"];
    _swe_orbit_max_min_true_distance = Module["_swe_orbit_max_min_true_distance"] = wasmExports2["gb"];
    _swe_gauquelin_sector = Module["_swe_gauquelin_sector"] = wasmExports2["hb"];
    _swe_vis_limit_mag = Module["_swe_vis_limit_mag"] = wasmExports2["ib"];
    _swe_topo_arcus_visionis = Module["_swe_topo_arcus_visionis"] = wasmExports2["jb"];
    _swe_heliacal_angle = Module["_swe_heliacal_angle"] = wasmExports2["kb"];
    _swe_heliacal_pheno_ut = Module["_swe_heliacal_pheno_ut"] = wasmExports2["lb"];
    _swe_heliacal_ut = Module["_swe_heliacal_ut"] = wasmExports2["mb"];
    __emscripten_stack_restore = wasmExports2["nb"];
    __emscripten_stack_alloc = wasmExports2["ob"];
    _emscripten_stack_get_current = wasmExports2["pb"];
    memory = wasmMemory = wasmExports2["l"];
    __indirect_function_table = wasmExports2["__indirect_function_table"];
  }
  var wasmImports = { c: ___syscall_fcntl64, i: ___syscall_ioctl, k: ___syscall_openat, d: ___syscall_readlinkat, j: _emscripten_resize_heap, f: _environ_get, g: _environ_sizes_get, a: _fd_close, h: _fd_read, e: _fd_seek, b: _fd_write };
  async function run() {
    preRun();
    if (runDependencies) {
      await resolveRunDependencies();
    }
    if (ABORT) return;
    initRuntime();
    postRun();
  }
  var wasmExports;
  wasmExports = await createWasm();
  await run();
  ;
  return Module;
}
var swisseph_default = createSwissEphModule;

// node_modules/@kuntay/swisseph/dist/generated/constants.js
var Body = {
  Sun: 0,
  Moon: 1,
  Mercury: 2,
  Venus: 3,
  Mars: 4,
  Jupiter: 5,
  Saturn: 6,
  Uranus: 7,
  Neptune: 8,
  Pluto: 9,
  MeanNode: 10,
  TrueNode: 11,
  MeanApog: 12,
  // Black Moon Lilith (ortalama) — cisim değil, Ay apojesi
  OscuApog: 13,
  // Black Moon Lilith (gerçek/oskülatör)
  Earth: 14,
  // yalnızca heliosentrik hesapta anlamlı
  Chiron: 15,
  Pholus: 16,
  Ceres: 17,
  Pallas: 18,
  Juno: 19,
  Vesta: 20,
  IntpApog: 21,
  IntpPerg: 22
};
var Flag = {
  Tropical: 0,
  Jpleph: 1,
  Swieph: 2,
  Defaulteph: 2,
  Moseph: 4,
  Helctr: 8,
  Truepos: 16,
  J2000: 32,
  Nonut: 64,
  Speed3: 128,
  Speed: 256,
  Nogdefl: 512,
  Noaberr: 1024,
  Astrometric: 1536,
  Equatorial: 2048,
  Xyz: 4096,
  Radians: 8192,
  Baryctr: 16384,
  Topoctr: 32768,
  OrbelAa: 32768,
  Sidereal: 65536,
  Icrs: 131072,
  Dpsideps1980: 262144,
  Jplhor: 262144,
  JplhorApprox: 524288,
  CenterBody: 1048576,
  TestPlmoon: 2228280
};
var HouseSystem = {
  Equal: "A",
  Alcabitius: "B",
  Campanus: "C",
  EqualMC: "D",
  CarterPoliEqu: "F",
  GauquelinSectors: "G",
  HorizonAzimut: "H",
  Sunshine: "I",
  SunshineAlt: "i",
  SavardA: "J",
  Koch: "K",
  PullenSD: "L",
  Morinus: "M",
  Equal1Aries: "N",
  Porphyry: "O",
  Placidus: "P",
  PullenSR: "Q",
  Regiomontanus: "R",
  Sripati: "S",
  PolichPage: "T",
  KrusinskiPisaGoelzer: "U",
  EqualVehlow: "V",
  EqualWholeSign: "W",
  AxialRotationSystemMeridianHouses: "X",
  APCHouses: "Y"
};
var Calendar = {
  Julian: 0,
  // Jülyen takvimi
  Gregorian: 1
  // Gregoryen takvimi
};
var RiseTransit = {
  Rise: 1,
  // SE_CALC_RISE
  Set: 2,
  // SE_CALC_SET
  UpperCulmination: 4,
  // SE_CALC_MTRANSIT — meridyen geçişi (üst)
  LowerCulmination: 8,
  // SE_CALC_ITRANSIT — alt meridyen geçişi
  DiscCenter: 256,
  // SE_BIT_DISC_CENTER — kenar yerine merkez
  DiscBottom: 8192,
  // SE_BIT_DISC_BOTTOM — alt kenar
  FixedDiscSize: 16384,
  // SE_BIT_FIXED_DISC_SIZE
  NoRefraction: 512,
  // SE_BIT_NO_REFRACTION — atmosferik kırılmayı yok say
  GeocentricNoEclipticLatitude: 128,
  // SE_BIT_GEOCTR_NO_ECL_LAT
  CivilTwilight: 1024,
  // SE_BIT_CIVIL_TWILIGHT — Güneş -6°
  NauticalTwilight: 2048,
  // SE_BIT_NAUTIC_TWILIGHT — Güneş -12°
  AstronomicalTwilight: 4096,
  // SE_BIT_ASTRO_TWILIGHT — Güneş -18°
  HinduRising: 896
  // SE_BIT_HINDU_RISING — merkez + kırılmasız + geosentrik
};
var EclipseFlag = {
  Central: 1,
  // SE_ECL_CENTRAL
  NonCentral: 2,
  // SE_ECL_NONCENTRAL
  Total: 4,
  // SE_ECL_TOTAL
  Annular: 8,
  // SE_ECL_ANNULAR — halkalı
  Partial: 16,
  // SE_ECL_PARTIAL — parçalı
  AnnularTotal: 32,
  // SE_ECL_ANNULAR_TOTAL — hibrit; SE_ECL_HYBRID ile aynı bit
  Penumbral: 64,
  // SE_ECL_PENUMBRAL — yalnızca ay tutulması
  AllSolarTypes: 63,
  // SE_ECL_ALLTYPES_SOLAR
  AllLunarTypes: 84,
  // SE_ECL_ALLTYPES_LUNAR
  Visible: 128,
  // SE_ECL_VISIBLE
  MaxVisible: 256,
  // SE_ECL_MAX_VISIBLE
  PartialBeginVisible: 512,
  // SE_ECL_PARTBEG_VISIBLE
  TotalBeginVisible: 1024,
  // SE_ECL_TOTBEG_VISIBLE
  TotalEndVisible: 2048,
  // SE_ECL_TOTEND_VISIBLE
  PartialEndVisible: 4096,
  // SE_ECL_PARTEND_VISIBLE
  PenumbralBeginVisible: 8192,
  // SE_ECL_PENUMBBEG_VISIBLE
  PenumbralEndVisible: 16384,
  // SE_ECL_PENUMBEND_VISIBLE
  OneTry: 32768
  // SE_ECL_ONE_TRY — aramayı tek denemede bırak
};
var EclipticNutationId = -1;

// node_modules/@kuntay/swisseph/dist/constants.js
var Body2 = {
  ...Body,
  BlackMoonLilithMean: Body.MeanApog,
  BlackMoonLilithTrue: Body.OscuApog,
  InterpolatedApogee: Body.IntpApog,
  InterpolatedPerigee: Body.IntpPerg,
  /** The Moon's mean north node (Rahu). */
  NorthNodeMean: Body.MeanNode,
  /** The Moon's true (osculating) north node. */
  NorthNodeTrue: Body.TrueNode
};
var REQUIRES_EPHEMERIS_FILE = /* @__PURE__ */ new Set([
  Body2.Chiron,
  Body2.Pholus,
  Body2.Ceres,
  Body2.Pallas,
  Body2.Juno,
  Body2.Vesta
]);
var Flag2 = {
  ...Flag,
  // --- efemeris kaynağı ---
  /** The `.se1` files. Falls back to Moshier, silently, when absent. */
  SwissEphemeris: Flag.Swieph,
  /** Analytic theory, no files needed. Always available. */
  Moshier: Flag.Moseph,
  /** A raw JPL file (`de441.eph` and friends). Node only, 2.6 GB. */
  JplEphemeris: Flag.Jpleph,
  // --- koordinat çerçevesi ---
  Heliocentric: Flag.Helctr,
  Barycentric: Flag.Baryctr,
  Topocentric: Flag.Topoctr,
  /** Equatorial instead of ecliptic coordinates (right ascension / declination). */
  Equatorial: Flag.Equatorial,
  /** Cartesian x/y/z instead of spherical. */
  Cartesian: Flag.Xyz,
  Radians: Flag.Radians,
  // --- konum düzeltmeleri ---
  /** No light-time or aberration correction — the geometric (true) position. */
  TruePosition: Flag.Truepos,
  NoNutation: Flag.Nonut,
  NoGravitationalDeflection: Flag.Nogdefl,
  NoAberration: Flag.Noaberr,
  J2000Equinox: Flag.J2000,
  // --- zodyak ---
  /** The sidereal zodiac, used together with `setSiderealMode()`. */
  Sidereal: Flag.Sidereal,
  /** Also compute speeds. Cheap, and usually wanted. */
  Speed: Flag.Speed
};
var Calendar2 = { ...Calendar };
var HouseSystem2 = { ...HouseSystem };
var ASCMC = {
  Ascendant: 0,
  Midheaven: 1,
  Armc: 2,
  Vertex: 3,
  EquatorialAscendant: 4,
  CoAscendantKoch: 5,
  CoAscendantMunkasey: 6,
  PolarAscendant: 7,
  Count: 8
};
var SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

// node_modules/@kuntay/swisseph/dist/ephemeris/files.js
var PREFIX = {
  planets: "sepl",
  // Güneş..Plüton
  moon: "semo",
  // Ay
  asteroids: "seas"
  // Chiron, Pholus, Ceres, Pallas, Juno, Vesta
};
var YEARS_PER_FILE = 600;
var INDEX_STEP = 6;
var COVERAGE = {
  minYear: -13200,
  maxYear: 17399
};
var AUXILIARY_FILES = {
  /** The fixed star catalogue, for `swe_fixstar` / `swe_fixstar2`. */
  fixedStars: "sefstars.txt",
  /** Orbital elements for Uranian planets, Transpluto and the like. */
  fictitiousBodies: "seorbel.txt",
  /** Named-asteroid lookup. 16 MB — not part of the core package. */
  asteroidNames: "seasnam.txt"
};
function pad(index) {
  return String(index).padStart(2, "0");
}
function requiredEphemerisFiles(options) {
  const { fromYear, kinds = ["planets", "moon", "asteroids"] } = options;
  const toYear = options.toYear ?? fromYear;
  const loOrdinal = sliceOrdinal(clampYear(Math.min(fromYear, toYear)));
  const hiOrdinal = sliceOrdinal(clampYear(Math.max(fromYear, toYear)));
  const files = [];
  for (const kind of kinds) {
    for (let ordinal = loOrdinal; ordinal <= hiOrdinal; ordinal++) {
      const name = fileForOrdinal(kind, ordinal);
      if (name)
        files.push(name);
    }
  }
  if (options.fixedStars)
    files.push(AUXILIARY_FILES.fixedStars);
  if (options.fictitiousBodies)
    files.push(AUXILIARY_FILES.fictitiousBodies);
  return files;
}
function sliceOrdinal(year) {
  return year >= 0 ? Math.floor(year / YEARS_PER_FILE) : -Math.ceil(-year / YEARS_PER_FILE);
}
function fileForOrdinal(kind, ordinal) {
  const prefix = PREFIX[kind];
  if (ordinal >= 0) {
    const index2 = INDEX_STEP * ordinal;
    return index2 <= 168 ? `${prefix}_${pad(index2)}.se1` : null;
  }
  const index = INDEX_STEP * -ordinal;
  return index <= 132 ? `${prefix}m${pad(index)}.se1` : null;
}
function clampYear(year) {
  return Math.min(COVERAGE.maxYear, Math.max(COVERAGE.minYear, year));
}

// node_modules/@kuntay/swisseph/dist/derived/sect.js
function normalizeDegrees(angle) {
  return (angle % 360 + 360) % 360;
}
function sectFromAscendant(sunLongitude, ascendant, twilightAllowance) {
  const fromAsc = normalizeDegrees(sunLongitude - ascendant);
  const elevation = fromAsc < 180 ? -(90 - Math.abs(fromAsc - 90)) : 90 - Math.abs(fromAsc - 270);
  return {
    sect: elevation >= -twilightAllowance ? "day" : "night",
    elevation
  };
}
function determineSect(sunLongitude, ascendant, options = {}) {
  const method = options.method ?? (options.sunAltitude !== void 0 ? "altitude" : "ascendant");
  const twilight = options.twilightAllowance ?? 0;
  if (method === "altitude") {
    if (options.sunAltitude === void 0) {
      throw new Error("method:'altitude' needs sunAltitude \u2014 compute it with swe.horizontal().");
    }
    const elevation2 = options.sunAltitude;
    return {
      sect: elevation2 >= -twilight ? "day" : "night",
      sunElevation: elevation2,
      method,
      borderline: Math.abs(elevation2) < 1
    };
  }
  const { sect, elevation } = sectFromAscendant(sunLongitude, ascendant, twilight);
  return {
    sect,
    sunElevation: elevation,
    method,
    borderline: Math.abs(elevation) < 1
  };
}

// node_modules/@kuntay/swisseph/dist/derived/lots.js
var HERMETIC_LOTS = {
  Fortune: {
    name: "Lot of Fortune",
    day: { a: "Ascendant", b: "Moon", c: "Sun" },
    night: { a: "Ascendant", b: "Sun", c: "Moon" },
    source: "Paulus Alexandrinus, Introduction 23",
    note: "Concerns the body, health and material circumstances. Associated with the Moon."
  },
  Spirit: {
    name: "Lot of Spirit",
    day: { a: "Ascendant", b: "Sun", c: "Moon" },
    night: { a: "Ascendant", b: "Moon", c: "Sun" },
    source: "Paulus Alexandrinus, Introduction 23",
    note: "Concerns the mind, the will and action. Associated with the Sun."
  },
  Eros: {
    name: "Lot of Eros",
    day: { a: "Ascendant", b: "Venus", c: "lot:Spirit" },
    night: { a: "Ascendant", b: "lot:Spirit", c: "Venus" },
    source: "Paulus Alexandrinus, Introduction 23"
  },
  Necessity: {
    name: "Lot of Necessity",
    day: { a: "Ascendant", b: "lot:Fortune", c: "Mercury" },
    night: { a: "Ascendant", b: "Mercury", c: "lot:Fortune" },
    source: "Paulus Alexandrinus, Introduction 23"
  },
  Courage: {
    name: "Lot of Courage",
    day: { a: "Ascendant", b: "lot:Fortune", c: "Mars" },
    night: { a: "Ascendant", b: "Mars", c: "lot:Fortune" },
    source: "Paulus Alexandrinus, Introduction 23"
  },
  Victory: {
    name: "Lot of Victory",
    day: { a: "Ascendant", b: "Jupiter", c: "lot:Spirit" },
    night: { a: "Ascendant", b: "lot:Spirit", c: "Jupiter" },
    source: "Paulus Alexandrinus, Introduction 23"
  },
  Nemesis: {
    name: "Lot of Nemesis",
    day: { a: "Ascendant", b: "lot:Fortune", c: "Saturn" },
    night: { a: "Ascendant", b: "Saturn", c: "lot:Fortune" },
    source: "Paulus Alexandrinus, Introduction 23"
  }
};
var NON_HERMETIC_LOTS = {
  Basis: {
    name: "Lot of Basis",
    // day/night yalnızca tip gereği; gerçek hesap compute() içinde.
    day: { a: "Ascendant", b: "lot:Fortune", c: "lot:Spirit" },
    /**
     * Temel Noktası sekt aynası DEĞİL: Şans ile Ruh arasındaki KISA yay
     * seçilir. Yani hangi formülün uygulanacağı sekte değil, iki noktanın
     * göreli konumuna bağlı — A+B−C kalıbına sığmadığı için compute() ile.
     */
    compute: (resolve) => {
      const fortune = resolve("lot:Fortune");
      const spirit = resolve("lot:Spirit");
      const ascendant = resolve("Ascendant");
      const arc = normalizeDegrees(spirit - fortune);
      return arc <= 180 ? normalizeDegrees(ascendant + arc) : normalizeDegrees(ascendant + (360 - arc));
    },
    source: "Hellenistic tradition (the shorter Fortune\u2013Spirit arc)",
    note: "Not a sect mirror: the shorter arc between the two points is used. Some modern implementations treat it as sect-based and get it wrong."
  },
  Exaltation: {
    name: "Lot of Exaltation",
    day: { a: "Ascendant", b: { degree: 19 }, c: "Sun" },
    // 19° Aries
    night: { a: "Ascendant", b: { degree: 33 }, c: "Moon" },
    // 3° Taurus
    source: "Paulus Alexandrinus",
    note: "Fixed degrees: by day the Sun's exaltation degree (19\xB0 Aries), by night the Moon's (3\xB0 Taurus)."
  },
  Father: {
    name: "Lot of the Father",
    day: { a: "Ascendant", b: "Sun", c: "Saturn" },
    night: { a: "Ascendant", b: "Saturn", c: "Sun" },
    source: "Vettius Valens, Anthology II"
  },
  Mother: {
    name: "Lot of the Mother",
    day: { a: "Ascendant", b: "Moon", c: "Venus" },
    night: { a: "Ascendant", b: "Venus", c: "Moon" },
    source: "Vettius Valens, Anthology II"
  },
  Siblings: {
    name: "Lot of Siblings",
    day: { a: "Ascendant", b: "Jupiter", c: "Saturn" },
    source: "Vettius Valens, Anthology II",
    note: "Not sect-dependent \u2014 the sources give no separate nocturnal formula."
  },
  Children: {
    name: "Lot of Children",
    day: { a: "Ascendant", b: "Saturn", c: "Jupiter" },
    night: { a: "Ascendant", b: "Jupiter", c: "Saturn" },
    source: "Vettius Valens, Anthology II"
  },
  Illness: {
    name: "Lot of Illness",
    day: { a: "Ascendant", b: "Mars", c: "Saturn" },
    night: { a: "Ascendant", b: "Saturn", c: "Mars" },
    source: "Paulus Alexandrinus"
  },
  Marriage: {
    name: "Lot of Marriage",
    day: { a: "Ascendant", b: "Venus", c: "Saturn" },
    source: "Traditional",
    note: "The sources diverge markedly on this lot; some invert the formula by gender. Override the definition if you follow a different tradition."
  }
};
var ALL_LOTS = {
  ...HERMETIC_LOTS,
  ...NON_HERMETIC_LOTS
};
function calculateLots(points, sect, definitions = ALL_LOTS) {
  const resolvedSect = normalizeSect(sect);
  const results = {};
  const resolving = /* @__PURE__ */ new Set();
  function pointValue(point) {
    if (typeof point === "object")
      return normalizeDegrees(point.degree);
    if (point.startsWith("lot:")) {
      const key = point.slice(4);
      const cached = results[key];
      if (cached)
        return cached.longitude;
      if (resolving.has(key)) {
        throw new Error(`Circular lot dependency: ${[...resolving].join(" -> ")} -> ${key}`);
      }
      const dependency = definitions[key] ?? ALL_LOTS[key];
      if (!dependency) {
        throw new Error(`Unknown lot reference: "${key}". It is in neither the definitions passed nor ALL_LOTS.`);
      }
      compute(key, dependency);
      return results[key].longitude;
    }
    switch (point) {
      case "Ascendant":
        return points.ascendant;
      case "Midheaven":
        return points.midheaven;
      case "Descendant":
        return normalizeDegrees(points.ascendant + 180);
      case "ImumCoeli":
        return normalizeDegrees(points.midheaven + 180);
      case "Sun":
        return points.sun;
      case "Moon":
        return points.moon;
      case "Mercury":
        return points.mercury;
      case "Venus":
        return points.venus;
      case "Mars":
        return points.mars;
      case "Jupiter":
        return points.jupiter;
      case "Saturn":
        return points.saturn;
      case "NorthNode":
      case "SouthNode": {
        if (points.northNode === void 0) {
          throw new Error("This lot needs the lunar node; supply ChartPoints.northNode.");
        }
        return point === "NorthNode" ? points.northNode : normalizeDegrees(points.northNode + 180);
      }
      default: {
        throw new Error(`Unknown lot point: ${String(point)}`);
      }
    }
  }
  function compute(key, definition) {
    resolving.add(key);
    const sectDependent = definition.compute ? false : definition.night !== void 0;
    let longitude;
    if (definition.compute) {
      longitude = normalizeDegrees(definition.compute(pointValue, resolvedSect));
    } else {
      const formula = resolvedSect === "night" && definition.night ? definition.night : definition.day;
      longitude = normalizeDegrees(pointValue(formula.a) + pointValue(formula.b) - pointValue(formula.c));
    }
    const signIndex = Math.floor(longitude / 30);
    results[key] = {
      key,
      name: definition.name,
      longitude,
      signIndex,
      sign: SIGNS[signIndex],
      degreeInSign: longitude - signIndex * 30,
      sectUsed: resolvedSect,
      sectDependent,
      source: definition.source,
      ...definition.note ? { note: definition.note } : {}
    };
    resolving.delete(key);
  }
  for (const [key, definition] of Object.entries(definitions)) {
    if (!(key in results))
      compute(key, definition);
  }
  const requested = {};
  for (const key of Object.keys(definitions))
    requested[key] = results[key];
  return requested;
}
function normalizeSect(sect) {
  const value = typeof sect === "object" && sect !== null ? sect.sect : sect;
  if (value !== "day" && value !== "night") {
    throw new TypeError(`sect must be 'day' or 'night' (or the SectResult from determineSect()), received ${JSON.stringify(sect)}`);
  }
  return value;
}
var LOT_REQUIRED_BODIES = [
  Body2.Sun,
  Body2.Moon,
  Body2.Mercury,
  Body2.Venus,
  Body2.Mars,
  Body2.Jupiter,
  Body2.Saturn
];

// node_modules/@kuntay/swisseph/dist/derived/parans.js
var ANGLE_EVENTS = ["rise", "set", "culminate", "anticulminate"];
var MINUTES_PER_DAY = 1440;
function eventSeparationMinutes(a, b) {
  const raw = a - b;
  const wrapped = raw - Math.round(raw);
  return Math.abs(wrapped) * MINUTES_PER_DAY;
}
function findParans(objects, options = {}) {
  const maxOrbMinutes = options.orbMinutes ?? 30;
  const filter = options.onlyInvolving;
  const contacts = [];
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const a = objects[i];
      const b = objects[j];
      if (filter && !filter.includes(a.name) && !filter.includes(b.name))
        continue;
      for (const eventA of ANGLE_EVENTS) {
        const timeA = a.events[eventA];
        if (timeA === void 0)
          continue;
        for (const eventB of ANGLE_EVENTS) {
          const timeB = b.events[eventB];
          if (timeB === void 0)
            continue;
          const orbMinutes = eventSeparationMinutes(timeA, timeB);
          if (orbMinutes > maxOrbMinutes)
            continue;
          contacts.push({
            from: { name: a.name, event: eventA, jd: timeA },
            to: { name: b.name, event: eventB, jd: timeB },
            orbMinutes,
            maxOrbMinutes,
            strength: 1 - orbMinutes / maxOrbMinutes
          });
        }
      }
    }
  }
  return contacts.sort((x, y) => y.strength - x.strength);
}

// node_modules/@kuntay/swisseph/dist/derived/eclipses.js
function solarEclipseKind(flags) {
  if (flags & EclipseFlag.AnnularTotal)
    return "hybrid";
  if (flags & EclipseFlag.Total)
    return "total";
  if (flags & EclipseFlag.Annular)
    return "annular";
  return "partial";
}
function lunarEclipseKind(flags) {
  if (flags & EclipseFlag.Total)
    return "total";
  if (flags & EclipseFlag.Partial)
    return "partial";
  return "penumbral";
}
function optionalTime(value) {
  return value === 0 ? void 0 : value;
}

// node_modules/@kuntay/swisseph/dist/derived/heliacal.js
function atmosphereToArray(atmosphere = {}) {
  return [
    atmosphere.pressure ?? 0,
    atmosphere.temperature ?? 15,
    atmosphere.humidity ?? 40,
    atmosphere.visibilityRange ?? 40
  ];
}
function observerToArray(observer = {}) {
  return [
    observer.age ?? 36,
    observer.snellenRatio ?? 1,
    observer.binocular === false ? 0 : 1,
    observer.magnification ?? 1,
    observer.apertureMm ?? 0,
    observer.transmission ?? 0
  ];
}

// node_modules/@kuntay/swisseph/dist/types.js
var SwissEphError = class extends Error {
  fn;
  detail;
  constructor(message, fn, detail) {
    super(message);
    this.fn = fn;
    this.detail = detail;
    this.name = "SwissEphError";
  }
  /**
   * The `.se1` file the library could not find, when that is what failed.
   *
   * Null for every other error. Useful for deciding what to fetch and retry.
   */
  get missingFile() {
    const source = this.detail ?? this.message;
    return /SwissEph file '([^']+)' not found/.exec(source)?.[1] ?? null;
  }
};

// node_modules/@kuntay/swisseph/dist/instance.js
var DEFAULT_EPHE_PATH = "/ephe";
function writeDiagnostic(text) {
  const stderr = globalThis.process?.stderr;
  if (typeof stderr?.write === "function")
    stderr.write(`${text}
`);
  else
    console.error(text);
}
var ERROR_BUFFER_SIZE = 256;
var CUSPS_BUFFER_SIZE = 37;
var GAUQUELIN_SECTOR_COUNT = 36;
var HOUSE_COUNT = 12;
var ASCMC_BUFFER_SIZE = 10;
var isGauquelin = (system) => system.charAt(0).toUpperCase() === "G";
var SE_ECL2HOR = 0;
var RISE_TRANS_NO_EVENT = -2;
var ECLIPSE_TIMES_SIZE = 10;
var ECLIPSE_ATTR_SIZE = 20;
var HELIACAL_BUFFER_SIZE = 50;
var MEAN_RETURN_DAYS = {
  [Body2.Sun]: 365.2422,
  // tropik yıl
  [Body2.Moon]: 27.32158,
  // tropik ay
  [Body2.Mercury]: 87.969,
  [Body2.Venus]: 224.701,
  [Body2.Mars]: 686.98,
  [Body2.Jupiter]: 4332.589,
  [Body2.Saturn]: 10759.22,
  [Body2.Uranus]: 30685.4,
  [Body2.Neptune]: 60189,
  [Body2.Pluto]: 90560
};
var CROSSING_STEP_DEGREES = 2;
var CROSSING_MIN_STEP_DAYS = 5e-3;
var CROSSING_MAX_STEP_DAYS = 30;
var CROSSING_PRECISION_DAYS = 1e-7;
var CROSSING_MAX_SEARCH_DAYS = 73e3;
var signedDegrees = (degrees) => {
  const n = (degrees % 360 + 360) % 360;
  return n > 180 ? n - 360 : n;
};
var EPHEMERIS_FLAG = {
  swiss: Flag2.SwissEphemeris,
  moshier: Flag2.Moshier,
  jpl: Flag2.JplEphemeris
};
var MISSING_FILE = /SwissEph file '([^']+)' not found/;
function packageProviding(file) {
  if (/^se(pl|mo|as)m?\d*_?\d*\.se1$/.test(file) || file.endsWith(".txt")) {
    return "@kuntay/swisseph-data";
  }
  if (/^s\d/.test(file) || /^se\d/.test(file))
    return "@kuntay/swisseph-asteroids";
  return null;
}
function ephemerisError(serr, fn) {
  const file = serr ? MISSING_FILE.exec(serr)?.[1] : void 0;
  if (!serr || !file) {
    return new SwissEphError(serr ?? `${fn} failed`, fn);
  }
  const pkg = packageProviding(file);
  return new SwissEphError(`Ephemeris file '${file}' is not loaded. ` + (pkg ? `It ships in ${pkg}. ` : "") + `Load it with mountEphemeris({ '${file}': bytes }) or, under Node, mountEphemerisDirectory(dir). (The path in the underlying message is inside the WebAssembly filesystem, not on your disk.) Planets fall back to Moshier automatically; asteroids and fixed stars cannot, which is why this raised instead of degrading.`, fn, serr);
}
function ephemerisFromFlags(returnedFlags) {
  if (returnedFlags & Flag2.Moshier)
    return "moshier";
  if (returnedFlags & Flag2.JplEphemeris)
    return "jpl";
  return "swiss";
}
async function createSwissEph(options = {}) {
  const wasm = await swisseph_default({
    print: writeDiagnostic,
    printErr: writeDiagnostic
  });
  const bufPosition = wasm._malloc(6 * 8);
  const bufError = wasm._malloc(ERROR_BUFFER_SIZE);
  const bufName = wasm._malloc(ERROR_BUFFER_SIZE);
  const bufCusps = wasm._malloc(CUSPS_BUFFER_SIZE * 8);
  const bufCuspSpeed = wasm._malloc(CUSPS_BUFFER_SIZE * 8);
  const bufAscmc = wasm._malloc(ASCMC_BUFFER_SIZE * 8);
  const bufAscmcSpeed = wasm._malloc(ASCMC_BUFFER_SIZE * 8);
  const bufGeo = wasm._malloc(3 * 8);
  const bufHorIn = wasm._malloc(3 * 8);
  const bufHorOut = wasm._malloc(3 * 8);
  const bufTret = wasm._malloc(ECLIPSE_TIMES_SIZE * 8);
  const bufAttr = wasm._malloc(ECLIPSE_ATTR_SIZE * 8);
  const bufDatm = wasm._malloc(4 * 8);
  const bufDobs = wasm._malloc(6 * 8);
  const bufDret = wasm._malloc(HELIACAL_BUFFER_SIZE * 8);
  const bufObjectName = wasm._malloc(ERROR_BUFFER_SIZE);
  let disposed = false;
  const c = {
    calcUt: wasm.cwrap("swe_calc_ut", "number", ["number", "number", "number", "number", "number"]),
    julday: wasm.cwrap("swe_julday", "number", ["number", "number", "number", "number", "number"]),
    revjul: wasm.cwrap("swe_revjul", null, ["number", "number", "number", "number", "number", "number"]),
    deltatEx: wasm.cwrap("swe_deltat_ex", "number", ["number", "number", "number"]),
    housesEx2: wasm.cwrap("swe_houses_ex2", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ]),
    fixstar2: wasm.cwrap("swe_fixstar2", "number", ["number", "number", "number", "number", "number"]),
    getPlanetName: wasm.cwrap("swe_get_planet_name", "string", ["number", "number"]),
    setEphePath: wasm.cwrap("swe_set_ephe_path", null, ["string"]),
    setSidMode: wasm.cwrap("swe_set_sid_mode", null, ["number", "number", "number"]),
    setTopo: wasm.cwrap("swe_set_topo", null, ["number", "number", "number"]),
    getAyanamsaExUt: wasm.cwrap("swe_get_ayanamsa_ex_ut", "number", ["number", "number", "number", "number"]),
    azalt: wasm.cwrap("swe_azalt", null, ["number", "number", "number", "number", "number", "number", "number"]),
    riseTrans: wasm.cwrap("swe_rise_trans", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ]),
    solcrossUt: wasm.cwrap("swe_solcross_ut", "number", ["number", "number", "number", "number"]),
    mooncrossUt: wasm.cwrap("swe_mooncross_ut", "number", ["number", "number", "number", "number"]),
    solEclipseWhenGlob: wasm.cwrap("swe_sol_eclipse_when_glob", "number", ["number", "number", "number", "number", "number", "number"]),
    solEclipseWhenLoc: wasm.cwrap("swe_sol_eclipse_when_loc", "number", ["number", "number", "number", "number", "number", "number", "number"]),
    lunEclipseWhen: wasm.cwrap("swe_lun_eclipse_when", "number", ["number", "number", "number", "number", "number", "number"]),
    lunEclipseWhenLoc: wasm.cwrap("swe_lun_eclipse_when_loc", "number", ["number", "number", "number", "number", "number", "number", "number"]),
    heliacalUt: wasm.cwrap("swe_heliacal_ut", "number", [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ]),
    version: wasm.cwrap("swe_version", "string", ["number"]),
    close: wasm.cwrap("swe_close", null, [])
  };
  const readDoubles = (ptr, n) => Array.from({ length: n }, (_, i) => wasm.getValue(ptr + i * 8, "double"));
  const readError = () => {
    const s = wasm.UTF8ToString(bufError);
    return s && s.length ? s : null;
  };
  const writeDoubles = (ptr, values) => {
    values.forEach((v, i) => wasm.setValue(ptr + i * 8, v, "double"));
  };
  const zeroDoubles = (ptr, n) => {
    for (let i = 0; i < n; i++)
      wasm.setValue(ptr + i * 8, 0, "double");
  };
  const writeGeo = (place) => {
    writeDoubles(bufGeo, [place.longitude, place.latitude, place.altitude ?? 0]);
  };
  const assertLive = () => {
    if (disposed) {
      throw new SwissEphError("This instance has been disposed.", "createSwissEph");
    }
  };
  function mountFiles(files, dir = DEFAULT_EPHE_PATH) {
    try {
      wasm.FS.mkdir(dir);
    } catch {
    }
    let bytes = 0;
    for (const [name, content] of Object.entries(files)) {
      const data = content instanceof Uint8Array ? content : new Uint8Array(content);
      wasm.FS.writeFile(`${dir}/${name}`, data);
      bytes += data.byteLength;
    }
    c.setEphePath(dir);
    return bytes;
  }
  function returnOf(body, natalJd, options2 = {}) {
    const after = options2.after ?? natalJd;
    const natalLongitude = api.calc(natalJd, body, options2).longitude;
    if (!options2.precessionCorrected) {
      return {
        jd: api.nextCrossing(body, natalLongitude, after, options2),
        targetLongitude: natalLongitude,
        natalLongitude,
        precessionCorrected: false
      };
    }
    const natalAyanamsa = api.ayanamsa(natalJd, options2.ephemeris);
    let target = natalLongitude;
    let jd = after;
    for (let i = 0; i < 3; i++) {
      jd = api.nextCrossing(body, target, after, options2);
      const refined = natalLongitude + (api.ayanamsa(jd, options2.ephemeris) - natalAyanamsa);
      const converged = Math.abs(refined - target) < 1e-9;
      target = refined;
      if (converged)
        break;
    }
    return {
      jd: api.nextCrossing(body, target, after, options2),
      targetLongitude: target,
      natalLongitude,
      precessionCorrected: true
    };
  }
  if (options.files)
    mountFiles(options.files, options.ephemerisPath);
  else if (options.ephemerisPath)
    c.setEphePath(options.ephemerisPath);
  const api = {
    /** The vendored Swiss Ephemeris version, e.g. `"2.10.03"`. */
    get version() {
      assertLive();
      return c.version(bufName);
    },
    /** Direct access to the Emscripten module. An escape hatch; prefer the API. */
    get raw() {
      return wasm;
    },
    // --- tarih ------------------------------------------------------------
    /**
     * Calendar date to Julian day. The hour is read as Universal Time.
     * @param hour decimal hour, e.g. 14.5 = 14:30
     */
    julianDay(year, month, day, hour = 0, calendar = Calendar2.Gregorian) {
      assertLive();
      return c.julday(year, month, day, hour, calendar);
    },
    /** Julian day back to a calendar date. The inverse of `julianDay()`. */
    calendarDate(jd, calendar = Calendar2.Gregorian) {
      assertLive();
      const y = bufCusps, m = bufCusps + 4, d = bufCusps + 8, h = bufCusps + 16;
      c.revjul(jd, calendar, y, m, d, h);
      return {
        year: wasm.getValue(y, "i32"),
        month: wasm.getValue(m, "i32"),
        day: wasm.getValue(d, "i32"),
        hour: wasm.getValue(h, "double")
      };
    },
    /** ΔT (TT − UT) in days. */
    deltaT(jd, ephemeris = "swiss") {
      assertLive();
      return c.deltatEx(jd, EPHEMERIS_FLAG[ephemeris], bufError);
    },
    // --- konumlar ---------------------------------------------------------
    /**
     * A body's position, for a moment given in Universal Time.
     *
     * Check the `ephemeris` field on the result: when Swiss Ephemeris cannot
     * find the `.se1` file you asked for, it falls back to Moshier without
     * raising an error.
     */
    calc(jd, body, options2 = {}) {
      assertLive();
      const source = options2.ephemeris ?? "swiss";
      const flags = EPHEMERIS_FLAG[source] | Flag2.Speed | (options2.flags ?? 0);
      wasm.setValue(bufError, 0, "i8");
      const ret = c.calcUt(jd, body, flags, bufPosition, bufError);
      const message = readError();
      if (ret < 0) {
        throw ephemerisError(message, "swe_calc_ut");
      }
      const [longitude, latitude, distance, longitudeSpeed, latitudeSpeed, distanceSpeed] = readDoubles(bufPosition, 6);
      return {
        longitude,
        latitude,
        distance,
        longitudeSpeed,
        latitudeSpeed,
        distanceSpeed,
        ephemeris: ephemerisFromFlags(ret),
        warning: message
      };
    },
    /** `calc()` plus sign, degree-in-sign and retrograde state. */
    calcWithSign(jd, body, options2 = {}) {
      const p = api.calc(jd, body, options2);
      const normalized = (p.longitude % 360 + 360) % 360;
      const signIndex = Math.floor(normalized / 30);
      return {
        ...p,
        signIndex,
        sign: SIGNS[signIndex],
        degreeInSign: normalized - signIndex * 30,
        retrograde: p.longitudeSpeed < 0
      };
    },
    /** The body's name, e.g. `Body.Chiron` gives `"Chiron"`. */
    planetName(body) {
      assertLive();
      return c.getPlanetName(body, bufName);
    },
    /**
     * A fixed star's position.
     * @param name traditional name (`"Aldebaran"`) or Bayer designation (`",alTau"`)
     */
    fixedStar(name, jd, options2 = {}) {
      assertLive();
      const source = options2.ephemeris ?? "swiss";
      const flags = EPHEMERIS_FLAG[source] | Flag2.Speed | (options2.flags ?? 0);
      wasm.stringToUTF8(name, bufName, ERROR_BUFFER_SIZE);
      wasm.setValue(bufError, 0, "i8");
      const ret = c.fixstar2(bufName, jd, flags, bufPosition, bufError);
      const message = readError();
      if (ret < 0) {
        if (message && MISSING_FILE.test(message)) {
          throw ephemerisError(message, "swe_fixstar2");
        }
        throw new SwissEphError(message ?? `Fixed star not found: ${name}`, "swe_fixstar2");
      }
      const [longitude, latitude, distance, longitudeSpeed, latitudeSpeed, distanceSpeed] = readDoubles(bufPosition, 6);
      return {
        longitude,
        latitude,
        distance,
        longitudeSpeed,
        latitudeSpeed,
        distanceSpeed,
        ephemeris: ephemerisFromFlags(ret),
        warning: message,
        resolvedName: wasm.UTF8ToString(bufName)
      };
    },
    // --- evler ------------------------------------------------------------
    /**
     * House cusps and angles.
     *
     * Several house systems are undefined beyond the polar circle and Swiss
     * Ephemeris substitutes Porphyry there. That is reported as
     * `substituted` rather than thrown — see {@link Houses}.
     *
     * `cusps.length` is 12 for every system except `HouseSystem.GauquelinSectors`
     * (`'G'`), which gives 36 — do not assume twelve.
     *
     * @param latitude  geographic latitude, north positive
     * @param longitude geographic longitude, east positive
     */
    houses(jd, latitude, longitude, system = HouseSystem2.Placidus, options2 = {}) {
      assertLive();
      const flags = options2.flags ?? 0;
      wasm.setValue(bufError, 0, "i8");
      const gauquelin = isGauquelin(system);
      const writeCount = gauquelin ? CUSPS_BUFFER_SIZE : HOUSE_COUNT + 1;
      for (let i = 0; i < writeCount; i++) {
        wasm.setValue(bufCusps + i * 8, 0, "double");
      }
      const ret = c.housesEx2(jd, flags, latitude, longitude, system.charCodeAt(0), bufCusps, bufAscmc, bufCuspSpeed, bufAscmcSpeed, bufError);
      const message = readError();
      const cuspCount = gauquelin && ret >= 0 ? GAUQUELIN_SECTOR_COUNT : HOUSE_COUNT;
      const raw = readDoubles(bufCusps, cuspCount + 1);
      const ascmc = readDoubles(bufAscmc, ASCMC.Count);
      const cusps = raw.slice(1, cuspCount + 1);
      const filled = cusps.some((cusp) => cusp !== 0);
      if (ret < 0 && !filled) {
        throw new SwissEphError(message ?? `Could not compute house system '${system}'`, "swe_houses_ex2");
      }
      const halfTurn = flags & Flag2.Radians ? Math.PI : 180;
      const opposite = (angle) => ((angle + halfTurn) % (halfTurn * 2) + halfTurn * 2) % (halfTurn * 2);
      return {
        cusps,
        requestedSystem: system,
        substituted: ret < 0,
        ascendant: ascmc[ASCMC.Ascendant],
        midheaven: ascmc[ASCMC.Midheaven],
        descendant: opposite(ascmc[ASCMC.Ascendant]),
        imumCoeli: opposite(ascmc[ASCMC.Midheaven]),
        armc: ascmc[ASCMC.Armc],
        vertex: ascmc[ASCMC.Vertex],
        equatorialAscendant: ascmc[ASCMC.EquatorialAscendant],
        coAscendantKoch: ascmc[ASCMC.CoAscendantKoch],
        coAscendantMunkasey: ascmc[ASCMC.CoAscendantMunkasey],
        polarAscendant: ascmc[ASCMC.PolarAscendant],
        warning: message
      };
    },
    // --- türetilmiş hesaplar ----------------------------------------------
    /**
     * Sect, chart points and Arabic lots for a birth moment and place.
     *
     * Gathers the positions the lots need, determines the sect, and resolves
     * the lots in dependency order — several are defined in terms of others.
     *
     * ```ts
     * const { sect, lots } = swe.lots(jd, { latitude: 39.93, longitude: 32.86 });
     * lots.Fortune.degreeInSign;
     * ```
     */
    lots(jd, options2) {
      assertLive();
      const { latitude, longitude, houseSystem = HouseSystem2.Placidus } = options2;
      const houses = api.houses(jd, latitude, longitude, houseSystem, options2.calcOptions);
      const at = (body) => api.calc(jd, body, options2.calcOptions).longitude;
      const points = {
        ascendant: houses.ascendant,
        midheaven: houses.midheaven,
        sun: at(Body2.Sun),
        moon: at(Body2.Moon),
        mercury: at(Body2.Mercury),
        venus: at(Body2.Venus),
        mars: at(Body2.Mars),
        jupiter: at(Body2.Jupiter),
        saturn: at(Body2.Saturn),
        northNode: at(Body2.NorthNodeTrue)
      };
      const detected = api.sect(jd, latitude, longitude, options2.sectOptions);
      const sectResult = options2.sect ? { ...detected, sect: options2.sect, overridden: options2.sect !== detected.sect } : { ...detected, overridden: false };
      return {
        sect: sectResult,
        points,
        lots: calculateLots(points, sectResult.sect, options2.definitions)
      };
    },
    /**
     * A body's horizon coordinates.
     *
     * @returns `azimuth` measured from south towards west;
     *          `altitude`, the true (unrefracted) height;
     *          `apparentAltitude`, with atmospheric refraction applied
     */
    horizontal(jd, body, latitude, longitude, altitudeMetres = 0, options2 = {}) {
      assertLive();
      const position = api.calc(jd, body, options2);
      wasm.setValue(bufGeo, longitude, "double");
      wasm.setValue(bufGeo + 8, latitude, "double");
      wasm.setValue(bufGeo + 16, altitudeMetres, "double");
      wasm.setValue(bufHorIn, position.longitude, "double");
      wasm.setValue(bufHorIn + 8, position.latitude, "double");
      wasm.setValue(bufHorIn + 16, position.distance, "double");
      c.azalt(jd, SE_ECL2HOR, bufGeo, 0, 0, bufHorIn, bufHorOut);
      const [azimuth, altitude, apparentAltitude] = readDoubles(bufHorOut, 3);
      return { azimuth, altitude, apparentAltitude };
    },
    /**
     * Whether the chart is diurnal or nocturnal.
     *
     * Most Arabic lots and much of traditional dignity depend on this; get it
     * wrong and the results are quietly wrong rather than obviously so.
     *
     * The default uses the Sun's **true altitude**. The traditional ascendant
     * shortcut (`method: 'ascendant'`) agrees exactly up to the polar circle
     * and then breaks down — at 70° latitude it can report "night" with the
     * Sun 11° above the horizon. See `derived/sect.ts`.
     *
     * The `borderline` field marks charts where the Sun is within a degree of
     * the horizon, so a minute of uncertainty in the birth time could flip
     * the answer.
     */
    sect(jd, latitude, longitude, options2 = {}) {
      assertLive();
      const sun = api.calc(jd, Body2.Sun);
      if (options2.method === "ascendant") {
        const houses = api.houses(jd, latitude, longitude, options2.houseSystem ?? HouseSystem2.Placidus);
        return determineSect(sun.longitude, houses.ascendant, options2);
      }
      const { altitude } = api.horizontal(jd, Body2.Sun, latitude, longitude);
      return determineSect(sun.longitude, 0, {
        ...options2,
        method: "altitude",
        sunAltitude: altitude
      });
    },
    // --- deklinasyon ------------------------------------------------------
    /**
     * A body's position in equatorial coordinates.
     *
     * The same call as {@link calc} with `Flag.Equatorial`, but with the
     * fields named for what they hold. Under that flag Swiss Ephemeris
     * returns right ascension where longitude normally sits and declination
     * where latitude sits, which is easy to misread.
     */
    equatorial(jd, body, options2 = {}) {
      const p = api.calc(jd, body, {
        ...options2,
        flags: (options2.flags ?? 0) | Flag2.Equatorial
      });
      return {
        rightAscension: p.longitude,
        declination: p.latitude,
        distance: p.distance,
        rightAscensionSpeed: p.longitudeSpeed,
        declinationSpeed: p.latitudeSpeed,
        distanceSpeed: p.distanceSpeed,
        ephemeris: p.ephemeris,
        warning: p.warning
      };
    },
    /**
     * Obliquity of the ecliptic and the nutation at a moment.
     *
     * Needed for out-of-bounds work: the limit a body has to pass is the
     * obliquity, which drifts by about 47 arcseconds per century. Using the
     * J2000 constant instead flips the verdict for any body sitting within
     * a tenth of a degree of the boundary.
     */
    obliquity(jd, options2 = {}) {
      assertLive();
      wasm.setValue(bufError, 0, "i8");
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0);
      const ret = c.calcUt(jd, EclipticNutationId, flags, bufPosition, bufError);
      if (ret < 0) {
        throw new SwissEphError(readError() ?? "swe_calc_ut failed", "swe_calc_ut");
      }
      const [trueObliquity, meanObliquity, nutationInLongitude, nutationInObliquity] = readDoubles(bufPosition, 4);
      return { trueObliquity, meanObliquity, nutationInLongitude, nutationInObliquity };
    },
    /**
     * Declinations for a set of bodies, ready for
     * `findDeclinationAspects()` and `outOfBounds()`.
     *
     * ```ts
     * const points = swe.declinations(jd, [Body.Sun, Body.Moon, Body.Venus]);
     * const parallels = findDeclinationAspects(points);
     * const oob = outOfBounds(points, swe.obliquity(jd).trueObliquity);
     * ```
     */
    declinations(jd, bodies, options2 = {}) {
      return bodies.map((body) => {
        const eq = api.equatorial(jd, body, options2);
        return {
          name: api.planetName(body),
          body,
          declination: eq.declination,
          speed: eq.declinationSpeed
        };
      });
    },
    // --- doğuş, batış, kültminasyon ---------------------------------------
    /**
     * When a body or star next reaches one of the four angles.
     *
     * @param target a body constant, or a fixed star name
     * @param event  one of `RiseTransit.Rise`, `.Set`, `.UpperCulmination`,
     *               `.LowerCulmination`, optionally OR'd with the
     *               `RiseTransit` modifier bits
     *
     * A circumpolar object never rises or sets. That is not an error, and it
     * is reported as `occurs: false` rather than thrown — a chart at 70° N
     * has bodies in exactly that state and should still compute.
     */
    riseTransit(jd, target, place, event = RiseTransit.Rise, options2 = {}) {
      assertLive();
      const isStar = typeof target === "string";
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0);
      if (isStar)
        wasm.stringToUTF8(target, bufObjectName, ERROR_BUFFER_SIZE);
      writeGeo(place);
      wasm.setValue(bufError, 0, "i8");
      zeroDoubles(bufTret, 1);
      const ret = c.riseTrans(jd, isStar ? 0 : target, isStar ? bufObjectName : 0, flags, event, bufGeo, options2.pressure ?? 0, options2.temperature ?? 0, bufTret, bufError);
      if (ret === RISE_TRANS_NO_EVENT)
        return { jd: null, occurs: false };
      if (ret < 0) {
        throw new SwissEphError(readError() ?? "swe_rise_trans failed", "swe_rise_trans");
      }
      return { jd: wasm.getValue(bufTret, "double"), occurs: true };
    },
    /**
     * All four angle times for each object, the input parans need.
     *
     * Each event is the *next* occurrence at or after `jd`, so the four times
     * span roughly one rotation. Objects that never cross the horizon are
     * marked `circumpolar` or `neverRises` and still report their
     * culminations, which is what makes a paran with a circumpolar star
     * possible at all.
     */
    angleEvents(jd, targets, place, options2 = {}) {
      assertLive();
      const bits = {
        rise: RiseTransit.Rise,
        set: RiseTransit.Set,
        culminate: RiseTransit.UpperCulmination,
        anticulminate: RiseTransit.LowerCulmination
      };
      return targets.map((target) => {
        const isStar = typeof target === "string";
        const events = {};
        for (const event of ANGLE_EVENTS) {
          const r = api.riseTransit(jd, target, place, bits[event], options2);
          if (r.occurs && r.jd !== null)
            events[event] = r.jd;
        }
        const entry = {
          name: isStar ? target : api.planetName(target),
          ...isStar ? { star: target } : { body: target },
          events
        };
        if (events.rise === void 0 && events.set === void 0) {
          const declination = isStar ? api.fixedStar(target, jd, {
            ...options2,
            flags: (options2.flags ?? 0) | Flag2.Equatorial
          }).latitude : api.equatorial(jd, target, options2).declination;
          const limit = 90 - Math.abs(place.latitude);
          const signed = declination * Math.sign(place.latitude || 1);
          if (signed > limit)
            entry.circumpolar = true;
          else if (signed < -limit)
            entry.neverRises = true;
        }
        return entry;
      });
    },
    /**
     * Parans between a set of objects at a place.
     *
     * A convenience over {@link angleEvents} and `findParans()`; reach for
     * those two directly when you want to reuse the event times.
     *
     * ```ts
     * const contacts = swe.parans(jd, [Body.Sun, Body.Mars, 'Sirius'],
     *   { latitude: 39.93, longitude: 32.86 }, { orbMinutes: 20 });
     * ```
     */
    parans(jd, targets, place, options2 = {}) {
      return findParans(api.angleEvents(jd, targets, place, options2), options2);
    },
    // --- dönüşler ---------------------------------------------------------
    /**
     * The next time a body reaches a given longitude.
     *
     * The Sun and Moon use Swiss Ephemeris's own crossing routines. Everything
     * else is found by stepping and then bisecting.
     *
     * Two things to know about the general case. A planet near a station can
     * cross the same longitude three times, and this returns the **first**.
     * And a stepped search can in principle skip a pair of crossings that both
     * fall inside one step — possible only when a station sits within about
     * two degrees of the target.
     *
     * @param afterJd the search starts here and always moves forward; a
     *                crossing exactly at `afterJd` is skipped, so calling this
     *                repeatedly walks through successive crossings
     */
    nextCrossing(body, targetLongitude, afterJd, options2 = {}) {
      assertLive();
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0);
      const period = MEAN_RETURN_DAYS[body];
      const dedicated = body === Body2.Sun ? c.solcrossUt : body === Body2.Moon ? c.mooncrossUt : null;
      if (dedicated && !options2.forceSearch) {
        const fnName = body === Body2.Sun ? "swe_solcross_ut" : "swe_mooncross_ut";
        wasm.setValue(bufError, 0, "i8");
        let t = dedicated(targetLongitude, afterJd, flags, bufError);
        if (t < afterJd) {
          throw new SwissEphError(readError() ?? `${fnName} failed`, fnName);
        }
        if (t <= afterJd + CROSSING_PRECISION_DAYS) {
          t = dedicated(targetLongitude, afterJd + period / 1e3, flags, bufError);
          if (t < afterJd) {
            throw new SwissEphError(readError() ?? `${fnName} failed`, fnName);
          }
        }
        return t;
      }
      const calcOptions = { ...options2, flags: options2.flags };
      const at = (t) => api.calc(t, body, calcOptions);
      const delta = (t) => signedDegrees(at(t).longitude - targetLongitude);
      const start = at(afterJd);
      const meanSpeed = period ? 360 / period : Math.max(Math.abs(start.longitudeSpeed), 360 / CROSSING_MAX_SEARCH_DAYS);
      const maxDays = options2.maxDays ?? Math.min(1.5 * (360 / meanSpeed), CROSSING_MAX_SEARCH_DAYS);
      const step = Math.min(Math.max(CROSSING_STEP_DEGREES / meanSpeed, CROSSING_MIN_STEP_DAYS), CROSSING_MAX_STEP_DAYS);
      let lo = afterJd;
      let dLo = signedDegrees(start.longitude - targetLongitude);
      if (Math.abs(dLo) < 1e-9) {
        lo = afterJd + step;
        dLo = delta(lo);
      }
      while (lo - afterJd < maxDays) {
        const hi = lo + step;
        const dHi = delta(hi);
        if (dLo < 0 !== dHi < 0 && Math.abs(dLo - dHi) < 180) {
          let a = lo, b = hi, dA = dLo;
          while (b - a > CROSSING_PRECISION_DAYS) {
            const mid = (a + b) / 2;
            const dMid = delta(mid);
            if (dMid === 0)
              return mid;
            if (dA < 0 === dMid < 0) {
              a = mid;
              dA = dMid;
            } else {
              b = mid;
            }
          }
          return (a + b) / 2;
        }
        lo = hi;
        dLo = dHi;
      }
      throw new SwissEphError(`${api.planetName(body)} did not cross ${targetLongitude.toFixed(4)}\xB0 within ${maxDays.toFixed(0)} days. Pass a larger maxDays to search further.`, "nextCrossing");
    },
    /**
     * Solar return: when the Sun comes back to its natal longitude.
     *
     * Set `precessionCorrected` to return to the same **sidereal** longitude
     * instead. The two disagree by the precession accumulated since birth —
     * roughly a day of Sun motion after thirty years — and which one is
     * correct is a live disagreement between practitioners, not a detail.
     *
     * The correction is measured with whatever sidereal mode the instance
     * currently has, since it is the *change* in ayanamsa that matters and
     * the constant offset cancels. Rates do differ slightly between models
     * though: about one arcsecond per year, which after thirty years moves
     * the corrected return by a quarter of an hour. Call `setSiderealMode()`
     * first if your tradition specifies one.
     *
     * ```ts
     * const { jd } = swe.solarReturn(natalJd, { after: swe.julianDay(2026, 1, 1) });
     * const chart = swe.houses(jd, 39.93, 32.86);
     * ```
     */
    solarReturn(natalJd, options2 = {}) {
      return returnOf(Body2.Sun, natalJd, options2);
    },
    /**
     * Lunar return: when the Moon comes back to its natal longitude.
     * Roughly every 27.3 days. `precessionCorrected` works as for the solar
     * return, though over one month the correction is negligible.
     */
    lunarReturn(natalJd, options2 = {}) {
      return returnOf(Body2.Moon, natalJd, options2);
    },
    /**
     * A return of any body to its natal longitude — Mars returns, Saturn
     * returns, and so on. Slow bodies need a wide search; see
     * {@link nextCrossing} for what `maxDays` does.
     */
    returnOf(body, natalJd, options2 = {}) {
      return returnOf(body, natalJd, options2);
    },
    // --- tutulmalar -------------------------------------------------------
    /**
     * The next solar eclipse.
     *
     * With no `place`, the search is global — the next eclipse anywhere,
     * optionally filtered to a type. With a `place`, it is the next eclipse
     * *visible from there*, and the result carries magnitude, obscuration and
     * the Sun's altitude at maximum.
     *
     * The two searches also return different timings, which is why they are
     * mapped to named fields here: what the C API calls `tret[4]` is the
     * start of totality in one and the fourth contact in the other.
     */
    solarEclipse(afterJd, options2 = {}) {
      assertLive();
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0);
      const backward = options2.backward ? 1 : 0;
      if (options2.place && options2.type !== void 0) {
        throw new SwissEphError("swe_sol_eclipse_when_loc takes no type filter. Passing `type` together with `place` would be silently ignored; filter the result yourself, or drop `place` to search globally.", "solarEclipse");
      }
      wasm.setValue(bufError, 0, "i8");
      zeroDoubles(bufTret, ECLIPSE_TIMES_SIZE);
      zeroDoubles(bufAttr, ECLIPSE_ATTR_SIZE);
      if (options2.place) {
        writeGeo(options2.place);
        const ret2 = c.solEclipseWhenLoc(afterJd, flags, bufGeo, bufTret, bufAttr, backward, bufError);
        if (ret2 < 0) {
          throw new SwissEphError(readError() ?? "swe_sol_eclipse_when_loc failed", "swe_sol_eclipse_when_loc");
        }
        const t2 = readDoubles(bufTret, ECLIPSE_TIMES_SIZE);
        const a = readDoubles(bufAttr, ECLIPSE_ATTR_SIZE);
        return {
          kind: solarEclipseKind(ret2),
          central: (ret2 & EclipseFlag.Central) !== 0,
          flags: ret2,
          timings: {
            maximum: t2[0],
            partialBegin: optionalTime(t2[1]),
            // birinci temas
            totalityBegin: optionalTime(t2[2]),
            // ikinci temas
            totalityEnd: optionalTime(t2[3]),
            // üçüncü temas
            partialEnd: optionalTime(t2[4]),
            // dördüncü temas
            sunrise: optionalTime(t2[5]),
            sunset: optionalTime(t2[6])
          },
          local: {
            magnitude: a[0],
            diameterRatio: a[1],
            obscuration: a[2],
            coreShadowKm: a[3],
            azimuth: a[4],
            altitude: a[5],
            apparentAltitude: a[6],
            nasaMagnitude: a[8],
            saros: a[9],
            sarosMember: a[10],
            visible: (ret2 & EclipseFlag.Visible) !== 0
          }
        };
      }
      const ret = c.solEclipseWhenGlob(afterJd, flags, options2.type ?? 0, bufTret, backward, bufError);
      if (ret < 0) {
        throw new SwissEphError(readError() ?? "swe_sol_eclipse_when_glob failed", "swe_sol_eclipse_when_glob");
      }
      const t = readDoubles(bufTret, ECLIPSE_TIMES_SIZE);
      return {
        kind: solarEclipseKind(ret),
        central: (ret & EclipseFlag.Central) !== 0,
        flags: ret,
        timings: {
          maximum: t[0],
          localNoon: optionalTime(t[1]),
          partialBegin: optionalTime(t[2]),
          partialEnd: optionalTime(t[3]),
          totalityBegin: optionalTime(t[4]),
          totalityEnd: optionalTime(t[5]),
          centreLineBegin: optionalTime(t[6]),
          centreLineEnd: optionalTime(t[7])
        }
      };
    },
    /**
     * The next lunar eclipse. With a `place`, the next one visible from
     * there, carrying umbral and penumbral magnitude and the Moon's altitude.
     *
     * Note that `place.altitude` is validated by Swiss Ephemeris and an
     * implausible height is rejected outright rather than clamped.
     */
    lunarEclipse(afterJd, options2 = {}) {
      assertLive();
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0);
      const backward = options2.backward ? 1 : 0;
      if (options2.place && options2.type !== void 0) {
        throw new SwissEphError("swe_lun_eclipse_when_loc takes no type filter; passing `type` for a local search would be silently ignored.", "lunarEclipse");
      }
      wasm.setValue(bufError, 0, "i8");
      zeroDoubles(bufTret, ECLIPSE_TIMES_SIZE);
      zeroDoubles(bufAttr, ECLIPSE_ATTR_SIZE);
      const ret = options2.place ? (writeGeo(options2.place), c.lunEclipseWhenLoc(afterJd, flags, bufGeo, bufTret, bufAttr, backward, bufError)) : c.lunEclipseWhen(afterJd, flags, options2.type ?? 0, bufTret, backward, bufError);
      if (ret < 0) {
        const fn = options2.place ? "swe_lun_eclipse_when_loc" : "swe_lun_eclipse_when";
        throw new SwissEphError(readError() ?? `${fn} failed`, fn);
      }
      const t = readDoubles(bufTret, ECLIPSE_TIMES_SIZE);
      const eclipse = {
        kind: lunarEclipseKind(ret),
        flags: ret,
        timings: {
          maximum: t[0],
          partialBegin: optionalTime(t[2]),
          partialEnd: optionalTime(t[3]),
          totalityBegin: optionalTime(t[4]),
          totalityEnd: optionalTime(t[5]),
          penumbralBegin: optionalTime(t[6]),
          penumbralEnd: optionalTime(t[7]),
          moonrise: optionalTime(t[8]),
          moonset: optionalTime(t[9])
        }
      };
      if (options2.place) {
        const a = readDoubles(bufAttr, ECLIPSE_ATTR_SIZE);
        eclipse.local = {
          magnitude: a[0],
          penumbralMagnitude: a[1],
          azimuth: a[4],
          altitude: a[5],
          apparentAltitude: a[6],
          saros: a[9],
          sarosMember: a[10],
          visible: (ret & EclipseFlag.Visible) !== 0
        };
      }
      return eclipse;
    },
    // --- heliacal ---------------------------------------------------------
    /**
     * The next heliacal event for an object — its first or last visible
     * appearance in the twilight.
     *
     * Unlike the rest of this library the answer depends on the atmosphere
     * and on the observer's eyesight, so it carries assumptions. Both are
     * typed and defaulted explicitly; see `Atmosphere` and `Observer`.
     *
     * `HeliacalEvent.EveningFirst` and `.MorningLast` apply only to the Moon
     * and the inner planets. `.AcronychalRising` and `.AcronychalSetting` are
     * declared upstream but not implemented.
     *
     * ```ts
     * const { visibilityBegin } = swe.heliacal(
     *   swe.julianDay(-3000, 7, 1), 'Sirius',
     *   { latitude: 30.0, longitude: 31.2, altitude: 20 },
     *   HeliacalEvent.HeliacalRising,
     * );
     * ```
     */
    heliacal(afterJd, object, place, event, options2 = {}) {
      assertLive();
      const flags = EPHEMERIS_FLAG[options2.ephemeris ?? "swiss"] | (options2.flags ?? 0) | (options2.heliacalFlags ?? 0);
      writeGeo(place);
      writeDoubles(bufDatm, atmosphereToArray(options2.atmosphere));
      writeDoubles(bufDobs, observerToArray(options2.observer));
      wasm.stringToUTF8(object, bufObjectName, ERROR_BUFFER_SIZE);
      wasm.setValue(bufError, 0, "i8");
      zeroDoubles(bufDret, 3);
      const ret = c.heliacalUt(afterJd, bufGeo, bufDatm, bufDobs, bufObjectName, event, flags, bufDret, bufError);
      if (ret < 0) {
        throw new SwissEphError(readError() ?? "swe_heliacal_ut failed", "swe_heliacal_ut");
      }
      const [visibilityBegin, optimum, visibilityEnd] = readDoubles(bufDret, 3);
      return {
        visibilityBegin,
        // Arcus visionis yönteminde SE bu ikisini sıfır bırakıyor.
        optimum: optionalTime(optimum),
        visibilityEnd: optionalTime(visibilityEnd),
        event,
        object: wasm.UTF8ToString(bufObjectName)
      };
    },
    // --- ayarlar ----------------------------------------------------------
    /**
     * Sets the sidereal (nirayana) mode, used together with `Flag.Sidereal`.
     * The setting is instance-wide — precisely why instances are isolated.
     */
    setSiderealMode(ayanamsa, t0 = 0, ayanT0 = 0) {
      assertLive();
      c.setSidMode(ayanamsa, t0, ayanT0);
    },
    /** The ayanamsa for a moment, in degrees. */
    ayanamsa(jd, ephemeris = "swiss") {
      assertLive();
      wasm.setValue(bufError, 0, "i8");
      const ret = c.getAyanamsaExUt(jd, EPHEMERIS_FLAG[ephemeris], bufPosition, bufError);
      if (ret < 0) {
        throw new SwissEphError(readError() ?? "swe_get_ayanamsa_ex_ut failed", "swe_get_ayanamsa_ex_ut");
      }
      return wasm.getValue(bufPosition, "double");
    },
    /** Sets the observer's place for topocentric positions, with `Flag.Topocentric`. */
    setTopocentric(longitude, latitude, altitudeMetres = 0) {
      assertLive();
      c.setTopo(longitude, latitude, altitudeMetres);
    },
    /** Sets the search path for ephemeris files. */
    setEphemerisPath(path) {
      assertLive();
      c.setEphePath(path);
    },
    /**
     * Writes ephemeris files into the virtual filesystem and sets the path.
     * @returns total bytes written
     */
    mountEphemeris(files, dir = DEFAULT_EPHE_PATH) {
      assertLive();
      return mountFiles(files, dir);
    },
    /**
     * Fetches and mounts the files a given date range needs.
     *
     * Files must be loaded **before** any calculation: Swiss Ephemeris reads
     * them synchronously on the C side, and there is no way to await a fetch
     * in the middle of one. Because the file a date needs is computable from
     * the date (see `ephemeris/files.ts`), only the necessary files are
     * downloaded.
     *
     * A file that cannot be found is not an error — Swiss Ephemeris falls
     * back to Moshier for that range. The result reports what was loaded and
     * what was missing.
     *
     * ```ts
     * const swe = await createSwissEph();
     * await swe.loadEphemeris(new FetchEphemeris(), {
     *   fromYear: 1900, toYear: 2100, fixedStars: true,
     * });
     * ```
     */
    async loadEphemeris(source, range, dir = DEFAULT_EPHE_PATH) {
      assertLive();
      const wanted = requiredEphemerisFiles(range);
      const results = await Promise.all(wanted.map(async (name) => [name, await source.read(name)]));
      const files = {};
      const loaded = [];
      const missing = [];
      for (const [name, content] of results) {
        if (content) {
          files[name] = content;
          loaded.push(name);
        } else
          missing.push(name);
      }
      const bytes = mountFiles(files, dir);
      return { loaded, missing, bytes };
    },
    /**
     * Node only: mounts a real directory with **no copying**.
     *
     * `mountEphemeris()` copies files into memory, and since isolation means
     * one WebAssembly instance per `createSwissEph()`, that is 2 MB per
     * instance. Under NODEFS the same directory is shared by all of them,
     * which is what a server should use.
     *
     * Throws in a browser; use `loadEphemeris()` there.
     */
    mountEphemerisDirectory(hostDirectory, dir = DEFAULT_EPHE_PATH) {
      assertLive();
      const NODEFS = wasm.NODEFS;
      if (!NODEFS) {
        throw new SwissEphError("NODEFS is unavailable \u2014 mountEphemerisDirectory() only works under Node. Use loadEphemeris() in a browser.", "mountEphemerisDirectory");
      }
      try {
        wasm.FS.mkdir(dir);
      } catch {
      }
      wasm.FS.mount(NODEFS, { root: hostDirectory }, dir);
      c.setEphePath(dir);
    },
    /**
     * Closes open files and frees the buffers. The instance is unusable
     * afterwards.
     */
    dispose() {
      if (disposed)
        return;
      c.close();
      for (const ptr of [
        bufPosition,
        bufError,
        bufName,
        bufCusps,
        bufCuspSpeed,
        bufAscmc,
        bufAscmcSpeed,
        bufGeo,
        bufHorIn,
        bufHorOut,
        bufTret,
        bufAttr,
        bufDatm,
        bufDobs,
        bufDret,
        bufObjectName
      ]) {
        wasm._free(ptr);
      }
      disposed = true;
    },
    /** Support for `using` declarations (TypeScript 5.2+). */
    [Symbol.dispose]() {
      api.dispose();
    }
  };
  return api;
}

// node_modules/@kuntay/swisseph/dist/ephemeris/sources.js
var FetchEphemeris = class {
  description;
  #baseUrl;
  #cache;
  #fetch;
  constructor(options = {}) {
    this.#baseUrl = (options.baseUrl ?? DEFAULT_CDN_BASE).replace(/\/+$/, "");
    this.#cache = options.cache ?? null;
    this.description = `fetch(${this.#baseUrl})`;
    const impl = options.fetchImpl ?? globalThis.fetch;
    if (typeof impl !== "function") {
      throw new Error("No fetch in this environment. Supply an implementation through the fetchImpl option.");
    }
    this.#fetch = options.fetchImpl ? impl : impl.bind(globalThis);
  }
  async read(fileName) {
    if (this.#cache) {
      const hit = await this.#cache.get(fileName);
      if (hit)
        return hit;
    }
    const response = await this.#fetch(`${this.#baseUrl}/${fileName}`);
    if (!response.ok)
      return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (this.#cache)
      await this.#cache.set(fileName, bytes);
    return bytes;
  }
};
var DEFAULT_CDN_BASE = "https://cdn.jsdelivr.net/npm/@kuntay/swisseph-data/ephe";

// node_modules/@kuntay/swisseph/dist/generated/stars.js
var CURATED_STARS = [
  { name: "Sirius", designation: "alCMa", magnitude: -1.46, groups: ["behenian", "bright"] },
  { name: "Canopus", designation: "alCar", magnitude: -0.74, groups: ["notable", "bright"] },
  { name: "Toliman", designation: "alCen", magnitude: -0.1, groups: ["notable", "bright"] },
  { name: "Arcturus", designation: "alBoo", magnitude: -0.05, groups: ["behenian", "bright"] },
  { name: "Vega", designation: "alLyr", magnitude: 0.03, groups: ["behenian", "bright"] },
  { name: "Capella", designation: "alAur", magnitude: 0.08, groups: ["behenian", "bright"] },
  { name: "Rigel", designation: "beOri", magnitude: 0.13, groups: ["notable", "bright"] },
  { name: "Procyon", designation: "alCMi", magnitude: 0.37, groups: ["behenian", "bright"] },
  { name: "Betelgeuse", designation: "alOri", magnitude: 0.42, groups: ["notable", "bright"] },
  { name: "Achernar", designation: "alEri", magnitude: 0.46, groups: ["notable", "bright"] },
  { name: "Hadar", designation: "beCen", magnitude: 0.6, groups: ["bright"] },
  { name: "Altair", designation: "alAql", magnitude: 0.76, groups: ["notable", "bright"] },
  { name: "Acrux", designation: "alCru", magnitude: 0.81, groups: ["notable", "bright"] },
  { name: "Aldebaran", designation: "alTau", magnitude: 0.86, groups: ["royal", "behenian", "bright"], meaning: "Watcher of the East \u2014 the eye of the Bull" },
  { name: "Antares", designation: "alSco", magnitude: 0.91, groups: ["royal", "behenian", "bright"], meaning: "Watcher of the West \u2014 the heart of the Scorpion" },
  { name: "Spica", designation: "alVir", magnitude: 0.97, groups: ["behenian", "bright"] },
  { name: "Pollux", designation: "beGem", magnitude: 1.14, groups: ["notable", "bright"] },
  { name: "Fomalhaut", designation: "alPsA", magnitude: 1.16, groups: ["royal", "bright"], meaning: "Watcher of the South \u2014 the mouth of the Southern Fish" },
  { name: "Deneb", designation: "alCyg", magnitude: 1.25, groups: ["notable", "bright"] },
  { name: "Mimosa", designation: "beCru", magnitude: 1.25, groups: ["bright"] },
  { name: "Regulus", designation: "alLeo", magnitude: 1.4, groups: ["royal", "behenian", "bright"], meaning: "Watcher of the North \u2014 the heart of the Lion" },
  { name: "Adara", designation: "epCMa", magnitude: 1.5, groups: ["bright"] },
  { name: "Castor", designation: "alGem", magnitude: 1.58, groups: ["notable", "bright"] },
  { name: "Shaula", designation: "laSco", magnitude: 1.62, groups: ["bright"] },
  { name: "Bellatrix", designation: "gaOri", magnitude: 1.64, groups: ["notable", "bright"] },
  { name: "Gacrux", designation: "gaCru", magnitude: 1.64, groups: ["bright"] },
  { name: "Elnath", designation: "beTau", magnitude: 1.65, groups: ["bright"] },
  { name: "Alnilam", designation: "epOri", magnitude: 1.69, groups: ["notable", "bright"] },
  { name: "Miaplacidus", designation: "beCar", magnitude: 1.69, groups: ["bright"] },
  { name: "Alnair", designation: "alGru", magnitude: 1.71, groups: ["bright"] },
  { name: "Alioth", designation: "epUMa", magnitude: 1.77, groups: ["bright"] },
  { name: "Mirfak", designation: "alPer", magnitude: 1.79, groups: ["notable", "bright"] },
  { name: "Alnitak", designation: "zeOri", magnitude: 1.79, groups: ["notable", "bright"] },
  { name: "Dubhe", designation: "alUMa", magnitude: 1.79, groups: ["bright"] },
  { name: "Suhail al Muhlif", designation: "ga-2Vel", magnitude: 1.83, groups: ["bright"] },
  { name: "Wezen", designation: "deCMa", magnitude: 1.84, groups: ["bright"] },
  { name: "Kaus Australis", designation: "epSgr", magnitude: 1.85, groups: ["bright"] },
  { name: "Alkaid", designation: "etUMa", magnitude: 1.86, groups: ["behenian", "bright"] },
  { name: "Sargas", designation: "thSco", magnitude: 1.862, groups: ["bright"] },
  { name: "Menkalinan", designation: "beAur", magnitude: 1.9, groups: ["bright"] },
  { name: "Peacock", designation: "alPav", magnitude: 1.918, groups: ["bright"] },
  { name: "Alhena", designation: "gaGem", magnitude: 1.92, groups: ["notable", "bright"] },
  { name: "Atria", designation: "alTrA", magnitude: 1.92, groups: ["bright"] },
  { name: "Alsephina", designation: "deVel", magnitude: 1.95, groups: ["bright"] },
  { name: "Avior", designation: "epCar", magnitude: 1.953, groups: ["bright"] },
  { name: "Alphard", designation: "alHya", magnitude: 1.97, groups: ["notable", "bright"] },
  { name: "Mirzam", designation: "beCMa", magnitude: 1.97, groups: ["bright"] },
  { name: "Algieba", designation: "ga-1Leo", magnitude: 1.98, groups: ["bright"] },
  { name: "Hamal", designation: "alAri", magnitude: 2.01, groups: ["notable"] },
  { name: "Polaris", designation: "alUMi", magnitude: 2.02, groups: ["notable"] },
  { name: "Mirach", designation: "beAnd", magnitude: 2.05, groups: ["notable"] },
  { name: "Alpheratz", designation: "alAnd", magnitude: 2.06, groups: ["notable"] },
  { name: "Algol", designation: "bePer", magnitude: 2.12, groups: ["behenian"] },
  { name: "Denebola", designation: "beLeo", magnitude: 2.13, groups: ["notable"] },
  { name: "Schedar", designation: "alCas", magnitude: 2.23, groups: ["notable"] },
  { name: "Alphecca", designation: "alCrB", magnitude: 2.24, groups: ["behenian"] },
  { name: "Scheat", designation: "bePeg", magnitude: 2.42, groups: ["notable"] },
  { name: "Markab", designation: "alPeg", magnitude: 2.48, groups: ["notable"] },
  { name: "Menkar", designation: "alCet", magnitude: 2.53, groups: ["notable"] },
  { name: "Zosma", designation: "deLeo", magnitude: 2.53, groups: ["notable"] },
  { name: "Zubeneshamali", designation: "beLib", magnitude: 2.62, groups: ["notable"] },
  { name: "Unukalhai", designation: "alSer", magnitude: 2.63, groups: ["notable"] },
  { name: "Zubenelgenubi", designation: "al-2Lib", magnitude: 2.75, groups: ["notable"] },
  { name: "Vindemiatrix", designation: "epVir", magnitude: 2.79, groups: ["notable"] },
  { name: "Deneb Algedi", designation: "deCap", magnitude: 2.83, groups: ["behenian"] },
  { name: "Algenib", designation: "gaPeg", magnitude: 2.84, groups: ["notable"] },
  { name: "Alcyone", designation: "etTau", magnitude: 2.87, groups: ["behenian"] },
  { name: "Sadalsuud", designation: "beAqr", magnitude: 2.89, groups: ["notable"] },
  { name: "Algorab", designation: "deCrv", magnitude: 2.94, groups: ["behenian"] },
  { name: "Sadalmelik", designation: "alAqr", magnitude: 2.94, groups: ["notable"] },
  { name: "Diadem", designation: "alCom", magnitude: 4.32, groups: ["notable"] },
  { name: "Facies", designation: "M22", magnitude: 6.17, groups: ["notable"] }
];

// node_modules/@kuntay/swisseph/dist/derived/stars.js
function starsInGroup(group) {
  return CURATED_STARS.filter((star) => star.groups.includes(group));
}
var ROYAL_STARS = starsInGroup("royal");
var BEHENIAN_STARS = starsInGroup("behenian");
var NOTABLE_STARS = starsInGroup("notable");
var BRIGHT_STARS = starsInGroup("bright");
function byDesignation(designation) {
  return `,${designation}`;
}

// assets/astro/swiss-adapter.js
var ASTROVIP_HOUSE_SYSTEM = "K";
function assertSwissResult(result) {
  if (!result || result.engine !== "swisseph" || result.ephemerisSource !== "swiss-files") {
    throw new Error("AstroVip precision guard: Swiss ephemeris files are required; fallback results are rejected.");
  }
  return result;
}
function normalizeDegrees2(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError("Longitude must be finite.");
  return (n % 360 + 360) % 360;
}
function validateHouseResult(result) {
  assertSwissResult(result);
  if (result.houseSystem !== ASTROVIP_HOUSE_SYSTEM) throw new Error("Expected Koch house system (K).");
  if (!Array.isArray(result.cusps) || result.cusps.length !== 12) throw new Error("Expected 12 Koch cusps.");
  for (const cusp of result.cusps) normalizeDegrees2(cusp);
  for (const key of ["asc", "mc", "dsc", "ic"]) normalizeDegrees2(result.axes?.[key]);
  return result;
}

// assets/astro/koch-houses.js
var norm = (x) => (Number(x) % 360 + 360) % 360;
function normalizeKochHouses(raw, { ephemerisSource = "swiss-files" } = {}) {
  if (!raw) throw new Error("Missing Swiss house result.");
  if (raw.substituted === true)
    throw new Error("Koch is undefined at this latitude; Swiss substituted another house system.");
  const sourceCusps = raw.cusps || raw.houseCusps;
  if (!Array.isArray(sourceCusps) || sourceCusps.length !== 12)
    throw new Error("Expected exactly 12 zero-based Koch cusps.");
  const asc = raw.ascendant ?? raw.asc;
  const mc = raw.midheaven ?? raw.mc;
  if (!Number.isFinite(Number(asc)) || !Number.isFinite(Number(mc)))
    throw new Error("Missing ASC/MC from Swiss house result.");
  return validateHouseResult({
    engine: "swisseph",
    ephemerisSource,
    houseSystem: ASTROVIP_HOUSE_SYSTEM,
    cusps: sourceCusps.map(norm),
    axes: { asc: norm(asc), mc: norm(mc), dsc: norm(Number(asc) + 180), ic: norm(Number(mc) + 180) }
  });
}

// assets/astro/swiss-browser-entry.js
var enginePromise;
async function engine() {
  if (!enginePromise) enginePromise = (async () => {
    const swe = await createSwissEph();
    const load = await swe.loadEphemeris(new FetchEphemeris(), { fromYear: 1800, toYear: 2399, fixedStars: true });
    if (load.missing?.length) throw new Error("Swiss ephemeris files incomplete.");
    return swe;
  })();
  return enginePromise;
}
var BODY_MAP = Object.freeze([
  ["Sun", "Soare", "\u2609", Body2.Sun],
  ["Moon", "Lun\u0103", "\u263D", Body2.Moon],
  ["Mercury", "Mercur", "\u263F", Body2.Mercury],
  ["Venus", "Venus", "\u2640", Body2.Venus],
  ["Mars", "Marte", "\u2642", Body2.Mars],
  ["Jupiter", "Jupiter", "\u2643", Body2.Jupiter],
  ["Saturn", "Saturn", "\u2644", Body2.Saturn],
  ["Uranus", "Uranus", "\u2645", Body2.Uranus],
  ["Neptune", "Neptun", "\u2646", Body2.Neptune],
  ["Pluto", "Pluto", "\u2647", Body2.Pluto]
]);
function julianFromDate(swe, date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError("A valid Date is required.");
  return swe.julianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 36e5
  );
}
function swissPosition(swe, jd, [key, label, glyph, body]) {
  const p = swe.calc(jd, body);
  if (p.ephemeris !== "swiss") throw new Error("Swiss ephemeris unavailable; calculation refused.");
  return {
    key,
    label,
    glyph,
    longitude: Number(p.longitude),
    latitude: Number(p.latitude),
    longitudeSpeed: Number(p.longitudeSpeed),
    retrograde: Number(p.longitudeSpeed) < 0,
    ephemeris: p.ephemeris
  };
}
async function calculateSwissBody(date, key) {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  const item = BODY_MAP.find((x) => x[0] === key);
  if (!item) throw new RangeError("Unsupported Swiss body: " + key);
  return { engine: "swisseph", ephemerisSource: "swiss-files", jd, date: date.toISOString(), ...swissPosition(swe, jd, item) };
}
async function calculateSwissPositions(date) {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  return {
    engine: "swisseph",
    ephemerisSource: "swiss-files",
    jd,
    date: date.toISOString(),
    planets: BODY_MAP.map((item) => swissPosition(swe, jd, item))
  };
}
async function calculateSwissKoch(date, lat, lon) {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  const sun = swe.calc(jd, Body2.Sun);
  if (sun.ephemeris !== "swiss") throw new Error("Swiss ephemeris unavailable; calculation refused.");
  const raw = swe.houses(jd, Number(lat), Number(lon), "K");
  return normalizeKochHouses(raw, { ephemerisSource: "swiss-files" });
}
async function calculateSwissChart(date, lat, lon) {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  const planets = BODY_MAP.map((item) => swissPosition(swe, jd, item));
  const raw = swe.houses(jd, Number(lat), Number(lon), "K");
  const houses = normalizeKochHouses(raw, { ephemerisSource: "swiss-files" });
  return {
    engine: "swisseph",
    ephemerisSource: "swiss-files",
    zodiac: "tropical",
    houseSystem: "K",
    jd,
    date: date.toISOString(),
    planets,
    cusps: houses.cusps,
    axes: houses.axes
  };
}
async function calculateSwissLots(date, lat, lon) {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  const result = swe.lots(jd, { latitude: Number(lat), longitude: Number(lon), houseSystem: "K" });
  return {
    engine: "swisseph",
    ephemerisSource: "swiss-files",
    jd,
    date: date.toISOString(),
    sect: result.sect,
    points: result.points,
    lots: result.lots
  };
}
async function calculateSwissFixedStars(date, group = "royal") {
  const swe = await engine();
  const jd = julianFromDate(swe, date);
  const groups = { royal: ROYAL_STARS, behenian: BEHENIAN_STARS, notable: NOTABLE_STARS };
  const selected = groups[group] || ROYAL_STARS;
  const stars = selected.map((star) => {
    const p = swe.fixedStar(byDesignation(star.designation), jd);
    return {
      name: star.name,
      designation: star.designation,
      magnitude: star.magnitude,
      groups: star.groups,
      longitude: Number(p.longitude),
      latitude: Number(p.latitude),
      longitudeSpeed: Number(p.longitudeSpeed || 0),
      resolvedName: p.name || star.name
    };
  });
  return { engine: "swisseph", ephemerisSource: "swiss-files", jd, date: date.toISOString(), group, stars };
}
export {
  calculateSwissBody,
  calculateSwissChart,
  calculateSwissFixedStars,
  calculateSwissKoch,
  calculateSwissLots,
  calculateSwissPositions
};
